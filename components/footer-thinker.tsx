'use client';

import Link from 'next/link';
import { getPersonaUrl } from '@/lib/utils';

export function FooterThinker() {
  return (
    <footer className="w-full border-t dark:border-[rgba(255,255,255,0.04)] border-[#E2DFDA] dark:bg-[#131211] bg-[#ECEAE7] mt-auto py-12 px-4 md:px-6 dark:text-[#A59E94] text-[#6F7175] font-sans transition-colors duration-1000">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 md:gap-12 text-[13.5px]">
        
        <div className="flex flex-col gap-6 w-full lg:w-1/2 pr-0 md:pr-12">
          <div className="flex flex-col gap-3">
            <div className="font-cormorant text-2xl md:text-3xl dark:text-[#D8D1C7] text-[#2F3134] tracking-wide font-normal">Biranchi</div>
            <p className="dark:text-[#7F786F] text-[#6F7175] leading-[1.8] italic font-cormorant text-[17px] max-w-sm">&quot;Some ideas need silence before they become clear.&quot;</p>
          </div>
          
          <div className="flex flex-col gap-3 mt-4">
            <h3 className="font-cormorant dark:text-[#D8D1C7] text-[#2F3134] text-[17px] tracking-wide">Letters</h3>
            <p className="dark:text-[#7F786F] text-[#6F7175] text-[13.5px] leading-[1.8] font-light max-w-sm">Occasional reflections, unfinished thoughts, and quiet observations.</p>
            
            <form className="flex flex-col sm:flex-row gap-0 mt-3 w-full max-w-sm border-b border-[rgba(255,255,255,0.05)] focus-within:border-[rgba(255,255,255,0.15)] transition-colors duration-700 pb-1.5" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Where should I send them?" 
                className="bg-transparent dark:text-[#D8D1C7] text-[#2F3134] px-2 py-2 flex-1 min-w-0 focus:outline-none placeholder:dark:text-[#7F786F] text-[#6F7175] font-light text-[13.5px] italic"
                required
              />
              <button type="submit" className="bg-transparent dark:text-[#7F786F] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] px-4 py-2 transition-colors duration-500 text-[13.5px] whitespace-nowrap font-light">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 md:gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-3 text-[13.5px] font-light">
            <h3 className="font-cormorant dark:text-[#D8D1C7] text-[#2F3134] text-[16px] mb-1 truncate tracking-wide">Chapters</h3>
            <Link href={getPersonaUrl('builder')} className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">Builder</Link>
            <Link href={getPersonaUrl('operator')} className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">Operator</Link>
            <Link href={getPersonaUrl('thinker')} className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">Thinker</Link>
            <Link href={getPersonaUrl('wanderer')} className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">Wanderer</Link>
          </div>
          
          <div className="flex flex-col gap-3 text-[13.5px] font-light">
            <h3 className="font-cormorant dark:text-[#D8D1C7] text-[#2F3134] text-[16px] mb-1 truncate tracking-wide">Presence</h3>
            <Link href="#" className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">GitHub</Link>
            <Link href="#" className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">LinkedIn</Link>
            <Link href="#" className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">Twitter</Link>
            <Link href="#" className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">HackTheBox</Link>
            <Link href="#" className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">Instagram</Link>
          </div>
          
          <div className="flex flex-col gap-3 text-[13.5px] font-light">
            <h3 className="font-cormorant dark:text-[#D8D1C7] text-[#2F3134] text-[16px] mb-1 truncate tracking-wide">Essays & Notes</h3>
            <Link href={getPersonaUrl('thinker', '/about')} className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">About</Link>
            <Link href="#" className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">Writings</Link>
            <Link href="#" className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">Terms</Link>
            <Link href="#" className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">Feedback</Link>
            <Link href="#" className="dark:text-[#A59E94] text-[#6F7175] dark:hover:dark:text-[#D8D1C7] text-[#2F3134] hover:text-[#2F3134] transition-colors duration-500 truncate">Support</Link>
          </div>
        </div>
        
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t dark:border-[rgba(255,255,255,0.04)] border-[#E2DFDA] text-center flex flex-col items-center justify-center">
        <p className="text-[13px] dark:text-[#7F786F] text-[#6F7175] font-light">
          &copy; 2026 Biranchi. Cultivating stillness.
        </p>
      </div>
    </footer>
  );
}

