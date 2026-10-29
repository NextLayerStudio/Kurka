/* =====================================================================
   DÔCHODKOVÁ KALKULAČKA – výpočty (čisté funkcie, bez práce so stránkou)
   Všetky sumy na výstupe sú mesačné a v dnešných cenách.
   ===================================================================== */
(function(root){
"use strict";

/* Dôchodkový vek podľa roku narodenia → {years, months, total (v rokoch)} */
function retirementAge(birthYear, cfg){
  var t = cfg.retirementAge, ym;
  if(t.table[birthYear]) ym = t.table[birthYear];
  else if(birthYear < Math.min.apply(null, Object.keys(t.table).map(Number))) ym = t.table[Math.min.apply(null, Object.keys(t.table).map(Number))];
  else {
    var base = t.table[t.lastTableYear];
    var m = base[0] * 12 + base[1] + (birthYear - t.lastTableYear) * t.monthsPerYearAfter;
    ym = [Math.floor(m / 12), m % 12];
  }
  return {years: ym[0], months: ym[1], total: ym[0] + ym[1] / 12};
}

/* Orientačná čistá mzda zamestnanca z hrubej (2026, bez detí a bez stropov odvodov) */
function netWage(gross, cfg){
  var e = cfg.employee;
  if(!(gross > 0)) return {net: 0, contributions: 0, tax: 0};
  var contrib = gross * (e.socialRate + e.healthRate);
  var baseYear = (gross - contrib) * 12;
  var nczd = baseYear <= e.nczdFullLimit ? e.nczdAnnual : Math.max(0, e.nczdReduceConst - baseYear / e.nczdReduceDiv);
  var taxable = Math.max(0, baseYear - nczd), tax = 0, lower = 0;
  for(var i = 0; i < e.taxBands.length; i++){
    var upper = e.taxBands[i][0], rate = e.taxBands[i][1];
    if(taxable > lower) tax += (Math.min(taxable, upper) - lower) * rate;
    lower = upper;
  }
  tax /= 12;
  return {net: gross - contrib - tax, contributions: contrib, tax: tax};
}

/* Vymeriavací základ SZČO odvodený z celkových mesačných odvodov SP + ZP */
function szcoAssessmentBase(contributions, cfg){
  var s = cfg.szco;
  if(!(contributions > 0)) return 0;
  return Math.max(s.minAssessmentBase, contributions / (s.socialRate + s.healthRate));
}

/* POMB s modelovým tlmením nad 1,25 a stropom */
function pomb(assessmentBase, cfg){
  if(!(assessmentBase > 0)) return 0;
  var p = assessmentBase / cfg.averageWage, c = cfg.pomb;
  if(p > c.threshold) p = c.threshold + c.slopeAbove * (p - c.threshold);
  return Math.min(p, c.max);
}

function p2RateForYear(y, cfg){
  var h = cfg.pillar2.historyRates;
  return h[y] != null ? h[y] : cfg.pillar2.rateFuture;
}

/* II. pilier: simulácia sporenia po rokoch → mesačný dôchodok v dnešných cenách */
function pillar2(o){
  var cfg = o.cfg, p = cfg.pillar2, a = o.assumptions;
  if(!o.hasP2) return {monthly: 0, capital: 0, capitalNominal: 0, payoutYears: 0, savingYears: 0};
  var fund = p.funds[o.fund] || p.funds.indexovy;
  var guaranteed = fund.rate <= p.derisk.safeRate + 1e-9;
  var risky = guaranteed ? 0 : (o.saved || 0), safe = guaranteed ? (o.saved || 0) : 0;
  var years = Math.max(0, Math.round(o.yearsToRetire));
  var yearlyContrib = (p.rateFuture / 100) * o.assessmentBase * 12;
  for(var k = 0; k < years; k++){
    risky *= 1 + fund.rate;
    safe *= 1 + p.derisk.safeRate;
    var c = yearlyContrib * Math.pow(1 + a.wageGrowth, k);
    if(guaranteed) safe += c; else risky += c;
    if(!guaranteed && o.age + k + 1 >= p.derisk.fromAge){
      var move = Math.min(risky, p.derisk.sharePerYear * (risky + safe));
      risky -= move; safe += move;
    }
  }
  var capNom = risky + safe;
  var savingYears = Math.max(0, o.retirementYear - o.entryYear);
  var payoutYears = p.payout.baseYears + p.payout.perSavingYear * savingYears;
  var net = capNom * (1 - p.payout.margin), rm = p.payout.techRate / 12, nMonths = payoutYears * 12;
  var annuity = rm === 0 ? net / nMonths : net * rm / (1 - Math.pow(1 + rm, -nMonths));
  var deflator = Math.pow(1 + a.inflation, o.yearsToRetire);
  return {monthly: annuity / deflator, capital: capNom / deflator, capitalNominal: capNom, payoutYears: payoutYears, savingYears: savingYears};
}

/* Mesačná investícia v dnešných cenách (každý rok sa navyšuje o infláciu),
   aby sa za n rokov nasporil kapitál K (v dnešných cenách) pri nominálnom výnose r. */
function monthlyInvestment(K, r, inflation, years){
  if(!(K > 0)) return 0;
  if(!(years > 0)) return Infinity;
  var rm = Math.pow((1 + r) / (1 + inflation), 1 / 12) - 1, n = years * 12;
  if(Math.abs(rm) < 1e-12) return K / n;
  return K * rm / (Math.pow(1 + rm, n) - 1);
}

/* Pevná mesačná investícia (nominálne, bez navyšovania), aby sa za n rokov
   nasporil kapitál Knom (v budúcich peniazoch) pri nominálnom výnose r. */
function monthlyInvestmentFixed(Knom, r, years){
  if(!(Knom > 0)) return 0;
  if(!(years > 0)) return Infinity;
  var rm = Math.pow(1 + r, 1 / 12) - 1, n = years * 12;
  if(Math.abs(rm) < 1e-12) return Knom / n;
  return Knom * rm / (Math.pow(1 + rm, n) - 1);
}

/* Hlavný výpočet */
function compute(input, cfg){
  var a = {
    inflation: input.inflation != null ? input.inflation : cfg.assumptions.inflation,
    wageGrowth: input.wageGrowth != null ? input.wageGrowth : cfg.assumptions.wageGrowth,
    investReturn: input.investReturn != null ? input.investReturn : cfg.assumptions.investReturn,
    lifeExpToday: input.lifeExpToday != null ? input.lifeExpToday : cfg.assumptions.lifeExpToday,
    lifeExpGainPerYear: cfg.assumptions.lifeExpGainPerYear,
    reserveYears: input.reserveYears != null ? input.reserveYears : cfg.assumptions.reserveYears
  };
  var useSF = input.useSustainability != null ? input.useSustainability : cfg.sustainabilityDefaultOn;
  var Y = cfg.currentYear, age = Y - input.birthYear;
  var ra = retirementAge(input.birthYear, cfg);
  var monthsEarly = input.early ? Math.max(0, Math.min(cfg.earlyRetirement.maxMonthsEarly, Math.round(input.monthsEarly || 0))) : 0;
  var retireAge = ra.total - monthsEarly / 12;
  var yearsToRetire = Math.max(0, retireAge - age);
  var retirementYear = input.birthYear + retireAge;

  // príjem a vymeriavací základ
  var isEmp = input.type !== 'szco', income, assessmentBase, wage = null;
  if(isEmp){
    wage = netWage(input.gross, cfg);
    income = wage.net;
    assessmentBase = input.gross || 0;
  } else {
    income = input.szcoIncome || 0;
    assessmentBase = szcoAssessmentBase(input.szcoContributions, cfg);
  }

  // I. pilier
  var P = pomb(assessmentBase, cfg);
  var odp = Math.max(0, retireAge - cfg.workStartAge);
  var adhReal = cfg.adh * Math.pow((1 + cfg.adhWageShare * a.wageGrowth) / (1 + a.inflation), yearsToRetire);
  var base = P * odp * adhReal;
  var p2Cut = 0, p2Years = 0;
  if(input.hasP2 && odp > 0){
    var from = Math.max(cfg.pillar2.firstYear, input.p2EntryYear || Y), to = Math.floor(retirementYear);
    var cutUnits = 0;
    for(var y = from; y < to; y++){ cutUnits += 4 * p2RateForYear(y, cfg) / 91; p2Years++; }
    p2Cut = base * Math.min(1, cutUnits / odp);
  }
  var earlyFactor = 1 - cfg.earlyRetirement.penaltyPer30Days * Math.ceil(monthsEarly * 30.4375 / 30);
  var sfFactor = useSF ? Math.max(0, 1 - yearsToRetire * cfg.sustainabilityFactor) : 1;
  var p1Model = Math.max(0, (base - p2Cut) * earlyFactor * sfFactor);
  var trust = input.stateTrust != null ? Math.max(0, Math.min(1, input.stateTrust)) : cfg.stateTrust.default;
  var p1 = p1Model * trust;

  // II. pilier
  var p2 = pillar2({cfg: cfg, assumptions: a, hasP2: !!input.hasP2, fund: input.p2Fund, saved: input.p2Saved,
    assessmentBase: assessmentBase, age: age, yearsToRetire: yearsToRetire, retirementYear: retirementYear,
    entryYear: input.p2EntryYear || Y});

  // cieľ, medzera, kapitál, investícia
  var targetAuto = !(input.target > 0);
  var target = targetAuto ? income : input.target;
  var gap = Math.max(0, target - p1 - p2.monthly);
  var lifeExp = a.lifeExpToday + a.lifeExpGainPerYear * yearsToRetire;
  var payoutYears = Math.max(1, lifeExp - retireAge + a.reserveYears);
  var capital = gap * 12 * payoutYears;
  var pmt = monthlyInvestment(capital, a.investReturn, a.inflation, yearsToRetire);
  var delays = cfg.delays.map(function(d){
    var yrs = yearsToRetire - d;
    var v = yrs > 0.5 ? monthlyInvestment(capital, a.investReturn, a.inflation, yrs) : Infinity;
    return {delay: d, years: yrs, monthly: v, extra: isFinite(v) && isFinite(pmt) ? v - pmt : Infinity,
            extraPct: isFinite(v) && pmt > 0 ? (v / pmt - 1) : (pmt === 0 ? 0 : Infinity)};
  });

  // Rovnaké výsledky v budúcich (nominálnych) peniazoch v roku odchodu + pevná investícia
  var f = Math.pow(1 + a.inflation, yearsToRetire);
  var capitalNom = capital * f;
  var monthlyFixed = monthlyInvestmentFixed(capitalNom, a.investReturn, yearsToRetire);
  var nominal = {
    factor: f, p1: p1 * f, p1Model: p1Model * f, p2: p2.monthly * f, pension: (p1 + p2.monthly) * f,
    target: target * f, gap: gap * f, capital: capitalNom, monthly: monthlyFixed,
    delays: cfg.delays.map(function(d){
      var yrs = yearsToRetire - d;
      var v = yrs > 0.5 ? monthlyInvestmentFixed(capitalNom, a.investReturn, yrs) : Infinity;
      return {delay: d, years: yrs, monthly: v, extra: isFinite(v) && isFinite(monthlyFixed) ? v - monthlyFixed : Infinity,
              extraPct: isFinite(v) && monthlyFixed > 0 ? (v / monthlyFixed - 1) : (monthlyFixed === 0 ? 0 : Infinity)};
    })
  };

  return {
    nominal: nominal,
    age: age, retirementAge: ra, monthsEarly: monthsEarly, retireAge: retireAge,
    retirementYear: retirementYear, yearsToRetire: yearsToRetire,
    income: income, wage: wage, assessmentBase: assessmentBase,
    pomb: P, odp: odp, adhReal: adhReal, p1Base: base, p2Cut: p2Cut, p2Years: p2Years,
    earlyFactor: earlyFactor, sfFactor: sfFactor, useSustainability: useSF,
    p1Model: p1Model, stateTrust: trust, p1: p1, p2: p2, pension: p1 + p2.monthly,
    target: target, targetAuto: targetAuto, gap: gap,
    lifeExp: lifeExp, payoutYears: payoutYears, capital: capital, monthly: pmt, delays: delays,
    assumptions: a
  };
}

root.DochodokCalc = {retirementAge: retirementAge, netWage: netWage, szcoAssessmentBase: szcoAssessmentBase,
  pomb: pomb, pillar2: pillar2, monthlyInvestment: monthlyInvestment, monthlyInvestmentFixed: monthlyInvestmentFixed, compute: compute};
})(typeof window !== 'undefined' ? window : this);
