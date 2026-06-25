'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { PersonaSearch } from '@/components/persona-search';
import { Terminal, RefreshCcw, Home } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BuilderNotFound() {
  const [isRecompiling, setIsRecompiling] = useState(false);
  const router = useRouter();

  const handleRecompile = () => {
    setIsRecompiling(true);
    setTimeout(() => {
      router.push('/builder');
    }, 2000);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-black text-[#00ff00] p-6 font-mono selection:bg-[#00ff00]/30 selection:text-white">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-3xl space-y-6"
      >
        <div className="border border-[#00ff00]/30 rounded-lg overflow-hidden bg-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,0,0.1)]">
          <div className="bg-[#00ff00]/10 border-b border-[#00ff00]/30 p-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 opacity-70" />
            <span className="text-sm font-medium opacity-80">builder_exception.log</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="opacity-80">
              <span className="text-red-500 font-bold">[ERROR]</span> 404: Unhandled Routing Exception at /builder/*
            </div>
            <div className="text-[#00ff00]/60 text-sm opacity-70 leading-relaxed">
              Traceback (most recent call last):<br/>
              &nbsp;&nbsp;File "next/router.js", line 42, in route_resolve<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;raise MissingNodeError("The requested module node is undefined or out of scope.")<br/>
              MissingNodeError: Could not locate compiled assets for the requested path.
            </div>
            
            {isRecompiling && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-4 text-[#00ff00] animate-pulse"
              >
                &gt; Recompiling system index... [||||||||||||||------] 70%
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
          <div className="bg-black border border-[#00ff00]/30 rounded-full px-2 py-1">
            <PersonaSearch persona="builder" mobileBgColor="bg-black" />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleRecompile}
              disabled={isRecompiling}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-[#00ff00]/50 hover:bg-[#00ff00]/10 transition-colors font-medium disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 ${isRecompiling ? 'animate-spin' : ''}`} />
              {isRecompiling ? 'Recompiling...' : 'Run Build Repair Tool'}
            </button>
            <Link 
              href="/builder" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#00ff00]/20 hover:bg-[#00ff00]/30 transition-colors font-medium"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
