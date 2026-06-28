'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function SignalNewsletterPage() {
  const [emailValue, setEmailValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const expectations = [
    'Infrastructure observations',
    'Security notes',
    'Reliability lessons',
    'System stories'
  ];

  const recentLetters = [
    { title: 'An Inventory of Digital Defenses', date: 'May 22, 2026' },
    { title: 'The Mechanics of Silent Failures', date: 'May 12, 2026' },
    { title: 'Defending the Perimeter', date: 'April 28, 2026' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValue) return;
    setIsSubmitting(true);
    
    const { subscribeNewsletter } = await import('@/app/public.actions');
    const result = await subscribeNewsletter(emailValue, ['operator'], 'operator');
    
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full font-mono bg-transparent min-h-[70vh] flex flex-col justify-start py-10 md:py-16 relative z-10"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 w-full flex-1 flex flex-col justify-center">

        {/* HERO SECTION */}
        <section className={`transition-all duration-500 ease-out ${isInputFocused ? 'max-md:scale-[0.98] pb-4' : 'pb-8 md:pb-12'}`}>
          <div className="border-l-2 dark:border-[#1e2722] border-[#D6DED5] pl-4 py-1 mb-4">
            <span className="text-xs font-semibold dark:text-[#a3c2af] text-[#5F7A69] tracking-widest uppercase block mb-1">
              [ SIGNAL REPORTS ]
            </span>
            <span className="text-[10px] dark:text-[#6d8775] text-[#8A7C70] tracking-[0.22em] font-medium block uppercase">
              INFRASTRUCTURE &bull; SECURITY &bull; TELEMETRY
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium dark:text-[#a3c2af] text-[#1F2822] leading-tight tracking-tight max-w-xl mb-4">
            Signal Reports
          </h1>

          <p className="text-sm dark:text-[#6d8775]/90 text-[#8A7C70]/90 leading-relaxed max-w-xl">
            Observations from infrastructure, cybersecurity, reliability, and digital systems.
          </p>
        </section>

        {/* EMAIL FORM */}
        <section className="mb-10 w-full max-w-xl">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xs border dark:border-[#1e2722] border-[#D6DED5] dark:bg-[#111612] bg-[#EDF1EC]"
            >
              <div className="flex justify-between items-center text-[10px] text-primary/70 tracking-wide font-medium mb-2 uppercase">
                <span>SUBSCRIBED</span>
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
              </div>
              <p className="text-sm text-foreground font-semibold leading-relaxed mb-1">
                Endpoint registration successful.
              </p>
              <p className="text-xs text-primary/70 leading-relaxed">
                Welcome to Signal Reports. Your email address has been added to our quiet operational index.
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
                  className="w-full bg-transparent border-b border-border px-1 py-3 text-foreground focus:outline-none focus:border-primary transition-colors duration-500 font-mono text-sm placeholder:text-primary/50 rounded-none shadow-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-primary/70 hover:text-foreground transition-colors duration-300"
                  aria-label="Subscribe"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-t-transparent border-primary rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 stroke-2" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 px-1 text-[9px] sm:text-[10px] uppercase font-mono">
                <div className="flex flex-col text-left">
                  <span className="text-primary">Low frequency</span>
                  <span className="text-primary/70">High Signal.</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-primary/60 normal-case font-sans font-light text-[10px] sm:text-[11px] leading-tight">No schedules. no weekly promises.</span>
                  <span className="text-primary/50 italic normal-case font-sans font-light text-[10px] sm:text-[11px] leading-tight">only sending when there is something worth sending.</span>
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
          <section className="mb-10 pt-6 border-t border-border">
            <h2 className="text-[10px] text-primary/80 uppercase tracking-[0.25em] font-semibold mb-4">
              [ PACKET LOGS EXPECTED ]
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {expectations.map((exp, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-[10px] text-primary/50">&gt;</span>
                  <span className="text-xs text-foreground/80 font-medium">{exp}</span>
                </div>
              ))}
            </div>
          </section>

          {/* RECENT LETTERS */}
          <section className="mb-10 pt-6 border-t border-border">
            <h2 className="text-[10px] text-primary/80 uppercase tracking-[0.25em] font-semibold mb-4">
              [ TRANSMISSION RECORD ]
            </h2>
            <div className="space-y-3">
              {recentLetters.map((letter, idx) => (
                <div key={idx} className="flex items-baseline justify-between gap-4 py-1.5 border-b border-dashed border-border/40">
                  <span className="text-xs text-foreground/80 font-medium">{letter.title}</span>
                  <span className="text-[10px] text-primary/80 shrink-0 font-mono">{letter.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* WHY THIS NEWSLETTER EXISTS */}
          <section className="pt-6 border-t border-border">
            <h2 className="text-[10px] text-primary/80 uppercase tracking-[0.25em] font-semibold mb-3">
              [ ANCHOR EXPLANATION ]
            </h2>
            <p className="text-xs text-primary/90 leading-relaxed max-w-xl">
              The systems that keep our worlds running are often the ones we see the least. Signal Reports exists to inspect digital environments, cybersecurity barriers, and structural reliability. It is a chronicle of what lies hidden beneath the interface, shared quietly.
            </p>
          </section>

        </div>

      </div>
    </motion.div>
  );
}
