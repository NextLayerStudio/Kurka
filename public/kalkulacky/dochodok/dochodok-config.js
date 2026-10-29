/* =====================================================================
   DÔCHODKOVÁ KALKULAČKA – všetky zákonné a modelové konštanty
   Platnosť: rok 2026 · aktualizované 6. 10. 2026
   Pri každej hodnote je zdroj. Značka OVERIŤ = hodnotu treba pred
   zverejnením skontrolovať (je to model alebo zdroj nie je úradný).
   ===================================================================== */
window.DOCHODOK_CONFIG = {
  validFor: 'október 2026',
  currentYear: 2026,

  /* ---------- I. pilier (starobný dôchodok zo Sociálnej poisťovne) ---------- */
  // Aktuálna dôchodková hodnota pre nároky vzniknuté v roku 2026.
  // Zdroj: Sociálna poisťovňa (oznámenie ADH na rok 2026), overené 10/2026.
  adh: 19.7633,
  // ADH rastie o 95 % rastu priemernej mzdy. Zdroj: § 82 zákona 461/2003 Z. z.
  adhWageShare: 0.95,
  // Priemerná mzda (všeobecný vymeriavací základ za rok 2024), z ktorej sa počíta POMB.
  // Zdroj: podnikajte.sk – minimálne odvody SZČO 2026 (VVZ 2024 = 1 524 €). OVERIŤ na socpoist.sk
  averageWage: 1524,
  // Priemerný osobný mzdový bod: nad 1,25 sa započíta len 68 % prebytku, strop 3,0.
  // Zdroj: model pretz.sk. Strop 3 je zo zákona, pravidlo 1,25 / 0,68 OVERIŤ.
  pomb: { threshold: 1.25, slopeAbove: 0.68, max: 3 },
  // Odpracované roky = vek odchodu − 23 (modelový začiatok kariéry). Zdroj: model.
  workStartAge: 23,
  // Udržateľnostný faktor: zníženie dôchodku o 1 % za každý rok do dôchodku.
  // NIE JE v platnom zákone – opatrnejší (pesimistický) predpoklad, používateľ ho môže vypnúť.
  // Zdroj: model pretz.sk. OVERIŤ
  sustainabilityFactor: 0.01,
  sustainabilityDefaultOn: false, // predvolene vypnuté – riziko pokrýva voľba „Koľko verím štátu“
  // Dôvera v štát: koľko percent z vypočítaného štátneho dôchodku (I. pilier) klient čaká, že naozaj dostane.
  // Je to osobný odhad klienta (demografické riziko), nie zákonná hodnota. II. pilier sa nekráti – sú to vlastné úspory.
  stateTrust: { default: 1.0, presets: [0, 0.3, 0.5, 0.8, 1.0] },
  // Predčasný starobný dôchodok: najviac 2 roky pred dôchodkovým vekom,
  // krátenie 0,5 % za každých začatých 30 dní (0,3 % pri 40+ rokoch poistenia – model to nezohľadňuje).
  // Zdroj: § 67 zákona 461/2003 Z. z.; rulecalc.com, aksamec.sk (2026).
  earlyRetirement: { maxMonthsEarly: 24, penaltyPer30Days: 0.005 },

  /* ---------- Dôchodkový vek (bez zohľadnenia vychovaných detí) ---------- */
  // Tabuľka podľa roku narodenia; po roku 1966 +1 mesiac za každý ďalší ročník.
  // Zdroj: model pretz.sk. Po roku 1966 je vek zo zákona naviazaný na strednú dĺžku života
  // a MPSVR ho vyhlasuje 6 rokov dopredu – pravidlo +1 mesiac/rok je odhad. OVERIŤ
  retirementAge: {
    table: { 1960: [63, 0], 1961: [63, 2], 1962: [63, 4], 1963: [63, 6], 1964: [63, 8], 1965: [63, 10], 1966: [64, 0] },
    lastTableYear: 1966,
    monthsPerYearAfter: 1
  },

  /* ---------- Zamestnanec – orientačná čistá mzda 2026 ---------- */
  employee: {
    // Odvody zamestnanca: sociálne 9,4 % + zdravotné 5 % (od 1. 1. 2026).
    // Zdroj: podnikajte.sk – odvody zamestnanca od 1. 1. 2026.
    socialRate: 0.094,
    healthRate: 0.05,
    // Nezdaniteľná časť základu dane na daňovníka 2026: 5 966,73 €/rok (21 × ŽM 284,13 €),
    // plná do základu dane 26 083,13 €, potom 14 661,11 − ZD/3. Zdroj: podnikajte.sk, financnasprava.sk.
    nczdAnnual: 5966.73,
    nczdFullLimit: 26083.13,
    nczdReduceConst: 14661.11,
    nczdReduceDiv: 3,
    // Sadzby dane 2026 (ročný základ dane). Zdroj: financnasprava.sk – sadzba dane FO za rok 2026.
    taxBands: [[43983.32, 0.19], [60349.21, 0.25], [75010.32, 0.30], [Infinity, 0.35]]
  },

  /* ---------- SZČO ---------- */
  szco: {
    // Minimálne odvody SZČO 2026: SP 303,11 € + ZP 121,92 € = 425,03 €.
    // Zdroj: podnikajte.sk – minimálne odvody SZČO od 1. 1. 2026. (Zadanie uvádzalo 425,04 €.)
    minContributions: 425.03,
    // Sadzby: sociálne 33,15 %, zdravotné 16 %. Vymeriavací základ sa v modeli odvodí
    // z celkových odvodov: VZ = odvody / (0,3315 + 0,16), najmenej minimálny VZ 914,40 €.
    socialRate: 0.3315,
    healthRate: 0.16,
    minAssessmentBase: 914.40
  },

  /* ---------- II. pilier ---------- */
  pillar2: {
    // Príspevok 4 % z vymeriavacieho základu od roku 2025. Zdroj: rulecalc.com, sita.sk.
    rateFuture: 4,
    // Historické sadzby (v %) – podľa nich sa kráti I. pilier (§ 66 ods. 6 zákona 461/2003):
    // za každý rok v II. pilieri sa dôchodok zníži o (4 × sadzba / 91) pomernej sumy za ten rok
    // (9 % → 36/91, 4 % → 16/91, 4,5 % → 18/91). Zdroj: ddadsstornala.sk, § 66 ods. 6.
    // Sadzby 2019–2024 OVERIŤ (podľa verejných prehľadov 4,75 % → 5,5 %).
    historyRates: {
      2005: 9, 2006: 9, 2007: 9, 2008: 9, 2009: 9, 2010: 9, 2011: 9, 2012: 7.33,
      2013: 4, 2014: 4, 2015: 4, 2016: 4, 2017: 4.25, 2018: 4.5, 2019: 4.75,
      2020: 5, 2021: 5.25, 2022: 5.5, 2023: 5.5, 2024: 5.5
    },
    firstYear: 2005,
    // Priemerný ročný výnos fondov (model). Zdroj: model pretz.sk. OVERIŤ podľa reálnych výnosov DSS.
    funds: {
      garantovany: { label: 'Garantovaný (dlhopisový)', rate: 0.015 },
      akciovy:     { label: 'Akciový', rate: 0.055 },
      indexovy:    { label: 'Indexový', rate: 0.09 }
    },
    // Od 50 rokov sa každý rok 4 % úspor presúva do garantovaného fondu (1,5 % p. a.). Zdroj: model. OVERIŤ
    derisk: { fromAge: 50, sharePerYear: 0.04, safeRate: 0.015 },
    // Výplata: marža 10 %, anuita s technickou úrokovou mierou 1 %,
    // doba výplaty = 25 + 0,125 × rokov sporenia. Zdroj: model pretz.sk. OVERIŤ
    payout: { margin: 0.10, techRate: 0.01, baseYears: 25, perSavingYear: 0.125 }
  },

  /* ---------- Predpoklady (dajú sa meniť v „Rozšírenom prepočte“) ---------- */
  assumptions: {
    inflation: 0.03,          // inflácia p. a. – všetky výsledky sú v dnešných cenách
    wageGrowth: 0.03,         // rast miezd p. a.
    investReturn: 0.08,       // zhodnotenie vlastnej investície p. a.
    lifeExpToday: 78.0,       // stredná dĺžka života dnes (model). OVERIŤ (ŠÚ SR)
    lifeExpGainPerYear: 0.2,  // nárast dožitia za každý rok do dôchodku (model). OVERIŤ
    reserveYears: 3           // rezerva dožitia (roky navyše)
  },

  // Predvolené zobrazenie súm: 'nominal' = s infláciou (budúce ceny, pevná mesačná investícia),
  // 'real' = v dnešných cenách (investícia sa každý rok navyšuje o infláciu).
  displayMode: 'nominal',

  // Cena odkladania – o koľko rokov neskôr začať
  delays: [0, 3, 6, 9]
};
