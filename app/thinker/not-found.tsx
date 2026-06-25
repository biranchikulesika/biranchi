'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { PersonaSearch } from '@/components/persona-search';
import { BookOpen } from 'lucide-react';

const fragments = [
  {
    quote: "Sometimes what we are looking for is not a place, but a new perspective.",
    book: "The Book of Disquiet",
    author: "Fernando Pessoa",
    link: "/thinker/reading"
  },
  {
    quote: "The page is blank. This is not a void, but a canvas of potential.",
    book: "Meditations",
    author: "Marcus Aurelius",
    link: "/thinker/reading"
  },
  {
    quote: "To be lost is to be fully present, and to be fully present is to be capable of being in uncertainty.",
    book: "A Field Guide to Getting Lost",
    author: "Rebecca Solnit",
    link: "/thinker/reading"
  },
  {
    quote: "We must not seek the answer, but the question that unlocks the path.",
    book: "Letters to a Young Poet",
    author: "Rainer Maria Rilke",
    link: "/thinker/reading"
  }
];

export default function ThinkerNotFound() {
  const [fragment, setFragment] = useState(fragments[0]);

  useEffect(() => {
    // Pick a random fragment on mount
    const randomIndex = Math.floor(Math.random() * fragments.length);
    setFragment(fragments[randomIndex]);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#fcfaf8] dark:bg-[#111110] text-[#2c2c2a] dark:text-[#e0ddd6] selection:bg-[#d6cfc4] dark:selection:bg-[#3f3f3a]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl text-center space-y-16"
      >
        <div className="space-y-4">
          <h1 className="text-xl tracking-[0.2em] uppercase opacity-40 font-serif">Page Missing</h1>
          <div className="w-12 h-[1px] bg-current/20 mx-auto"></div>
        </div>

        <div className="space-y-8 max-w-lg mx-auto">
          <p className="text-3xl md:text-4xl font-serif italic leading-relaxed opacity-90">
            "{fragment.quote}"
          </p>
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm tracking-widest uppercase opacity-50">Related Reading</span>
            <Link 
              href={fragment.link} 
              className="inline-flex items-center gap-2 text-sm border-b border-current/30 pb-0.5 hover:opacity-70 transition-opacity"
            >
              <BookOpen className="w-4 h-4 opacity-70" />
              <span className="font-serif italic">{fragment.book}</span> by {fragment.author}
            </Link>
          </div>
        </div>

        <div className="pt-16 flex flex-col items-center gap-8">
          <div className="opacity-80">
            <PersonaSearch persona="thinker" mobileBgColor="bg-[#fcfaf8] dark:bg-[#111110]" />
          </div>
          
          <Link 
            href="/thinker" 
            className="text-xs uppercase tracking-[0.2em] opacity-50 hover:opacity-100 transition-opacity"
          >
            Close Notebook
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
