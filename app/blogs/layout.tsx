import { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { PersonaSearch } from '@/components/persona-search';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { getPersonaUrl } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';

export const metadata: Metadata = {
  title: 'Ecosystem Logs | Biranchi',
  description: 'Blueprints, signals, dialectics, and scribbles. The collective intelligence network.',
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen dark:bg-[#050505] bg-[#F5F5F2] dark:text-[#e5e5e5] text-[#2B2B28] flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full p-4 md:p-6 flex justify-between items-center border-b dark:border-stone-900/50 border-[#ECEBE6] dark:bg-[#050505]/80 bg-[#F5F5F2]/80 backdrop-blur-md">
        <Link href={getPersonaUrl('main')} className="hover:opacity-70 transition-opacity">
          <Logo />
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <DesktopNav persona="main" />
          <PersonaSearch mobileBgColor="dark:bg-[#050505] bg-[#F5F5F2]" />
          <ThemeToggle />
          <MobileNav persona="main" mobileBgColor="dark:bg-[#050505] bg-[#F5F5F2]" />
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
