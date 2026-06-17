import { Metadata } from 'next';
import { ThemeToggle } from '@/components/theme-toggle';
import { PersonaSwitcher } from '@/components/persona-switcher';
import { PersonaSearch } from '@/components/persona-search';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { FooterThinker } from '@/components/footer-thinker';

export const metadata: Metadata = {
  title: 'Thinker | Biranchi',
  description: 'Philosophy, Psychology, Deep Thoughts',
};

export default function ThinkerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans dark:bg-[#111417] bg-[#F4F3F1] dark:text-[#D7D4CE] text-[#2F3134] min-h-screen dark:selection:bg-[rgba(255,255,255,0.06)] selection:bg-[#E2DFDA] flex flex-col leading-[1.9] relative z-0">
      <div className="pointer-events-none fixed inset-0 z-[-1] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(23,27,32,0.5)_0%,transparent_75%)] bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.02)_0%,transparent_75%)]" />
      <header className="sticky top-0 z-50 w-full p-4 md:p-6 flex justify-between items-center dark:bg-[#12161A]/70 bg-[#F4F3F1]/70 backdrop-blur-xl border-b dark:border-[rgba(255,255,255,0.03)] border-[#E2DFDA] transition-colors duration-1000">
        <PersonaSwitcher currentPersona="Thinker" currentStyle="dark:text-[#D7D4CE] text-[#2F3134] font-sans font-light tracking-wide opacity-60 hover:opacity-100 transition-all duration-700" />
        <div className="flex items-center gap-1 md:gap-2 dark:text-[#A7A39B] text-[#6F7175]">
          <DesktopNav persona="thinker" />
          <PersonaSearch persona="Thinker" mobileBgColor="dark:bg-[#171B20] bg-[#ECEAE7]" />
          <ThemeToggle />
          <MobileNav persona="thinker" mobileBgColor="dark:bg-[#171B20] bg-[#ECEAE7]" />
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <FooterThinker />
    </div>
  );
}
