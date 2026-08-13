"use client";

import React, { useEffect, useState } from "react";

const sections = [
  { id: "prevadzkovatel", title: "Kto spracúva vaše údaje" },
  { id: "formulare", title: "Aké údaje zbierame" },
  { id: "cookies", title: "Cookies a návštevnosť" },
  { id: "prijemcovia", title: "Komu ich sprístupňujeme" },
  { id: "prava", title: "Vaše práva" },
  { id: "dozor", title: "Dozorný orgán" },
];

const forms = [
  {
    purpose: "Kontaktný formulár",
    scope: "Meno, priezvisko, e-mail, telefón (nepovinné) a text správy.",
    basis: "Čl. 6 ods. 1 písm. b) GDPR – kontakt pred prípadným uzatvorením zmluvy na vašu žiadosť.",
    retention: "1 rok od poslednej komunikácie.",
  },
  {
    purpose: "Dotazník finančnej gramotnosti",
    scope:
      "Meno, priezvisko, e-mail alebo telefón a vaše odpovede o využívaných produktoch a oblastiach záujmu.",
    basis: "Čl. 6 ods. 1 písm. a) GDPR – váš súhlas, ktorý môžete kedykoľvek odvolať.",
    retention: "1 rok od odoslania alebo do odvolania súhlasu.",
  },
];

