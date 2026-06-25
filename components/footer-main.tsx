import Link from 'next/link';
import { SOCIAL_LINKS } from '@/lib/config/socials';

export function FooterMain() {
  return (
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
  );
}
