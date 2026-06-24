'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { PersonaSearch } from '@/components/persona-search';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import PHRASES from './phrases.json';
import QUOTES from './quotes.json';
import { getPersonaUrl } from '@/lib/utils';

// Components
function Typewriter() {
  const [text, setText] = useState("Kulesika");
  const [targetWord, setTargetWord] = useState("Kulesika");
  const [phase, setPhase] = useState<'paused' | 'deleting' | 'preparing' | 'typing'>('paused');
  const [validPhrases, setValidPhrases] = useState<string[]>(["Kulesika", ...PHRASES]);
  
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const phraseQueueRef = useRef<string[]>([]);

  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  useEffect(() => {
    const updateValidPhrases = () => {
      if (!containerRef.current || !measureRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const bodyPadding = parseInt(window.getComputedStyle(document.body).paddingRight || '0');
      const availableWidth = window.innerWidth - rect.left - bodyPadding - 32; // 32px safe margin
      
      const valid: string[] = ["Kulesika"];
      for (const phrase of PHRASES) {
        measureRef.current.textContent = phrase;
        if (measureRef.current.offsetWidth <= availableWidth) {
          valid.push(phrase);
        }
      }
      const finalValid = valid.length > 1 ? valid : ["Kulesika", "coder", "writer"];
      setValidPhrases(prev => {
        if (prev.length === finalValid.length && prev.every((v, i) => v === finalValid[i])) {
          return prev;
        }
        return finalValid;
      });
      // Only shuffle if it's completely empty or new valid phrases were applied
      if (phraseQueueRef.current.length === 0) {
        phraseQueueRef.current = shuffleArray(finalValid);
      }
    };

    const timer = setTimeout(updateValidPhrases, 100);
    window.addEventListener('resize', updateValidPhrases);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateValidPhrases);
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (phase === 'paused') {
      timeout = setTimeout(() => {
        setPhase('deleting');
      }, 4000);
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(prev => prev.slice(0, -1));
        }, Math.random() * 15 + 25);
      } else {
        if (phraseQueueRef.current.length === 0) {
          phraseQueueRef.current = shuffleArray(validPhrases);
        }
        const nextWord = phraseQueueRef.current.pop() || "Kulesika";
        setTargetWord(nextWord);
        setPhase('preparing');
      }
    } else if (phase === 'preparing') {
      timeout = setTimeout(() => {
        setPhase('typing');
      }, 600 + Math.random() * 300);
    } else if (phase === 'typing') {
      const targetChars = Array.from(targetWord);
      const currentChars = Array.from(text);
      if (currentChars.length < targetChars.length) {
        timeout = setTimeout(() => {
          setText(targetChars.slice(0, currentChars.length + 1).join(''));
        }, Math.random() * 40 + 60);
      } else {
        timeout = setTimeout(() => {
          setPhase('paused');
        }, 10);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [text, phase, targetWord, validPhrases]);

  return (
    <span ref={containerRef} className="flex items-center relative h-full">
      <span ref={measureRef} className="invisible absolute top-0 left-0 pointer-events-none whitespace-nowrap h-0 overflow-hidden"></span>
      <span className="italic text-primary whitespace-nowrap">{text}</span>
      <span className="animate-[pulse_1.5s_ease-in-out_infinite] text-primary/40 font-light ml-0.5 md:ml-1 -mt-1 font-serif text-[1.1em]">|</span>
    </span>
  );
}

function NavCard({ title, subtitle, desc, href }: { title: string, subtitle: string, desc: string, href: string }) {
  return (
    <Link href={href} className="flex flex-col justify-between group p-4 sm:p-5 md:p-6 lg:p-7 rounded-2xl border border-border bg-muted/50 hover:bg-muted hover:border-border transition-all duration-700 ease-out min-h-[110px] md:min-h-[170px]">
      <div className="flex justify-between items-start mb-4 md:mb-8">
        <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-primary uppercase">{title}</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-primary group-hover:text-foreground transition-colors duration-500" />
      </div>
      <div className="flex flex-col gap-1 md:gap-2">
        <span className="font-serif text-[17px] md:text-[19px] text-foreground group-hover:text-foreground transition-colors duration-500 tracking-tight">{subtitle}</span>
        <span className="font-sans font-light text-[13px] md:text-[14px] text-foreground/80 group-hover:text-foreground transition-colors duration-500 leading-snug">{desc}</span>
      </div>
    </Link>
  );
}

