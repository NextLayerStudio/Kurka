/* =====================================================================
   HYPOTEKÁRNA KALKULAČKA – pravidlá NBS a zákonné hodnoty
   Platnosť: október 2026 · aktualizované 8. 10. 2026
   Pri každej hodnote je zdroj. Značka OVERIŤ = pred zverejnením skontrolovať.
   Právny základ: zákon č. 90/2016 Z. z. o úveroch na bývanie a opatrenie NBS
   o úveroch na bývanie (makroprudenciálne limity DTI, DSTI, LTV).
   ===================================================================== */
window.HYPO_CONFIG = {
  validFor: 'október 2026',

  /* ---------- Životné minimum (odpočíta sa od príjmu pri DSTI) ---------- */
  // Sumy platné od 1. 7. 2026 do 30. 6. 2027. Zdroj: NBS (príklad: manželia + 2 deti = 770,78 €),
  // podnikajte.sk – životné minimum od 1. 7. 2026.
  subsistence: { firstAdult: 295.22, otherAdult: 205.96, child: 134.80, validUntil: '30. 6. 2027' },

  /* ---------- DSTI – schopnosť splácať ---------- */
  // Splátky všetkých úverov najviac 60 % z (čistý príjem − životné minimum).
  // Zdroj: nbs.sk – DSTI. (Výnimky do 70 % pre 5 % úverov banka prideľuje sama – kalkulačka ich nepoužíva.)
  dsti: { limit: 0.60 },

  /* ---------- Stresový test (úroková rezerva v DSTI) ---------- */
  // Splátka sa prepočíta pri sadzbe zvýšenej o 2 p. b., najviac do 6 % (ak je skutočná sadzba vyššia,
  // platí skutočná), pri predpoklade 30-ročnej splatnosti. Banka použije vyššiu z oboch splátok.
  // Fixácia nad 10 rokov → rezerva 1 p. b.; fixácia na celú dobu → bez rezervy.
  // Týka sa nových aj existujúcich úverov so splatnosťou nad 8 rokov. Zdroj: nbs.sk – DSTI.
  // Overené v úplnom znení opatrenia NBS č. 10/2016: § 4 ods. 2 písm. b) – stresová splátka sa počíta
  // pri sadzbe aspoň o 2 p. b. vyššej „a maximálnej lehoty splatnosti úveru na bývanie podľa § 6 ods. 1“
  // (= 30 rokov), nie pri skutočnej splatnosti; § 4 ods. 4 (fixácia nad 10 r. +1 p. b.), § 4 ods. 6 (strop 6 %),
  // § 3 ods. 10 a 14 (existujúce úvery nad 8 rokov). Niektoré kalkulačky (napr. Finportal) počítajú stres
  // prísnejšie so skutočnou splatnosťou – pri kratšej splatnosti im preto vychádza nižší úver.
  // ROZHODNUTIE (8. 10. 2026, M. Kurka): počítame PRÍSNEJŠIE ako opatrenie – so skutočnou splatnosťou
  // (rovnako ako Finportal), aby klient radšej videl nižšiu sumu. Pri existujúcich úveroch so zostávajúcou dobou.
  // useActualTerm: false = presne podľa opatrenia (30 rokov).
  // ROZHODNUTIE (13. 10. 2026, M. Kurka): existujúce úvery stresujeme VŽDY (opatrenie vyžaduje len pri
  // zostávajúcej dobe nad 8 rokov) – existingAboveYears: 0. Ak klient nezadá sadzbu, dopočíta sa zo zostatku,
  // doby a splátky. DSTI počíta so skutočnými splátkami, stresový test so stresovanými (ako Finportal).
  // Strop 6 % platí podľa NBS len pre úvery na bývanie zabezpečené nehnuteľnosťou; existujúce úvery
  // (často spotrebné) preto stresujeme +2 p. b. BEZ stropu (existingCap: null), aby výpočet bol opatrný.
  stress: { buffer: 0.02, bufferLongFix: 0.01, cap: 0.06, assumedYears: 30, useActualTerm: true, existingAboveYears: 0, existingCap: null },

  /* ---------- DTI – celková zadlženosť ---------- */
  // Celkový dlh najviac 8-násobok ročného čistého príjmu. Ak má žiadateľ 41+ rokov a úver
  // splatí až po 65. roku veku: limit = 8 − 0,25 × (celé roky veku − 40), najmenej 3.
  // Pri viacerých žiadateľoch sa limit počíta pre každého zvlášť a sčíta sa.
  // Do dlhu sa počíta nový úver, zostatky existujúcich úverov a pri kreditných kartách
  // a kontokorentoch čerpaná suma + 20 % z nečerpaného limitu. Zdroj: nbs.sk – DTI.
  // (Výnimka 9-násobok pre mladých do 35 r. je kvóta banky – kalkulačka ju nepoužíva.)
  dti: { limit: 8, ageFrom: 41, endAge: 65, stepPerYear: 0.25, baseAge: 40, min: 3, cardUndrawnShare: 0.20 },

  /* ---------- Kreditné karty a kontokorenty v DSTI ---------- */
  // Do splátok sa započíta najmenej 3 % zo schválených povolených prečerpaní alebo limitov kreditných kariet.
  // Zdroj: opatrenie NBS č. 10/2016, § 3 ods. 15 (overené).
  cards: { dstiShareOfLimit: 0.03 },

  /* ---------- LTV – pomer úveru k hodnote nehnuteľnosti ---------- */
  // Do 31. 12. 2026: 80 % (do 90 % len obmedzený podiel úverov banky).
  // Od 1. 1. 2027 (zmena opatrenia NBS, podľa podnikajte.sk schválená 30. 9. 2026): mladí do 35 r.
  // na prvé bývanie až 90 %, tretia a ďalšia nehnuteľnosť najviac 70 %. OVERIŤ platné znenie na nbs.sk
  ltv: {
    categories: {
      standard: { label: 'Štandardný úver', limit: 0.80, note: 'Nad 80 % (do 90 %) len v rámci výnimky banky.' },
      young:    { label: 'Mladý do 35 r., prvé bývanie', limit: 0.90, note: 'Od 1. 1. 2027.' },
      third:    { label: 'Tretia a ďalšia nehnuteľnosť', limit: 0.70, note: 'Od 1. 1. 2027, bez výnimky.' }
    }
  },

  /* ---------- Ďalšie príjmy ---------- */
  // Príjem z prenájmu nehnuteľnosti: banky bežne započítajú najviac 50 % zo sumy, ktorá prichádza na účet,
  // daňové priznanie nie je potrebné. Ide o prax bánk, nie o pravidlo NBS – percento sa dá pri každom
  // príjme zmeniť. Zdroj: prax (M. Kurka, 14. 10. 2026).
  // Príjem z podnikania (SZČO, s.r.o.): banka buď započíta percento z ročného obratu (tržieb),
  // alebo vychádza z čistého príjmu / podielu na zisku. Percentá sa líšia podľa banky – dajú sa voliť.
  // Pri s.r.o. sa obrat násobí aj podielom žiadateľa vo firme. Zdroj: prax bánk (M. Kurka, 14. 10. 2026). OVERIŤ predvolené %.
  extraIncome: {
    rentalDefaultShare: 0.50,
    turnoverDefaultShare: 0.10,
    turnoverPresets: [0.05, 0.10, 0.15, 0.20, 0.25],
    netDefaultShare: 1.00
  },

  /* ---------- Úver ---------- */
  // Maximálna splatnosť úveru na bývanie 30 rokov. Zdroj: opatrenie NBS č. 10/2016, § 6 ods. 1 (overené;
  // nad 30 rokov môže banka poskytnúť najviac 10 % objemu úverov – kalkulačka to nepoužíva).
  maxTermYears: 30,

  /* ---------- Predvolené hodnoty formulára ---------- */
  defaults: { rate: 0.035, termYears: 30, fixation: 'short' }
};
