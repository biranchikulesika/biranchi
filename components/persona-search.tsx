'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { searchPublishedPosts } from '@/app/public.actions';
import { useRouter } from 'next/navigation';

type PersonaSearchProps = {
  persona?: string;
  mobileBgColor: string;
};

export function PersonaSearch({ persona, mobileBgColor }: PersonaSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim().length > 0) {
        startTransition(async () => {
          const res = await searchPublishedPosts(query);
          setResults(res);
        });
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);

  let placeholderText = persona ? `Search in ${persona}...` : 'Search posts...';
  if (persona?.toLowerCase() === 'operator') {
    placeholderText = 'Search signals...';
  } else if (persona?.toLowerCase() === 'wanderer') {
    placeholderText = 'Search stories...';
  } else if (persona?.toLowerCase() === 'thinker') {
    placeholderText = 'Search reflections...';
  }

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
          className={`bg-transparent rounded-full py-1.5 pl-9 pr-4 text-sm w-48 focus:w-56 outline-none transition-all duration-500 border border-border focus:border-primary placeholder-primary/70 text-foreground italic opacity-95`}
        />
        {isPending && query.length > 0 && (
          <Loader2 className="w-4 h-4 absolute right-3 opacity-50 animate-spin" />
        )}
        <AnimatePresence>
          {isOpen && query.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: isThinker || persona?.toLowerCase() === 'wanderer' ? 0.4 : 0.2, ease: "easeOut" }}
              className={`absolute top-full right-0 mt-4 w-[300px] backdrop-blur-xl p-2 shadow-2xl flex flex-col gap-1 z-50 rounded-lg ${mobileBgColor} border border-border text-foreground max-h-[60vh] overflow-y-auto`}
            >
              {results.length > 0 ? results.map((r, i) => (
                <div key={i} onClick={() => { setIsOpen(false); router.push(`/p/${r.slug}`); }} className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors overflow-hidden hover:bg-muted`}>
                  <div className={`font-medium whitespace-nowrap overflow-hidden text-ellipsis ${isThinker ? 'font-serif opacity-80' : persona?.toLowerCase() === 'wanderer' ? 'font-cormorant text-lg italic opacity-95' : 'opacity-90'}`}>{r.title}</div>
                  <div className={`text-xs mt-1 text-primary/70`}>{new Date(r.publishedAt || r.createdAt).toLocaleDateString()}</div>
                </div>
              )) : !isPending ? (
                <div className="px-3 py-4 text-center text-sm text-primary/60 italic">No results found</div>
              ) : null}
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
              className={`flex-1 bg-transparent border-none py-3 pl-10 pr-10 text-base outline-none w-full placeholder-primary/70 text-foreground italic`}
            />
            {isPending && query.length > 0 && (
              <Loader2 className="w-5 h-5 absolute right-16 opacity-50 animate-spin" />
            )}
            <button 
              onClick={() => { setIsOpen(false); setQuery(''); }} 
              className={`p-2 ml-2 rounded-full transition-colors opacity-70 hover:opacity-100 hover:bg-muted`}
            >
              <X className="w-5 h-5" />
            </button>
            
            {query.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`absolute top-full left-0 right-0 mt-0 shadow-2xl flex flex-col p-2 z-50 min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-y-auto ${mobileBgColor} border-t border-border`}
              >
                {results.length > 0 ? results.map((r, i) => (
                  <div key={i} onClick={() => { setIsOpen(false); router.push(`/p/${r.slug}`); }} className={`px-4 py-4 rounded-md cursor-pointer transition-colors hover:bg-muted border-b border-border last:border-0`}>
                    <div className={`text-sm leading-tight ${isThinker ? 'font-serif opacity-80' : persona?.toLowerCase() === 'wanderer' ? 'font-cormorant text-xl italic opacity-95' : 'font-medium opacity-90'}`}>{r.title}</div>
                    <div className={`text-xs mt-1.5 text-primary/70`}>{new Date(r.publishedAt || r.createdAt).toLocaleDateString()}</div>
                  </div>
                )) : !isPending ? (
                  <div className="px-4 py-8 text-center text-sm text-primary/60 italic">No results found</div>
                ) : null}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