function Marquee({ children, reverse = false }: { children: React.ReactNode, reverse?: boolean }) {
  return (
    <div className="relative w-full overflow-hidden whitespace-nowrap py-2.5 md:py-5 border-y border-border bg-background">
      <div className={`flex w-max animate-marquee opacity-60 md:opacity-90 ${reverse ? '[animation-direction:reverse]' : ''}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center space-x-10 md:space-x-24 px-5 md:px-12 text-primary font-mono text-[8px] md:text-[10px] tracking-[0.25em] md:tracking-[0.2em] uppercase">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['thinker', 'wanderer']);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isGridMode, setIsGridMode] = useState(false);
  const [gridOpacity, setGridOpacity] = useState(1);
  const [quote, setQuote] = useState("Most people wait too long to begin.");

  const handleFocusChange = (focused: boolean) => {
    setIsInputFocused(focused);
    if (focused !== isGridMode) {
      setGridOpacity(0);
      setTimeout(() => {
        setIsGridMode(focused);
        setTimeout(() => {
          setGridOpacity(1);
        }, 50);
      }, 150); // 150ms fade out duration
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const newsletters = [
    { id: 'builder', persona: 'Builder', name: 'Forge', desc: 'code, systems, technology' },
    { id: 'operator', persona: 'Operator', name: 'Signal', desc: 'cybersecurity and digital infrastructure' },
    { id: 'thinker', persona: 'Thinker', name: 'Inside the Head', desc: 'philosophy, psychology, ideas' },
    { id: 'wanderer', persona: 'Wanderer', name: 'Scribble', desc: 'stories, travel, life experiences' }
  ];

  const toggleTopic = (cat: string) => {
    setSelectedTopics(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-background text-foreground flex flex-col font-sans overflow-x-hidden relative selection:bg-primary/20"
    >
      {/* Global Header */}
      <header className="fixed top-0 w-full p-4 md:p-6 flex justify-between items-center z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <Link href={getPersonaUrl('main')} className="font-sans font-bold tracking-widest flex items-center hover:opacity-70 transition-opacity uppercase text-current">
          BIRANCHI
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <DesktopNav persona="main" />
          <PersonaSearch mobileBgColor="bg-background" />
          <ThemeToggle />
          <MobileNav persona="main" mobileBgColor="bg-background" />
        </div>
      </header>

      {/* Viewport Height Cover for Hero + Marquee */}
      <div className="flex flex-col w-full h-auto md:min-h-screen">
        {/* --- Section 1: Hero --- */}
        <section className="flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-16 lg:px-24 pt-20 pb-8 md:pt-36 md:pb-16 relative w-full border-b border-border">
          <div className="mx-auto w-full max-w-[1200px] flex flex-col gap-8 md:gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="flex items-center text-[9vw] sm:text-[8vw] md:text-7xl lg:text-[7.5rem] xl:text-[8.5rem] font-serif font-light leading-[1.1] md:leading-[1.05] tracking-tight md:tracking-tighter text-foreground select-none whitespace-normal md:whitespace-nowrap flex-wrap md:flex-nowrap">
              <span className="pr-2.5 md:pr-4">Biranchi</span>
              <span className="relative inline-flex justify-start">
                <span className="invisible pointer-events-none">Kulesika</span>
                <span className="absolute inset-y-0 left-0 flex items-center">
                  <Typewriter />
                </span>
              </span>
            </h1>
          </motion.div>
          
          <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
              className="w-full flex justify-start md:-mt-2"
          >
              <p className="hidden md:block font-sans font-light text-[21px] text-primary leading-[1.65] w-full max-w-[700px] text-left tracking-tight">
                A personal ecosystem for building, thinking, writing, and documenting the things that continue to hold my attention.
              </p>
              <p className="block md:hidden font-sans font-light text-[17px] sm:text-[19px] text-primary leading-[1.5] w-full max-w-[300px] text-left tracking-wide">
                A personal ecosystem for building, thinking, writing, and documenting the things that continue to hold my attention.
              </p>
          </motion.div>
            
          <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 w-full mt-2 md:mt-6"
          >
              <NavCard title="Builder" subtitle="Forge" desc="Code, systems, and technology" href={getPersonaUrl('builder')} />
              <NavCard title="Operator" subtitle="Signal" desc="Cybersecurity and digital infrastructure" href={getPersonaUrl('operator')} />
              <NavCard title="Wanderer" subtitle="Scribble" desc="Stories, travel, and memory" href={getPersonaUrl('wanderer')} />
              <NavCard title="Thinker" subtitle="Inside the Head" desc="Ideas, psychology, and reflection" href={getPersonaUrl('thinker')} />
          </motion.div>
        </div>
      </section>

      {/* --- Marquee --- */}
      <Marquee>
        <span>Build slowly</span>
        <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
        <span>Clarity over hype</span>
        <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
        <span>Learn publicly</span>
        <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
        <span>Attention is a resource</span>
        <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
      </Marquee>
      </div>

      {/* Viewport Height Cover for Section 2 + Marquee */}
      <div className="flex flex-col w-full h-auto md:min-h-screen">
        {/* --- Section 2: About --- */}
        <section className="flex-1 flex flex-col justify-center px-5 sm:px-6 md:px-16 lg:px-24 pt-10 pb-8 md:pt-20 md:pb-16 border-b border-border relative overflow-hidden">
          {/* Subtle background glow with a tiny warmth element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-900-[0.03] sm:bg-amber-900/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-[1100px] mx-auto w-full relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 lg:gap-20 xl:gap-24">
            {/* Left Column: Large Quote */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="flex-1 lg:pr-8"
            >
              <h2 className="md:hidden font-mono text-[10px] tracking-widest text-primary uppercase mb-4 opacity-70">
                Operating Principles
              </h2>
              <p className="font-serif text-[2.25rem] md:text-[2.5rem] leading-[1.1] sm:text-5xl sm:leading-[1.1] lg:text-6xl lg:leading-[1.1] xl:text-[4.5rem] xl:leading-[1.05] text-foreground tracking-tight max-w-[12em] md:max-w-none mix-blend-plus-lighter">
                {quote}
              </p>
            </motion.div>

            {/* Right Column: Principles List */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full md:w-[380px] lg:w-[440px] shrink-0 flex flex-col gap-5 md:gap-12 md:border-l border-border md:pl-10 lg:pl-14 relative py-2"
            >
              {/* Desktop Only Label */}
              <h2 className="hidden md:block font-mono text-[10px] tracking-widest text-primary uppercase opacity-70">
                Operating Principles
              </h2>
              
              <ul className="flex flex-col gap-3.5 sm:gap-6 md:gap-8">
                <li className="flex items-start gap-4 sm:gap-5">
                  <span className="font-mono text-[10px] text-primary mt-1.5 shrink-0 w-6">01</span>
                  <p className="font-sans font-light text-foreground/80 text-[15px] md:text-lg leading-[1.5]">
                    Be kind. Don&apos;t be weak.
                  </p>
                </li>
                <li className="flex items-start gap-4 sm:gap-5">
                  <span className="font-mono text-[10px] text-primary mt-1.5 shrink-0 w-6">02</span>
                  <p className="font-sans font-light text-foreground/80 text-[15px] md:text-lg leading-[1.5]">
                    Attention is a resource. Protect it.
                  </p>
                </li>
                <li className="flex items-start gap-4 sm:gap-5">
                  <span className="font-mono text-[10px] text-primary mt-1.5 shrink-0 w-6">03</span>
                  <p className="font-sans font-light text-foreground/80 text-[15px] md:text-lg leading-[1.5]">
                    Stay curious. Keep learning.
                  </p>
                </li>
                <li className="flex items-start gap-4 sm:gap-5">
                  <span className="font-mono text-[10px] text-primary mt-1.5 shrink-0 w-6">04</span>
                  <p className="font-sans font-light text-foreground/80 text-[15px] md:text-lg leading-[1.5]">
                    Small habits shape identity.
                  </p>
                </li>
                <li className="flex items-start gap-4 sm:gap-5">
                  <span className="font-mono text-[10px] text-primary mt-1.5 shrink-0 w-6">05</span>
                  <p className="font-sans font-light text-foreground/80 text-[15px] md:text-lg leading-[1.5]">
                    Truth matters even when uncomfortable.
                  </p>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* --- Marquee --- */}
        <Marquee reverse>
          <span>Programming</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Cybersecurity</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Digital Philosophy</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Minimal Systems</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Psychology</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
        </Marquee>
      </div>

      {/* Viewport Height Cover for Section 3 + Marquee */}
      <div className="flex flex-col w-full relative h-auto md:min-h-screen">
        {/* --- Section 3: Current Focus --- */}
        <section className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-10 pb-10 md:pt-20 md:pb-16 border-b border-border">
          <div className="max-w-[1100px] mx-auto w-full relative z-10 flex flex-col justify-center h-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="mb-8 md:mb-20"
            >
              <h2 className="font-mono text-[10px] tracking-widest text-primary uppercase mb-4 md:mb-6 opacity-70">
                Current Focus
              </h2>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] text-foreground leading-[1.15] mb-4 md:mb-5 max-w-[12em] md:max-w-3xl tracking-tight text-balance md:text-left">
                What I&apos;m building, exploring,<br className="hidden md:block" /> and thinking about.
              </p>
              <p className="font-sans font-light text-primary/80 text-[15px] sm:text-lg max-w-2xl">
                Things that currently occupy my attention.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-12 lg:gap-20 w-full">
              {/* BUILDING */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="flex flex-col gap-3 md:gap-6"
              >
                <h3 className="font-mono text-[10px] tracking-[0.2em] text-primary uppercase">Building</h3>
                <ul className="flex flex-col gap-2.5 md:gap-3 font-sans font-light text-foreground/90 text-[15px] md:text-base leading-relaxed">
                  <li className="flex items-start gap-4"><span className="text-primary/50 text-[10px] mt-[5px] shrink-0">✦</span> Personal digital ecosystem</li>
                  <li className="flex items-start gap-4"><span className="text-primary/50 text-[10px] mt-[5px] shrink-0">✦</span> Minimal web experiences</li>
                  <li className="flex items-start gap-4"><span className="text-primary/50 text-[10px] mt-[5px] shrink-0">✦</span> AI workflows</li>
                </ul>
              </motion.div>

              {/* EXPLORING */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.1 }}
                className="flex flex-col gap-3 md:gap-6"
              >
                <h3 className="font-mono text-[10px] tracking-[0.2em] text-primary uppercase">Exploring</h3>
                <ul className="flex flex-col gap-2.5 md:gap-3 font-sans font-light text-foreground/90 text-[15px] md:text-base leading-relaxed">
                  <li className="flex items-start gap-4"><span className="text-primary/50 text-[10px] mt-[5px] shrink-0">✦</span> Digital identity</li>
                  <li className="flex items-start gap-4"><span className="text-primary/50 text-[10px] mt-[5px] shrink-0">✦</span> Human attention</li>
                  <li className="flex items-start gap-4"><span className="text-primary/50 text-[10px] mt-[5px] shrink-0">✦</span> Long-term thinking</li>
                </ul>
              </motion.div>

              {/* THINKING ABOUT */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2 }}
                className="flex flex-col gap-3 md:gap-6"
              >
                <h3 className="font-mono text-[10px] tracking-[0.2em] text-primary uppercase">Thinking About</h3>
                <ul className="flex flex-col gap-2.5 md:gap-3 font-sans font-light text-foreground/90 text-[15px] md:text-base leading-relaxed">
                  <li className="flex items-start gap-4"><span className="text-primary/50 text-[10px] mt-[5px] shrink-0">✦</span> Meaningful online presence</li>
                  <li className="flex items-start gap-4"><span className="text-primary/50 text-[10px] mt-[5px] shrink-0">✦</span> Technology and self-awareness</li>
                  <li className="flex items-start gap-4"><span className="text-primary/50 text-[10px] mt-[5px] shrink-0">✦</span> Creating without noise</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- Marquee --- */}
        <Marquee reverse={false}>
          <span>Digital Identity</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Systems</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Psychology</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Attention</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Minimalism</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Programming</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Thinking</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Philosophy</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Creativity</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
          <span>Long-Term Thinking</span>
          <span className="w-1.5 h-1.5 rounded-full dark:bg-stone-800 bg-stone-300" />
        </Marquee>
      </div>

      {/* Viewport Height Cover for Section 4 + Footer */}
      <div className="flex flex-col w-full relative h-auto md:min-h-screen">
        {/* Subtle Ambient Warmth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[600px] h-[600px] bg-amber-900/10 blur-[130px] rounded-full pointer-events-none opacity-50" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[400px] bg-amber-950/20 blur-[150px] rounded-[100%] pointer-events-none opacity-40 mix-blend-screen" />

        {/* --- Section 4: Newsletter Invitation --- */}
        <section className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 w-full relative z-10 pt-10 pb-8 md:pb-16 md:pt-0">
          <div className="w-full max-w-[1100px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-12 lg:gap-20 xl:gap-24">
            
            {/* Left text column */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1 }}
              className="flex-1 flex flex-col text-left lg:pr-8"
            >
              <h2 className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-primary uppercase mb-4 md:mb-6 opacity-70">
                Choose Your Corners
              </h2>
              <h3 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem] lg:text-[3.25rem] text-foreground mb-3 md:mb-5 tracking-tight leading-[1.1]">
                Choose what you want to hear about.
              </h3>
              <p className="font-sans font-light text-foreground/90 text-[15px] sm:text-[17px] leading-relaxed max-w-md">
                Thoughts, systems, stories, and ideas that stay with me long enough to write about.
              </p>
            </motion.div>

            {/* Right form column */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: 0.1 }}
              className={`w-full md:w-[380px] lg:w-[420px] shrink-0 flex flex-col mx-auto lg:mx-0 transition-transform duration-500 ${isInputFocused ? 'max-md:-translate-y-2' : ''}`}
            >
              <form className="w-full flex flex-col" onSubmit={(e) => e.preventDefault()}>
                
                <div 
                  className={`flex flex-col md:flex-col w-full sm:gap-1.5 md:mb-14 ${isGridMode ? 'max-md:grid max-md:grid-cols-2 max-md:gap-2 max-md:mb-4' : 'max-md:gap-0.5 max-md:mb-8'}`}
                  style={{ opacity: gridOpacity, transition: 'opacity 150ms ease-out' }}
                >
                  {newsletters.map(nl => {
                    const isSelected = selectedTopics.includes(nl.id);
                    return (
                      <button
                        key={nl.id}
                        type="button"
                        onPointerDown={(e) => {
                          // Prevent input from losing focus immediately on touch
                          e.preventDefault(); 
                        }}
                        onClick={() => toggleTopic(nl.id)}
                        className={`group flex items-start md:p-3.5 rounded-xl transition-colors duration-[400ms] text-left bg-muted/30 hover:bg-muted/80 relative md:-ml-3.5 md:w-[calc(100%+28px)] ${
                          isGridMode 
                            ? 'max-md:p-2.5 max-md:w-full max-md:border border-border' 
                            : 'max-md:p-3 max-md:-ml-3 max-md:w-[calc(100%+24px)]'
                        }`}
                      >
                        <div className={`shrink-0 w-[14px] h-[14px] rounded-[3px] border flex items-center justify-center transition-all duration-300 mt-[7px] mr-3.5 ${isSelected ? 'bg-primary border-primary text-background' : 'border-border group-hover:border-primary'}`}>
                          {isSelected && <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div className="flex flex-col relative w-full overflow-hidden">
                            <div className="flex flex-col relative top-[-1px] w-full">
                              <span className={`font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.25em] transition-all duration-[400ms] ease-out block origin-top w-full overflow-hidden ${isSelected ? 'text-primary' : 'text-primary/70 group-hover:text-primary'} ${isGridMode ? 'max-md:opacity-0 max-md:max-h-0' : 'max-md:opacity-100 max-md:max-h-[20px] max-md:mb-1.5 md:mb-1'}`}>{nl.persona}</span>
                              <p className="font-serif text-[16px] sm:text-[19px] leading-tight mt-0 md:mt-0 tracking-tight flex flex-wrap items-baseline md:gap-y-1 w-full">
                                <span className={`transition-colors duration-300 w-full md:w-auto ${isSelected ? 'text-foreground' : 'text-foreground/70 group-hover:text-foreground'}`}>{nl.name}</span>
                                <span className="text-primary/60 mx-2.5 font-sans hidden sm:inline">·</span>
                                <span className={`font-sans text-[13px] sm:text-[15px] font-light w-full sm:w-auto inline-block sm:inline overflow-hidden transition-all duration-[400ms] ease-out origin-top ${isSelected ? 'text-primary' : 'text-primary/70 group-hover:text-primary'} ${isGridMode ? 'max-md:opacity-0 max-md:max-h-0' : 'max-md:opacity-100 max-md:max-h-[30px] max-md:mt-0.5'}`}>{nl.desc}</span>
                              </p>
                            </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="relative group w-full mb-6 max-md:mt-2">
                  <input 
                    type="email"
                    name="newsletter-email"
                    id="newsletter-email"
                    autoComplete="email"
                    data-1p-ignore="true"
                    data-lpignore="true" 
                    placeholder="Enter your email address" 
                    onFocus={() => handleFocusChange(true)}
                    onBlur={() => handleFocusChange(false)}
                    className="w-full bg-transparent border-b border-border px-1 py-4 text-foreground focus:outline-none focus:border-primary transition-colors duration-500 font-sans text-[16px] font-light placeholder:text-primary/80 rounded-none shadow-none"
                    required
                  />
                  <button 
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-foreground transition-colors active:scale-95"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
                  </button>
                </div>
                <p className="text-primary font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] opacity-60 ml-1">
                  Low frequency. High signal.
                </p>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Global Footer */}
        <footer className="w-full px-6 md:px-16 lg:px-24 py-6 md:py-14 flex flex-col md:flex-row justify-between items-center gap-5 md:gap-4 z-50 bg-transparent border-t border-border">
          
          {/* Left */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="md:flex-1 flex justify-center md:justify-start order-1 text-center md:text-left"
          >
            <span className="font-sans font-light text-[14px] text-primary/80">
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
            <span className="font-serif text-[15px] md:text-[16px] text-primary tracking-wide">
              Biranchi Kulesika
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary/70">
              India · 2026
            </span>
          </motion.div>

          {/* Right */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="md:flex-1 flex justify-center md:justify-end items-center gap-5 md:gap-6 order-3 font-sans font-light text-[14px] text-primary/80"
          >
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors duration-500">
              GitHub
            </a>
            <span className="text-primary/40 md:hidden">·</span>
            <a href="mailto:#" className="hover:text-foreground transition-colors duration-500">
              Email
            </a>
          </motion.div>

        </footer>
      </div>
    </motion.div>
  );
}
