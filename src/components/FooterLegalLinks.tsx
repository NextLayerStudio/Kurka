"use client";

import Link from "next/link";

interface FooterLegalLinksProps {
  onOpenCookies: () => void;
}

export default function FooterLegalLinks({ onOpenCookies }: FooterLegalLinksProps) {
  const linkClassName =
    "block text-left text-sm text-[#202325] transition-colors hover:text-[#5ECAD5] md:text-base";

  return (
    <div className="space-y-2">
      <button type="button" onClick={onOpenCookies} className={linkClassName}>
        Nastavenia cookies
      </button>
      <Link href="/ochrana-udajov" className={linkClassName}>
        Ochrana osobných údajov
      </Link>
    </div>
  );
}
