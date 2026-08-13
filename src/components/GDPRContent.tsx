"use client";

import React, { useState } from "react";

type TabId = "overview" | "rights" | "data" | "contact";

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Prehľad" },
  { id: "rights", label: "Vaše práva" },
  { id: "data", label: "Spracovanie údajov" },
  { id: "contact", label: "Kontakt" },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
      <h2 className="mb-4 text-lg font-semibold text-[#202325]">{title}</h2>
      <div className="space-y-3 text-sm leading-7 text-gray-700 md:text-base">{children}</div>
    </section>
  );
}

export default function GDPRContent() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div>
      <nav className="mb-8 flex overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors md:text-base ${
              activeTab === tab.id
                ? "border-[#202325] text-[#202325]"
                : "border-transparent text-gray-500 hover:text-[#202325]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "overview" && (
        <div className="space-y-8">
          <Section title="1. Prevádzkovateľ">
            <p>
              Správcom osobných údajov je{" "}
              <strong className="font-semibold text-[#202325]">Michal Kurka</strong>, finančný
              poradca, A13 Concept Business Hub, Továrenská 2206/13K, 901 01 Malacky, Slovenská
              republika.
            </p>
          </Section>

          <Section title="2. Rozsah spracúvaných údajov">
            <ul className="list-disc space-y-2 pl-5">
              <li>Meno, priezvisko, telefón, e-mail a text správy z kontaktného formulára</li>
              <li>Údaje z dotazníka finančnej gramotnosti vrátane kontaktných údajov</li>
              <li>Technické údaje pri návšteve webu (napr. IP adresa, typ prehliadača)</li>
              <li>Údaje o nastavení súborov cookie</li>
            </ul>
          </Section>

          <Section title="3. Účel spracúvania">
            <ul className="list-disc space-y-2 pl-5">
              <li>Vybavenie dopytu a komunikácia s návštevníkom webu</li>
              <li>Poskytovanie finančného poradenstva</li>
              <li>Správa obsahu webovej stránky</li>
              <li>Zabezpečenie prevádzky a ochrany webu</li>
              <li>Plnenie zákonných povinností</li>
            </ul>
          </Section>

          <Section title="4. Právny základ">
            <ul className="list-disc space-y-2 pl-5">
              <li>Súhlas dotknutej osoby</li>
              <li>Plnenie zmluvy alebo opatrenia pred uzatvorením zmluvy</li>
              <li>Oprávnený záujem prevádzkovateľa</li>
              <li>Plnenie zákonnej povinnosti</li>
            </ul>
          </Section>

          <Section title="5. Doba uchovávania">
            <p>
              Osobné údaje uchovávame po dobu nevyhnutnú na splnenie účelu spracúvania a v lehotách
              stanovených platnými právnymi predpismi. Po uplynutí tejto doby budú údaje vymazané
              alebo anonymizované.
            </p>
          </Section>
        </div>
      )}

      {activeTab === "rights" && (
        <div className="space-y-0 divide-y divide-gray-200">
          {[
            {
              title: "Právo na prístup",
              text: "Máte právo získať potvrdenie o tom, či sa spracúvajú vaše osobné údaje, a ak áno, právo na prístup k týmto údajom.",
            },
            {
              title: "Právo na opravu",
              text: "Máte právo požadovať bez zbytočného odkladu opravu nesprávnych osobných údajov a doplnenie neúplných údajov.",
            },
            {
              title: "Právo na vymazanie",
              text: "Máte právo požadovať vymazanie osobných údajov, ak sú splnené podmienky podľa GDPR.",
            },
            {
              title: "Právo na obmedzenie spracúvania",
              text: "Máte právo požadovať obmedzenie spracúvania vo vymedzených prípadoch.",
            },
            {
              title: "Právo na prenosnosť údajov",
              text: "Máte právo získať osobné údaje, ktoré ste poskytli, v štruktúrovanom, bežne používanom formáte.",
            },
            {
              title: "Právo namietať",
              text: "Máte právo namietať proti spracúvaniu založenému na oprávnenom záujme prevádzkovateľa.",
            },
            {
              title: "Právo odvolať súhlas",
              text: "Ak je spracúvanie založené na súhlase, môžete súhlas kedykoľvek odvolať bez vplyvu na zákonnosť spracúvania pred odvolaním.",
            },
            {
              title: "Právo podať sťažnosť",
              text: "Máte právo podať sťažnosť na dozorný orgán, najmä v členskom štáte vášho obvyklého pobytu.",
            },
          ].map((item) => (
            <section key={item.title} className="py-6 first:pt-0 last:pb-0">
              <h3 className="mb-2 text-base font-semibold text-[#202325]">{item.title}</h3>
              <p className="text-sm leading-7 text-gray-700 md:text-base">{item.text}</p>
            </section>
          ))}
        </div>
      )}

      {activeTab === "data" && (
        <div className="space-y-8">
          <Section title="Príjemcovia a sprostredkovatelia">
            <ul className="list-disc space-y-2 pl-5">
              <li>Vercel – poskytovateľ hostingu webovej stránky</li>
              <li>Neon – poskytovateľ databázových služieb pre ukladanie formulárov a blogu</li>
              <li>
                Vercel Analytics – anonymizovaná štatistika návštevnosti (len na základe súhlasu)
              </li>
            </ul>
          </Section>

          <Section title="Prenos údajov do tretích krajín">
            <p>
              Pri využívaní niektorých technických služieb môže dochádzať k prenosu údajov mimo
              Európskej únie. V takom prípade zabezpečujeme primeranú úroveň ochrany v súlade s
              požiadavkami GDPR.
            </p>
          </Section>

          <Section title="Bezpečnostné opatrenia">
            <p>
              Osobné údaje chránime primeranými technickými a organizačnými opatreniami, vrátane
              šifrovaného prenosu (HTTPS), obmedzenia prístupu a pravidelnej údržby systémov.
            </p>
          </Section>

          <Section title="Automatizované rozhodovanie">
            <p>
              Osobné údaje sa nepoužívajú na automatizované rozhodovanie ani profilovanie s právnymi
              alebo obdobne významnými účinkami pre dotknutú osobu.
            </p>
          </Section>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="space-y-8">
          <Section title="Kontakt pre uplatnenie práv">
            <p>
              Pre uplatnenie práv dotknutej osoby alebo otázky týkajúce sa ochrany údajov nás
              kontaktujte:
            </p>
            <div className="mt-4 space-y-1">
              <p className="font-semibold text-[#202325]">Michal Kurka</p>
              <p>
                E-mail:{" "}
                <a
                  href="mailto:michal.kurka@michalkurka.sk"
                  className="text-[#202325] underline underline-offset-2 hover:text-gray-600"
                >
                  michal.kurka@michalkurka.sk
                </a>
              </p>
              <p>Telefón: +421 905 583 323</p>
              <p>A13 Concept Business Hub, Továrenská 2206/13K, 901 01 Malacky</p>
            </div>
          </Section>

          <Section title="Postup pri uplatnení práv">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Pošlite písomnú žiadosť na uvedený e-mail.</li>
              <li>Uveďte, ktoré právo uplatňujete.</li>
              <li>Pre overenie totožnosti uveďte meno a kontaktné údaje.</li>
              <li>Na žiadosť odpovieme bez zbytočného odkladu, najneskôr do 30 dní.</li>
            </ol>
          </Section>

          <Section title="Dozorný orgán">
            <p>
              Sťažnosť môžete podať na{" "}
              <strong className="font-semibold text-[#202325]">
                Úrad na ochranu osobných údajov Slovenskej republiky
              </strong>
              , Hraničná 12, 820 07 Bratislava, web:{" "}
              <a
                href="https://www.dataprotection.gov.sk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#202325] underline underline-offset-2 hover:text-gray-600"
              >
                www.dataprotection.gov.sk
              </a>
              .
            </p>
          </Section>
        </div>
      )}
    </div>
  );
}
