'use client';

import { motion } from 'motion/react';

export default function ThinkerAboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 pt-8 pb-20 md:pt-10 md:pb-32 relative flex flex-col font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl"
      >
        <div className="mb-10 md:mb-14">
          <span className="text-[10px] md:text-[11px] tracking-[0.2em] text-primary/70 mb-6 md:mb-8 block font-mono uppercase opacity-70">
            Inside the Head
          </span>
          <h1 className="text-4xl md:text-5xl text-foreground tracking-wide font-cormorant font-normal leading-snug">
            Why Thinker Exists
          </h1>
        </div>
        
        <div className="space-y-8 md:space-y-12 text-foreground/80 leading-[1.95] text-[15px] md:text-lg font-light antialiased">
          <p>
            Thinker is the quietest part of the ecosystem. It holds reflections, internal conversations, observations, unfinished thoughts, philosophy, psychology, and questions that continue to stay with me.
          </p>
          <p>
            This space is less about certainty and more about paying attention. Writing here helps me understand ideas, emotions, patterns, and sometimes myself.
          </p>
          <p>
            Not every thought needs a conclusion. Some things simply need space to be observed carefully before they make sense.
          </p>
          
          <div className="pt-8 md:pt-12">
            <p className="text-[13.5px] md:text-[14.5px] text-primary/80 tracking-wide font-cormorant italic text-xl">
              Some thoughts stay longer than expected.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
