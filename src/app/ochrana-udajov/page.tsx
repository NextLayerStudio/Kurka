"use client";

import Image from "next/image";
import GDPRContent from "@/components/GDPRContent";

export default function OchranaUdajovPage() {
  return (
    <main className="min-h-screen">
      <section className="relative flex min-h-[320px] items-center overflow-hidden md:min-h-[360px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Untitled-1.svg"
            alt="Banner background"
            fill
            className="object-cover object-right"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-light text-white md:text-5xl">Ochrana osobných údajov</h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">
            Informačná povinnosť podľa nariadenia (EÚ) 2016/679 (GDPR) a zákona č. 18/2018 Z. z.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <GDPRContent />
        </div>
      </section>
    </main>
  );
}
