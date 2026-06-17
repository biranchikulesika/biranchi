'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { PersonaSearch } from '@/components/persona-search';
import { getPersonaUrl } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

function CornerCard({ title, subtitle, desc, href, type }: { title: string, subtitle: string, desc: string, href: string, type: 'builder' | 'operator' | 'thinker' | 'wanderer' }) {
  const hoverStyles = {
    builder: "hover:dark:bg-stone-900/40 hover:bg-white/90 hover:dark:border-stone-700/80 hover:border-stone-400 transition-all duration-200 ease-out",
    operator: "hover:dark:bg-stone-900/30 hover:bg-white/90 hover:dark:border-stone-500/90 hover:border-stone-400 transition-all duration-300 ease-out",
    thinker: "hover:dark:bg-stone-900/20 hover:bg-white/90 hover:dark:border-stone-800/80 hover:border-stone-400 transition-colors duration-1000 ease-in-out",
    wanderer: "hover:dark:bg-stone-900/10 hover:bg-white/90 hover:dark:border-stone-800/60 hover:border-stone-400 hover:-translate-y-[1px] transition-all duration-700 ease-out"
  }[type];

  return (
    <Link href={href} className={`flex flex-col justify-between group p-5 md:p-7 rounded-2xl border dark:border-stone-800/40 border-[#ECEBE6] dark:bg-stone-900/10 bg-[#E8E6DF] ${hoverStyles}`}>
      <div className="flex justify-between items-start mb-5 md:mb-8">
        <span className="font-mono text-[10px] tracking-[0.2em] dark:text-stone-500 text-[#6E6A64] uppercase">{title}</span>
        <ArrowUpRight className="w-4 h-4 dark:text-stone-650 text-[#6E6A64] group-hover:dark:text-stone-400 group-hover:text-stone-900 transition-colors duration-500" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-serif text-xl md:text-2xl dark:text-stone-200 text-[#2B2B28] group-hover:dark:text-stone-100 group-hover:text-stone-950 transition-colors duration-500 tracking-tight">{subtitle}</span>
        <span className="font-sans font-light text-[15px] md:text-[16px] dark:text-stone-500/90 text-[#6E6A64]/90 group-hover:dark:text-stone-400 group-hover:text-stone-800 transition-colors duration-500 leading-relaxed">{desc}</span>
      </div>
    </Link>
  );
}

export default function AboutPage() {
  const details = [
    "Linux", "Late nights", "Curiosity", "Journaling", "Writing things down", 
    "Pop music", "Observing people", "Landscapes", "Storytelling", "Integrity", 
    "Authenticity", "Long walks", "Systems thinking", "Slow internet", "Thoughtful conversations"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full dark:bg-[#050505] bg-[#F5F5F2] dark:text-[#e5e5e5] text-[#2B2B28] flex flex-col font-sans overflow-x-hidden relative dark:selection:bg-stone-800 selection:bg-stone-300 dark:selection:text-white selection:text-black"
    >
      {/* Global Header */}
      <header className="fixed top-0 w-full p-4 md:p-6 flex justify-between items-center z-50 dark:bg-[#050505]/80 bg-[#F5F5F2]/80 backdrop-blur-md border-b dark:border-stone-900/50 border-[#ECEBE6]">
        <Link href={getPersonaUrl('main')} className="font-sans font-bold tracking-widest flex items-center hover:opacity-70 transition-opacity uppercase text-current">
          BIRANCHI
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <DesktopNav persona="main" />
          <PersonaSearch mobileBgColor="dark:bg-[#050505] bg-[#F5F5F2]" />
          <ThemeToggle />
          <MobileNav persona="main" mobileBgColor="dark:bg-[#050505] bg-[#F5F5F2]" />
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full relative pt-24 md:pt-32">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-amber-900/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* SECTION 1 — HERO */}
        <section className="px-6 md:px-16 lg:px-24 py-10 sm:py-12 md:py-16 relative z-10 w-full max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            <span className="font-mono text-[10px] tracking-[0.2em] dark:text-[#8c8273] text-[#7A746B] uppercase mb-6 md:mb-8 block opacity-80">
              ABOUT
            </span>
            <h1 className="font-serif text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[4rem] leading-[1.1] dark:text-stone-100 text-[#2B2B28] tracking-tight mb-6 md:mb-10">
              A personal ecosystem shaped by curiosity, systems, stories, and reflection.
            </h1>
            <p className="font-sans font-light dark:text-stone-400/90 text-[#6E6A64]/90 text-lg md:text-xl leading-[1.8] max-w-[650px] mb-6">
              I built this space to separate the different things that continue to occupy my attention. Some corners are focused on systems and technology. Others hold stories, observations, unfinished thoughts, and quieter reflections.
            </p>
            <p className="font-sans font-light dark:text-stone-500/70 text-[#6E6A64]/70 text-[15px] md:text-[16px] max-w-[650px]">
              The internet rewards compressed identities. This space exists to resist that.
            </p>
          </motion.div>
        </section>

        {/* SECTION 2 — WHO I AM */}
        <section className="px-6 md:px-16 lg:px-24 py-10 sm:py-12 md:py-16 relative z-10 w-full max-w-[900px] mx-auto border-t dark:border-stone-900/50 border-[#ECEBE6]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-10"
          >
            <h2 className="font-serif text-2xl md:text-3xl dark:text-stone-200 text-[#2B2B28]">Who I am</h2>
            <div className="flex flex-col gap-6 font-sans font-light dark:text-stone-400/90 text-[#6E6A64]/90 text-lg leading-[1.8]">
              <p>
                I spend most of my time thinking about systems, writing things down, exploring technology, and trying to understand how people behave around the tools they create.
              </p>
              <p>
                I&apos;m Biranchi, an Integrated MCA student from Odisha, India. Most of this ecosystem grew from curiosity, observation, experimentation, and the habit of documenting thoughts before they disappear.
              </p>
              <p>
                This space is less about presenting a polished identity and more about documenting an evolving one. I prefer building slowly, thinking carefully, and sharing things that feel honest enough to stay online for a long time.
              </p>
            </div>
          </motion.div>
        </section>

        {/* SECTION 3 — WHY THIS EXISTS */}
        <section className="px-6 md:px-16 lg:px-24 py-10 sm:py-12 md:py-16 relative z-10 w-full max-w-[900px] mx-auto border-t dark:border-stone-900/50 border-[#ECEBE6]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-10"
          >
            <h2 className="font-serif text-2xl md:text-3xl dark:text-stone-200 text-[#2B2B28]">Why this exists</h2>
            <div className="flex flex-col gap-6 font-sans font-light dark:text-stone-300/90 text-[#2B2B28]/90 text-lg leading-[1.8]">
              <p>
                The modern internet often rewards speed, noise, and constant performance. I wanted to create something quieter. A space where different parts of my interests could exist without collapsing into one flattened online identity.
              </p>
              <p>
                Each corner of this ecosystem focuses on a different mode of thinking. Together, they form a more complete picture of how I learn, build, observe, and reflect.
              </p>
              <p>
                Some thoughts survive better when they are given their own room.
              </p>
            </div>
          </motion.div>
        </section>

        {/* SECTION 4 — THE FOUR CORNERS */}
        <section className="px-6 md:px-16 lg:px-24 py-10 sm:py-12 md:py-16 relative z-10 w-full max-w-[1100px] mx-auto border-t dark:border-stone-900/50 border-[#ECEBE6]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="flex flex-col"
          >
            <h2 className="font-serif text-2xl md:text-3xl dark:text-stone-200 text-[#2B2B28] mb-8 md:mb-10 text-center md:text-left">The four corners</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              <CornerCard 
                title="Builder" 
                subtitle="Forge" 
                desc="Systems, code, workflows, experimentation, and the process of building things carefully over time." 
                href={getPersonaUrl('builder', '/')} 
                type="builder"
              />
              <CornerCard 
                title="Operator" 
                subtitle="Signal" 
                desc="Cybersecurity, infrastructure, digital systems, operational thinking, and understanding what exists beneath interfaces." 
                href={getPersonaUrl('operator', '/')} 
                type="operator"
              />
              <CornerCard 
                title="Thinker" 
                subtitle="Inside the Head" 
                desc="Reflection, psychology, philosophy, overthinking, internal dialogue, and ideas that stay long enough to be written down." 
                href={getPersonaUrl('thinker', '/')} 
                type="thinker"
              />
              <CornerCard 
                title="Wanderer" 
                subtitle="Scribble" 
                desc="Stories, memory, travel, lived moments, observations, and fragments collected along the way." 
                href={getPersonaUrl('wanderer', '/')} 
                type="wanderer"
              />
            </div>
          </motion.div>
        </section>

        {/* SECTION 5 — HOW I USE THE INTERNET */}
        <section className="px-6 md:px-16 lg:px-24 py-10 sm:py-12 md:py-16 relative z-10 w-full max-w-[900px] mx-auto border-t dark:border-stone-900/50 border-[#ECEBE6]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-10"
          >
            <h2 className="font-serif text-2xl md:text-3xl dark:text-stone-200 text-[#2B2B28]">How I use the<br className="hidden md:block"/> internet</h2>
            <div className="flex flex-col gap-6 font-sans font-light dark:text-stone-400/90 text-[#6E6A64]/90 text-lg leading-[1.8]">
              <p>
                I think a lot about digital identity, attention, and how people present themselves online. This ecosystem is my attempt at creating a slower and more intentional presence on the internet.
              </p>
              <p>
                Instead of trying to compress everything into one personality, I prefer separating different interests into different spaces while still keeping them connected to the same human underneath.
              </p>
            </div>
          </motion.div>
        </section>

        {/* SECTION 6 — SMALL HUMAN DETAILS */}
        <section className="px-6 md:px-16 lg:px-24 py-8 sm:py-10 md:py-14 relative z-10 w-full max-w-[900px] mx-auto border-t dark:border-stone-900/50 border-[#ECEBE6]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center text-center"
          >
            <h2 className="font-mono text-[10px] tracking-[0.2em] dark:text-stone-500 text-[#6E6A64] uppercase mb-6 md:mb-8">Small details</h2>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 md:gap-x-6 md:gap-y-4 max-w-[650px]">
              {details.map((detail, i) => (
                <span key={i} className="font-serif italic text-[17px] md:text-[18px] dark:text-stone-400/80 text-[#6E6A64]/80 transform md:-rotate-1 hover:-translate-y-[1px] opacity-80 hover:opacity-100 transition-all duration-300">
                  {detail}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

      </main>

      {/* Global Footer */}
      <footer className="w-full px-6 md:px-16 lg:px-24 py-6 md:py-14 flex flex-col md:flex-row justify-between items-center gap-5 md:gap-4 z-50 bg-transparent border-t dark:border-stone-800/20 border-[#ECEBE6]">
        
        {/* Left */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="md:flex-1 flex justify-center md:justify-start order-1 text-center md:text-left"
        >
          <span className="font-sans font-light text-[14px] dark:text-stone-500/60 text-[#6E6A64]/60">
            Most things take longer than expected.
          </span>
        </motion.div>

        {/* Center */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="md:flex-1 flex flex-col items-center gap-1 order-2 text-center"
        >
          <span className="font-serif text-[15px] md:text-[16px] dark:text-stone-500/70 text-[#6E6A64]/70 tracking-wide">
            Biranchi Kulesika
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] dark:text-stone-600/50 text-[#6E6A64]/50">
            India · 2026
          </span>
        </motion.div>

        {/* Right */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="md:flex-1 flex justify-center md:justify-end items-center gap-5 md:gap-6 order-3 font-sans font-light text-[14px] dark:text-stone-500/60 text-[#6E6A64]/60"
        >
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:dark:text-stone-400 hover:text-stone-900 transition-colors duration-500">
            GitHub
          </a>
          <span className="dark:text-stone-800/50 text-[#6E6A64]/40 md:hidden">·</span>
          <a href="mailto:#" className="hover:dark:text-stone-400 hover:text-stone-900 transition-colors duration-500">
            Email
          </a>
        </motion.div>

      </footer>
    </motion.div>
  );
}
