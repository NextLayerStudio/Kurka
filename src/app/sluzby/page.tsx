"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ContactModal from "../../components/ContactModal";
import CalculatorCta from "@/components/CalculatorCta";

export default function SluzbyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const services = [
    {
      title: "Investovanie",
      description: "Rozmnožte svoje úspory inteligentným investovaním s profesionálnym poradenstvom",
      features: ["Investičné fondy", "ETF investície", "Robo advisory"],
      href: "/sluzby/investovanie",
      icon: "📈",
      color: "bg-blue-50 hover:bg-blue-100"
    },
    {
      title: "Hypotéky",
      description: "Získajte najvýhodnejšiu hypotéku a splňte si sen o vlastnom bývaní",
      features: ["Hypotéka na bývanie", "Refinancovanie", "Americká hypotéka"],
      href: "/sluzby/hypoteky",
      icon: "🏠",
      color: "bg-green-50 hover:bg-green-100"
    },
    {
      title: "Poistenia",
      description: "Zabezpečte sa a svoju rodinu proti nepredvídateľným životným situáciám",
      features: ["Životné poistenie", "Úrazové poistenie", "Kritické choroby"],
      href: "/sluzby/poistenia",
      icon: "🛡️",
      color: "bg-purple-50 hover:bg-purple-100"
    },
    {
      title: "Dôchodok",
      description: "Zabezpečte si dôstojný dôchodok a finančnú nezávislosť v seniorskom veku",
      features: ["III. pilier - DDS", "Dôchodkové poistenie", "Investičné sporenie"],
      href: "/sluzby/dochodok",
      icon: "🏛️",
      color: "bg-orange-50 hover:bg-orange-100"
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Hero Banner Section */}
      <section className="relative min-h-[750px] md:min-h-[700px] lg:min-h-[700px] flex items-center overflow-hidden">
        {/* Banner background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner.svg"
            alt="Banner background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* Advisor photo positioned on the right */}
        <div className="absolute right-4 sm:right-20 md:-right-30 lg:right-20 -bottom-12 sm:-bottom-16 md:-bottom-16 lg:-bottom-24 z-20 w-[320px] h-[420px] sm:w-[400px] sm:h-[520px] md:w-[520px] md:h-[650px] lg:w-[600px] lg:h-[750px] xl:w-[650px] xl:h-[850px]">
          <Image
            src="/advisor-photo.png"
            alt="Financial Advisor"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Text Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row lg:flex-row items-center justify-center min-h-[750px] md:min-h-[700px] lg:min-h-[700px]">
            {/* Left side - Text content */}
            <div className="flex-1 text-left md:text-left lg:text-left mb-8 md:mb-0 lg:mb-0 lg:pr-8 xl:pr-16 lg:pl-0 lg:ml-8 px-4 sm:px-0 pt-32 sm:pt-24 md:pt-0 lg:pt-0 md:pl-12 lg:pl-16 md:max-w-[55%] md:mr-auto">
              <h1 className="text-5xl sm:text-6xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6 drop-shadow-lg" style={{fontFamily: 'Monda, sans-serif'}}>
                <span className="block md:hidden">Služby</span>
                <span className="hidden md:block">Služby</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-xl text-white mb-8 max-w-xl md:max-w-3xl lg:max-w-lg mx-auto lg:mx-0 font-light drop-shadow-md">
                Vyberte si zo širokej ponuky služieb, ktoré naša kancelária ponúka. Či už sa chcete poradiť ohľadom hypotéky, poistenia či dôchodku. Sme tu pre vás
              </p>
              <Link href="/formular">
                <button className="bg-[#5ECAD5] hover:bg-[#4BB8C4] text-white font-semibold px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors shadow-lg text-base sm:text-lg md:text-lg w-full sm:w-auto max-w-xs sm:max-w-none mx-auto sm:mx-0 block sm:inline-block">
                  Využiť službu
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-12 md:py-20 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-semibold text-[#202325] text-center mb-8 md:mb-12 lg:mb-12">
            ČO VÁM PONÚKAME
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-10 lg:gap-8">
            {services.map((service, index) => (
              <Link key={index} href={service.href}>
                <div className={`${service.color} p-6 md:p-8 lg:p-8 rounded-xl shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:shadow-xl`}>
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl">{service.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold text-[#202325] mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm md:text-base lg:text-base leading-relaxed">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-xs sm:text-sm md:text-sm lg:text-sm">
                            <div className="w-2 h-2 bg-[#5ECAD5] rounded-full mr-3 flex-shrink-0"></div>
                            <span className="text-[#202325]">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 text-[#5ECAD5] font-medium text-xs sm:text-sm md:text-sm lg:text-sm flex items-center">
                        Zistiť viac 
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-20 lg:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-semibold text-[#202325] text-center mb-8 md:mb-12 lg:mb-12">
            PREČO SI VYBRAŤ NÁS?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-8">
            <div className="bg-white p-6 md:p-8 lg:p-8 rounded-lg shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 bg-[#5ECAD5] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl lg:text-lg font-semibold text-[#202325] mb-2">
                    Komplexný prístup
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base lg:text-sm">
                    Riešime všetky vaše finančné potreby pod jednou strechou
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 lg:p-8 rounded-lg shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 bg-[#5ECAD5] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl lg:text-lg font-semibold text-[#202325] mb-2">
                    20+ rokov skúseností
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base lg:text-sm">
                    Dlhoročné skúsenosti a tisíce spokojných klientov
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 lg:p-8 rounded-lg shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 bg-[#5ECAD5] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl lg:text-lg font-semibold text-[#202325] mb-2">
                    Bezplatné poradenstvo
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base lg:text-sm">
                    Všetky naše služby a poradenstvo poskytujeme bez poplatkov
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 lg:p-8 rounded-lg shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 bg-[#5ECAD5] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#202325] mb-2">
                    Osobný prístup
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Individuálne riešenia šité na mieru vašim potrebám
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 md:py-16 bg-[#202325]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8 md:mb-12">
            AKO TO PREBIEHA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold text-white mb-2">Konzultácia</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Zanalyzujeme vašu finančnú situáciu a potreby</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold text-white mb-2">Návrh</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Navrhneme optimálne riešenia na mieru</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold text-white mb-2">Implementácia</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Spustíme riešenia podľa dohodnutého plánu</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">4</div>
              <h3 className="text-lg font-semibold text-white mb-2">Starostlivosť</h3>
              <p className="text-gray-300 text-sm leading-relaxed">Poskytujeme dlhodobú starostlivosť a podporu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculators */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculatorCta slug="rozpocet" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#202325] mb-6">
            ZAČNIME SPOLU
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Získajte bezplatnú analýzu vašej finančnej situácie a osobný finančný plán
          </p>
          <Link href="/formular">
            <button className="bg-[#5ECAD5] hover:bg-[#4BB8C4] text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg text-lg">
              Chcem bezplatnú konzultáciu
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}