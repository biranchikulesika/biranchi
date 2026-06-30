import type { Metadata } from 'next';
import Link from 'next/link';
import { getPersonaUrl } from '@/lib/utils';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { PersonaSearch } from '@/components/persona-search';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/ui/logo';
import { SOCIAL_LINKS } from '@/lib/config/socials';

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions, agreements, and policies for Biranchi's personal ecosystem.",
};

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen dark:bg-[#050505] bg-[#F5F5F2] dark:text-[#e5e5e5] text-[#2B2B28] flex flex-col font-sans overflow-x-hidden relative dark:selection:bg-stone-800 selection:bg-stone-300 dark:selection:text-white selection:text-black">
      {/* Global Header */}
      <header className="fixed top-0 w-full p-4 md:p-6 flex justify-between items-center z-50 dark:bg-[#050505]/80 bg-[#F5F5F2]/80 backdrop-blur-md border-b dark:border-stone-900/50 border-[#ECEBE6]">
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

      <main className="flex-1 flex flex-col w-full relative pt-24 md:pt-32 px-6 md:px-16 lg:px-24 py-10 sm:py-12 max-w-225 mx-auto z-10">
        <span className="font-mono text-[10px] tracking-[0.2em] text-primary/80 uppercase mb-6 md:mb-8 block">
          AGREEMENTS
        </span>
        <h1 className="font-serif text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[4rem] leading-[1.1] text-foreground tracking-tight mb-6 md:mb-10">
          Terms & Conditions
        </h1>
        <div className="font-sans font-light text-primary/90 text-lg leading-[1.8] flex flex-col gap-6">
          <p>
            This page outlines the terms, conditions, and agreements for engaging with the content, projects, and resources available across the Builder, Operator, Thinker, and Wanderer personas.
          </p>
          <p>
            The content is provided for informational and educational purposes. While every effort is made to ensure accuracy, the materials are provided &quot;as is&quot; without any guarantees. 
          </p>
          <p>
            Please check back as these terms are subject to change as the ecosystem evolves.
          </p>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="w-full px-6 md:px-16 lg:px-24 py-6 md:py-14 flex flex-col md:flex-row justify-between items-center gap-5 md:gap-4 z-50 bg-transparent border-t border-border mt-auto">
        <div className="md:flex-1 flex justify-center md:justify-start order-1 text-center md:text-left">
          <span className="font-sans font-light text-[14px] text-primary/60">
            Most things take longer than expected.
          </span>
        </div>
        <div className="md:flex-1 flex flex-col items-center gap-1 order-2 text-center">
          <span className="font-serif text-[15px] md:text-[16px] text-primary/70 tracking-wide">
            Biranchi Kulesika
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary/50">
            India · 2026
          </span>
        </div>
        <div className="md:flex-1 flex justify-center md:justify-end items-center gap-5 md:gap-6 order-3 font-sans font-light text-[14px] text-primary/60">
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors duration-500">
            GitHub
          </a>
          <span className="text-primary/40 md:hidden">·</span>
          <a href={SOCIAL_LINKS.email} className="hover:text-foreground transition-colors duration-500">
            Email
          </a>
        </div>
      </footer>
    </div>
  );
}
