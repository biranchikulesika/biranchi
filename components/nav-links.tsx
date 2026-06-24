'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getPersonaUrl } from '@/lib/utils';

export function DesktopNav({ persona }: { persona?: 'main' | 'builder' | 'operator' | 'thinker' | 'wanderer' }) {
  const pathname = usePathname();
  let currentPersona: 'main' | 'builder' | 'operator' | 'thinker' | 'wanderer' = persona || 'main';
  
  if (!persona) {
    if (pathname.startsWith('/builder')) currentPersona = 'builder';
    else if (pathname.startsWith('/operator')) currentPersona = 'operator';
    else if (pathname.startsWith('/thinker')) currentPersona = 'thinker';
    else if (pathname.startsWith('/wanderer')) currentPersona = 'wanderer';
  }

  const aboutPath = getPersonaUrl(currentPersona, '/about');
  const blogPath = getPersonaUrl(currentPersona, '/blogs');

  const links = [
    { name: 'About', path: aboutPath },
    { name: 'Blogs', path: blogPath },
    { name: 'Newsletter', path: getPersonaUrl(currentPersona, '/newsletter') },
  ];

  return (
    <nav className="hidden md:flex items-center gap-6 mr-2 text-[11px] tracking-[0.2em] uppercase font-medium font-sans">
      {links.map(link => (
        <Link key={link.name} href={link.path} className="opacity-60 hover:opacity-100 transition-opacity">
          {link.name}
        </Link>
      ))}
      <Link href="/fund" className="opacity-80 hover:opacity-100 transition-all border border-current/30 px-4 py-1.5 hover:bg-current/5">
        Fund
      </Link>
    </nav>
  );
}

export function MobileNav({ mobileBgColor, persona }: { mobileBgColor: string, persona?: 'main' | 'builder' | 'operator' | 'thinker' | 'wanderer' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  let currentPersona: 'main' | 'builder' | 'operator' | 'thinker' | 'wanderer' = persona || 'main';
  
  if (!persona) {
    if (pathname.startsWith('/builder')) currentPersona = 'builder';
    else if (pathname.startsWith('/operator')) currentPersona = 'operator';
    else if (pathname.startsWith('/thinker')) currentPersona = 'thinker';
    else if (pathname.startsWith('/wanderer')) currentPersona = 'wanderer';
  }

  const aboutPath = getPersonaUrl(currentPersona, '/about');
  const blogPath = getPersonaUrl(currentPersona, '/blogs');

  const links = [
    { name: 'About', path: aboutPath },
    { name: 'Blogs', path: blogPath },
    { name: 'Newsletter', path: getPersonaUrl(currentPersona, '/newsletter') },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isThinker = currentPersona === 'thinker';
  const isWanderer = currentPersona === 'wanderer';

  return (
    <div ref={containerRef} className="md:hidden relative flex items-center font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 transition-colors rounded-full flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-muted`}
        aria-label="Menu"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: isThinker || isWanderer ? 0.4 : 0.2, ease: "easeOut" }}
            className={`absolute top-full right-0 mt-4 w-48 backdrop-blur-xl p-2 flex flex-col gap-1 z-50 rounded-lg ${mobileBgColor} border border-border shadow-2xl text-foreground`}
          >
            {links.map(link => (
              <Link
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 text-[10px] tracking-[0.2em] uppercase transition-colors rounded-md opacity-70 hover:opacity-100 hover:bg-muted font-light`}
              >
                {link.name}
              </Link>
            ))}
            <div className={`my-1 border-t border-border`}></div>
            <Link
              href="/fund"
              onClick={() => setIsOpen(false)}
              className={`mx-2 my-2 px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors text-center rounded opacity-80 hover:opacity-100 border border-border hover:bg-muted font-light`}
            >
              Fund
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
