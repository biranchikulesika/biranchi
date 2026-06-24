'use client';

import Link from 'next/link';
import { getPersonaUrl } from '@/lib/utils';

export function FooterBuilder() {
  return (
    <footer className="w-full border-t border-border bg-background mt-auto py-12 px-4 md:px-6 text-sm text-primary">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 md:gap-12 text-sm md:text-base">
        <div className="flex flex-col gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-4">
            <div className="font-bold text-xl text-foreground">Biranchi</div>
            <p className="text-primary/80 leading-relaxed">&quot;Building the systems of tomorrow, one line of code at a time.&quot;</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground uppercase tracking-wider text-xs">Newsletter</h3>
            <p className="text-primary/80 text-sm">Stay updated with the latest builds, deployments, and architectures.</p>
            <form className="flex flex-col sm:flex-row gap-2 mt-2 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-muted border border-border text-foreground px-3 py-2 rounded flex-1 min-w-0 focus:outline-none focus:border-primary transition-colors"
                required
              />
              <button type="submit" className="bg-muted hover:bg-muted/80 text-foreground px-5 py-2 rounded transition-colors font-medium whitespace-nowrap">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 md:gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-semibold text-foreground mb-2 uppercase tracking-wider text-[10px] md:text-xs">Folders</h3>
            <Link href={getPersonaUrl('builder')} className="hover:text-foreground transition-colors truncate">Builder</Link>
            <Link href={getPersonaUrl('operator')} className="hover:text-foreground transition-colors truncate">Operator</Link>
            <Link href={getPersonaUrl('thinker')} className="hover:text-foreground transition-colors truncate">Thinker</Link>
            <Link href={getPersonaUrl('wanderer')} className="hover:text-foreground transition-colors truncate">Wanderer</Link>
          </div>
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-semibold text-foreground mb-2 uppercase tracking-wider text-[10px] md:text-xs">Social</h3>
            <Link href="#" className="hover:text-foreground transition-colors truncate">GitHub</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">LinkedIn</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">Twitter (X)</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">HackTheBox</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">Instagram</Link>
          </div>
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-semibold text-foreground mb-2 uppercase tracking-wider text-[10px] md:text-xs truncate">Legal & Resources</h3>
            <Link href={getPersonaUrl('builder', '/about')} className="hover:text-foreground transition-colors truncate">About</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">Blogs / Writes</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">Feedback</Link>
            <Link href="#" className="hover:text-foreground transition-colors truncate">Support / Fund</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-xs text-primary">
        &copy; 2026 Biranchi. All rights reserved.
      </div>
    </footer>
  );
}
