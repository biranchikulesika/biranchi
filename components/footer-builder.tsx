'use client';

import Link from 'next/link';
import { getPersonaUrl } from '@/lib/utils';

export function FooterBuilder() {
  return (
    <footer className="w-full border-t dark:border-neutral-900 border-[#E7E4DD] dark:bg-neutral-950 bg-[#F3F2EE] mt-auto py-12 px-4 md:px-6 text-sm dark:text-neutral-400 text-[#5E5A53]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 md:gap-12 text-sm md:text-base">
        <div className="flex flex-col gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-4">
            <div className="font-bold text-xl dark:text-neutral-200 text-[#222222]">Biranchi</div>
            <p className="dark:text-neutral-500 text-[#5E5A53] leading-relaxed">&quot;Building the systems of tomorrow, one line of code at a time.&quot;</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold dark:text-neutral-300 text-[#222222] uppercase tracking-wider text-xs">Newsletter</h3>
            <p className="dark:text-neutral-500 text-[#5E5A53] text-sm">Stay updated with the latest builds, deployments, and architectures.</p>
            <form className="flex flex-col sm:flex-row gap-2 mt-2 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="dark:bg-neutral-900 bg-[#E7E4DD] border dark:border-neutral-800 border-[#DDD8CF] dark:text-neutral-200 text-[#222222] px-3 py-2 rounded flex-1 min-w-0 focus:outline-none focus:border-neutral-600 transition-colors"
                required
              />
              <button type="submit" className="bg-neutral-800 hover:bg-neutral-700 dark:text-neutral-200 text-[#222222] px-5 py-2 rounded transition-colors font-medium whitespace-nowrap">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 md:gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-semibold dark:text-neutral-300 text-[#222222] mb-2 uppercase tracking-wider text-[10px] md:text-xs">Folders</h3>
            <Link href={getPersonaUrl('builder')} className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">Builder</Link>
            <Link href={getPersonaUrl('operator')} className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">Operator</Link>
            <Link href={getPersonaUrl('thinker')} className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">Thinker</Link>
            <Link href={getPersonaUrl('wanderer')} className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">Wanderer</Link>
          </div>
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-semibold dark:text-neutral-300 text-[#222222] mb-2 uppercase tracking-wider text-[10px] md:text-xs">Social</h3>
            <Link href="#" className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">GitHub</Link>
            <Link href="#" className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">LinkedIn</Link>
            <Link href="#" className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">Twitter (X)</Link>
            <Link href="#" className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">HackTheBox</Link>
            <Link href="#" className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">Instagram</Link>
          </div>
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-semibold dark:text-neutral-300 text-[#222222] mb-2 uppercase tracking-wider text-[10px] md:text-xs truncate">Legal & Resources</h3>
            <Link href={getPersonaUrl('builder', '/about')} className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">About</Link>
            <Link href="#" className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">Blogs / Writes</Link>
            <Link href="#" className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">Terms</Link>
            <Link href="#" className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">Feedback</Link>
            <Link href="#" className="dark:hover:dark:text-neutral-200 text-[#222222] hover:text-[#222222]/80 transition-colors truncate">Support / Fund</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t dark:border-neutral-900/10 border-[#E7E4DD] text-center text-xs dark:text-neutral-600 text-[#5E5A53]">
        &copy; 2026 Biranchi. All rights reserved.
      </div>
    </footer>
  );
}
