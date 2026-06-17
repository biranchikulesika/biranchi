'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type PersonaSearchProps = {
  persona?: string;
  mobileBgColor: string;
};

export function PersonaSearch({ persona, mobileBgColor }: PersonaSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let placeholderText = persona ? `Search in ${persona}...` : 'Search posts...';
  if (persona?.toLowerCase() === 'operator') {
    placeholderText = 'Search signals...';
  } else if (persona?.toLowerCase() === 'wanderer') {
    placeholderText = 'Search stories...';
  } else if (persona?.toLowerCase() === 'thinker') {
    placeholderText = 'Search reflections...';
  }

  const results = [
    { title: `[Mock] First result matching "${query}"`, date: '2024-05-12' },
    { title: `[Mock] Essential guide to ${persona ? persona.toLowerCase() : 'all categories'}`, date: '2024-04-28' },
    { title: `[Mock] Deep dive into ${query || 'systems'}`, date: '2024-03-15' },
  ];

  const isThinker = persona?.toLowerCase() === 'thinker';

  return (
    <div ref={containerRef} className="flex items-center">
      {/* Desktop Search Input */}
      <div className="hidden md:flex relative items-center">
        <Search className={`w-4 h-4 absolute left-3 ${isThinker ? 'opacity-30' : 'opacity-50'} pointer-events-none`} />
        <input 
          type="text" 
          placeholder={placeholderText}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className={`bg-transparent rounded-full py-1.5 pl-9 pr-4 text-sm w-48 focus:w-56 outline-none transition-all duration-500
            ${isThinker 
              ? 'border border-[rgba(255,255,255,0.06)] focus:border-[rgba(255,255,255,0.12)] placeholder-[#7E7A73] opacity-80 dark:text-[#D7D4CE] text-[#2F3134] font-light italic' 
              : persona?.toLowerCase() === 'wanderer'
                ? 'dark:bg-[#221C18]/40 bg-[#EEE7DE]/40 border dark:border-[#26201B] border-[#E5DCCF] focus:border-[#B97A56]/80 placeholder-[#74685D] dark:text-[#E1D5C8] text-[#43382F] font-spectral italic opacity-95'
                : 'border border-current/20 focus:border-current/50 placeholder-current/50'
            }`}
        />
        <AnimatePresence>
          {isOpen && query.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: isThinker || persona?.toLowerCase() === 'wanderer' ? 0.4 : 0.2, ease: "easeOut" }}
              className={`absolute top-full right-0 mt-4 w-[300px] backdrop-blur-xl p-2 shadow-2xl flex flex-col gap-1 z-50 rounded-lg ${mobileBgColor} ${
                isThinker ? 'border dark:border-[#242A31]/50 border-[#E2DFDA] dark:text-[#D7D4CE] text-[#2F3134] font-light' : persona?.toLowerCase() === 'wanderer' ? 'border dark:border-[#26201B] border-[#E5DCCF] dark:text-[#E1D5C8] text-[#43382F] font-spectral' : 'border border-current/10'
              }`}
            >
              {results.map((r, i) => (
                <div key={i} className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors overflow-hidden ${
                  isThinker ? 'dark:hover:dark:bg-[#242A31]/30 bg-[#E2DFDA]/30 hover:bg-[#E2DFDA]/50 opacity-90' : persona?.toLowerCase() === 'wanderer' ? 'dark:hover:dark:bg-[#26201B] bg-[#E5DCCF]/60 hover:bg-[#E5DCCF]/60 opacity-95' : 'hover:bg-current/10'
                }`}>
                  <div className={`font-medium whitespace-nowrap overflow-hidden text-ellipsis ${isThinker ? 'font-serif opacity-80' : persona?.toLowerCase() === 'wanderer' ? 'font-cormorant text-lg italic opacity-95' : 'opacity-90'}`}>{r.title}</div>
                  <div className={`text-xs mt-1 ${isThinker ? 'dark:text-[#7E7A73] text-[#6F7175] font-sans' : persona?.toLowerCase() === 'wanderer' ? 'dark:text-[#74685D] text-[#8A7C70] font-sans' : 'opacity-50'}`}>{r.date}</div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Search Button */}
      <button 
        className="md:hidden p-2 rounded-full hover:bg-current/10 transition-colors opacity-70 hover:opacity-100 flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Mobile Overlay Search */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: isThinker || persona?.toLowerCase() === 'wanderer' ? 0.4 : 0.2, ease: "easeOut" }}
            className={`md:hidden absolute inset-0 z-50 flex items-center px-4 backdrop-blur-lg ${mobileBgColor}`}
          >
            <Search className={`w-5 h-5 absolute left-6 ${isThinker || persona?.toLowerCase() === 'wanderer' ? 'opacity-30' : 'opacity-50'} pointer-events-none`} />
            <input
              type="text"
              autoFocus
              placeholder={placeholderText}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`flex-1 bg-transparent border-none py-3 pl-10 pr-4 text-base outline-none w-full ${
                isThinker ? 'placeholder-[#7E7A73] dark:text-[#D7D4CE] text-[#2F3134] font-light italic' : persona?.toLowerCase() === 'wanderer' ? 'placeholder-[#74685D] dark:text-[#E1D5C8] text-[#43382F] font-spectral italic' : 'placeholder-current/50'
              }`}
            />
            <button 
              onClick={() => { setIsOpen(false); setQuery(''); }} 
              className={`p-2 ml-2 rounded-full transition-colors ${
                isThinker ? 'opacity-50 hover:opacity-80 dark:hover:dark:bg-[#242A31]/30 bg-[#E2DFDA]/30 hover:bg-[#E2DFDA]/50' : persona?.toLowerCase() === 'wanderer' ? 'opacity-60 hover:opacity-90 dark:hover:dark:bg-[#26201B] bg-[#E5DCCF] hover:bg-[#E5DCCF]' : 'opacity-70 hover:opacity-100 hover:bg-current/10'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
            
            {query.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`absolute top-full left-0 right-0 mt-0 shadow-2xl flex flex-col p-2 z-50 min-h-[calc(100vh-64px)] ${mobileBgColor} ${
                  isThinker ? 'border-t dark:border-[#242A31]/50 border-[#E2DFDA]' : persona?.toLowerCase() === 'wanderer' ? 'border-t dark:border-[#26201B] border-[#E5DCCF]' : 'border-t border-current/10'
                }`}
              >
                {results.map((r, i) => (
                  <div key={i} className={`px-4 py-4 rounded-md cursor-pointer transition-colors ${
                    isThinker ? 'dark:hover:dark:bg-[#242A31]/30 bg-[#E2DFDA]/30 hover:bg-[#E2DFDA]/50 border-b dark:border-[#242A31]/30 border-[#E2DFDA] last:border-0' : persona?.toLowerCase() === 'wanderer' ? 'dark:hover:dark:bg-[#26201B] bg-[#E5DCCF]/50 hover:bg-[#E5DCCF]/50 border-b dark:border-[#26201B] border-[#E5DCCF] last:border-0' : 'hover:bg-current/10 border-b border-current/5 last:border-0'
                  }`}>
                    <div className={`text-sm leading-tight ${isThinker ? 'font-serif opacity-80' : persona?.toLowerCase() === 'wanderer' ? 'font-cormorant text-xl italic opacity-95' : 'font-medium opacity-90'}`}>{r.title}</div>
                    <div className={`text-xs mt-1.5 ${isThinker ? 'dark:text-[#7E7A73] text-[#6F7175] font-sans' : persona?.toLowerCase() === 'wanderer' ? 'dark:text-[#74685D] text-[#8A7C70] font-sans tracking-wide uppercase' : 'opacity-50'}`}>{r.date}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
