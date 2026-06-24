'use client';

import Link from 'next/link';
import { getPersonaUrl } from '@/lib/utils';

export function FooterOperator() {
  return (
    <footer className="w-full border-t border-border bg-background mt-auto py-12 px-4 md:px-6 text-sm text-primary font-mono">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-12">
        <div className="flex flex-col gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-4">
            <div className="font-bold text-xl text-foreground">Biranchi</div>
            <p className="text-primary/90 leading-relaxed">&quot;Reliability is built on careful observation of failures.&quot;</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-normal text-primary/80 tracking-widest uppercase text-[10px] md:text-[11px]">[broadcast]</h3>
            <p className="text-primary/90 text-sm">Occasional thoughts on systems, infrastructure, technology, and the internet.</p>
            <form className="flex flex-col sm:flex-row gap-2 mt-2 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="bg-muted border border-border text-foreground px-3 py-2 flex-1 min-w-0 focus:outline-none focus:border-primary transition-colors font-mono placeholder:text-primary/50"
                required
              />
              <button type="submit" className="border border-border text-primary hover:bg-muted hover:text-foreground px-4 py-2 transition-colors text-xs tracking-widest font-medium whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 md:gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-normal text-primary/80 mb-3 tracking-[0.1em] md:tracking-widest uppercase text-[10px] md:text-[11px] truncate">[directories]</h3>
            <Link href={getPersonaUrl('builder')} className="hover:text-foreground transition-colors truncate">~/builder</Link>
            <Link href={getPersonaUrl('operator')} className="hover:text-foreground transition-colors truncate">~/operator</Link>
            <Link href={getPersonaUrl('thinker')} className="hover:text-foreground transition-colors truncate">~/thinker</Link>
            <Link href={getPersonaUrl('wanderer')} className="hover:text-foreground transition-colors truncate">~/wanderer</Link>
          </div>
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-normal text-primary/80 mb-3 tracking-[0.1em] md:tracking-widest uppercase text-[10px] md:text-[11px] truncate">[connections]</h3>
            <Link href="#" className="hover:text-foreground transition-colors truncate">GitHub</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">LinkedIn</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">Instagram</Link>
          </div>
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-normal text-primary/80 mb-3 tracking-[0.1em] md:tracking-widest uppercase text-[10px] md:text-[11px] truncate">[resources]</h3>
            <Link href={getPersonaUrl('operator', '/about')} className="hover:text-foreground transition-colors truncate">About</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">Logs</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">Feedback</Link>
            <Link href="/fund" className="hover:text-foreground transition-colors truncate">Support / Fund</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border text-center flex flex-col items-center justify-center">
        <p className="text-[11px] text-primary/80 tracking-wide">
          © 2026 Biranchi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

