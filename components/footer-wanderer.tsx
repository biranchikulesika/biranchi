'use client';

import Link from 'next/link';
import { getPersonaUrl } from '@/lib/utils';

export function FooterWanderer() {
  return (
    <footer className="w-full border-t dark:border-[#211C18] border-[#E5DCCF] dark:bg-[#14110F] bg-[#F5F1EB] mt-auto py-12 px-4 md:px-6 text-sm dark:text-[#8B7E72] text-[#8A7C70] font-spectral relative">
      <div className="absolute inset-0 pointer-events-none dark:bg-[radial-gradient(ellipse_at_30%_0%,rgba(28,24,21,0.4)_0%,transparent_70%)] bg-[radial-gradient(ellipse_at_30%_0%,rgba(238,231,222,0.8)_0%,transparent_70%)]" />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 md:gap-12 text-sm md:text-base relative z-10">
        <div className="flex flex-col gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-4">
            <div className="font-cormorant font-normal text-xl md:text-2xl dark:text-[#DDD2C5] text-[#43382F] italic tracking-wide">Biranchi</div>
            <p className="dark:text-[#8B7E72] text-[#8A7C70] leading-relaxed italic">&quot;Stories are how memories resist time.&quot;</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-sans font-medium uppercase tracking-[0.15em] dark:text-[#6F645A] text-[#8A7C70] text-xs">THE DISPATCH</h3>
            <p className="dark:text-[#8B7E72] text-[#8A7C70] font-spectral text-sm">Occasional stories, reflections, observations, and fragments from the journey.</p>
            <form className="flex flex-col sm:flex-row gap-2 mt-2 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Where should I send the letters?" 
                className="bg-transparent border dark:border-[#211C18] border-[#E5DCCF] dark:text-[#DDD2C5] text-[#43382F] px-3 py-2 flex-1 min-w-0 focus:outline-none focus:border-[#B97A56]/60 transition-colors placeholder:dark:text-[#6F645A] text-[#8A7C70] font-spectral italic text-sm md:text-base"
                required
              />
              <button type="submit" className="border dark:border-[#211C18] border-[#E5DCCF] dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] hover:border-[#B97A56]/60 px-5 py-2 transition-colors font-spectral italic text-sm md:text-base whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 md:gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-sans font-medium mb-2 dark:text-[#6F645A] text-[#8A7C70] uppercase tracking-[0.15em] text-[10px] md:text-xs truncate">Volumes</h3>
            <Link href={getPersonaUrl('builder')} className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">Vol I: Builder</Link>
            <Link href={getPersonaUrl('operator')} className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">Vol II: Operator</Link>
            <Link href={getPersonaUrl('thinker')} className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">Vol III: Thinker</Link>
            <Link href={getPersonaUrl('wanderer')} className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">Vol IV: Wanderer</Link>
          </div>
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-sans font-medium mb-2 dark:text-[#6F645A] text-[#8A7C70] uppercase tracking-[0.15em] text-[10px] md:text-xs truncate">Artifacts</h3>
            <Link href="#" className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">GitHub</Link>
            <Link href="#" className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">LinkedIn</Link>
            <Link href="#" className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">Twitter</Link>
            <Link href="#" className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">Instagram</Link>
          </div>
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-sans font-medium mb-2 dark:text-[#6F645A] text-[#8A7C70] uppercase tracking-[0.15em] text-[10px] md:text-xs truncate">Index</h3>
            <Link href={getPersonaUrl('wanderer', '/about')} className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">About</Link>
            <Link href="#" className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">Journal</Link>
            <Link href="#" className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">Agreements</Link>
            <Link href="#" className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">Feedback</Link>
            <Link href="#" className="dark:text-[#B8AA9A] text-[#8A7C70] hover:dark:text-[#B97A56] text-[#B67A55] transition-colors truncate">Patronage</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 md:mt-16 pt-8 border-t dark:border-[#211C18] border-[#E5DCCF] text-center flex flex-col items-center justify-center relative z-10">
        <p className="text-xs md:text-sm dark:text-[#8B7E72] text-[#8A7C70] tracking-wide font-spectral italic opacity-80">
          &copy; 2026 Biranchi. Wanderer Edition.
        </p>
      </div>
    </footer>
  );
}
