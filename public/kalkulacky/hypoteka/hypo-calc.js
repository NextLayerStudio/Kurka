/* =====================================================================
   HYPOTEKÁRNA KALKULAČKA – výpočty (čisté funkcie, bez práce so stránkou)
   ===================================================================== */
(function(root){
"use strict";

/* Mesačná anuitná splátka */
function payment(principal, ratePa, years){
  if(!(principal > 0) || !(years > 0)) return 0;
  var n = Math.round(years * 12), r = ratePa / 12;
  if(Math.abs(r) < 1e-12) return principal / n;
  return principal * r / (1 - Math.pow(1 + r, -n));
}
/* Výška úveru, ktorú splatí daná mesačná splátka */
function principalFor(pmt, ratePa, years){
  if(!(pmt > 0) || !(years > 0)) return 0;
  var n = Math.round(years * 12), r = ratePa / 12;
  if(Math.abs(r) < 1e-12) return pmt * n;
  return pmt * (1 - Math.pow(1 + r, -n)) / r;
}

/* Splátkový kalendár po rokoch (anuita, sadzba počas celej doby rovnaká):
   [{year, balance, principalPaid, interestPaid}] – kumulatívne od začiatku */
function amortization(principal, ratePa, years){
  var out = [{year: 0, balance: Math.max(0, principal || 0), principalPaid: 0, interestPaid: 0}];
  if(!(principal > 0) || !(years > 0)) return out;
  var n = Math.round(years * 12), r = ratePa / 12, pmt = payment(principal, ratePa, years);
  var bal = principal, pp = 0, ip = 0;
  for(var m = 1; m <= n; m++){
    var interest = bal * r, princ = Math.min(bal, pmt - interest);
    bal -= princ; pp += princ; ip += interest;
    if(m % 12 === 0 || m === n) out.push({year: m / 12, balance: Math.max(0, bal), principalPaid: pp, interestPaid: ip});
  }
  return out;
}

/* Limit DTI pre jedného žiadateľa podľa veku a konca splatnosti */
function dtiLimit(age, termYears, cfg){
  var d = cfg.dti, a = Math.floor(age || 0);
  if(a >= d.ageFrom && a + termYears > d.endAge) return Math.max(d.min, d.limit - d.stepPerYear * (a - d.baseAge));
  return d.limit;
}

/* Stresová sadzba: +2 p. b. (fixácia nad 10 r. +1 p. b., na celú dobu 0), najviac 6 %, nikdy nie pod skutočnou */
function stressRate(rate, fixation, cfg){
  var s = cfg.stress;
  var buf = fixation === 'full' ? 0 : (fixation === 'long' ? s.bufferLongFix : s.buffer);
  if(buf === 0) return rate;
  return Math.max(rate, Math.min(rate + buf, s.cap));
}

/* Úroková sadzba, pri ktorej zostatok a doba dávajú zadanú splátku (dopočet, ak ju klient nepozná) */
function impliedRate(balance, years, pmt){
  if(!(balance > 0) || !(years > 0) || !(pmt > 0)) return null;
  var n = Math.round(years * 12);
  if(pmt * n <= balance + 1e-6) return 0;
  var lo = 0, hi = 0.5;
  if(payment(balance, hi, years) < pmt) return hi;
  for(var k = 0; k < 80; k++){
    var mid = (lo + hi) / 2;
    if(payment(balance, mid, years) > pmt) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}

/* Existujúce záväzky → skutočné splátky (DSTI), stresované splátky (stresový test) a dlh (DTI) */
function existingDebts(list, cfg){
  var out = {dstiPayments: 0, stressPayments: 0, dtiDebt: 0, items: []};
  (list || []).forEach(function(x){
    if(x.kind === 'card'){
      var limit = Math.max(0, x.limit || 0), drawn = Math.min(limit, Math.max(0, x.drawn || 0));
      var dp = cfg.cards.dstiShareOfLimit * limit, dd = drawn + cfg.dti.cardUndrawnShare * (limit - drawn);
      out.dstiPayments += dp; out.stressPayments += dp; out.dtiDebt += dd;
      out.items.push({kind: 'card', dstiPayment: dp, stressPayment: dp, dtiDebt: dd});
      return;
    }
    var bal = Math.max(0, x.balance || 0), yrs = Math.max(0, x.years || 0);
    var hasRate = x.rate != null && x.rate >= 0;
    var pmt = x.payment > 0 ? x.payment : (hasRate ? payment(bal, x.rate, yrs) : 0);
    var rate = hasRate ? x.rate : impliedRate(bal, yrs, pmt);
    var stressed = null, used = pmt;
    if(rate != null && bal > 0 && yrs > cfg.stress.existingAboveYears){
      var sRate = cfg.stress.existingCap == null ? rate + cfg.stress.buffer : Math.max(rate, Math.min(rate + cfg.stress.buffer, cfg.stress.existingCap));
      stressed = payment(bal, sRate, cfg.stress.useActualTerm ? yrs : cfg.stress.assumedYears);
      used = Math.max(pmt, stressed);
    }
    out.dstiPayments += pmt; out.stressPayments += used; out.dtiDebt += bal;
    out.items.push({kind: 'loan', payment: pmt, rate: rate, rateImplied: !hasRate && rate != null, stressedPayment: stressed, stressPayment: used, dstiPayment: pmt, dtiDebt: bal});
  });
  return out;
}

/* Hlavný výpočet.
   input: {applicants:[{income, age}], children, property, ltvCategory, existing:[...],
           mode:'max'|'check', loan, termYears, rate, fixation} */
function compute(input, cfg){
  // Ďalšie príjmy (napr. prenájom): započítaná časť sa pripočíta k príjmu žiadateľa, ktorému patrí
  // kind: 'rental' (amount = mesačný nájom), 'szco' / 'sro' s method 'turnover' (turnover = ročný obrat)
  // alebo 'net' (amount = mesačný čistý príjem / podiel na zisku); pri s.r.o. z obratu aj ownership (podiel vo firme)
  var extras = (input.extraIncomes || []).map(function(x){
    var kind = x.kind || 'rental', method = kind === 'rental' ? 'amount' : (x.method || 'turnover');
    var e = cfg.extraIncome, clamp01 = function(v, d){ return v != null ? Math.max(0, Math.min(1, v)) : d; };
    var share = clamp01(x.share, kind === 'rental' ? e.rentalDefaultShare : (method === 'turnover' ? e.turnoverDefaultShare : e.netDefaultShare));
    var ownership = kind === 'sro' && method === 'turnover' ? clamp01(x.ownership, 1) : 1;
    var base = method === 'turnover' ? Math.max(0, x.turnover || 0) / 12 : Math.max(0, x.amount || 0);
    return {kind: kind, method: method, amount: method === 'turnover' ? 0 : Math.max(0, x.amount || 0), turnover: Math.max(0, x.turnover || 0),
            share: share, ownership: ownership, monthlyBase: base, counted: base * share * ownership, owner: x.owner || 0};
  });
  var apps = (input.applicants || []).filter(function(a){ return a; }).map(function(a, k){
    var add = extras.filter(function(e){ return Math.min(e.owner, (input.applicants || []).length - 1) === k; })
                    .reduce(function(s, e){ return s + e.counted; }, 0);
    return {income: Math.max(0, a.income || 0) + add, baseIncome: Math.max(0, a.income || 0), extraIncome: add, age: a.age};
  });
  var extraCounted = extras.reduce(function(s, e){ return s + e.counted; }, 0);
  var term = Math.min(cfg.maxTermYears, Math.max(1 / 12, input.termYears || cfg.defaults.termYears));
  var rate = input.rate != null ? input.rate : cfg.defaults.rate;
  var fixation = input.fixation || cfg.defaults.fixation;
  var income = apps.reduce(function(s, a){ return s + Math.max(0, a.income || 0); }, 0);
  var adults = Math.max(1, apps.length), kids = Math.max(0, Math.round(input.children || 0));
  var zm = cfg.subsistence.firstAdult + (adults - 1) * cfg.subsistence.otherAdult + kids * cfg.subsistence.child;
  var ex = existingDebts(input.existing, cfg);

  // DSTI
  var dstiBase = Math.max(0, income - zm);
  var dstiMaxPayments = cfg.dsti.limit * dstiBase;
  var capacity = Math.max(0, dstiMaxPayments - ex.dstiPayments);          // na novú splátku – skutočné splátky
  var capacityStress = Math.max(0, dstiMaxPayments - ex.stressPayments);  // na novú splátku – stresované splátky
  var sr = stressRate(rate, fixation, cfg);
  var stressed = sr > rate + 1e-12;
  var stressTerm = cfg.stress.useActualTerm ? term : cfg.stress.assumedYears;
  var maxByDsti = principalFor(capacity, rate, term);
  // stresový test: nový úver pri stresovej sadzbe (ak sa stresuje) + existujúce úvery pri strese
  var maxByStress = stressed ? principalFor(capacityStress, sr, stressTerm)
                             : (ex.stressPayments > ex.dstiPayments + 1e-9 ? principalFor(capacityStress, rate, term) : Infinity);

  // DTI
  var perApp = apps.map(function(a){
    var lim = dtiLimit(a.age, term, cfg);
    return {income: Math.max(0, a.income || 0), baseIncome: a.baseIncome, extraIncome: a.extraIncome, age: a.age, limit: lim, maxDebt: lim * 12 * Math.max(0, a.income || 0)};
  });
  var dtiMaxDebt = perApp.reduce(function(s, p){ return s + p.maxDebt; }, 0);
  var maxByDti = Math.max(0, dtiMaxDebt - ex.dtiDebt);

  // LTV
  var cat = cfg.ltv.categories[input.ltvCategory] || cfg.ltv.categories.standard;
  var property = Math.max(0, input.property || 0);
  var maxByLtv = property > 0 ? cat.limit * property : Infinity;

  var limits = [
    {key: 'dti', value: maxByDti}, {key: 'dsti', value: maxByDsti},
    {key: 'stress', value: maxByStress}, {key: 'ltv', value: maxByLtv}
  ];
  var byIncome = Math.min(maxByDti, maxByDsti, maxByStress);
  var maxLoan = Math.max(0, Math.min(byIncome, maxByLtv));
  maxLoan = Math.floor(maxLoan / 100) * 100;
  var binding = limits.reduce(function(b, l){ return l.value < b.value ? l : b; }, {key: null, value: Infinity}).key;

  // Ukazovatele pre zvolený úver (v režime max = pre maximálny úver)
  var L = input.mode === 'check' ? Math.max(0, input.loan || 0) : maxLoan;
  var pay = payment(L, rate, term);
  var payStress = stressed ? payment(L, sr, stressTerm) : pay;
  var annual = 12 * income;
  var ind = {
    loan: L, payment: pay, paymentStress: payStress,
    dti:    {ratio: annual > 0 ? (ex.dtiDebt + L) / annual : Infinity, usage: dtiMaxDebt > 0 ? (ex.dtiDebt + L) / dtiMaxDebt : (L + ex.dtiDebt > 0 ? Infinity : 0)},
    dsti:   {ratio: dstiBase > 0 ? (ex.dstiPayments + pay) / dstiBase : Infinity, usage: dstiMaxPayments > 0 ? (ex.dstiPayments + pay) / dstiMaxPayments : (pay + ex.dstiPayments > 0 ? Infinity : 0)},
    stress: {ratio: dstiBase > 0 ? (ex.stressPayments + payStress) / dstiBase : Infinity, usage: dstiMaxPayments > 0 ? (ex.stressPayments + payStress) / dstiMaxPayments : (payStress + ex.stressPayments > 0 ? Infinity : 0)},
    ltv:    {ratio: property > 0 ? L / property : null, usage: property > 0 ? L / (cat.limit * property) : null}
  };
  ['dti', 'dsti', 'stress', 'ltv'].forEach(function(k){ ind[k].ok = ind[k].usage == null || ind[k].usage <= 1 + 1e-9; });
  ind.allOk = ind.dti.ok && ind.dsti.ok && ind.stress.ok && ind.ltv.ok;

  return {
    income: income, annualIncome: annual, adults: adults, children: kids, subsistence: zm,
    extraIncomes: extras, extraCounted: extraCounted,
    existing: ex, term: term, rate: rate, fixation: fixation, stressRate: sr, stressed: stressed, stressTerm: stressTerm,
    dstiBase: dstiBase, dstiMaxPayments: dstiMaxPayments, capacity: capacity, capacityStress: capacityStress,
    stressApplies: stressed || ex.stressPayments > ex.dstiPayments + 1e-9,
    perApplicant: perApp, dtiMaxDebt: dtiMaxDebt,
    ltvCategory: cat, ltvLimit: cat.limit, property: property,
    maxByDti: maxByDti, maxByDsti: maxByDsti, maxByStress: maxByStress, maxByLtv: maxByLtv,
    maxByIncome: Math.max(0, Math.floor(byIncome / 100) * 100), maxLoan: maxLoan, binding: binding,
    maxPayment: payment(maxLoan, rate, term), indicators: ind
  };
}

root.HypoCalc = {payment: payment, principalFor: principalFor, amortization: amortization, impliedRate: impliedRate, dtiLimit: dtiLimit, stressRate: stressRate,
  existingDebts: existingDebts, compute: compute};
})(typeof window !== 'undefined' ? window : this);
