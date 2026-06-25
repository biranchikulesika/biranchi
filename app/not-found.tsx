'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { PersonaSearch } from '@/components/persona-search';
import { ArrowLeft } from 'lucide-react';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <div className="space-y-4">
          <h1 className="text-8xl font-serif font-light tracking-tighter">404</h1>
          <h2 className="text-2xl font-medium opacity-80">Signal Lost</h2>
          <p className="text-muted-foreground">The page you are looking for has drifted into the void. Use the search to recalibrate your coordinates.</p>
        </div>
        
        <div className="flex justify-center my-8">
          <div className="bg-card border border-border rounded-full px-2 py-1 shadow-sm">
            <PersonaSearch mobileBgColor="bg-background" />
          </div>
        </div>
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-primary font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
