"use client";

import React, { useState, useEffect } from "react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
};

export default function CookiesModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cookie-preferences");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Partial<CookiePreferences>;
      setPreferences({
        necessary: true,
        analytics: Boolean(parsed.analytics),
      });
    } catch (e) {
      console.error("Error loading cookie preferences:", e);
    }
  }, [isOpen]);

  const savePreferences = (next: CookiePreferences) => {
    setPreferences(next);
    localStorage.setItem("cookie-preferences", JSON.stringify(next));
    localStorage.setItem("cookie-consent-shown", "true");
    onClose();
  };

  const handleAcceptAll = () => {
    savePreferences({ necessary: true, analytics: true });
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
  };

  const handleRejectAll = () => {
    savePreferences({ necessary: true, analytics: false });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#202325] md:text-xl">
                Nastavenia súborov cookie
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Informácie o používaní cookies v súlade s GDPR.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#202325]"
              aria-label="Zavrieť"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <p className="text-sm leading-7 text-gray-700">
            Táto webová stránka používa nevyhnutné cookies a voliteľné analytické nástroje. Marketingové
            cookies ani reklamné trackery sa na tejto stránke nepoužívajú.
          </p>

          <div className="space-y-0 divide-y divide-gray-200 border border-gray-200">
            <div className="flex items-start justify-between gap-4 p-5">
              <div>
                <h3 className="text-sm font-semibold text-[#202325]">Nevyhnutné cookies</h3>
                <p className="mt-2 text-sm leading-7 text-gray-700">
                  Potrebné pre základné fungovanie stránky a uloženie vášho rozhodnutia o cookies.
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500">
                Vždy aktívne
              </span>
            </div>

            <div className="flex items-start justify-between gap-4 p-5">
              <div>
                <h3 className="text-sm font-semibold text-[#202325]">Analytické cookies</h3>
                <p className="mt-2 text-sm leading-7 text-gray-700">
                  Slúžia na anonymizovanú štatistiku návštevnosti prostredníctvom Vercel Analytics a
                  Speed Insights.
                </p>
              </div>
              <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))
                  }
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-[#202325]" />
                <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </label>
            </div>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm font-medium text-[#202325] underline underline-offset-2 hover:text-gray-600"
          >
            {showDetails ? "Skryť podrobnosti" : "Zobraziť podrobnosti"}
          </button>

          {showDetails && (
            <div className="border border-gray-200 p-5 text-sm leading-7 text-gray-700">
              <h4 className="mb-3 font-semibold text-[#202325]">Používané cookies a úložiská</h4>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-[#202325]">cookie-preferences</strong> – localStorage, ukladá
                  vaše nastavenia cookies
                </li>
                <li>
                  <strong className="text-[#202325]">cookie-consent-shown</strong> – localStorage,
                  zaznamená zobrazenie cookie lišty
                </li>
                <li>
                  <strong className="text-[#202325]">Vercel Analytics / Speed Insights</strong> –
                  voliteľné analytické cookies, aktivujú sa len po súhlase
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 p-6 sm:flex-row">
          <button
            onClick={handleRejectAll}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-[#202325] transition-colors hover:bg-gray-100"
          >
            Len nevyhnutné
          </button>
          <button
            onClick={handleAcceptSelected}
            className="flex-1 rounded-md border border-[#202325] bg-white px-4 py-2.5 text-sm font-medium text-[#202325] transition-colors hover:bg-[#202325] hover:text-white"
          >
            Uložiť výber
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 rounded-md bg-[#202325] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
          >
            Povoliť všetky
          </button>
        </div>
      </div>
    </div>
  );
}
