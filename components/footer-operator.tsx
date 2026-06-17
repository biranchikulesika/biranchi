'use client';

import Link from 'next/link';
import { getPersonaUrl } from '@/lib/utils';

export function FooterOperator() {
  return (
    <footer className="w-full border-t dark:border-[#1e2722] border-[#D6DED5] dark:bg-[#0a0f0d] bg-[#EDF1EC] mt-auto py-12 px-4 md:px-6 text-sm dark:text-[#5d7364] text-[#5C6A61] font-mono">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 md:gap-12">
        <div className="flex flex-col gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-4">
            <div className="font-bold text-xl dark:text-[#7f9e8a] text-[#5F7A69]">Biranchi</div>
            <p className="dark:text-[#4e6054] text-[#5C6A61]/90 leading-relaxed">&quot;Reliability is built on careful observation of failures.&quot;</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-normal dark:text-[#4e6054]/80 text-[#5C6A61]/80 tracking-widest uppercase text-[10px] md:text-[11px]">[broadcast]</h3>
            <p className="dark:text-[#4e6054] text-[#5C6A61]/90 text-sm">Occasional thoughts on systems, infrastructure, technology, and the internet.</p>
            <form className="flex flex-col sm:flex-row gap-2 mt-2 w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="bg-[#0f1713] border border-[#232f28] dark:text-[#7f9e8a] text-[#5F7A69] px-3 py-2 flex-1 min-w-0 focus:outline-none focus:border-[#42594a] transition-colors font-mono placeholder:text-[#38473d]"
                required
              />
              <button type="submit" className="border border-[#232f28] text-[#6d8775] hover:bg-[#151f1a] dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 px-4 py-2 transition-colors text-xs tracking-widest font-medium whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 md:gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-normal dark:text-[#4e6054]/80 text-[#5C6A61]/80 mb-3 tracking-[0.1em] md:tracking-widest uppercase text-[10px] md:text-[11px] truncate">[directories]</h3>
            <Link href={getPersonaUrl('builder')} className="dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 transition-colors truncate">~/builder</Link>
            <Link href={getPersonaUrl('operator')} className="dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 transition-colors truncate">~/operator</Link>
            <Link href={getPersonaUrl('thinker')} className="dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 transition-colors truncate">~/thinker</Link>
            <Link href={getPersonaUrl('wanderer')} className="dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 transition-colors truncate">~/wanderer</Link>
          </div>
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-normal dark:text-[#4e6054]/80 text-[#5C6A61]/80 mb-3 tracking-[0.1em] md:tracking-widest uppercase text-[10px] md:text-[11px] truncate">[connections]</h3>
            <Link href="#" className="dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 transition-colors truncate">GitHub</Link>
            <Link href="#" className="dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 transition-colors truncate">LinkedIn</Link>
            <Link href="#" className="dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 transition-colors truncate">Twitter</Link>
            <Link href="#" className="dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 transition-colors truncate">Instagram</Link>
          </div>
          <div className="flex flex-col gap-3 text-xs md:text-sm">
            <h3 className="font-normal dark:text-[#4e6054]/80 text-[#5C6A61]/80 mb-3 tracking-[0.1em] md:tracking-widest uppercase text-[10px] md:text-[11px] truncate">[resources]</h3>
            <Link href={getPersonaUrl('operator', '/about')} className="dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 transition-colors truncate">About</Link>
            <Link href="#" className="dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 transition-colors truncate">Logs</Link>
            <Link href="#" className="dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 transition-colors truncate">Feedback</Link>
            <Link href="#" className="dark:hover:dark:text-[#8ba896] text-[#1F2822] hover:text-[#1F2822]/80 transition-colors truncate">Support</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t dark:border-[#1e2722]/60 border-[#D6DED5] text-center flex flex-col items-center justify-center">
        <p className="text-[11px] dark:text-[#4e6054]/80 text-[#5C6A61]/80 tracking-wide">
          © 2026 Biranchi. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

