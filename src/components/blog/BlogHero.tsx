"use client";

import { useState } from "react";
import Image from "next/image";
import ContactFormModal from "../ContactFormModal";

export default function BlogHero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ContactFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <section className="relative min-h-[600px] md:min-h-[550px] lg:min-h-[550px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/blog-banner.jpg"
            alt="Noviny Financial Insights na pracovnom stole"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row lg:flex-row items-center justify-center min-h-[600px] md:min-h-[550px] lg:min-h-[550px]">
            <div className="flex-1 text-center md:text-left lg:text-left mb-8 md:mb-0 lg:mb-0 lg:pr-4 lg:ml-8 md:pl-12 lg:pl-16 md:max-w-[55%] md:mr-auto mx-auto md:mx-0 mt-48 md:mt-0">
              <h1 className="text-6xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6 drop-shadow-lg text-center md:text-left lg:text-left">
                BLOG
              </h1>
              <p className="text-lg md:text-xl text-white mb-8 max-w-2xl md:max-w-3xl lg:max-w-lg mx-auto lg:mx-0 font-light drop-shadow-md text-left md:text-left lg:text-left">
                Najnovšie články a poznatky zo sveta financií
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#5ECAD5] hover:bg-[#4BB8C4] text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors shadow-lg text-base md:text-lg w-full sm:w-auto"
              >
                Kontaktujte ma
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
