"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CalculatorMeta } from "@/lib/calculators";

type CalculatorEmbedProps = {
  calc: CalculatorMeta;
};

const MIN_HEIGHT = 400;

export default function CalculatorEmbed({ calc }: CalculatorEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState(calc.iframeHeight);

  const handleLoad = useCallback(() => {
    const frame = iframeRef.current;
    frame?.contentWindow?.postMessage({ type: "mk-calc-height-request" }, "*");
    const body = frame?.contentDocument?.body;
    if (!body || typeof ResizeObserver === "undefined") return;
    observerRef.current?.disconnect();
    const measure = () =>
      setHeight(Math.max(MIN_HEIGHT, Math.ceil(body.getBoundingClientRect().height)));
    observerRef.current = new ResizeObserver(measure);
    observerRef.current.observe(body);
    measure();
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data?.type === "mk-calc-height" && typeof e.data.height === "number") {
        setHeight(Math.max(MIN_HEIGHT, Math.ceil(e.data.height)));
      }
    };
    window.addEventListener("message", onMessage);

    // The iframe can finish loading before hydration attaches onLoad
    if (iframeRef.current?.contentDocument?.readyState === "complete") handleLoad();

    return () => {
      window.removeEventListener("message", onMessage);
      observerRef.current?.disconnect();
    };
  }, [handleLoad]);

  return (
    <div className="min-h-screen bg-[#f4f5f6]">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="min-w-0">
            <Link
              href="/kalkulacky"
              className="text-sm font-medium text-[#5ECAD5] hover:text-[#4BB8C4]"
            >
              ← Späť na kalkulačky
            </Link>
            <h1 className="mt-1 text-xl font-bold text-[#202325] md:text-2xl break-words">
              {calc.title}
            </h1>
          </div>
          <Link
            href="/domov"
            className="hidden shrink-0 text-sm font-semibold text-[#202325] hover:text-[#5ECAD5] sm:inline-flex"
          >
            Domov
          </Link>
          {calc.showNavodLink && (
            <a
              href="/kalkulacky/rozpocet/navod.html"
              className="text-sm font-semibold text-[#202325] underline decoration-[#5ECAD5] underline-offset-4 hover:text-[#5ECAD5]"
            >
              Ako si aplikáciu pridať na plochu
            </a>
          )}
        </div>
      </div>
      <iframe
        ref={iframeRef}
        title={calc.title}
        src={calc.iframeSrc}
        className="mx-auto block w-full max-w-[1100px] border-0 bg-white"
        style={{ height: `${height}px` }}
        onLoad={handleLoad}
      />
    </div>
  );
}
