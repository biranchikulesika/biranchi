import { Metadata } from 'next';
import { ThemeToggle } from '@/components/theme-toggle';
import { PersonaSwitcher } from '@/components/persona-switcher';
import { PersonaSearch } from '@/components/persona-search';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { FooterBuilder } from '@/components/footer-builder';

export const metadata: Metadata = {
  title: 'Builder | Biranchi',
  description: 'Systems, Code, Open Source',
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono dark:bg-neutral-950 bg-[#F3F2EE] dark:text-neutral-300 text-[#222222] min-h-screen selection:bg-neutral-800 flex flex-col">
      <header className="sticky top-0 z-50 w-full p-4 md:p-6 flex justify-between items-center border-b dark:border-neutral-900 border-[#E7E4DD] dark:bg-neutral-950 bg-[#F3F2EE]/80 backdrop-blur-md">
        <PersonaSwitcher currentPersona="Builder" currentStyle="dark:text-neutral-400 text-[#5E5A53] font-mono" />
        <div className="flex items-center gap-1 md:gap-2">
          <DesktopNav persona="builder" />
          <PersonaSearch persona="Builder" mobileBgColor="dark:bg-neutral-950 bg-[#F3F2EE]" />
          <ThemeToggle />
          <MobileNav persona="builder" mobileBgColor="dark:bg-neutral-950 bg-[#F3F2EE]" />
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <FooterBuilder />
    </div>
  );
}
