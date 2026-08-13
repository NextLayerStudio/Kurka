"use client";

import React, { useState, useEffect } from "react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieChoice = localStorage.getItem("cookie-preferences");
    const consentShown = localStorage.getItem("cookie-consent-shown");

    if (!cookieChoice && !consentShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const saveChoice = (analytics: boolean) => {
    localStorage.setItem(
      "cookie-preferences",
      JSON.stringify({ necessary: true, analytics })
    );
    localStorage.setItem("cookie-consent-shown", "true");
    setIsVisible(false);
  };

  const handleAcceptAll = () => saveChoice(true);

  const handleAcceptNecessary = () => saveChoice(false);

  const handleCustomize = () => {
    localStorage.setItem("cookie-consent-shown", "true");
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent("open-cookies-modal"));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-gray-300 bg-white p-4 shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="max-w-3xl">
          <h3 className="text-sm font-semibold text-[#202325] md:text-base">
            Súbory cookie a ochrana súkromia
          </h3>
          <p className="mt-2 text-sm leading-7 text-gray-700">
            Nevyhnutné cookies sú vždy aktívne. Analytické cookies (Vercel Analytics) používame len s
            vaším súhlasom. Marketingové cookies na tejto stránke nepoužívame.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <button
            onClick={handleAcceptNecessary}
            className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-[#202325] transition-colors hover:bg-gray-50"
          >
            Len nevyhnutné
          </button>
          <button
            onClick={handleCustomize}
            className="rounded-md border border-[#202325] px-4 py-2.5 text-sm font-medium text-[#202325] transition-colors hover:bg-[#202325] hover:text-white"
          >
            Nastavenia
          </button>
          <button
            onClick={handleAcceptAll}
            className="rounded-md bg-[#202325] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            Povoliť všetky
          </button>
        </div>
      </div>
    </div>
  );
}
