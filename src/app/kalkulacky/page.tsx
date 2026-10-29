import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalculatorSlug, calculatorList } from "@/lib/calculators";

export const metadata: Metadata = {
  title: "Kalkulačky | Michal Kurka",
  description:
    "Investičná, dôchodková a hypotekárna kalkulačka a aplikácia Rodinný rozpočet – bezplatné nástroje pre vaše financie.",
};

const iconProps = {
  className: "h-7 w-7",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

const icons: Record<CalculatorSlug, ReactNode> = {
  investicie: (
    <svg {...iconProps}>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  ),
  dochodok: (
    <svg {...iconProps}>
      <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  hypoteka: (
    <svg {...iconProps}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  ),
  rozpocet: (
    <svg {...iconProps}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <path d="M16 15h2" />
    </svg>
  ),
};

const steps = [
  { title: "Vyberte kalkulačku", text: "Investície, dôchodok, hypotéka alebo rozpočet" },
  { title: "Zadajte svoje čísla", text: "Výsledok sa prepočíta hneď pri každej zmene" },
  { title: "Stiahnite si PDF", text: "Prepočet si uložte alebo pošlite ďalej" },
  { title: "Preberieme to spolu", text: "Na bezplatnej konzultácii pripravím plán na mieru" },
];

export default function KalkulackyPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative min-h-[750px] md:min-h-[700px] lg:min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/banner.svg" alt="Banner background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="absolute right-4 sm:right-20 md:-right-30 lg:right-20 -bottom-12 sm:-bottom-16 md:-bottom-16 lg:-bottom-24 z-20 w-[320px] h-[420px] sm:w-[400px] sm:h-[520px] md:w-[520px] md:h-[650px] lg:w-[600px] lg:h-[750px] xl:w-[650px] xl:h-[850px]">
          <Image src="/advisor-photo.png" alt="Michal Kurka" fill className="object-contain" priority />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-center justify-center min-h-[750px] md:min-h-[700px]">
            <div className="flex-1 text-left mb-8 md:mb-0 lg:pr-8 xl:pr-16 lg:ml-8 px-4 sm:px-0 pt-32 sm:pt-24 md:pt-0 md:pl-12 lg:pl-16 md:max-w-[55%] md:mr-auto">
              <h1
                className="text-5xl sm:text-6xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6 drop-shadow-lg"
                style={{ fontFamily: "Monda, sans-serif" }}
              >
                Kalkulačky
              </h1>
              <p className="text-lg sm:text-xl text-white mb-8 max-w-xl lg:max-w-lg font-light drop-shadow-md">
                Prepočítajte si investície, dôchodok, hypotéku alebo rodinný rozpočet. Zadarmo, bez registrácie
                a s výsledkom hneď.
              </p>
              <a
                href="#kalkulacky"
                className="bg-[#5ECAD5] hover:bg-[#4BB8C4] text-white font-semibold px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors shadow-lg text-base sm:text-lg w-full sm:w-auto max-w-xs sm:max-w-none block sm:inline-block text-center"
              >
                Vybrať kalkulačku
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Calculators Section */}
      <section id="kalkulacky" className="bg-gray-50 py-16 md:py-20 scroll-mt-8">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:gap-8 lg:px-8">
          {calculatorList.map((calc) => (
            <Link
              key={calc.slug}
              href={`/kalkulacky/${calc.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8"
            >
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#5ECAD5] transition-transform duration-300 group-hover:scale-x-100" />

              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#5ECAD5]/10 text-[#1F8E99] transition-colors duration-300 group-hover:bg-[#5ECAD5] group-hover:text-white">
                  {icons[calc.slug]}
                </div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {calc.tag}
                </span>
              </div>

              <h2 className="mb-2 text-2xl font-bold text-[#202325]">{calc.title}</h2>
              <p className="mb-4 text-lg font-semibold leading-snug text-[#1F8E99]">{calc.headline}</p>
              <p className="mb-6 text-sm leading-relaxed text-gray-600 md:text-base">{calc.teaser}</p>

              <ul className="mb-8 flex flex-wrap gap-2">
                {calc.features.map((feature) => (
                  <li
                    key={feature}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-[#202325] md:text-sm"
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              <span className="mt-auto inline-flex items-center gap-2 font-semibold text-[#202325] transition-colors group-hover:text-[#1F8E99]">
                Otvoriť kalkulačku
                <svg
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.3 3.3a1 1 0 011.4 0l6 6a1 1 0 010 1.4l-6 6a1 1 0 01-1.4-1.4l4.3-4.3H3a1 1 0 110-2h11.6l-4.3-4.3a1 1 0 010-1.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 md:py-16 bg-[#202325]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8 md:mb-12">AKO TO FUNGUJE?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 bg-[#5ECAD5] rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-[#5ECAD5]">
            <div className="flex items-start">
              <div className="text-6xl text-[#5ECAD5] mr-4 leading-none">&ldquo;</div>
              <p className="text-lg text-gray-700 italic leading-relaxed">
                Kalkulačka ukáže orientačný výpočet a pomôže vám zorientovať sa. Každá situácia je však iná –
                preto sa oplatí prebrať výsledok s niekým, kto vám pripraví riešenie presne na mieru.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#202325] mb-6">ZAČNIME SPOLU</h2>
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
