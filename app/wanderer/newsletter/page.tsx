'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function ScribbleNewsletterPage() {
  const [emailValue, setEmailValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const expectations = [
    'Stories',
    'Travel notes',
    'Memory fragments',
    'Observations'
  ];

  const recentLetters = [
    { title: 'The Railway Platform at 5 AM', date: 'May 15, 2026' },
    { title: 'Conversations on the Night Train', date: 'April 30, 2026' },
    { title: 'A Quiet Cafe in Odisha', date: 'March 25, 2026' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmailValue('');
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full font-spectral bg-transparent min-h-[70vh] flex flex-col justify-start py-10 md:py-16 relative z-10"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-center">
        
        {/* HERO SECTION */}
        <section className={`transition-all duration-500 ease-out ${isInputFocused ? 'max-md:scale-[0.98] pb-4' : 'pb-8 md:pb-12'}`}>
          <div className="border-l border-[#E5DCCF] dark:border-[#26201B] pl-4 py-1 mb-4">
            <span className="text-[10px] font-sans tracking-[0.25em] dark:text-[#B97A56] text-[#B67A55] uppercase block mb-1">
              SCRIBBLE
            </span>
            <span className="text-[9px] font-mono dark:text-[#B6A798] text-[#8A7C70] tracking-[0.15em] block uppercase italic">
              Stories &bull; Memories &bull; Moments Preserved
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif dark:text-[#E1D5C8] text-[#43382F] leading-tight tracking-tight max-w-xl mb-4 italic">
            Letters worth keeping.
          </h1>

          <p className="text-sm dark:text-[#B6A798]/90 text-[#8A7C70]/90 leading-relaxed max-w-xl font-light">
            Stories, memories, travel notes, conversations, and moments preserved before they disappear.
          </p>
        </section>

        {/* EMAIL FORM */}
        <section className="mb-10 w-full max-w-xl">
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl border dark:border-[#26201B] border-[#E5DCCF] dark:bg-[#201B17] bg-[#EEE7DE]"
            >
              <div className="flex justify-between items-center text-[10px] font-mono dark:text-[#B97A56] text-[#B67A55] tracking-widest mb-2 uppercase">
                <span>MEMORANDUM FILED</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#B67A55]" />
              </div>
              <p className="text-lg italic dark:text-[#E1D5C8] text-[#43382F] mb-1">
                Letters registered.
              </p>
              <p className="text-xs dark:text-[#B6A798]/80 text-[#8A7C70]/80 leading-relaxed">
                Thank you for subscribing. Scribble&apos;s memories and observations will reach your inbox in due time.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col w-full relative font-sans">
              <div className="relative group w-full mb-4">
                <input 
                  type="email"
                  required
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Enter email address" 
                  className="w-full bg-transparent border-b dark:border-[#26201B] border-[#E5DCCF] px-1 py-3 dark:text-[#E1D5C8] text-[#43382F] focus:outline-none focus:dark:border-[#B97A56] focus:border-[#B67A55] transition-colors duration-500 font-spectral italic text-base placeholder:dark:text-[#B6A798]/40 placeholder:text-[#8A7C70]/50 rounded-none shadow-none"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 dark:text-[#B6A798] text-[#8A7C70] hover:dark:text-[#B97A56] hover:text-[#B67A55] transition-colors duration-300"
                  aria-label="Subscribe"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-t-transparent dark:border-[#B97A56] border-[#B67A55] rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 stroke-[1.5]" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 px-1 text-[8px] sm:text-[9px] font-mono uppercase tracking-wider">
                <div className="flex flex-col text-left">
                  <span className="dark:text-[#B6A798]/70 text-[#8A7C70]/70 font-light">Low frequency</span>
                  <span className="dark:text-[#B6A798]/50 text-[#8A7C70]/55 font-light">High Signal.</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="dark:text-stone-500 text-stone-500 normal-case font-sans font-light text-[10px] sm:text-[11px] leading-tight">No schedules. no weekly promises.</span>
                  <span className="dark:text-stone-600 text-[#8A7C70]/80 italic normal-case font-sans font-light text-[10px] sm:text-[11px] leading-tight">only sending when there is something worth sending.</span>
                </div>
              </div>
            </form>
          )}
        </section>

        {/* COLLAPSIBLE REGION */}
        <div className={`transition-all duration-700 ease-in-out ${
          isInputFocused ? 'max-md:max-h-0 max-md:opacity-0 max-md:pointer-events-none max-md:overflow-hidden max-md:py-0 max-md:mt-0' : 'max-md:max-h-[2000px] max-md:opacity-100'
        }`}>

          {/* WHAT YOU'LL RECEIVE */}
          <section className="mb-10 pt-6 border-t dark:border-[#26201B] border-[#E5DCCF]">
            <h2 className="text-[10px] font-sans dark:text-[#B97A56] text-[#B67A55] uppercase tracking-[0.25em] font-semibold mb-4">
              [ THE RECORD EXPECTED ]
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-sans">
              {expectations.map((exp, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[10px] dark:text-[#B6A798]/30 text-[#8A7C70]/30">&#10038;</span>
                  <span className="text-xs dark:text-[#E1D5C8]/80 text-[#43382F]/80 font-light">{exp}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RECENT LETTERS */}
          <section className="mb-10 pt-6 border-t dark:border-[#26201B] border-[#E5DCCF]">
            <h2 className="text-[10px] font-sans dark:text-[#B97A56] text-[#B67A55] uppercase tracking-[0.25em] font-semibold mb-4">
              [ RECENT DRIFT ]
            </h2>
            <div className="space-y-3">
              {recentLetters.map((letter, idx) => (
                <div key={idx} className="flex items-baseline justify-between gap-4 py-2 border-b border-dashed dark:border-[#26201B]/50 border-[#E5DCCF]/50">
                  <span className="text-sm dark:text-[#E1D5C8]/95 text-[#43382F]/95 font-medium">{letter.title}</span>
                  <span className="text-[10px] font-mono dark:text-[#B6A798] text-[#8A7C70]/70 shrink-0">{letter.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* WHY THIS NEWSLETTER EXISTS */}
          <section className="pt-6 border-t dark:border-[#26201B] border-[#E5DCCF]">
            <h2 className="text-[10px] font-sans dark:text-[#B97A56] text-[#B67A55] uppercase tracking-[0.25em] font-semibold mb-3">
              [ EXPLANATION FROM ROAD ]
            </h2>
            <p className="text-xs dark:text-[#B6A798]/90 text-[#8A7C70]/90 leading-relaxed max-w-xl font-light">
              Most details of our lives drift away unnoticed. Scribble exists to hold on to the specific textures, conversations, and places that make up our experiences. It is a quiet ledger of memory, preserved before it disappears.
            </p>
          </section>

        </div>

      </div>
    </motion.div>
  );
}
