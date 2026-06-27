'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { getBuilderStatuss } from '@/lib/queries';
import { getActiveSystems } from '@/lib/queries';
import { getBuildLogs } from '@/lib/queries';
import { getPostsMeta } from '@/lib/queries';
import { useEffect } from 'react';

// SECTION PACING SEPARATOR SYSTEM — 3 Distinct Types (Max)
// TYPE A — Operational Divider (label and phrases with high containment)
function OperationalDivider({ label, phrases }: { label: string; phrases: string[] }) {
  return (
    <div className="w-full pt-8 pb-4 select-none font-mono">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="w-full h-[1px] bg-neutral-200/15 dark:bg-neutral-900/25 mb-4" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.25em] py-1 dark:text-neutral-500 text-[#8B867C]/95">
          <span className="font-semibold">{label}</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium opacity-80">
            {phrases.map((phrase, index) => (
              <span key={index} className="flex items-center gap-2">
                <span>{phrase}</span>
                {index < phrases.length - 1 && <span className="opacity-25 select-none">&bull;</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// TYPE B — Cinematic Separator (creates atmospheric pacing between major surfaces)
function CinematicSeparator({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="w-full py-16 md:py-24 select-none font-mono">
      <div className="max-w-4xl mx-auto px-6 md:px-10 flex flex-col items-center justify-center space-y-4">
        <span className="text-[10px] md:text-[11px] dark:text-neutral-400 text-[#8B867C] tracking-[0.35em] uppercase font-bold text-center">
          [ {title} ]
        </span>
        <div className="w-16 h-[1px] bg-neutral-200/15 dark:bg-neutral-900/25" />
        <span className="text-[8px] md:text-[9px] dark:text-neutral-500/60 text-neutral-500/50 tracking-[0.25em] uppercase text-center leading-normal max-w-sm">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

// TYPE C — Centered Statement (centered operational/philosophical sentence without lines)
function CenteredStatement({ text }: { text: string }) {
  return (
    <div className="w-full my-6 py-1 select-none font-mono">
      <div className="max-w-5xl mx-auto px-6 md:px-12 text-center font-medium">
        <span className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-neutral-450 dark:text-neutral-500/80 font-semibold">
          [ {text} ]
        </span>
      </div>
    </div>
  );
}

export type SystemStatus = 'stable' | 'active' | 'lab';

export interface SystemItem {
  id: string;
  code?: string;
title?: string;
  name?: string;
  status: SystemStatus | string;
  description: string;
  tags?: string[];
stack?: string[];
  updated?: string;
updatedAt?: string;
  featured?: boolean;
  url?: string;
}

export interface LogEntry {
  id: string;
  date: string;
  category?: string;
source?: string;
  title: string;
  summary?: string;
description?: string;
  why?: string;
  affectedAreas: string[];
}

const renderStatusBadge = (status: SystemStatus | string) => {
  const normStatus = (status || 'active').toLowerCase() as SystemStatus;
  switch (normStatus) {
    case 'stable':
      return (
        <span className="text-[9px] dark:text-[#7f9e8a] text-[#5F7A69] tracking-[0.2em] border border-emerald-500/15 dark:bg-emerald-950/15 bg-emerald-50 px-2 py-0.5 rounded-[2px] font-bold uppercase">
          STABLE
        </span>
      );
    case 'active':
      return (
        <span className="text-[9px] dark:text-neutral-500 text-[#8B867C] tracking-[0.2em] border border-neutral-500/15 dark:bg-neutral-800/50 bg-neutral-100 px-2 py-0.5 rounded-[2px] font-bold uppercase">
          ACTIVE
        </span>
      );
    case 'lab':
      return (
        <span className="text-[9px] dark:text-amber-500 text-amber-600 tracking-[0.2em] border border-dashed border-amber-500/20 dark:bg-amber-950/15 bg-amber-50 px-2 py-0.5 rounded-[2px] font-bold uppercase">
          LAB
        </span>
      );
    default:
      return (
        <span className="text-[9px] dark:text-neutral-500 text-[#8B867C] tracking-[0.2em] border border-neutral-500/15 dark:bg-neutral-800/50 bg-neutral-100 px-2 py-0.5 rounded-[2px] font-bold uppercase">
          {normStatus}
        </span>
      );
  }
};

const SystemShowcase = ({ system }: { system: SystemItem }) => {
  const isDashed = system.status === 'lab';
  const borderClass = isDashed 
    ? "border border-dashed border-border"
    : "border border-border";

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={`lg:col-span-7 flex flex-col justify-between p-4 md:p-5 dark:bg-neutral-900/5 bg-surface ${borderClass} hover:border-border dark:hover:border-neutral-700 hover:bg-muted dark:hover:bg-neutral-900/10 hover:-translate-y-[1px] transition-all duration-200 ease-out rounded-[3px] shadow-sm group`}
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-lg font-bold dark:text-neutral-100 text-[#111111] transition-colors leading-tight">
            {system.url ? (
              <Link href={system.url} className="hover:underline">{system.title || system.name}</Link>
            ) : system.name}
          </h3>
          <div className="shrink-0 mt-[2px]">
            {renderStatusBadge(system.status)}
          </div>
        </div>
        
        <p className="text-[13px] dark:text-neutral-400 text-[#5E5A53] leading-relaxed max-w-xl">
          {system.description}
        </p>
      </div>

      <div className="mt-4 flex justify-between items-center text-[10px] dark:text-neutral-500 text-[#8B867C] pt-2">
        <span className="truncate">{(system.stack || system.tags || []).join(' • ')}</span>
        <span className="font-mono text-[9px] opacity-75">Updated {system.updatedAt || system.updated || 'recently'}</span>
      </div>
    </motion.div>
  );
};

const SystemCard = ({ system }: { system: SystemItem }) => {
  const isDashed = system.status === 'lab';
  const borderClass = isDashed 
    ? "border border-dashed border-border"
    : "border border-border";

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={`lg:col-span-5 flex flex-col justify-between p-4 md:p-5 dark:bg-neutral-900/5 bg-surface ${borderClass} hover:border-border dark:hover:border-neutral-700 hover:bg-muted dark:hover:bg-neutral-900/10 hover:-translate-y-[1px] transition-all duration-200 ease-out rounded-[3px] shadow-sm group`}
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-[17px] font-bold dark:text-neutral-100 text-[#111111] transition-colors leading-tight">
            {system.url ? (
              <Link href={system.url} className="hover:underline">{system.title || system.name}</Link>
            ) : system.name}
          </h3>
          <div className="shrink-0 mt-[2px]">
            {renderStatusBadge(system.status)}
          </div>
        </div>
        
        <p className="text-[13px] dark:text-neutral-400 text-[#5E5A53] leading-relaxed">
          {system.description}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-1 text-[10px] dark:text-neutral-500 text-[#8B867C] pt-2">
        <span className="truncate">{(system.stack || system.tags || []).join(' • ')}</span>
        <span className="font-mono text-[9px] opacity-60">Updated {system.updatedAt || system.updated || 'recently'}</span>
      </div>
    </motion.div>
  );
};

export default function BuilderPage() {
  const [activeLogId, setActiveLogId] = useState<string>("log-1");
  const [buildLogsData, setBuildLogsData] = useState<LogEntry[]>([]);
  const [systemsData, setSystemsData] = useState<SystemItem[]>([]);
  const [operationalStateEntries, setOperationalStateEntries] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statusData, systemsDataResponse, logsData, allPosts] = await Promise.all([
          getBuilderStatuss(),
          getActiveSystems(),
          getBuildLogs(),
          getPostsMeta()
        ]);

        if (statusData && statusData.length > 0) {
          const s = statusData[0];
          setOperationalStateEntries([
            { label: "status", primaryValue: s.statusText || 'Operational' },
            { label: "focus", primaryValue: s.currentFocus || 'Development' },
            { label: "last update", primaryValue: s.lastUpdated || 'Recently' },
          ]);
        } else {
          setOperationalStateEntries([]);
        }

        if (systemsDataResponse) {
          const visibleSystems = systemsDataResponse.filter((s:any) => s.hidden !== true).sort((a:any, b:any) => (a.order || 0) - (b.order || 0));
          setSystemsData(visibleSystems);
        }

        if (logsData) {
          const enrichedLogs = logsData.map((l:any, i:number) => ({
            ...l,
            category: l.source || l.title || 'System',
            summary: l.description || '',
            id: l.id || `log-${i}`
          }));
          setBuildLogsData(enrichedLogs);
          if (enrichedLogs.length > 0) setActiveLogId(enrichedLogs[0].id);
        }

        if (allPosts) {
          const builderPosts = allPosts.filter((p:any) => p.persona?.toLowerCase() === 'builder' && p.hidden !== true && p.status !== 'draft' && (!p.status || p.status.toLowerCase() !== 'draft'));
          const sortedPosts = builderPosts.sort((a:any, b:any) => {
             if (a.featured && !b.featured) return -1;
             if (!a.featured && b.featured) return 1;
             return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
          });
          setPosts(sortedPosts);
        }

      } catch (err) {
        console.error("Error loading builder data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredPost = posts.find((p:any) => p.featured) || posts[0];
  let remainingPosts = posts.filter((p:any) => p.id !== featuredPost?.id);
  const secondaryPost = remainingPosts[0];
  remainingPosts = remainingPosts.slice(1, 6);

  if (isLoading) return <div className="p-12 text-center text-neutral-500 font-mono text-xs">Initializing systems...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full font-mono bg-transparent"
    >      {/* SECTION 1 — HERO / OPERATIONAL ENTRY FRAME (Standalone Slide) */}
      <section className="w-full min-h-[100svh] flex flex-col justify-center pt-16 md:pt-20 pb-32 md:pb-40 relative">
        <div className="max-w-5xl mx-auto px-6 md:px-12 w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-0 lg:items-start">
            
            {/* HEADLINE */}
            <div className="lg:col-span-7 order-1 lg:row-start-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium dark:text-neutral-100 text-[#111111] leading-tight tracking-tight max-w-xl">
              Building systems carefully over time.
              </h1>
            </div>

            {/* RIGHT SIDE ACTIVE SYSTEMS PANEL - Tightened layout, visually snug */}
            <div className="lg:col-span-4 lg:col-start-9 w-full order-2 lg:row-start-1 lg:row-span-2 lg:mt-2">
              <div className="border border-border p-5 md:p-6 dark:bg-neutral-900/5 bg-surface shadow-sm rounded-[3px] space-y-4 relative overflow-hidden">
                <div className="flex justify-between items-center text-[10px] dark:text-neutral-500 text-[#8B867C] tracking-wide font-medium">
                  <span>Operational state</span>
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5F7A69] opacity-40"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#5F7A69]"></span>
                  </span>
                </div>
                
                {operationalStateEntries.map((entry, index) => (
                  <div key={index} className="border-t border-[#E7E4DD]/70 dark:border-neutral-900/30 pt-3">
                    <span className="text-[10px] dark:text-neutral-500 text-[#8B867C] block mb-0.5 font-bold">[ {entry.label} ]</span>
                    <p className="text-xs dark:text-neutral-300 text-[#222222] font-semibold leading-relaxed">{entry.primaryValue}</p>
                    {entry.context && (
                      <span className="text-[10px] dark:text-neutral-600 text-[#A29D93] font-mono mt-0.5 block opacity-75">{entry.context}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPTION & LINKS */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6 lg:space-y-5 order-3 lg:row-start-2 lg:mt-5 pt-2 lg:pt-0">
              <p className="hidden md:block text-[13px] md:text-sm text-primary/80 leading-relaxed max-w-[280px] sm:max-w-md lg:max-w-lg">
                I build tools, systems, experiments, workflows, and digital environments focused on clarity, structure, and long-term usefulness.
              </p>

              <div className="flex flex-wrap gap-6 pt-1 lg:pt-2">
                <button 
                  onClick={() => scrollToSection('active-systems')}
                  className="text-xs font-mono tracking-wide text-primary/70 hover:text-foreground transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
                >
                  Explore Systems <span className="opacity-50">↓</span>
                </button>
                <button 
                  onClick={() => scrollToSection('build-logs')}
                  className="text-xs font-mono tracking-wide text-primary/70 hover:text-foreground transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
                >
                  View Build Logs <span className="opacity-50">↓</span>
                </button>
              </div>
            </div>

          </div>
        </div>
        

      </section>

      {/* SECTION 2 — ACTIVE SYSTEMS FRAME */}
      <section id="active-systems" className="w-full min-h-[100svh] flex flex-col justify-center py-16">
        <div className="max-w-5xl mx-auto px-6 md:px-12 w-full">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-4 pb-2 border-b border-border"
          >
            <h2 className="text-[11px] text-primary/70 uppercase tracking-[0.25em] font-bold">
              [ ACTIVE SYSTEMS ]
            </h2>
          </motion.div>

          {/* Single neat grid context with stagger reveal booting animation (The Memorable Signature Moment) */}
          <motion.div 
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
          >
            
            {systemsData.length === 0 ? (
              <div className="lg:col-span-12 py-12 text-center text-primary/70 font-sans font-light italic border border-dashed border-border rounded-sm">
                Systems are being assembled.
              </div>
            ) : systemsData.map((sys) => sys.featured ? (
              <SystemShowcase key={sys.id} system={sys} />
            ) : (
              <SystemCard key={sys.id} system={sys} />
            ))}

          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — BUILD LOGS (Calm structural arrival, tight timeline rhythm) */}
      <section id="build-logs" className="w-full min-h-[100svh] flex flex-col justify-center py-16">
        <div className="max-w-5xl mx-auto px-6 md:px-12 w-full">
          
          <div className="mb-4 pb-1.5 border-b border-border">
            <h2 className="text-[11px] text-primary/70 uppercase tracking-[0.25em] font-bold">
              [ BUILD LOGS ]
            </h2>
          </div>

          <div className="relative space-y-8 md:space-y-0 md:grid md:grid-cols-12 md:gap-x-12">
            
            {/* LEFT COLUMN: NAVIGATION */}
            <div className="col-span-12 md:col-span-4 lg:col-span-4 flex flex-col md:border-r border-neutral-200/50 dark:border-neutral-900/30 md:pr-8 pb-8 md:pb-0 border-b md:border-b-0 space-y-4 md:space-y-0">
              
              {/* MOBILE HORIZONTAL SELECTOR */}
              <div className="flex md:hidden items-center gap-1 w-full bg-neutral-100/70 dark:bg-neutral-900/40 p-1 rounded-md border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden">
                {buildLogsData.length === 0 ? (
                  <div className="text-center w-full py-2 text-[10px] text-primary/70 font-mono">No logs</div>
                ) : buildLogsData.slice(0, 3).map((log) => {
                  const isActive = activeLogId === log.id;
                  return (
                    <button
                      key={log.id}
                      onClick={() => setActiveLogId(log.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 min-w-0 px-1 py-1.5 transition-all rounded-[4px] truncate ${isActive ? 'bg-muted shadow-sm text-foreground' : 'text-primary/70 hover:bg-muted/50'}`}
                    >
                      <span className={`text-[8px] shrink-0 ${isActive ? 'text-primary' : 'opacity-50'}`}>
                        {isActive ? '●' : '○'}
                      </span>
                      <span className={`text-[10px] sm:text-[11px] font-mono tracking-tight truncate ${isActive ? 'font-bold' : 'font-medium'}`}>
                        {log.category}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* DESKTOP VERTICAL RAIL */}
              <div className="hidden md:flex flex-col w-full relative">
                {buildLogsData.length === 0 ? (
                  <div className="text-[12px] text-primary/70 font-mono">No logs</div>
                ) : buildLogsData.slice(0, 6).map((log, index) => {
                  const isActive = activeLogId === log.id;
                  
                  return (
                    <div key={log.id} className="flex flex-col">
                      <button
                        onClick={() => setActiveLogId(log.id)}
                        className={`text-left group flex items-start gap-4 py-1 transition-all duration-300 ${isActive ? 'opacity-100 text-foreground' : 'opacity-60 hover:opacity-100 text-primary/80'}`}
                      >
                        <span className={`text-[12px] mt-[1px] leading-none transition-colors ${isActive ? 'text-primary scale-110' : 'text-primary/70'}`}>
                          {isActive ? '●' : '○'}
                        </span>
                        <span className={`text-[13px] truncate transition-colors ${isActive ? 'text-foreground font-semibold tracking-wide' : 'text-primary/70 font-medium tracking-wide group-hover:text-foreground'}`}>
                          {log.category}
                        </span>
                      </button>
                      
                      {/* Vertical line connecting entries */}
                      {index < Math.min(buildLogsData.length, 6) - 1 && (
                        <div className="w-[1px] h-6 ml-[5px] my-1 border-l border-border" />
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            {/* RIGHT COLUMN: REVISION VIEWER */}
            <div className="col-span-12 md:col-span-8 lg:col-span-8 md:pl-4 relative min-h-[360px]">
              {buildLogsData.length === 0 ? (
                <div className="flex items-center justify-center h-full pt-10">
                  <span className="text-primary/70 font-sans font-light italic">No build logs yet.</span>
                </div>
              ) : (() => {
                const activeLog = buildLogsData.find(l => l.id === activeLogId) || buildLogsData[0];
                return (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeLog.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-2 font-mono">
                        <div className="flex items-center gap-1.5 text-primary">
                          <span className="text-[8px] opacity-80">■</span>
                          <span className="text-[10px] uppercase font-bold tracking-widest">
                            {activeLog.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-primary/70">
                          {activeLog.date}
                        </span>
                      </div>

                      <h4 className="text-lg md:text-xl text-foreground font-semibold leading-snug">
                        {activeLog.title}
                      </h4>

                      <div className="space-y-6 pt-6 border-t border-border">
                        <div>
                          <h5 className="text-[10px] font-mono uppercase tracking-widest text-primary/70 mb-2">Summary</h5>
                          <p className="text-sm md:text-[15px] text-foreground leading-relaxed max-w-2xl">
                            {activeLog.summary}
                          </p>
                        </div>

                        {activeLog.why && (
                          <div>
                            <h5 className="text-[10px] font-mono uppercase tracking-widest text-primary/70 mb-2">Why</h5>
                            <p className="text-sm md:text-[15px] text-primary/90 leading-relaxed max-w-2xl">
                              {activeLog.why}
                            </p>
                          </div>
                        )}

                        {activeLog.affectedAreas && activeLog.affectedAreas.length > 0 && (
                          <div>
                            <h5 className="text-[10px] font-mono uppercase tracking-widest text-primary/70 mb-3">Affected Areas</h5>
                            <div className="flex flex-wrap gap-3 mt-2">
                              {activeLog.affectedAreas.map((area, i) => (
                                <span key={i} className="text-[11px] font-mono border border-border bg-muted/20 px-2.5 py-1 rounded-[3px] text-primary/90">
                                  [ {area} ]
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FROM FORGE / EDITORIAL WRITING (reflective, expanded editorial breathing, narrower readable flow) */}
      
      {posts.length > 0 && (
      <section id="from-forge" className="w-full justify-center py-16 flex flex-col min-h-[100svh]">
        <div className="max-w-4xl mx-auto px-6 md:px-10 w-full">
          
          <div className="mb-4 pb-1.5 border-b border-border">
            <h2 className="text-[11px] text-primary/70 uppercase tracking-[0.25em] font-bold">
              [ FROM FORGE ]
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* FEATURED ESSAYS */}
            <div className="lg:col-span-7 space-y-6">
              {/* PRIMARY FEATURE */}
              {featuredPost && (
              <Link href={`/p/${featuredPost.slug || featuredPost.id}`} className="space-y-3 block group">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground group-hover:underline leading-tight mb-2">
                  {featuredPost.title}
                </h3>
                
                <span className="text-[11px] font-mono text-primary/70 block group-hover:text-primary transition-colors">
                  {featuredPost.publishedAt || 'Unknown'}
                </span>
                
                <p className="text-sm text-primary/90 leading-relaxed max-w-xl group-hover:text-primary transition-colors">
                  {featuredPost.excerpt || 'Read reflection.'}
                </p>
              </Link>
              )}

              {featuredPost && secondaryPost && (
                <div className="w-full h-[1px] bg-border" />
              )}

              {/* SECONDARY FEATURE */}
              {secondaryPost && (
              <Link href={`/p/${secondaryPost.slug || secondaryPost.id}`} className="space-y-2 opacity-95 block group">
                <h4 className="text-base md:text-lg font-semibold text-foreground group-hover:underline leading-snug">
                  {secondaryPost.title}
</h4>
                
                <span className="text-[10px] font-mono text-primary/70 block group-hover:text-primary transition-colors">
                  {secondaryPost.publishedAt || 'Unknown'}
                </span>
                
                <p className="text-xs text-primary/90 leading-relaxed max-w-lg group-hover:text-primary transition-colors">
                  {secondaryPost.excerpt || 'Read reflection.'}
                </p>
              </Link>
              )}
            </div>

            {/* RECENT REFLECTIONS */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 h-full">
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-primary/70 uppercase tracking-[0.2em] block">
                  recent reflections
                </span>
                
                <div className="divide-y border-t border-border divide-border border-b">
                  {remainingPosts.map((p:any) => (
                  <Link 
                    key={p.id}
                    href={`/p/${p.slug || p.id}`} 
                    className="group block py-2.5 hover:bg-muted/10 transition-colors duration-150 px-2 -mx-2"
                  >
                    <h4 className="text-xs font-semibold text-foreground group-hover:text-foreground transition-colors">
                      {p.title}
                    </h4>
                    <div className="flex justify-between items-center mt-1.5 text-[9px] font-mono text-primary/70">
                      <span>{(p.tags && p.tags[0]) || 'Reflection'}</span>
                      <span>{p.publishedAt || 'Unknown'}</span>
                    </div>
                  </Link>
                  ))}
                  {remainingPosts.length === 0 && (
                    <div className="py-2.5 px-2 -mx-2 text-xs text-primary/70 font-mono">No more posts.</div>
                  )}
                </div>
              </div>

              <div className="pt-1">
                <button 
                  onClick={() => scrollToSection('build-logs')}
                  className="text-xs text-primary/80 hover:text-foreground transition-all duration-200 hover:underline flex items-center gap-1 cursor-pointer font-bold font-mono"
                >
                  View Writing Timeline <span className="opacity-70">&rarr;</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      <section className="w-full flex flex-col justify-start pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-10 w-full overflow-hidden md:overflow-visible">
          
          <div className="mb-8 pb-1.5 border-b border-border flex justify-between items-end">
            <h2 className="text-[11px] text-primary/70 uppercase tracking-[0.25em] font-bold">
              [ SYSTEM ARCHITECTURE ]
            </h2>
            <span className="md:hidden text-[9px] text-primary/70 font-mono tracking-widest uppercase mb-0.5">
              Swipe <span className="opacity-70">&rarr;</span>
            </span>
          </div>

          <div className="flex overflow-x-auto gap-x-12 md:gap-x-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-visible md:grid md:grid-cols-1 md:gap-y-10 pb-4 md:pb-0">
            
            {/* PAGE 1 */}
            <div className="w-full shrink-0 snap-start grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {/* Card 1 */}
              <div className="border-l-2 border-border pl-4 py-0.5">
                <p className="text-sm text-foreground font-semibold tracking-wide">
                  KNOWLEDGE LAYER
                </p>
                <span className="text-[11px] text-primary/70 block mt-1.5 font-normal">
                  Notes • References • Archives
                </span>
              </div>
              
              {/* Card 2 */}
              <div className="border-l-2 border-border pl-4 py-0.5">
                <p className="text-sm text-foreground font-semibold tracking-wide">
                  PROJECT LAYER
                </p>
                <span className="text-[11px] text-primary/70 block mt-1.5 font-normal">
                  Experiments • Systems • Workspaces
                </span>
              </div>

              {/* Card 3 */}
              <div className="border-l-2 border-border pl-4 py-0.5">
                <p className="text-sm text-foreground font-semibold tracking-wide">
                  PUBLISHING LAYER
                </p>
                <span className="text-[11px] text-primary/70 block mt-1.5 font-normal">
                  Essays • Logs • Newsletters
                </span>
              </div>
            </div>

            {/* PAGE 2 */}
            <div className="w-full shrink-0 snap-start grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {/* Card 4 */}
              <div className="border-l-2 border-border pl-4 py-0.5">
                <p className="text-sm text-foreground font-semibold tracking-wide">
                  DEPLOYMENT LAYER
                </p>
                <span className="text-[11px] text-primary/70 block mt-1.5 font-normal">
                  Preview • Production • Delivery
                </span>
              </div>
              
              {/* Card 5 */}
              <div className="border-l-2 border-border pl-4 py-0.5">
                <p className="text-sm text-foreground font-semibold tracking-wide">
                  REVISION LAYER
                </p>
                <span className="text-[11px] text-primary/70 block mt-1.5 font-normal">
                  History • Versions • Records
                </span>
              </div>

              {/* Card 6 */}
              <div className="border-l-2 border-border pl-4 py-0.5">
                <p className="text-sm text-foreground font-semibold tracking-wide">
                  ARCHIVE LAYER
                </p>
                <span className="text-[11px] text-primary/70 block mt-1.5 font-normal">
                  Snapshots • Memory • Preservation
                </span>
              </div>
            </div>

          </div>

          {/* BOTTOM SACRED MOTTO - Closely associated visually, tight structural relationship */}
          <div className="mt-10 pt-4 border-t border-border text-center max-w-sm mx-auto">
            <p className="text-xs text-primary/70 italic tracking-wide leading-relaxed">
              &quot;Most systems fail because they grow faster than they are understood.&quot;
            </p>
          </div>

        </div>
      </section>

      {/* SOFTER LANDING ENDING TRANSITION SPACER */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-200/50 dark:via-neutral-900/20 to-transparent my-4" />

    </motion.div>
  );
}
