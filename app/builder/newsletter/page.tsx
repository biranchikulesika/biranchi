'use client';

import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';

export default function ForgeNewsletterPage() {
  const [emailValue, setEmailValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const expectations = [
    'Build logs',
    'Experiments',
    'Technical notes',
    'Lessons learned'
  ];

  const recentLetters = [
    { title: 'Why I Keep Rebuilding My Notes System', date: 'May 20, 2026' },
    { title: 'Building Slower Interfaces', date: 'May 14, 2026' },
    { title: 'Designing Systems That Feel Human', date: 'May 08, 2026' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue) return;
    setIsSubmitting(true);
    
    const { subscribeNewsletter } = await import('@/app/public.actions');
    const result = await subscribeNewsletter(emailValue, ['builder'], 'builder');
    
    setIsSubmitting(false);
    if (result.success) {
      setIsSubmitted(true);
      setEmailValue('');
    } else {
      alert(result.error || 'Failed to subscribe');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full font-mono bg-transparent min-h-[70vh] flex flex-col justify-start py-10 md:py-16"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-center">
        
        {/* HERO SECTION */}
        <section className={`transition-all duration-500 ease-out ${isInputFocused ? 'max-md:scale-[0.98] pb-4' : 'pb-8 md:pb-12'}`}>
          <div className="border-l-2 dark:border-neutral-800 border-neutral-350 pl-4 py-1 mb-4">
            <span className="text-xs font-semibold dark:text-neutral-400 text-[#8B867C] tracking-widest uppercase block mb-1">
              [ FORGE DISPATCH ]
            </span>
            <span className="text-[10px] dark:text-neutral-500 text-[#A29D93] tracking-[0.22em] font-medium block uppercase">
              REPORTS &bull; BUILD LOGS &bull; ARCHITECTURE
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium dark:text-neutral-100 text-[#111111] leading-tight tracking-tight max-w-xl mb-4">
            Forge Dispatch
          </h1>

          <p className="text-sm dark:text-neutral-450 text-[#5E5A53] leading-relaxed max-w-xl">
            Projects, systems, experiments, programming, and lessons learned while building.
          </p>
        </section>

        {/* EMAIL FORM */}
        <section className="mb-10 w-full max-w-xl">
          {isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-sm border border-neutral-300 dark:border-neutral-900 bg-neutral-200/10 dark:bg-neutral-900/5"
            >
              <div className="flex justify-between items-center text-[10px] dark:text-neutral-500 text-[#8B867C] tracking-wide font-medium mb-2 uppercase">
                <span>SUBSCRIBED</span>
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#5F7A69]"></span>
                </span>
              </div>
              <p className="text-sm dark:text-neutral-200 text-[#111111] font-semibold leading-relaxed mb-1">
                You have been registered.
              </p>
              <p className="text-xs dark:text-neutral-500 text-[#6E6A64] leading-relaxed">
                Welcome to Forge Dispatch. Subscriptions are processed carefully.
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
                  placeholder="Enter email address" 
                  className="w-full bg-transparent border-b dark:border-neutral-850 border-neutral-300 px-1 py-3 dark:text-neutral-200 text-[#111111] focus:outline-none focus:dark:border-neutral-500 focus:border-neutral-700 transition-colors duration-500 font-mono text-sm placeholder:dark:text-neutral-700 placeholder:text-neutral-400/80 rounded-none shadow-none"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 dark:text-neutral-500 text-[#8B867C] hover:dark:text-neutral-300 hover:text-neutral-950 transition-colors duration-300"
                  aria-label="Subscribe"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-t-transparent dark:border-neutral-400 border-neutral-700 rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 stroke-2" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 px-1 text-[9px] sm:text-[10px] uppercase font-mono">
                <div className="flex flex-col text-left">
                  <span className="dark:text-neutral-500 text-[#8B867C]">Low frequency</span>
                  <span className="dark:text-neutral-600 text-[#9C958A]">High Signal.</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="dark:text-neutral-550 text-neutral-500 normal-case font-sans font-light text-[10px] sm:text-[11px] leading-tight">No schedules. no weekly promises.</span>
                  <span className="dark:text-neutral-600 text-neutral-400/85 italic normal-case font-sans font-light text-[10px] sm:text-[11px] leading-tight">only sending when there is something worth sending.</span>
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
          <section className="mb-10 pt-6 border-t border-[#E7E4DD]/70 dark:border-neutral-900/30">
            <h2 className="text-[10px] dark:text-neutral-500 text-[#8B867C] uppercase tracking-[0.25em] font-semibold mb-4">
              [ WHAT YOU WILL RECEIVE ]
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {expectations.map((exp, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[10px] dark:text-neutral-600 text-neutral-400/80">&bull;</span>
                  <span className="text-xs dark:text-neutral-300 text-[#222222] font-medium">{exp}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RECENT LETTERS */}
          <section className="mb-10 pt-6 border-t border-[#E7E4DD]/70 dark:border-neutral-900/30">
            <h2 className="text-[10px] dark:text-neutral-500 text-[#8B867C] uppercase tracking-[0.25em] font-semibold mb-4">
              [ RECENT LETTERS ]
            </h2>
            <div className="space-y-3">
              {recentLetters.map((letter, idx) => (
                <div key={idx} className="flex items-baseline justify-between gap-4 py-1.5 border-b border-dashed dark:border-neutral-900/20 border-neutral-300/40">
                  <span className="text-xs dark:text-neutral-300 text-[#222222] font-semibold">{letter.title}</span>
                  <span className="text-[10px] dark:text-neutral-550 text-[#8B867C]/80 shrink-0 font-mono">{letter.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* WHY THIS NEWSLETTER EXISTS */}
          <section className="pt-6 border-t border-[#E7E4DD]/70 dark:border-neutral-900/30">
            <h2 className="text-[10px] dark:text-neutral-500 text-[#8B867C] uppercase tracking-[0.25em] font-semibold mb-3">
              [ RATIONALE ]
            </h2>
            <p className="text-xs dark:text-neutral-450 text-[#5E5A53] leading-relaxed max-w-xl">
              Systems require patience, but they also require memory. Forge Dispatch exists to capture the architecture, experiments, and reasoning behind my work. It is an honest ledger of things constructed, broken, and understood over time.
            </p>
          </section>

        </div>

      </div>
    </motion.div>
  );
}
