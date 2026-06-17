'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { getOperatorFocuss, getPosts } from '@/app/admin/actions';
import { useEffect, useState } from 'react';

export default function OperatorPage() {
  const [focuses, setFocuses] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [fData, pData] = await Promise.all([
          getOperatorFocuss(),
          getPosts()
        ]);
        
        let visibleFocuses: any[] = [];
        if (fData) {
          visibleFocuses = fData.filter((f:any) => !f.hidden).sort((a:any, b:any) => (a.order || 0) - (b.order || 0));
        }
        setFocuses(visibleFocuses);
        
        let visibleNotes: any[] = [];
        if (pData) {
          const operatorPosts = pData.filter((p:any) => p.persona?.toLowerCase() === 'operator' && !p.hidden && !p.draft);
          operatorPosts.sort((a:any, b:any) => {
             if (a.featured && !b.featured) return -1;
             if (!a.featured && b.featured) return 1;
             return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
          });
          
          visibleNotes = operatorPosts.map((p:any) => ({
             id: p.slug || p.id,
             title: p.title,
             category: (p.tags && p.tags[0]) || 'Systems',
             date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown',
             content: p.excerpt || p.subtitle || 'System note.'
          }));
        }
        setNotes(visibleNotes);
        
      } catch (e) {
        console.error("Error loading operator data", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-12 text-center text-neutral-500 font-mono text-xs">Initializing systems...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full min-h-screen font-mono overflow-x-hidden"
    >
      {/* SECTION 1 — HERO / OPERATIONAL ENTRY FRAME (Standalone Slide) */}
      <section className="w-full min-h-[100svh] flex flex-col justify-center pt-16 md:pt-20 pb-32 md:pb-40 relative">
        <div className="max-w-5xl mx-auto px-6 md:px-12 w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-0 lg:items-start">
            
            {/* HEADLINE */}
            <div className="lg:col-span-7 order-1 lg:row-start-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium dark:text-neutral-100 text-[#111111] leading-tight tracking-tight max-w-xl">
                Understanding systems through observation and failure.
              </h1>
            </div>

            {/* RIGHT SIDE ACTIVE SYSTEMS PANEL - Tightened layout, visually snug */}
            <div className="lg:col-span-4 lg:col-start-9 w-full order-2 lg:row-start-1 lg:row-span-2 lg:mt-2">
              <div className="border border-neutral-200/70 dark:border-neutral-900 p-5 md:p-6 dark:bg-neutral-900/5 bg-[#E7E4DD]/10 rounded-[3px] space-y-4 relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] dark:text-neutral-500 text-[#8B867C] tracking-wide font-medium">
                  <span>Current focus</span>
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5F7A69] opacity-40"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#5F7A69]"></span>
                  </span>
                </div>
                
                
                {focuses.length > 0 ? focuses.map((f:any) => (
                    <div key={f.id} className="border-t border-[#E7E4DD]/70 dark:border-neutral-900/30 pt-3">
                      <span className="text-[10px] dark:text-neutral-500 text-[#8B867C] block mb-0.5 font-bold uppercase">[ {f.category || 'FOCUS'} ]</span>
                      <p className="text-xs dark:text-neutral-300 text-[#222222] font-semibold leading-relaxed">{f.text}</p>
                    </div>
                )) : (
                    <div className="text-xs dark:text-neutral-500 text-[#8B867C] p-2 italic pt-3 border-t border-[#E7E4DD]/70 dark:border-neutral-900/30">Current focus will appear here.</div>
                )}

              </div>
            </div>

            {/* DESCRIPTION & LINKS */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6 lg:space-y-5 order-3 lg:row-start-2 lg:mt-5 pt-2 lg:pt-0">
              <p className="hidden md:block text-[13px] md:text-sm dark:text-neutral-500 text-[#8B867C] lg:dark:text-neutral-450 lg:text-[#5E5A53] leading-relaxed max-w-[280px] sm:max-w-md lg:max-w-lg">
                Studying how systems behave under pressure, how failures emerge, and how people adapt around them.
              </p>

              <div className="flex flex-wrap gap-6 pt-1 lg:pt-2">
                <a 
                  href="#recent-observations"
                  className="text-xs font-mono tracking-wide dark:text-neutral-500 text-[#8B867C] hover:dark:text-neutral-200 hover:text-[#111111] transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
                >
                  View Field Notes <span className="opacity-50">↓</span>
                </a>
                <Link 
                  href="/operator/blogs"
                  className="text-xs font-mono tracking-wide dark:text-neutral-500 text-[#8B867C] hover:dark:text-neutral-200 hover:text-[#111111] transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
                >
                  View Archive <span className="opacity-50">→</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 w-full pb-36 md:pb-48">
        <main className="flex flex-col">

            {/* FIELD NOTES */}
            <section id="recent-observations" className="scroll-mt-24 w-full">
              <div className="mb-12 max-w-xl">
                <h2 className="text-xl md:text-2xl font-bold dark:text-neutral-200 text-[#111111] tracking-tight mb-3">
                  FIELD NOTES
                </h2>
                <p className="text-sm dark:text-neutral-400 text-[#5E5A53] leading-relaxed mb-4">
                  Recent observations collected from ongoing study, experiments, failures, and system analysis.
                </p>
                <div className="text-[11px] font-mono dark:text-neutral-500 text-[#8B867C] tracking-wide uppercase">
                  Showing latest 3 observations
                </div>
              </div>
              
              
              <div className="flex flex-col max-w-2xl space-y-2">
                
                {notes.slice(0, 3).map((n:any, i:number) => {
                  const isFirst = i === 0;
                  return (
                    <Link 
                      key={n.id}
                      href={`/p/${n.id}`}
                      className={`group flex flex-col ${isFirst ? 'pb-8 border-b' : 'py-6 border-b last:border-b-0'} border-[#D6DED5]/40 dark:border-neutral-800 transition-opacity hover:opacity-100 opacity-90`}
                    >
                      {isFirst && <span className="text-[10px] font-mono dark:text-[#7f9e8a] text-[#5F7A69] uppercase tracking-widest mb-4 block font-bold">Latest Observation</span>}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[11px] dark:text-neutral-400 text-[#5E5A53] font-bold tracking-widest uppercase">{n.category || 'Systems'}</span>
                        <span className="text-[10px] dark:text-neutral-600 text-neutral-300">&middot;</span>
                        <span className="text-[11px] dark:text-neutral-500 text-[#8B867C] font-mono tracking-widest uppercase">{n.date || 'Unknown'}</span>
                      </div>
                      <h3 className={`${isFirst ? 'text-xl sm:text-[22px]' : 'text-[15px] sm:text-base'} font-bold dark:text-neutral-100 text-[#111111] leading-snug group-hover:dark:text-[#b4d3c0] group-hover:text-[#3E5245] transition-colors mb-3 md:max-w-[540px]`}>
                        {n.title}
                      </h3>
                      <p className={`${isFirst ? 'text-[15px] sm:text-base' : 'text-sm'} dark:text-neutral-400 text-[#3E5245] leading-relaxed font-sans md:max-w-[540px]`}>
                        {n.content}
                      </p>
                    </Link>
                  );
                })}
                {notes.length === 0 && <div className="text-[15px] dark:text-neutral-500 text-[#8B867C] py-8 italic font-sans font-light">No observations published yet.</div>}
</div>

              <div className="pt-8 max-w-[600px]">
                 <Link href="/operator/blogs/archive" className="text-xs font-mono tracking-wide dark:text-neutral-500 text-[#8B867C] hover:dark:text-neutral-200 hover:text-[#111111] transition-colors duration-200 cursor-pointer flex items-center gap-1.5 focus:outline-none">
                    View Observation Archive <span className="opacity-50">&rarr;</span>
                 </Link>
              </div>
            </section>

          </main>

      </div>
    </motion.div>
  );
}
