import Link from "next/link";
import { CalculatorSlug, calculators } from "@/lib/calculators";

type CalculatorCtaProps = {
  slug: CalculatorSlug;
  className?: string;
};

export default function CalculatorCta({ slug, className = "" }: CalculatorCtaProps) {
  const calc = calculators[slug];

  return (
    <aside
      className={`rounded-2xl border border-[#5ECAD5]/30 bg-gradient-to-br from-[#5ECAD5]/10 via-white to-white p-6 md:p-8 shadow-sm ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[#5ECAD5] mb-2">
        Interaktívna kalkulačka
      </p>
      <h3 className="text-xl md:text-2xl font-bold text-[#202325] mb-3 leading-snug">
        {calc.headline}
      </h3>
      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{calc.teaser}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/kalkulacky/${slug}`}
          className="inline-flex items-center justify-center rounded-lg bg-[#5ECAD5] px-6 py-3 text-center font-semibold text-white shadow-md transition-colors hover:bg-[#4BB8C4]"
        >
          Otvoriť kalkulačku
        </Link>
        <Link
          href="/kalkulacky"
          className="inline-flex items-center justify-center rounded-lg border border-[#202325]/15 px-6 py-3 text-center font-semibold text-[#202325] transition-colors hover:border-[#5ECAD5] hover:text-[#5ECAD5]"
        >
          Všetky kalkulačky
        </Link>
      </div>
    </aside>
  );
}
