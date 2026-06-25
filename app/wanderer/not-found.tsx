'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Compass, Map, Search } from 'lucide-react';
import { PersonaSearch } from '@/components/persona-search';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WandererNotFound() {
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleDetour = () => {
    setIsSpinning(true);
    // In a real implementation this would fetch a random post slug
    // For now, we simulate a detour path
    setTimeout(() => {
      router.push('/wanderer/blogs/archive');
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#f4f1e1] dark:bg-[#1a1814] text-[#4a4238] dark:text-[#d4cbb8] overflow-hidden relative">
      
      {/* Abstract Map Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="300" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10"/>
          <circle cx="400" cy="400" r="200" stroke="currentColor" strokeWidth="1" strokeDasharray="5 15"/>
          <path d="M400 100 L400 700 M100 400 L700 400" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8"/>
          <path d="M200 200 Q400 100 600 200 T700 500" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg text-center flex flex-col items-center space-y-10"
      >
        <div className="relative">
          <motion.div
            animate={isSpinning ? { rotate: 360 * 5 } : { rotate: 45 }}
            transition={isSpinning ? { duration: 1.5, ease: "circInOut" } : { duration: 4, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            className="w-32 h-32 rounded-full border-2 border-current/20 flex items-center justify-center bg-background/50 backdrop-blur-sm"
          >
            <Compass className="w-16 h-16 opacity-70" strokeWidth={1} />
          </motion.div>
          <div className="absolute -top-4 -right-4 text-xs font-mono opacity-50">404°</div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-cormorant italic tracking-wide">Off the Trail</h1>
          <p className="text-lg opacity-80 font-serif leading-relaxed max-w-sm mx-auto">
            You've ventured into uncharted territory. The path you were following has faded away.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <button 
            onClick={handleDetour}
            disabled={isSpinning}
            className="w-full sm:w-auto px-8 py-3 bg-[#4a4238] text-[#f4f1e1] dark:bg-[#d4cbb8] dark:text-[#1a1814] rounded-full font-medium tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Map className="w-4 h-4" />
            {isSpinning ? 'Finding Path...' : 'Take a Detour'}
          </button>
          
          <Link 
            href="/wanderer" 
            className="w-full sm:w-auto px-8 py-3 border border-current/20 rounded-full font-medium tracking-wide hover:bg-current/5 transition-colors text-center"
          >
            Back to Camp
          </Link>
        </div>

        <div className="pt-8 w-full max-w-xs mx-auto border-t border-current/10">
          <PersonaSearch persona="wanderer" mobileBgColor="bg-[#f4f1e1] dark:bg-[#1a1814]" />
        </div>
      </motion.div>
    </div>
  );
}
