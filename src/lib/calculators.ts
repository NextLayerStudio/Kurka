export type CalculatorSlug = "investicie" | "dochodok" | "hypoteka" | "rozpocet";

export type CalculatorMeta = {
  slug: CalculatorSlug;
  title: string;
  tag: string;
  headline: string;
  teaser: string;
  features: string[];
  iframeSrc: string;
  iframeHeight: number;
  showNavodLink?: boolean;
};

export const calculators: Record<CalculatorSlug, CalculatorMeta> = {
  investicie: {
    slug: "investicie",
    title: "Investičná kalkulačka",
    tag: "Investovanie",
    headline: "Koľko z vašich peňazí spraví čas?",
    teaser:
      "Nastavte si vklady, dobu a očakávaný výnos a hneď uvidíte, na akú sumu môže investícia narásť a akú bude mať kúpnu silu po zohľadnení inflácie. Výsledok si môžete stiahnuť ako PDF.",
    features: ["Zložené úročenie", "Vplyv inflácie", "Výsledok v PDF"],
    iframeSrc: "/kalkulacky/investicie/index.html",
    iframeHeight: 2600,
  },
  dochodok: {
    slug: "dochodok",
    title: "Dôchodková kalkulačka",
    tag: "Dôchodok",
    headline: "Koľko vám bude chýbať na dôchodku?",
    teaser:
      "Spočítajte si, koľko vám podľa dnešných pravidiel dá štát, koľko bude chýbať do dôchodku, z ktorého sa dá dobre žiť, a koľko na to treba odkladať už teraz. Výsledok si stiahnete ako PDF.",
    features: ["Štátny dôchodok a II. pilier", "Koľko odkladať mesačne", "Výsledok v PDF"],
    iframeSrc: "/kalkulacky/dochodok/index.html",
    iframeHeight: 2800,
  },
  hypoteka: {
    slug: "hypoteka",
    title: "Hypotekárna kalkulačka",
    tag: "Hypotéky",
    headline: "Koľko vám banka požičia na bývanie?",
    teaser:
      "Kalkulačka počíta podľa pravidiel Národnej banky Slovenska, ktoré musí dodržať každá banka. Uvidíte maximálnu výšku úveru, mesačnú splátku a ako bude úver v čase klesať.",
    features: ["Pravidlá NBS (DTI, DSTI, LTV)", "Stresový test", "Výsledok v PDF"],
    iframeSrc: "/kalkulacky/hypoteka/index.html",
    iframeHeight: 2700,
  },
  rozpocet: {
    slug: "rozpocet",
    title: "Rodinný rozpočet",
    tag: "Rozpočet",
    headline: "Chcete mať prehľad o svojom rozpočte?",
    teaser:
      "Zapíšte si príjmy, výdavky a investície, nastavte si ciele a uvidíte, kam vaše peniaze idú. Bez registrácie – údaje zostávajú len vo vašom zariadení.",
    features: ["Príjmy a výdavky", "Ciele a majetok", "Funguje aj offline"],
    iframeSrc: "/kalkulacky/rozpocet/index.html",
    iframeHeight: 2400,
    showNavodLink: true,
  },
};

export const calculatorList = Object.values(calculators);
