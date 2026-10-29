"use client";

import React, { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import ContactFormModal from "../../../components/ContactFormModal";
import CalculatorCta from "@/components/CalculatorCta";

export default function DochodokPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const retirementCompanies = [
    { name: "TatraBanka", logo: "/TatraBanka.webp", product: "DDS Klasik", isImage: true, extraLarge: false },
    { name: "Generali", logo: "/VUBGenerali_logo.png", product: "Perspektíva", isImage: true, extraLarge: false },
    { name: "NN", logo: "/NN.webp", product: "Invest DDS", isImage: true, extraLarge: false },
    { name: "UNIQA", logo: "/Uniqa.webp", product: "Profit DDS", isImage: true, extraLarge: true },
  ];

  return (
    <>
      <Head>
        <link rel="preload" href="/dochodok-banner.jpg" as="image" type="image/jpeg" />
      </Head>
      <main className="min-h-screen">
        {/* Contact Modal */}
        <ContactFormModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Hero Banner Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[700px] flex items-center overflow-hidden">
        {/* Banner background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/dochodok-banner.jpg"
            alt="Pár pri plánovaní dôchodku pri západe slnka"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        
        
        {/* Text Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row lg:flex-row items-center justify-center min-h-[600px] md:min-h-[700px] lg:min-h-[700px]">
            {/* Left side - Text content */}
            <div className="flex-1 text-left md:text-left lg:text-left mb-8 md:mb-0 lg:mb-0 lg:pr-8 xl:pr-16 lg:pl-0 lg:ml-8 px-4 sm:px-0 pt-40 sm:pt-32 md:pt-0 lg:pt-0 md:pl-12 lg:pl-16 md:max-w-[55%] md:mr-auto">
              <h1 className="text-5xl sm:text-6xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6 drop-shadow-lg" style={{fontFamily: 'Monda, sans-serif'}}>
                <span className="block md:hidden">Renta a dôchodok</span>
                <span className="hidden md:block">Renta a dôchodok</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-xl text-white mb-8 max-w-xl md:max-w-3xl lg:max-w-2xl mx-auto lg:mx-0 font-light drop-shadow-md">
                Zabezpečte si dôstojný dôchodok a finančnú nezávislosť.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#5ECAD5] hover:bg-[#4BB8C4] text-white font-semibold px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors shadow-lg text-base sm:text-lg md:text-lg w-full sm:w-auto max-w-xs sm:max-w-none mx-auto sm:mx-0 block sm:inline-block"
              >
                Chcem sa zabezpečiť
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Insights Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Question - Magazine Style */}
          <div className="text-center mb-16">
            <div className="inline-block bg-[#5ECAD5] text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              DÔCHODOK
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#202325] mb-8 max-w-3xl mx-auto leading-tight">
              Prečo je dôležité myslieť na dôchodok už dnes?
            </h2>
            <div className="w-20 h-1 bg-[#5ECAD5] mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Až 90 % ľudí na Slovensku sa dožije dôchodkového veku – životnej etapy, ktorá môže trvať aj niekoľko desaťročí. Napriek tomu na ňu väčšina z nás myslí až príliš neskoro. Stabilné finančné zázemie a dlhodobé plánovanie sú kľúčom k zachovaniu nezávislosti a životného štandardu. Pravidelné sporenie a investovanie vám pomôžu pripraviť sa na dôchodok bez starostí.
            </p>
          </div>

          {/* Quote Style Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12 border-l-4 border-[#5ECAD5]">
            <div className="flex items-start">
              <div className="text-6xl text-[#5ECAD5] mr-4 leading-none">&ldquo;</div>
              <div>
                <p className="text-lg text-gray-700 italic leading-relaxed mb-4">
                Čas je kľúčový faktor úspešného dôchodkového sporenia. Čím skôr začneš, tým viac za teba pracuje zložené úročenie – peniaze majú priestor rásť a vytvárať zisk aj z už dosiahnutých výnosov.
                </p>
                <p className="text-lg text-gray-700 italic leading-relaxed">
                Skorý štart zároveň znamená, že tvoj cieľ dosiahneš s menším mesačným vkladom. Ak začneš dnes, stačí odkladať menej. Ak to odložíš o pár rokov, budeš musieť prispievať podstatne viac, aby si dosiahol rovnaký výsledok.
                </p>
                <p className="text-lg text-gray-700 italic leading-relaxed">
                Investovanie na dôchodok nie je o dokonalom načasovaní, ale o rozhodnutí začať. Každý mesiac, ktorý nevyužiješ, je mesiac, kedy tvoje peniaze mohli pracovať pre teba.
                </p>
              </div>
            </div>
          </div>

          {/* Infographics Section */}
          <div className="mb-12">
            <div className="text-center mb-10 md:mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-[#202325] mb-3">
                Demografia a budúcnosť dôchodkov
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                Oficiálna prognóza MF SR a Európskej komisie: pomer pracujúcich k počtu dôchodcov klesá. Čím menej ľudí prispieva do systému, tým dôležitejšie je vlastné sporenie.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:gap-10 max-w-5xl mx-auto">
              <figure className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-shadow hover:shadow-lg">
                <div className="bg-gradient-to-br from-[#5ECAD5]/10 to-white px-5 py-4 md:px-6 md:py-5 border-b border-gray-100">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#5ECAD5] mb-1">
                    Slovensko, 2022 – 2060
                  </span>
                  <figcaption className="text-base md:text-lg font-semibold text-[#202325] leading-snug">
                    O zhruba 35 rokov bude na jedného dôchodcu pracovať len 1,1 človeka
                  </figcaption>
                </div>
                <div className="p-4 sm:p-5 md:p-6 bg-[#f8f9fa]">
                  <Image
                    src="/pracujuci-na-dochodcu-2060.webp"
                    alt="Graf: počet pracujúcich na jedného dôchodcu – prognóza do roku 2060"
                    width={1200}
                    height={650}
                    className="w-full h-auto rounded-lg object-contain"
                  />
                </div>
              </figure>

              <figure className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-shadow hover:shadow-lg">
                <div className="bg-gradient-to-br from-[#5ECAD5]/10 to-white px-5 py-4 md:px-6 md:py-5 border-b border-gray-100">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#5ECAD5] mb-1">
                    Slovensko, 2022 – 2070
                  </span>
                  <figcaption className="text-base md:text-lg font-semibold text-[#202325] leading-snug">
                    Dnes na jedného dôchodcu pracujú necelí dvaja ľudia – okolo roku 2060 to bude 1,1 pracujúceho
                  </figcaption>
                </div>
                <div className="p-4 sm:p-5 md:p-6 bg-[#f8f9fa]">
                  <Image
                    src="/pracujuci-na-dochodcu-2070.webp"
                    alt="Graf: pomer zamestnaných k poberateľom dôchodkov – prognóza do roku 2070"
                    width={1200}
                    height={650}
                    className="w-full h-auto rounded-lg object-contain"
                  />
                </div>
              </figure>
            </div>

            <p className="text-center text-xs sm:text-sm text-gray-500 mt-8 max-w-3xl mx-auto leading-relaxed">
              Zdroj: 2024 Ageing Report, Slovak Republic – Country Fiche (MF SR, Európska komisia), tabuľka 10. Počet zamestnaných / počet poberateľov dôchodkov (všetky typy).
            </p>
          </div>
          {/* Bottom Quote */}
          <div className="bg-gradient-to-r from-[#5ECAD5]/5 to-blue-50/50 rounded-xl p-6 border-l-4 border-[#5ECAD5] mt-12">
            <p className="text-gray-800 leading-relaxed text-center">
              Súčasný dôchodkový systém čelí výzvam spôsobeným starnutím populácie a znižovaním počtu pracujúcich na jedného dôchodcu. Tento trend spôsobuje, že v budúcnosti štátne dávky nebudú stačiť na zabezpečenie dôstojného života. Ľudia, ktorí pôjdu do dôchodku o 30–50 rokov, by sa mali pripraviť na nižší alebo dokonca žiadny štátny dôchodok. Vytvorte si preto vlastný finančný plán a budujte si nezávislosť včas.
            </p>
          </div>

          {/* Warning Section */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
            <h4 className="font-bold text-red-800 mb-3 flex items-center text-lg">
              <span className="w-5 h-5 bg-red-500 rounded-full mr-3"></span>
              Prečo sa nespoliehať len na štátny dôchodok?
            </h4>
            <div className="space-y-3 text-red-700 text-sm leading-relaxed">
              <p>• Slovensko má čoraz menej pracujúcich a čoraz viac dôchodcov – systém je postavený na priebežnom financovaní, čo znamená, že dnešní pracujúci platia dnešné dôchodky.</p>
              <p>• Lenže populácia starne a pôrodnosť klesá. Demografický vývoj je neúprosný – o pár rokov bude na jedného dôchodcu pripadať menej než jeden pracujúci.</p>
              <p>• Sociálna poisťovňa už dnes čelí výpadkom a deficitom, ktoré štát dotuje z rozpočtu.</p>
              <p>• Výsledok? Štátny dôchodok v budúcnosti pravdepodobne nepokryje ani základné životné náklady, nieto dôstojnú starobu.</p>
              <p>• Práve preto je dôležité mať vlastné rezervy, investície alebo doplnkové zabezpečenie. Spoliehať sa výlučne na štát dnes nie je istota – ale riziko.</p>
            </div>
          </div>

          <CalculatorCta slug="dochodok" className="mt-12" />

          {/* Simple CTA */}
          <div className="text-center mt-16 pt-8 border-t border-gray-200">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#5ECAD5] hover:bg-[#4BB8C4] text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg text-lg"
            >
              Bezplatná konzultácia
            </button>
            <p className="text-gray-500 text-sm mt-3">
              Bez záväzkov • Individuálny prístup
            </p>
          </div>
        </div>
      </section>



      

      {/* Why Start Early Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#202325] mb-8">
            PREČO ZAČAŤ SKORO?
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-[#5ECAD5]">
            <div className="flex items-start">
              <div className="text-6xl text-[#5ECAD5] mr-4 leading-none">&ldquo;</div>
              <div className="text-left">
                <p className="text-lg text-gray-700 italic leading-relaxed mb-4">
                  Zložené úročenie je ôsmy div sveta. Ten, kto mu rozumie, zarába na ňom, ten, kto mu nerozumie, platí ho.
                </p>
                <p className="text-gray-800 font-semibold text-right">
                  ALBERT EINSTEIN
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Retirement Companies Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#202325] text-center mb-8 md:mb-12">
            DÔCHODKOVÉ SPOLOČNOSTI
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {retirementCompanies.map((company, index) => (
              <div key={`${company.name}-${index}`} className="flex items-center justify-center">
                {company.isImage ? (
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={400}
                    height={200}
                    className="w-auto object-contain hover:scale-110 transition-all duration-300 h-14 md:h-20"
                    style={{ maxHeight: '6rem' }}
                  />
                ) : (
                  <span className="text-xl">{company.logo}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#202325] text-center mb-8 md:mb-12">
            VÝHODY DÔCHODKOVÉHO SPORENIA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-[#202325] mb-4">💰 Daňové úľavy</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Až 180€ ročne na daniach + úľavy za príspevky</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-[#202325] mb-4">🎁 Prispevky od zamestnavatela</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Štát prispieva k vašim úsporám dodatočnými peniazmi</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-[#202325] mb-4">🔒 Garancia</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Garantované výnosy a ochrana vložených prostriedkov</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg sm:text-xl font-semibold text-[#202325] mb-4">🔄 Flexibilita</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">Možnosť zmeny príspevkov a prevodov medzi spoločnosťami</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#202325] text-center mb-8 md:mb-12">
            AKO TO PREBIEHA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-[#202325] mb-2">Analýza cieľov a potrieb</h3>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-[#202325] mb-2">Návrh vhodnej stratégie</h3>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-[#202325] mb-2">Realizácia</h3>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">4</div>
              <h3 className="text-lg font-semibold text-[#202325] mb-2">Pravidelný servis</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}