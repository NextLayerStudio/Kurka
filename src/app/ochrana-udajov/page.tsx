"use client";

import Image from "next/image";
import Link from "next/link";
import GDPRContent from "@/components/GDPRContent";

const LAST_UPDATED = "13. augusta 2026";

export default function OchranaUdajovPage() {
  return (
    <main className="min-h-screen">
      <section className="relative flex min-h-[480px] items-center overflow-hidden md:min-h-[520px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Untitled-1.svg"
            alt="Banner background"
            fill
            className="object-cover object-right"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#5ECAD5] drop-shadow">
            Zásady ochrany osobných údajov
          </p>
          <h1
            className="text-4xl font-light leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl"
            style={{ fontFamily: "Monda, sans-serif" }}
          >
            Ochrana osobných údajov
          </h1>
          <p className="mt-6 max-w-2xl text-base font-light text-white drop-shadow-md md:text-lg">
            Vaše údaje sú vaše. Tu sa dozviete presne, ktoré údaje spracúvam, prečo a ako dlho — v
            súlade s nariadením (EÚ) 2016/679 (GDPR) a zákonom č. 18/2018 Z. z.
          </p>
          <p className="mt-6 text-sm text-white/80">Naposledy aktualizované: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GDPRContent />
        </div>
      </section>

      <section className="bg-[#202325] py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-medium text-[#5ECAD5] md:text-4xl"
            style={{ fontFamily: "Monda, sans-serif" }}
          >
            MÁTE OTÁZKY K SVOJIM ÚDAJOM?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
            Napíšte mi a odpoviem vám osobne. Rovnako sa na mňa obráťte, ak si chcete uplatniť
            ktorékoľvek zo svojich práv podľa GDPR.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="mailto:michal.kurka@michalkurka.sk"
              className="rounded-lg bg-[#5ECAD5] px-8 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-[#4BB8C4]"
            >
              michal.kurka@michalkurka.sk
            </a>
            <Link
              href="/kontakt"
              className="rounded-lg border border-white/40 px-8 py-4 font-semibold text-white transition-colors hover:bg-white hover:text-[#202325]"
            >
              Kontaktné údaje
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