const rights = [
  "prístup k údajom a ich kópiu (čl. 15)",
  "opravu nesprávnych údajov (čl. 16)",
  "vymazanie údajov (čl. 17)",
  "obmedzenie spracúvania (čl. 18)",
  "prenosnosť údajov (čl. 20)",
  "namietať proti spracúvaniu (čl. 21)",
  "kedykoľvek odvolať súhlas (čl. 7)",
  "podať návrh dozornému orgánu (čl. 77)",
];

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 border-t border-gray-200 pt-10 first:border-t-0 first:pt-0"
    >
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-semibold text-[#5ECAD5]">
          {String(index).padStart(2, "0")}
        </span>
        <h2
          className="text-2xl font-semibold text-[#202325] md:text-3xl"
          style={{ fontFamily: "Monda, sans-serif" }}
        >
          {title}
        </h2>
      </div>
      <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

export default function GDPRContent() {
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-120px 0px -65% 0px" }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, []);

  const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent("open-cookies-modal"));
  };

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
      <aside className="lg:w-56 lg:shrink-0">
        <div className="lg:sticky lg:top-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Obsah</p>
          <nav className="border-l border-gray-200">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`-ml-px block border-l-2 py-2 pl-4 text-sm transition-colors ${
                  activeId === section.id
                    ? "border-[#5ECAD5] font-semibold text-[#202325]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-[#202325]"
                }`}
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-10">
        <p className="border-l-4 border-[#5ECAD5] bg-gray-50 p-5 text-base leading-relaxed text-gray-700 md:text-lg">
          Na tejto stránke od vás nezbieram nič okrem toho, čo mi sami napíšete v jednom z dvoch
          formulárov. Údaje nepredávam, neposielam na reklamné účely a nepoužívam na sledovanie.
        </p>

        <Section id="prevadzkovatel" index={1} title="Kto spracúva vaše údaje">
          <div className="border border-gray-200 p-5">
            <p className="font-semibold text-[#202325]">Michal Kurka</p>
            <p className="mt-1 text-sm text-gray-600 md:text-base">Finančný poradca</p>
            <div className="mt-4 space-y-1.5 text-sm md:text-base">
              <p>A13 Concept Business Hub, Továrenská 2206/13K, 901 01 Malacky</p>
              <p>
                <a
                  href="mailto:michal.kurka@michalkurka.sk"
                  className="text-[#5ECAD5] underline underline-offset-2 transition-colors hover:text-[#4BB8C4]"
                >
                  michal.kurka@michalkurka.sk
                </a>{" "}
                &middot;{" "}
                <a
                  href="tel:+421907675846"
                  className="text-[#5ECAD5] underline underline-offset-2 transition-colors hover:text-[#4BB8C4]"
                >
                  +421 907 675 846
                </a>
              </p>
            </div>
          </div>
          <p>
            Postupujem podľa nariadenia (EÚ) 2016/679 (GDPR) a zákona č. 18/2018 Z. z. Vo všetkých
            otázkach ochrany údajov ma kontaktujte priamo na uvedených kontaktoch.
          </p>
        </Section>

        <Section id="formulare" index={2} title="Aké údaje zbierame">
          <div className="space-y-4">
            {forms.map((form) => (
              <div key={form.purpose} className="border border-gray-200">
                <h3 className="border-b border-gray-200 bg-gray-50 px-5 py-3.5 text-base font-semibold text-[#202325] md:text-lg">
                  {form.purpose}
                </h3>
                <dl className="divide-y divide-gray-200 px-5 text-sm md:text-base">
                  {[
                    ["Údaje", form.scope],
                    ["Právny základ", form.basis],
                    ["Uchovávame", form.retention],
                  ].map(([label, value]) => (
                    <div key={label} className="py-4 sm:flex sm:gap-6">
                      <dt className="shrink-0 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:w-32 sm:pt-0.5">
                        {label}
                      </dt>
                      <dd className="mt-1 leading-relaxed text-gray-700 sm:mt-0">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          <p>
            Vyplnenie formulárov je dobrovoľné, no bez mena a kontaktu vás nedokážem kontaktovať. Po
            uplynutí uvedenej doby údaje vymažem. Ak sa dohodneme na spolupráci, ďalšie údaje
            potrebné na sprostredkovanie finančného produktu zbieram až osobne, mimo tejto stránky, a
            uchovávam ich po dobu, ktorú vyžadujú zákony o finančnom sprostredkovaní.
          </p>
          <p>
            Nespracúvam osobitné kategórie údajov (napríklad o zdraví) a nevykonávam automatizované
            rozhodovanie ani profilovanie – dotazník slúži len ako podklad na osobný rozhovor.
          </p>
        </Section>

        <Section id="cookies" index={3} title="Cookies a návštevnosť">
          <p>
            Stránka nepoužíva reklamné ani marketingové cookies. Do prehliadača sa ukladá iba záznam
            o vašom rozhodnutí o cookies, aby sme sa vás nemuseli pýtať znova.
          </p>
          <p>
            Návštevnosť merám nástrojmi Vercel Web Analytics a Speed Insights. Nepoužívajú cookies
            ani trvalé identifikátory, zbierajú len agregované údaje (navštívená podstránka, typ
            zariadenia, krajina, rýchlosť načítania) a bez vášho súhlasu sa vôbec nespustia. Mapa na
            stránke Kontakt sa načítava z Google Maps, ktorá pri tom spracúva vašu IP adresu.
          </p>
          <button
            type="button"
            onClick={openCookieSettings}
            className="mt-2 inline-block rounded-lg bg-[#5ECAD5] px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-[#4BB8C4]"
          >
            Zmeniť nastavenia cookies
          </button>
        </Section>

        <Section id="prijemcovia" index={4} title="Komu ich sprístupňujeme">
          <ul className="space-y-3">
            {[
              "Vercel Inc. – hosting webovej stránky a meranie návštevnosti.",
              "Poskytovateľ cloudovej databázy – bezpečné uloženie údajov z formulárov.",
              "Google – mapa na stránke Kontakt a webové fonty.",
              "Finančné inštitúcie – len ak vám sprostredkujem konkrétny produkt.",
              "Orgány verejnej moci – iba ak to vyžaduje zákon.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5ECAD5]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            Vercel a Google sídlia v USA, takže časť údajov sa spracúva mimo EÚ – na základe
            rozhodnutia Európskej komisie o primeranosti (EU–U.S. Data Privacy Framework), prípadne
            štandardných zmluvných klauzúl. Údaje sú chránené šifrovaným prenosom (HTTPS) a prístup k
            nim má len obmedzený počet osôb.
          </p>
        </Section>

        <Section id="prava" index={5} title="Vaše práva">
          <p>Vo vzťahu k svojim údajom máte právo na:</p>
          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {rights.map((right) => (
              <li key={right} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5ECAD5]"
                />
                <span>{right}</span>
              </li>
            ))}
          </ul>
          <p>
            Stačí mi napísať na{" "}
            <a
              href="mailto:michal.kurka@michalkurka.sk"
              className="text-[#5ECAD5] underline underline-offset-2 transition-colors hover:text-[#4BB8C4]"
            >
              michal.kurka@michalkurka.sk
            </a>{" "}
            a uviesť, čoho sa vaša žiadosť týka. Uplatnenie práv je bezplatné a odpoviem najneskôr do
            jedného mesiaca. Odvolanie súhlasu nemá vplyv na zákonnosť spracúvania pred jeho
            odvolaním.
          </p>
        </Section>

        <Section id="dozor" index={6} title="Dozorný orgán">
          <p>
            Ak nie ste s niečím spokojní, ozvite sa najprv mne. Kedykoľvek však môžete podať návrh na
            začatie konania dozornému orgánu:
          </p>
          <div className="border border-gray-200 p-5 text-sm md:text-base">
            <p className="font-semibold text-[#202325]">
              Úrad na ochranu osobných údajov Slovenskej republiky
            </p>
            <p className="mt-2">Galvaniho Business Centrum II, Galvaniho 7/B, 821 04 Bratislava</p>
            <p className="mt-1">
              +421 2 32 31 32 14 &middot;{" "}
              <a
                href="https://dataprotection.gov.sk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5ECAD5] underline underline-offset-2 transition-colors hover:text-[#4BB8C4]"
              >
                dataprotection.gov.sk
              </a>
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
}
