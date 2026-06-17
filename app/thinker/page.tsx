'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { getQuestions, getThoughtFragments, getBooks, getPosts } from '@/app/admin/actions';

// Authentically crafted, personal, student-first questions








export default function ThinkerPage() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [fragments, setFragments] = useState<any[]>([]);
  const [currentReads, setCurrentReads] = useState<any[]>([]);
  const [featuredEssays, setFeaturedEssays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const essaysSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const [qData, fData, bData, pData] = await Promise.all([
          getQuestions(),
          getThoughtFragments(),
          getBooks(),
          getPosts()
        ]);
        
        if (qData) {
          setQuestions(qData.filter((q:any) => !q.hidden).sort((a:any, b:any) => (a.order || 0) - (b.order || 0)).map((q:any) => q.text));
        }
        if (fData) {
          setFragments(fData.filter((f:any) => !f.hidden).sort((a:any, b:any) => (a.order || 0) - (b.order || 0)));
        }
        if (bData) {
          let visibleBooks = bData.filter((b:any) => !b.hidden);
          visibleBooks.sort((a:any, b:any) => {
             if (a.featured && !b.featured) return -1;
             if (!a.featured && b.featured) return 1;
             return 0;
          });
          setCurrentReads(visibleBooks);
        }
        if (pData) {
          let thinkerPosts = pData.filter((p:any) => p.persona?.toLowerCase() === 'thinker' && !p.hidden && !p.draft);
          thinkerPosts.sort((a:any, b:any) => {
             if (a.featured && !b.featured) return -1;
             if (!a.featured && b.featured) return 1;
             return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
          });
          
          setFeaturedEssays(thinkerPosts.map((p:any) => ({
             slug: p.slug || p.id,
             title: p.title,
             excerpt: p.excerpt || 'Read more.',
             readingTime: p.readingTime || '5 min read',
             category: (p.tags && p.tags[0]) || 'Notes'
          })));
        }
        
      } catch (e) {
        console.error("Error loading thinker data", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-12 text-center text-[#7E7A73] font-mono text-xs max-w-7xl mx-auto">Loading...</div>;

  const displayFeaturedEssays = featuredEssays;

  const scrollToEssays = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full font-sans dark:text-[#A7A39B] text-[#55524B] antialiased"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
        
        {/* ========================================================= */}
        {/* DESKTOP TWO-COLUMN LAYOUT (lg:grid) */}
        {/* ========================================================= */}
        <div className="hidden lg:grid grid-cols-12 gap-16 xl:gap-24 items-start">
          
          {/* LEFT COLUMN: Main thinking stream (8 columns) */}
          <div className="col-span-8 space-y-36 xl:space-y-44">
            
            {/* 1. HERO SECTION */}
            <section id="desktop-hero" className="min-h-[75vh] flex flex-col justify-center max-w-2xl">
              <span className="text-[10px] md:text-[11px] tracking-[0.2em] text-[#7E7A73] mb-6 block font-mono uppercase opacity-70">
                Persona // Thinker
              </span>
              <h1 className="text-4xl md:text-5xl xl:text-[52px] text-[#2F3134] dark:text-[#DEDAD3] tracking-wide font-cormorant font-normal leading-snug mb-8">
                Trying to understand people, technology, and stillness without simplifying them.
              </h1>
              <p className="text-[#55524B] dark:text-[#A7A39B] leading-[1.9] text-[15.5px] md:text-[17px] font-light mb-12 max-w-xl">
                This is where I collect questions, observations, notes, and ideas that seem worth exploring. Most of them are unfinished. Some of them are probably wrong. That&apos;s part of the process.
              </p>
              <div className="flex items-center gap-8">
                <a 
                  href="#desktop-featured"
                  onClick={scrollToEssays}
                  className="group text-[12px] tracking-widest uppercase font-mono text-[#2F3134] dark:text-[#DEDAD3] border-b border-[#2F3134] dark:border-[#DEDAD3] pb-1.5 inline-flex items-center gap-2 hover:opacity-75 transition-all duration-300"
                >
                  Explore Thoughts 
                  <span className="transform group-hover:translate-x-1 duration-300 transition-transform">↓</span>
                </a>
                
                <Link 
                  href="/thinker/about"
                  className="group text-[12px] tracking-widest uppercase font-mono text-[#7E7A73] border-b border-transparent pb-1.5 inline-flex items-center gap-2 hover:text-[#2F3134] dark:hover:text-[#DEDAD3] hover:border-[#2F3134] dark:hover:border-[#DEDAD3] transition-all duration-300"
                >
                  About This Space
                </Link>
              </div>
            </section>

            {/* 2. FEATURED ESSAYS */}
            <section id="desktop-featured" ref={essaysSectionRef} className="scroll-mt-28">
              <span className="text-[10px] md:text-[11px] tracking-[0.25em] text-[#7E7A73] dark:text-[#7E7A73] block font-mono uppercase opacity-70 mb-10 w-full border-b border-[#E2DFDA] dark:border-[rgba(255,255,255,0.03)] pb-3">
                Featured Essays
              </span>
              
              <div className="space-y-16">
                {displayFeaturedEssays.length === 0 && (
                  <div className="py-12 text-[#7F786F] dark:text-[#7E7A73] font-sans font-light italic">
                    Thoughts are still forming.
                  </div>
                )}
                {/* Primary Essay (01) */}
                {displayFeaturedEssays.slice(0, 1).map((essay) => (
                  <Link 
                    href={`/p/${essay.slug}`} 
                    key={essay.slug}
                    className="group block select-none"
                  >
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="text-[11px] font-mono text-[#7E7A73]">01</span>
                      <span className="text-[11px] tracking-[0.15em] text-[#7E7A73] font-mono uppercase">
                        {essay.category} &bull; {essay.readingTime}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-cormorant font-normal text-[#2F3134] dark:text-[#DEDAD3] tracking-wide mb-4 leading-tight group-hover:text-[#8E8A81] dark:group-hover:text-[#A7A39B] transition-colors duration-300">
                      {essay.title}
                    </h3>
                    <p className="text-[16px] text-[#55524B] dark:text-[#A7A39B] leading-[1.85] font-light max-w-2xl mb-6">
                      {essay.excerpt}
                    </p>
                    <span className="text-[12px] tracking-wider font-mono text-[#7E7A73]/80 group-hover:text-[#2F3134] dark:group-hover:text-[#DEDAD3] underline underline-offset-4 transition-colors duration-300">
                      Read notes &rarr;
                    </span>
                  </Link>
                ))}

                {/* Divider */}
                <div className="border-t border-[#E2DFDA]/60 dark:border-[rgba(255,255,255,0.03)] my-12" />

                {/* Secondary Essays (02 & 03) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                  {displayFeaturedEssays.slice(1).map((essay, index) => (
                    <Link 
                      href={`/p/${essay.slug}`} 
                      key={essay.slug}
                      className="group block select-none"
                    >
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-[10px] font-mono text-[#7E7A73]/70">0{index + 2}</span>
                        <span className="text-[10px] tracking-[0.1em] text-[#7E7A73] font-mono uppercase opacity-60">
                          {essay.category} &bull; {essay.readingTime}
                        </span>
                      </div>
                      <h4 className="text-xl md:text-2xl font-cormorant font-normal text-[#2F3134] dark:text-[#DEDAD3] tracking-wide mb-3 group-hover:text-[#8E8A81] dark:group-hover:text-[#A7A39B] transition-colors duration-300">
                        {essay.title}
                      </h4>
                      <p className="text-[14px] text-[#55524B] dark:text-[#A7A39B] leading-[1.75] font-light mb-4">
                        {essay.excerpt}
                      </p>
                      <span className="text-[11px] tracking-wider font-mono text-[#7E7A73]/80 group-hover:text-[#2F3134] dark:group-hover:text-[#DEDAD3] underline underline-offset-4 transition-colors duration-300">
                        Read notes &middot;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. THOUGHT FRAGMENTS */}
            <section id="desktop-fragments" className="scroll-mt-28">
              <span className="text-[10px] md:text-[11px] tracking-[0.25em] text-[#7E7A73] dark:text-[#7E7A73] block font-mono uppercase opacity-70 mb-10 w-full border-b border-[#E2DFDA] dark:border-[rgba(255,255,255,0.03)] pb-3">
                Thought Fragments
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {fragments.length === 0 && (
                  <div className="text-[#7F786F] dark:text-[#7E7A73] font-sans font-light italic col-span-2">
                    No fragments collected yet.
                  </div>
                )}
                {fragments.map((frag) => (
                  <div 
                    key={frag.id} 
                    className="border-l border-[#E2DFDA]/60 dark:border-[rgba(255,255,255,0.02)] pl-5 py-2 hover:border-[#7E7A73]/30 dark:hover:border-[#7E7A73]/20 transition-colors duration-300"
                  >
                    <span className="text-[9px] font-mono text-[#7E7A73]/60 uppercase tracking-wider block mb-2">
                      Observation // {frag.id}
                    </span>
                    <p className="text-[14px] md:text-[14.5px] font-sans font-light leading-[1.8] text-[#55524B] dark:text-[#A7A39B]">
                      {frag.text || frag.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. CLOSING REFLECTION */}
            {/* Added luxurious breathing room with pb-48 md:pb-60 between closing reflection and footer */}
            <section id="desktop-closing" className="border-t border-[#E2DFDA] dark:border-[rgba(255,255,255,0.04)] pt-16 pb-48 md:pb-60 w-full">
              <div className="max-w-xl">
                <span className="text-[15px] md:text-[17px] text-[#2F3134] dark:text-[#DEDAD3] font-cormorant italic block mb-6 leading-relaxed">
                  This space isn&apos;t a collection of answers.
                </span>
                <p className="text-[14px] text-[#7F786F] dark:text-[#7E7A73] font-light leading-[1.8] mb-8">
                  It&apos;s a record of questions, experiments, observations, and occasional mistakes.<br />
                  This much for now.<br />
                  Stay curious. Keep learning.
                </p>
                <Link 
                  href="/thinker/about" 
                  className="inline-block text-[11px] tracking-widest font-mono text-[#2F3134] dark:text-[#DEDAD3] uppercase border-b border-[#2F3134] dark:border-[#DEDAD3] pb-1 hover:opacity-70 transition-opacity"
                >
                  About The Thinker &rarr;
                </Link>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Sticky Thinker Sidebar (4 columns) */}
          <aside className="col-span-4 pl-8 xl:pl-12 border-l border-[#E2DFDA] dark:border-[rgba(255,255,255,0.04)] sticky top-24 self-start pb-10 space-y-14">
            
            {/* 1. QUESTIONS I'M EXPLORING */}
            <div>
              <span className="text-[10px] tracking-[0.25em] text-[#7E7A73] block font-mono uppercase mb-6">
                Questions I&apos;m Exploring
              </span>
              <div className="border-l border-[#7E7A73]/30 pl-4 space-y-4 font-cormorant italic text-[16.5px] leading-relaxed text-[#2F3134]/95 dark:text-[#DEDAD3]/90">
                {questions.length === 0 ? (
                  <p className="text-[#7F786F] dark:text-[#7E7A73] font-sans font-light italic text-[13.5px]">
                    Questions will appear here.
                  </p>
                ) : questions.map((q, idx) => (
                  <p key={idx} className="hover:opacity-80 duration-200 transition-opacity">
                    &bull; {q}
                  </p>
                ))}
              </div>
            </div>

            {/* 4. CURRENT READING */}
            {/* Kept permanently visible layout component in sidebar */}
            <div>
              <span className="text-[10px] tracking-[0.25em] text-[#7E7A73] block font-mono uppercase mb-6">
                Current Reading
              </span>
              <div className="space-y-4">
                {currentReads.length === 0 ? (
                  <div className="text-[13.5px] font-sans font-light text-[#7F786F] dark:text-[#7E7A73] italic">
                    Reading shelf is currently empty.
                  </div>
                ) : currentReads.map((book, idx) => (
                  <div key={idx} className="flex justify-between items-baseline gap-4">
                    <div>
                      <span className="text-[13.5px] font-sans font-light text-[#2F3134] dark:text-[#D7D4CE] block">
                        {book.title}
                      </span>
                      <span className="text-[11px] italic font-cormorant text-[#7E7A73]">
                        by {book.author}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] tracking-wider font-mono uppercase text-[#7E7A73]">
                        {book.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-dashed border-[#E2DFDA] dark:border-[rgba(255,255,255,0.03)] mt-4">
                <Link 
                  href="/thinker/reading"
                  className="group text-[12px] tracking-wider font-mono text-[#7E7A73]/90 hover:text-[#2F3134] dark:hover:text-[#DEDAD3] hover:underline underline-offset-4 transition-colors duration-300 inline-flex items-center gap-1"
                >
                  Explore Reading Shelf <span className="transform group-hover:translate-x-0.5 duration-300 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>

          </aside>

        </div>

        {/* ========================================================= */}
        {/* MOBILE ONE-COLUMN LAYOUT (lg:hidden) */}
        {/* ========================================================= */}
        <div className="lg:hidden space-y-16">
          
          {/* MOBILE 1. HERO */}
          <section id="mobile-hero" className="min-h-[60vh] flex flex-col justify-center">
            <span className="text-[10px] tracking-[0.2em] text-[#7E7A73] block font-mono uppercase mb-4">
              Persona // Thinker
            </span>
            <h1 className="text-3xl text-[#2F3134] dark:text-[#DEDAD3] tracking-wide font-cormorant font-normal leading-snug mb-6">
              Trying to understand people, technology, and stillness without simplifying them.
            </h1>
            <p className="text-[#55524B] dark:text-[#A7A39B] leading-[1.8] text-[15px] font-light mb-8 max-w-lg">
              This is where I collect questions, observations, notes, and ideas that seem worth exploring. Most of them are unfinished. Some of them are probably wrong. That&apos;s part of the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/thinker/about"
                className="group text-[12px] tracking-widest uppercase font-mono text-[#2F3134] dark:text-[#DEDAD3] border-b border-[#2F3134] dark:border-[#DEDAD3] pb-1 inline-flex items-center gap-1.5 hover:opacity-75 transition-all duration-300 w-fit"
              >
                About This Space &rarr;
              </Link>
            </div>
          </section>

          {/* MOBILE 4. QUESTIONS I&apos;M EXPLORING */}
          <section id="mobile-questions" className="border-t border-[#E2DFDA] dark:border-[rgba(255,255,255,0.03)] pt-12">
            <span className="text-[10px] tracking-[0.25em] text-[#7E7A73] block font-mono uppercase opacity-70 mb-6">
              Questions I&apos;m Exploring
            </span>
            <div className="border-l border-[#7E7A73]/40 pl-4 space-y-4 font-cormorant italic text-[16px] leading-relaxed text-[#2F3134] dark:text-[#DEDAD3]">
              {questions.length === 0 ? (
                <p className="text-[#7F786F] dark:text-[#7E7A73] font-sans font-light italic text-[13.5px]">
                  Questions will appear here.
                </p>
              ) : questions.map((q, idx) => (
                <p key={idx}>
                  &bull; {q}
                </p>
              ))}
            </div>
          </section>

          {/* MOBILE 5. FEATURED ESSAYS */}
          <section id="mobile-featured" className="border-t border-[#E2DFDA] dark:border-[rgba(255,255,255,0.03)] pt-12">
            <span className="text-[10px] tracking-[0.25em] text-[#7E7A73] block font-mono uppercase opacity-70 mb-8">
              Featured Essays
            </span>
            <div className="space-y-12">
              {displayFeaturedEssays.length === 0 && (
                <div className="text-[#7F786F] dark:text-[#7E7A73] font-sans font-light italic">
                  Thoughts are still forming.
                </div>
              )}
              {/* Primary Essay */}
              {displayFeaturedEssays.slice(0, 1).map((essay) => (
                <Link 
                  href={`/p/${essay.slug}`} 
                  key={essay.slug}
                  className="group block select-none"
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-[10px] font-mono text-[#7E7A73]">01</span>
                    <span className="text-[10.5px] tracking-[0.05em] text-[#7E7A73] font-mono uppercase opacity-70">
                      {essay.category} &bull; {essay.readingTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-cormorant font-normal text-[#2F3134] dark:text-[#DEDAD3] tracking-wide mb-3 leading-tight">
                    {essay.title}
                  </h3>
                  <p className="text-[14.5px] text-[#55524B] dark:text-[#A7A39B] leading-[1.8] font-light mb-4">
                    {essay.excerpt}
                  </p>
                  <span className="text-[11px] font-mono text-[#7E7A73] underline underline-offset-4">
                    Read notes &rarr;
                  </span>
                </Link>
              ))}

              <div className="border-t border-[#E2DFDA]/45 dark:border-[rgba(255,255,255,0.02)] my-8" />

              {/* Secondary Essays */}
              {displayFeaturedEssays.slice(1).map((essay, index) => (
                <Link 
                  href={`/p/${essay.slug}`} 
                  key={essay.slug}
                  className="group block select-none"
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-[10px] font-mono text-[#7E7A73]">0{index + 2}</span>
                    <span className="text-[10.5px] tracking-[0.05em] text-[#7E7A73] font-mono uppercase opacity-70">
                      {essay.category} &bull; {essay.readingTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-cormorant font-normal text-[#2F3134] dark:text-[#DEDAD3] tracking-wide mb-2">
                    {essay.title}
                  </h3>
                  <p className="text-[13.5px] text-[#55524B] dark:text-[#A7A39B] leading-[1.75] font-light mb-3">
                    {essay.excerpt}
                  </p>
                  <span className="text-[11px] font-mono text-[#7E7A73] underline underline-offset-4">
                    Read notes &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* MOBILE 6. THOUGHT FRAGMENTS */}
          <section id="mobile-fragments" className="border-t border-[#E2DFDA] dark:border-[rgba(255,255,255,0.03)] pt-12">
            <span className="text-[10px] tracking-[0.25em] text-[#7E7A73] block font-mono uppercase opacity-70 mb-8">
              Thought Fragments
            </span>
            <div className="space-y-6">
              {fragments.length === 0 && (
                <div className="text-[#7F786F] dark:text-[#7E7A73] font-sans font-light italic placeholder">
                  No fragments collected yet.
                </div>
              )}
              {fragments.map((frag) => (
                <div 
                  key={frag.id} 
                  className="border-l border-[#E2DFDA]/60 dark:border-[rgba(255,255,255,0.02)] pl-4 py-1.5"
                >
                  <span className="text-[8px] font-mono text-[#7E7A73]/60 uppercase tracking-wider block mb-1">
                    Observation // {frag.id}
                  </span>
                  <p className="text-[13.5px] font-sans font-light leading-[1.75] text-[#55524B] dark:text-[#A59E94]">
                    {frag.text || frag.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* MOBILE 7. CURRENT READING */}
          <section id="mobile-reading" className="border-t border-[#E2DFDA] dark:border-[rgba(255,255,255,0.03)] pt-12">
            <span className="text-[10px] tracking-[0.25em] text-[#7E7A73] block font-mono uppercase opacity-70 mb-6">
              Current Reading
            </span>
            <div className="space-y-4">
              {currentReads.length === 0 ? (
                <div className="text-[13.5px] font-sans font-light text-[#7F786F] dark:text-[#7E7A73] italic">
                  Reading shelf is currently empty.
                </div>
              ) : currentReads.map((book, idx) => (
                <div key={idx} className="flex justify-between items-baseline gap-4 pb-3 border-b border-[#E2DFDA]/30 dark:border-[rgba(255,255,255,0.01)]">
                  <div>
                    <span className="text-[13px] font-sans font-light text-[#2F3134] dark:text-[#D7D4CE] block">
                      {book.title}
                    </span>
                    <span className="text-[10.5px] italic font-cormorant text-[#7E7A73]">
                      by {book.author}
                    </span>
                  </div>
                  <span className="text-[8.5px] font-mono uppercase text-[#7E7A73]">
                    {book.status}
                  </span>
                </div>
              ))}
              <div className="pt-2">
                <Link 
                  href="/thinker/reading"
                  className="group text-[11.5px] tracking-wider font-mono text-[#7E7A73]/90 hover:text-[#2F3134] dark:hover:text-[#DEDAD3] hover:underline underline-offset-4 transition-colors duration-300 inline-flex items-center gap-1"
                >
                  Explore Reading Shelf <span className="transform group-hover:translate-x-0.5 duration-300 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>
          </section>

          {/* MOBILE 8. CLOSING REFLECTION */}
          {/* Added visual space before footer on mobile */}
          <section id="mobile-closing" className="border-t border-[#E2DFDA] dark:border-[rgba(255,255,255,0.03)] pt-12 pb-36">
            <span className="text-[14.5px] text-[#2F3134] dark:text-[#DEDAD3] font-cormorant italic block mb-4">
              This space isn&apos;t a collection of answers.
            </span>
            <p className="text-[13px] text-[#7F786F] dark:text-[#7E7A73] font-light leading-[1.75] mb-6">
              It&apos;s a record of questions, experiments, observations, and occasional mistakes.<br />
              This much for now.<br />
              Stay curious. Keep learning.
            </p>
            <Link 
              href="/thinker/about" 
              className="inline-block text-[11px] tracking-widest font-mono text-[#2F3134] dark:text-[#DEDAD3] uppercase border-b border-[#2F3134] dark:border-[#DEDAD3] pb-0.5"
            >
              About The Thinker &rarr;
            </Link>
          </section>

        </div>

      </div>
    </motion.div>
  );
}
