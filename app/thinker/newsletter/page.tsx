'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function ThinkerNewsletterPage() {
  const [emailValue, setEmailValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const expectations = [
    'Essays',
    'Reflections',
    'Journal fragments',
    'Questions worth sitting with'
  ];

  const recentLetters = [
    { title: 'The Problem With Needing Closure', date: 'May 18, 2026' },
    { title: 'The Quiet Art of Unlearning', date: 'May 05, 2026' },
    { title: 'Attention Loss and Living Online', date: 'April 20, 2026' }
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
      className="w-full font-sans bg-transparent min-h-[70vh] flex flex-col justify-start py-10 md:py-16 relative"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-center">
        
        {/* HERO SECTION */}
        <section className={`transition-all duration-500 ease-out ${isInputFocused ? 'max-md:scale-[0.98] pb-4' : 'pb-8 md:pb-12'}`}>
          <div className="border-l border-[#E2DFDA] dark:border-[rgba(255,255,255,0.06)] pl-4 py-1 mb-4">
            <span className="text-[10px] font-mono tracking-[0.25em] dark:text-[#A7A39B] text-[#6F7175] uppercase block mb-1">
              INSIDE THE HEAD
            </span>
            <span className="text-[9px] font-mono dark:text-[#807D76] text-[#8C8F93] tracking-[0.18em] block uppercase font-light">
              Reflections &bull; Philosophy &bull; Human Experience
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif dark:text-[#e5e5e5] text-[#2F3134] leading-tight tracking-tight max-w-xl mb-4 font-normal">
            Continue the conversation.
          </h1>

          <p className="text-sm dark:text-[#A7A39B]/90 text-[#6F7175]/90 leading-relaxed max-w-xl font-light">
            Reflections on psychology, philosophy, awareness, and the strange mechanics of being human.
          </p>
        </section>

        {/* EMAIL FORM */}
        <section className="mb-10 w-full max-w-xl">
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border dark:border-[rgba(255,255,255,0.05)] border-[#E2DFDA] dark:bg-[rgba(255,255,255,0.01)] bg-[#ECEAE7]"
            >
              <div className="flex justify-between items-center text-[9px] font-mono dark:text-[#A7A39B] text-[#6F7175] tracking-widest mb-2 uppercase">
                <span>CONVERSATION JOINED</span>
                <span className="w-1 h-1 rounded-full bg-[#6F7175]" />
              </div>
              <p className="text-base font-serif dark:text-[#D7D4CE] text-[#2F3134] mb-1">
                You are registered.
              </p>
              <p className="text-xs dark:text-[#807D76] text-[#8C8F93] leading-relaxed">
                Thank you for subscribing. Future reflections will arrive directly inside your head.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col w-full relative">
              <div className="relative group w-full mb-4">
                <input 
                  type="email"
                  required
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  placeholder="Enter your email address" 
                  className="w-full bg-transparent border-b dark:border-[rgba(255,255,255,0.08)] border-[#E2DFDA] px-1 py-3 dark:text-[#D7D4CE] text-[#2F3134] focus:outline-none focus:dark:border-[#A7A39B] focus:border-[#6F7175] transition-colors duration-500 font-sans text-sm font-light placeholder:dark:text-[#807D76]/50 placeholder:text-stone-400/80 rounded-none shadow-none"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 dark:text-[#A7A39B] text-[#6F7175] hover:dark:text-[#e5e5e5] hover:text-[#2F3134] transition-colors duration-300"
                  aria-label="Subscribe"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-t-transparent dark:border-[#A7A39B] border-[#6F7175] rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 stroke-[1.5]" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 px-1 text-[8px] sm:text-[9px] font-mono uppercase tracking-wider">
                <div className="flex flex-col text-left">
                  <span className="dark:text-[#A7A39B]/70 text-[#6F7175]/70 font-light">Low frequency</span>
                  <span className="dark:text-[#A7A39B]/50 text-[#5F6165]/70 font-light">High Signal.</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="dark:text-stone-500 text-stone-500 normal-case font-sans font-light text-[10px] sm:text-[11px] leading-tight">No schedules. no weekly promises.</span>
                  <span className="dark:text-stone-600 text-stone-400/60 italic normal-case font-sans font-light text-[10px] sm:text-[11px] leading-tight">only sending when there is something worth sending.</span>
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
          <section className="mb-10 pt-6 border-t dark:border-[rgba(255,255,255,0.04)] border-[#E2DFDA]">
            <h2 className="text-[10px] font-mono dark:text-[#A7A39B] text-[#6F7175] uppercase tracking-[0.25em] font-semibold mb-4">
              [ WHAT TO EXPECT ]
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {expectations.map((exp, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[10px] dark:text-[#A7A39B]/40 text-[#6F7175]/40">&#9670;</span>
                  <span className="text-xs dark:text-[#D7D4CE]/90 text-[#2F3134]/90 font-light">{exp}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RECENT LETTERS */}
          <section className="mb-10 pt-6 border-t dark:border-[rgba(255,255,255,0.04)] border-[#E2DFDA]">
            <h2 className="text-[10px] font-mono dark:text-[#A7A39B] text-[#6F7175] uppercase tracking-[0.25em] font-semibold mb-4">
              [ PAST DIALOGUES ]
            </h2>
            <div className="space-y-3">
              {recentLetters.map((letter, idx) => (
                <div key={idx} className="flex items-baseline justify-between gap-4 py-2 border-b border-dashed dark:border-[rgba(255,255,255,0.02)] border-[#E2DFDA]/50">
                  <span className="text-xs font-serif dark:text-[#D7D4CE]/90 text-[#2F3134]/90">{letter.title}</span>
                  <span className="text-[10px] font-mono dark:text-[#807D76] text-[#8C8F93]/70 shrink-0">{letter.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* WHY THIS NEWSLETTER EXISTS */}
          <section className="pt-6 border-t dark:border-[rgba(255,255,255,0.04)] border-[#E2DFDA]">
            <h2 className="text-[10px] font-mono dark:text-[#A7A39B] text-[#6F7175] uppercase tracking-[0.25em] font-semibold mb-3">
              [ PHILOSOPHICAL STATEMENT ]
            </h2>
            <p className="text-xs dark:text-[#A7A39B]/80 text-[#6F7175]/80 leading-relaxed max-w-xl font-light">
              We are bombarded by solutions, but we rarely slow down to define the questions. This newsletter is an open-ended dialogue about awareness, psychology, and meaning. It is a quiet space to explore thoughts that cannot be forced into quick or simplified conclusions.
            </p>
          </section>

        </div>

      </div>
    </motion.div>
  );
}
