'use client';

import { motion } from 'motion/react';

export default function OperatorAboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 pt-8 pb-20 md:pt-10 md:pb-32 relative flex flex-col font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl"
      >
        <div className="mb-12 md:mb-14">
          <span className="text-[10px] md:text-[11px] tracking-wider dark:text-[#4e6054] text-[#5C6A61]/90 block mb-6 md:mb-8 font-mono">
            signal://
          </span>
          <h1 className="text-3xl md:text-4xl font-medium text-[#c2d6c9] tracking-tight">
            Why Signal Exists
          </h1>
        </div>
        
        <div className="space-y-8 md:space-y-10 dark:text-[#7f9e8a] text-[#5F7A69] leading-[1.8] md:leading-[1.9] text-[15.5px] md:text-[16.5px]">
          <p>
            Operator is where I think about infrastructure, cybersecurity, operational thinking, and the invisible systems that quietly power the internet.
          </p>
          <p>
            I’m deeply curious about how systems behave under pressure, how infrastructure scales, and how reliability, privacy, and security shape modern technology.
          </p>
          <p>
            This corner focuses less on performance and more on understanding. Logs, architecture, networks, and operational systems are not just technical subjects to me. They are ways of observing how modern digital life actually functions beneath the surface.
          </p>
          <div className="pt-14 md:pt-16 border-t border-transparent">
            <p className="text-[13px] md:text-[14px] dark:text-[#4e6054] text-[#5C6A61]/90 tracking-wide font-light">
              Reliable systems are usually invisible.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
