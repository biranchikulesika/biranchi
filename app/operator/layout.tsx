import { Metadata } from 'next';
import { ThemeToggle } from '@/components/theme-toggle';
import { PersonaSwitcher } from '@/components/persona-switcher';
import { PersonaSearch } from '@/components/persona-search';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { FooterOperator } from '@/components/footer-operator';

export const metadata: Metadata = {
  title: 'Operator | Biranchi',
  description: 'Cybersecurity, Ethical Hacking, OSINT',
};

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono dark:bg-[#080b09] bg-[#EDF1EC] dark:text-[#7f9e8a] text-[#1F2822] min-h-screen dark:selection:bg-[#1e2722] selection:bg-[#D6DED5] dark:selection:text-[#a3c2af] selection:text-[#1F2822] flex flex-col">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(100,140,110,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(100,140,110,0.007)_1px,transparent_1px)] bg-[size:40px_40px] z-0 opacity-50 dark:opacity-40" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full p-4 md:p-6 flex justify-between items-center border-b dark:border-[#1e2722] border-[#D6DED5] dark:bg-[#080b09]/90 bg-[#EDF1EC]/90 backdrop-blur-md">
          <PersonaSwitcher currentPersona="Operator" currentStyle="dark:text-[#6d8775] text-[#5F7A69] font-mono" />
          <div className="flex items-center gap-1 md:gap-2">
            <DesktopNav persona="operator" />
            <PersonaSearch persona="Operator" mobileBgColor="dark:bg-[#080b09] bg-[#EDF1EC]" />
            <ThemeToggle />
            <MobileNav persona="operator" mobileBgColor="dark:bg-[#080b09] bg-[#EDF1EC]" />
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <FooterOperator />
      </div>
    </div>
  );
}
