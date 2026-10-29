"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import ContactModal from "../../../components/ContactModal";
import CalculatorCta from "@/components/CalculatorCta";

interface InvestmentCompany {
  name: string;
  logo: string;
  isImage: boolean;
  extraLarge?: boolean;
  customSize?: boolean;
  isLarger?: boolean;
}

export default function InvestovaniePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeInvestmentModal = () => {
    setIsInvestmentModalOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _investmentOptions = [
    {
      title: "Investičné fondy",
      description: "Dlhodobé investovanie do diverzifikovaných portfólií",
      features: ["Nízke riziko", "Stabilný rast", "Profesionálne riadenie"],
      icon: "📈"
    },
    {
      title: "ETF investície",
      description: "Pasívne investovanie do indexových fondov",
      features: ["Nízke poplatky", "Diverzifikácia", "Transparentnosť"],
      icon: "📊"
    },
    {
      title: "Robo advisory",
      description: "Automatizované investovanie na základe vášho profilu",
      features: ["Automatické vyvažovanie", "24/7 monitoring", "Nízke náklady"],
      icon: "🤖"
    }
  ];

  // Investment companies for main page
  const investmentCompanies: InvestmentCompany[] = [
    { name: "Amundi", logo: "/Amundi_logo.png", isImage: true, extraLarge: true },
    { name: "Simplea", logo: "/Simplea_In_logo.png", isImage: true, extraLarge: true },
    { name: "Trigea", logo: "/Trigea_logo.png", isImage: true, extraLarge: true },
    { name: "EIC", logo: "/eic_logo.png", isImage: true, extraLarge: true }
  ];

  // All investment companies for popup (includes additional logos)
  const allInvestmentCompanies: InvestmentCompany[] = [
    ...investmentCompanies,
    { name: "Merity", logo: "/merity_logo.jpg", isImage: true, extraLarge: true },
    { name: "Conseq", logo: "/conseq_logo.png", isImage: true, extraLarge: true },
    { name: "IAD", logo: "/IAD_logo.png", isImage: true, extraLarge: true }
  ];

  return (
    <>
      <Head>
        <link rel="preload" href="/Investovanie.svg" as="image" type="image/svg+xml" />
      </Head>
      <main className="min-h-screen">
        {/* Contact Modal */}
        <ContactModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Investment Companies Modal */}
      {isInvestmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred background overlay */}
          <div className="absolute inset-0 backdrop-blur-sm"></div>
          {/* Popup content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="flex-1 text-center">
                  <h2 className="text-2xl font-bold text-[#202325]">Naše investičné spoločnosti</h2>
                </div>
                <button
                  onClick={closeInvestmentModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-items-center">
                {allInvestmentCompanies.length > 0 ? (
                  allInvestmentCompanies.map((company, index) => (
                    <div key={index} className="flex items-center justify-center w-full">
                      {company.isImage ? (
                        <Image
                          src={company.logo}
                          alt={`${company.name} logo`}
                          width={300}
                          height={150}
                          className="w-auto object-contain hover:scale-110 transition-transform duration-300 h-12 md:h-16"
                          style={{ maxHeight: '5rem', height: 'auto' }}
                        />
                      ) : (
                        <span className="text-xl">{company.logo}</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-400">
                    <p>Logos will be added here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[700px] flex items-center overflow-hidden">
        {/* Banner background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/investovanie-banner.jpg"
            alt="Socha býka – symbol investovania"
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
            <div className="flex-1 text-left md:text-left lg:text-left mb-8 md:mb-0 lg:mb-0 lg:pr-8 xl:pr-16 lg:pl-0 lg:ml-8 -ml-16 sm:-ml-20 pt-52 sm:pt-64 md:pt-0 lg:pt-0 md:pl-20 lg:pl-16 md:max-w-[50%] md:mr-auto max-w-[70%] sm:max-w-[65%]">
              <h1 className="text-5xl sm:text-5xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-4 sm:mb-6 drop-shadow-lg" style={{fontFamily: 'Monda, sans-serif'}}>
                <span className="block md:hidden">Investovanie</span>
                <span className="hidden md:block">Investovanie</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-8 max-w-xl md:max-w-3xl lg:max-w-2xl mx-auto lg:mx-0 font-light drop-shadow-md leading-relaxed">
                Rozmnožte svoje úspory inteligentným investovaním s profesionálnym poradenstvom
              </p>
              <Link href="/formular">
                <button className="bg-[#5ECAD5] hover:bg-[#4BB8C4] text-white font-semibold px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors shadow-lg text-sm sm:text-base md:text-lg w-full sm:w-auto max-w-xs sm:max-w-none mx-auto sm:mx-0 block sm:inline-block">
                  Bezplatná konzultácia
                </button>
              </Link>
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
              INVESTOVANIE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#202325] mb-8 max-w-3xl mx-auto leading-tight">
              Každý deň bez investovania vás stojí peniaze.
            </h2>
            <div className="w-20 h-1 bg-[#5ECAD5] mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Dlhodobé držanie peňazí na bežných účtoch alebo v hotovosti vedie k strate hodnoty peňazí vďaka infláciu. Pravidelne a rozumne investujte čo i len malú sumu a zhodnocujte svoje peniaze a tvorte si finančnú rezervu. Investovanie dávno nie je výsadou len pre bohatých či veľké firmy, so správnymi informáciami, nástrojmi a vedením sa k nemu môže dostať každý, kto chce mať svoje financie a budúcnosť pod kontrolou.
            </p>
          </div>

          {/* Quote Style Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12 border-l-4 border-[#5ECAD5]">
            <div className="flex items-start">
              <div className="text-6xl text-[#5ECAD5] mr-4 leading-none">&ldquo;</div>
              <div>
                <p className="text-lg text-gray-700 italic leading-relaxed mb-4">
                  Peniaze, ktoré si sporíme tak &ldquo;ODPOČÍVAJÚ&rdquo; a peniaze, ktoré investujem tak &ldquo;PRACUJÚ&rdquo;. Investovanie má zmysel, pretože peniaze časom strácajú hodnotu. Na rozdiel od bežného sporenia vám investície umožňujú zhodnocovať úspory a budovať kapitál na dôležité ciele ako bývanie, vzdelanie detí či finančnú slobodu.
                </p>
                <p className="text-lg text-gray-700 italic leading-relaxed">
                  Začať sa dá aj s menšími sumami, dôležité je nečakať. Čím skôr začnete, tým viac času majú peniaze rásť. Investovanie je vhodné pre každého, kto chce aktívne ovplyvniť svoju budúcnosť. Kľúčom k úspechu je spoľahlivý partner.
                </p>
              </div>
            </div>
          </div>

          {/* Infographics Section */}
          <div className="mb-16">
            <div className="text-center mb-10 md:mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-[#202325] mb-3">
                Inflácia vs. sporenie a investovanie
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                Porovnanie pri ročnej inflácii 3&nbsp;%. Zelené stĺpce ukazujú reálny zisk, červené stratu oproti tomu, čo ste vložili.
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10 max-w-7xl mx-auto">
              <figure className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-shadow hover:shadow-lg">
                <div className="bg-gradient-to-br from-[#5ECAD5]/10 to-white px-5 py-4 md:px-6 md:py-5 border-b border-gray-100">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#5ECAD5] mb-1">
                    Jednorazový vklad
                  </span>
                  <figcaption className="text-lg md:text-xl font-semibold text-[#202325]">
                    35&nbsp;000&nbsp;€ na 5 rokov
                  </figcaption>
                </div>
                <div className="p-4 sm:p-5 md:p-6 bg-[#f8f9fa]">
                  <Image
                    src="/jednorazova-investicia-inflacia.webp"
                    alt="Infografika: jednorazová investícia 35 000 € – porovnanie bežného účtu, sporenia a fondov po inflácii"
                    width={1200}
                    height={700}
                    className="w-full h-auto rounded-lg object-contain"
                  />
                </div>
              </figure>

              <figure className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-shadow hover:shadow-lg">
                <div className="bg-gradient-to-br from-[#5ECAD5]/10 to-white px-5 py-4 md:px-6 md:py-5 border-b border-gray-100">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#5ECAD5] mb-1">
                    Pravidelné sporenie
                  </span>
                  <figcaption className="text-lg md:text-xl font-semibold text-[#202325]">
                    100&nbsp;€ mesačne na 10 rokov
                  </figcaption>
                </div>
                <div className="p-4 sm:p-5 md:p-6 bg-[#f8f9fa]">
                  <Image
                    src="/sporenie-vs-investovanie-inflacia.webp"
                    alt="Infografika: mesačné sporenie 100 € – porovnanie účtov a fondov so skutočnou hodnotou po inflácii"
                    width={1200}
                    height={700}
                    className="w-full h-auto rounded-lg object-contain"
                  />
                </div>
              </figure>
            </div>

            <p className="text-center text-sm text-gray-500 mt-8 max-w-3xl mx-auto leading-relaxed">
              Ilustračné výpočty – skutočné výsledky závisia od produktu, poplatkov a vývoja trhu. Pri konzultácii pripravíme pre vás model na mieru.
            </p>
          </div>

          {/* Three Column Article Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 lg:gap-24 max-w-7xl mx-auto lg:justify-start">
            
            {/* Left Column */}
            <article className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-[#5ECAD5] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-[#202325]">
                  Oplatí sa riskovať investovaním keď môžem jednoducho sporiť?
                </h3>
              </div>
              
              <p className="text-gray-600 leading-relaxed text-base">
                Mnohí si myslia, že investovanie je len pre bohatých. Pravda je však iná, začať sa dá aj s 20 či 50 eurami mesačne. Pravidelné investovanie malých súm má často väčší efekt než čakanie na &ldquo;správny čas&rdquo; s veľkým vkladom.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#202325] mb-2 flex items-center text-base">
                  <span className="w-4 h-4 bg-[#5ECAD5] rounded-full mr-2"></span>
                  Kľúčové fakty:
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Kto investuje, dáva peniazom šancu rásť. Kto ich nechá ležať na účte, stráca, pretože inflácia každý rok znižuje ich hodnotu. Čím skôr začnete, tým viac získate.
                </p>
              </div>
            </article>

            {/* Middle Column */}
            <article className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-[#5ECAD5] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-[#202325]">
                  Je investovanie bezpečné? Môžem prísť o peniaze?
                </h3>
              </div>

              <p className="text-gray-600 leading-relaxed text-base">
                Hodnota investícií kolíše, raz stúpa, inokedy klesá. Je to prirodzená súčasť trhu, ovplyvnená politikou, ekonomikou či správaním investorov. Dôležité je nepanikáriť, ale pozerať sa na investovanie dlhodobo.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#202325] mb-2 flex items-center text-base">
                  <span className="w-4 h-4 bg-[#5ECAD5] rounded-full mr-2"></span>
                  Dôležité upozornenie:
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Trhy sa v čase zvyknú zotaviť a rásť, najmä ak máte dobre alokované portfólio. Bezpečnosť zvyšuje aj priebežný záujem, sledovanie diania a správne načasovanie krokov.
                </p>
              </div>

              <p className="text-gray-600 leading-relaxed text-base">
                Nemusíte byť odborník, ale mať po boku skúseného sprostredkovateľa ktorý všetko čo je potrebné sledovať a sprostredkovať rieši za vás s pravidelným vzdelávaním a skúsenosťami.
              </p>
            </article>

            {/* Right Column */}
            <article className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-[#5ECAD5] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-[#202325]">
                  Ako môžem investovať?
                </h3>
              </div>

              <p className="text-gray-600 leading-relaxed text-base">
                Na túto otázku sa nedá odpovedať univerzálne, pretože každý človek má iné ciele, skúsenosti a finančné možnosti. Ku každému klientovi je treba pristupovať individuálne a vždy sa najskôr zisťuje jeho investičný profil, očakávania a mieru ochoty podstúpiť riziko.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#202325] mb-2 flex items-center text-base">
                  <span className="w-4 h-4 bg-[#5ECAD5] rounded-full mr-2"></span>
                  Náš prístup:
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Máme dlhoročné skúsenosti, pod správou desiatky miliónov eur a stovky spokojných klientov. Radi vám spravíme analýzu a stratégiu – zrozumiteľne a odborne.
                </p>
              </div>

              <p className="text-gray-600 leading-relaxed text-base">
                Investovať môže prakticky každý – aj s menšou sumou a bez hlbokých znalostí finančných trhov. Dôležité je vedieť, aké sú tvoje ciele, ako dlho chceš investovať a aké riziko ti vyhovuje.
              </p>
            </article>
          </div>

          {/* Bottom Quote */}
          <div className="bg-gradient-to-r from-[#5ECAD5]/5 to-blue-50/50 rounded-xl p-6 border-l-4 border-[#5ECAD5] mt-12">
            <p className="text-gray-800 leading-relaxed text-center">
              Investovanie nie je hazard, ale ani zaručená istota. Pravdou je, že každý typ investície nesie určité riziko – preto je dôležité vedieť, kam, kedy a ako investovať. Nestrkáš peniaze naslepo, ale s plánom, ktorý zohľadňuje tvoje ciele, čas a ochotu riskovať. So správnym nastavením môžeš svoje peniaze zhodnocovať dlhodobo a rozumne, nie nechať ich ležať a strácať hodnotu.
            </p>
          </div>

          <CalculatorCta slug="investicie" className="mt-12" />

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

      {/* Investment Options Section }
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#202325] text-center mb-8 md:mb-12">
            TYPY INVESTOVANIA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 lg:gap-8">
            {investmentOptions.map((option, index) => (
              <div key={index} className="bg-gray-50 p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl sm:text-4xl mb-4 text-center">{option.icon}</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#202325] mb-4 text-center">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-6 text-center text-sm md:text-base leading-relaxed">
                  {option.description}
                </p>
                <ul className="space-y-2">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-[#5ECAD5] rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-[#202325] text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Why Invest Section */}
      <section className="py-12 md:py-16 bg-[#202325]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8">
            PREČO INVESTOVAŤ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-8">
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#5ECAD5] mb-4">Ochrana pred infláciou</h3>
              <p className="text-gray-300">Vaše peniaze si zachovajú a zvýšia svoju hodnotu v čase</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#5ECAD5] mb-4">Pasívny príjem</h3>
              <p className="text-gray-300">Vytvorte si dodatočný zdroj príjmov na dôchodok</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#5ECAD5] mb-4">Finančná nezávislosť</h3>
              <p className="text-gray-300">Dosiahnutie vašich finančných cieľov a snov</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-[#5ECAD5] mb-4">Diverzifikácia</h3>
              <p className="text-gray-300">Rozloženie rizika na rôzne typy investícií</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Companies Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#202325] text-center mb-8 md:mb-12">
            INVESTIČNÉ SPOLOČNOSTI
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            {investmentCompanies.map((company, index) => (
              <div key={index} className="flex items-center justify-center">
                {company.isImage ? (
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    width={300}
                    height={150}
                    className="w-auto object-contain hover:scale-110 transition-transform duration-300 h-12 md:h-16"
                    style={{ maxHeight: '5rem', height: 'auto' }}
                  />
                ) : (
                  <span className="text-xl">{company.logo}</span>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600 text-lg">
              Všetky investičné spoločnosti najdete{" "}
              <button
                onClick={() => setIsInvestmentModalOpen(true)}
                className="text-[#5ECAD5] hover:text-[#4BB8C4] underline cursor-pointer font-semibold transition-colors"
              >
                tu
              </button>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Investment Process Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#202325] text-center mb-8 md:mb-12">
            AKO TO PREBIEHA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-[#202325] mb-2">Konzultácia</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Zanalyzujeme vašu finančnú situáciu a ciele</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-[#202325] mb-2">Stratégia</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Vytvoríme investičnú stratégiu na mieru</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-[#202325] mb-2">Implementácia</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Spustíme investovanie podľa plánu</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">4</div>
              <h3 className="text-lg font-semibold text-[#202325] mb-2">Servis</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Pravidelné konzultácie a vyhodnocovanie</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#202325] mb-6">
            ZAČNITE INVESTOVAŤ UŽ DNES
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Získajte bezplatnú analýzu vašej finančnej situácie a osobný investičný plán
          </p>
          <Link href="/formular">
            <button className="bg-[#5ECAD5] hover:bg-[#4BB8C4] text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg text-lg">
              Chcem investovať
            </button>
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}