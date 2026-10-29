import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CalculatorEmbed from "@/components/CalculatorEmbed";
import { CalculatorSlug, calculators } from "@/lib/calculators";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(calculators).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calc = calculators[slug as CalculatorSlug];
  if (!calc) return { title: "Kalkulačka" };
  return {
    title: `${calc.title} | Michal Kurka`,
    description: calc.teaser,
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const calc = calculators[slug as CalculatorSlug];
  if (!calc) notFound();

  return <CalculatorEmbed calc={calc} />;
}
