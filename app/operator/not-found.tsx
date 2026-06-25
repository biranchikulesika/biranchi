'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { AlertTriangle, Activity, Server, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PersonaSearch } from '@/components/persona-search';

export default function OperatorNotFound() {
  const [uptime, setUptime] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#0a0a0a] text-zinc-300 font-mono">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl space-y-8"
      >
        <div className="flex items-center gap-4 border-b border-red-500/30 pb-6">
          <div className="p-4 bg-red-500/10 rounded-lg text-red-500 animate-pulse">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-red-500 uppercase">System Alert: Focus Lost</h1>
            <p className="text-zinc-500 mt-1 uppercase text-sm tracking-wider">Error 404: Navigational telemetry dropped.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 border border-zinc-800 rounded-lg bg-zinc-900/50 p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-4">Diagnostic Output</h3>
              <p className="text-red-400/80">&gt; Target sector not found in active operational matrix.</p>
              <p className="text-zinc-400">&gt; Rerouting telemetry to standard search protocol...</p>
              <p className="text-zinc-400">&gt; Awaiting manual operator input.</p>
            </div>
            
            <div className="pt-6 border-t border-zinc-800">
              <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-4">Command Input</h3>
              <div className="bg-black border border-zinc-700 rounded-lg p-2 focus-within:border-zinc-500 transition-colors">
                <PersonaSearch persona="operator" mobileBgColor="bg-[#0a0a0a]" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Network</span>
              </div>
              <span className="text-blue-500 text-sm font-bold">STABLE</span>
            </div>
            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">Main DB</span>
              </div>
              <span className="text-emerald-500 text-sm font-bold">ONLINE</span>
            </div>
            <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="text-sm">Recovery Time</span>
              </div>
              <span className="text-amber-500 text-sm font-mono">{formatUptime(uptime)}</span>
            </div>

            <Link 
              href="/operator" 
              className="block w-full mt-8 py-3 text-center uppercase tracking-widest text-sm font-bold bg-zinc-100 text-zinc-900 hover:bg-white transition-colors rounded"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
