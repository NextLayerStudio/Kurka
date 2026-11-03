'use client';

import { usePathname } from 'next/navigation';
import { Children, ReactNode } from 'react';

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isFormularPage = pathname === '/formular';
  const isAdminPage = pathname === '/admin';
  const isCalculatorEmbedPage =
    pathname.startsWith('/kalkulacky/') && pathname !== '/kalkulacky';

  if (isFormularPage || isAdminPage || isCalculatorEmbedPage) {
    // Layout children: Navbar, page, Footer, CookieConsent — render only the page.
    const page = Children.toArray(children)[1];
    return <>{page}</>;
  }

  // For all other pages, render everything (Navbar + content + Footer)
  return <>{children}</>;
}
