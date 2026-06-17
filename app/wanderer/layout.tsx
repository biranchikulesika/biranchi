import { Metadata } from 'next';
import { ThemeToggle } from '@/components/theme-toggle';
import { PersonaSwitcher } from '@/components/persona-switcher';
import { PersonaSearch } from '@/components/persona-search';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { FooterWanderer } from '@/components/footer-wanderer';

export const metadata: Metadata = {
  title: 'Wanderer | Biranchi',
  description: 'Stories, Memories, Personal Journey',
};

export default function WandererLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-spectral dark:bg-[#1B1613] bg-[#F5F1EB] dark:text-[#E1D5C8] text-[#43382F] min-h-screen dark:selection:bg-[rgba(185,122,86,0.15)] selection:bg-[rgba(182,122,85,0.15)] flex flex-col leading-relaxed relative z-0">
      <div className="pointer-events-none fixed inset-0 z-[-1] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,28,24,0.3)_0%,transparent_70%)] bg-[radial-gradient(ellipse_at_50%_0%,rgba(238,231,222,0.8)_0%,transparent_70%)]" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full px-6 py-6 transition-colors duration-1000 flex justify-between items-center dark:bg-[#1B1613]/90 bg-[#F5F1EB]/90 backdrop-blur-xl border-b dark:border-[#26201B] border-[#E5DCCF]">
          <PersonaSwitcher currentPersona="Wanderer" currentStyle="dark:text-[#B97A56] text-[#B67A55] dark:hover:text-[#C1784F] hover:text-[#A56948] font-spectral italic opacity-90 hover:opacity-100 transition-colors duration-700" />
          <div className="flex items-center gap-1 md:gap-2 dark:text-[#B6A798] text-[#8A7C70]">
            <DesktopNav persona="wanderer" />
            <PersonaSearch persona="Wanderer" mobileBgColor="dark:bg-[#221C18] bg-[#EEE7DE]" />
            <ThemeToggle />
            <MobileNav persona="wanderer" mobileBgColor="dark:bg-[#221C18] bg-[#EEE7DE]" />
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <FooterWanderer />
      </div>
    </div>
  );
}
