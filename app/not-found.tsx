import Link from 'next/link';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { PersonaSearch } from '@/components/persona-search';
import { ThemeToggle } from '@/components/theme-toggle';
import { getPersonaUrl } from '@/lib/utils';
import { SOCIAL_LINKS } from '@/lib/config/socials';
import { Logo } from '@/components/ui/logo';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-primary/20">
      {/* Global Header */}
      <header className="fixed top-0 w-full p-4 md:p-6 flex justify-between items-center z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <Link href={getPersonaUrl('main')} className="hover:opacity-70 transition-opacity">
          <Logo />
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <DesktopNav persona="main" />
          <PersonaSearch mobileBgColor="bg-background" />
          <ThemeToggle />
          <MobileNav persona="main" mobileBgColor="bg-background" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 mt-20">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-3xl font-medium">page not found</h1>
          <div className="space-y-2 opacity-70 text-sm">
            <p>The requested destination could not be resolved.</p>
            <p>This address does not point to any active document.</p>
          </div>
          <div className="pt-8">
            <Link href="/" className="inline-block px-6 py-2 rounded-full border border-border hover:bg-muted text-foreground font-medium transition-colors text-sm">
              return home
            </Link>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="w-full px-6 md:px-16 lg:px-24 py-6 md:py-14 flex flex-col md:flex-row justify-between items-center gap-5 md:gap-4 z-50 bg-transparent border-t border-border">
        <div className="md:flex-1 flex justify-center md:justify-start order-1 text-center md:text-left">
          <span className="font-sans font-light text-[14px] text-primary/80">
            Most things take longer than expected.
          </span>
        </div>
        <div className="md:flex-1 flex flex-col items-center gap-1 order-2 text-center">
          <span className="font-serif text-[15px] md:text-[16px] text-primary tracking-wide">
            Biranchi Kulesika
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary/70">
            India · 2026
          </span>
        </div>
        <div className="md:flex-1 flex justify-center md:justify-end items-center gap-5 md:gap-6 order-3 font-sans font-light text-[14px] text-primary/80">
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
