'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getFragments } from '@/lib/queries';
import { getJournalMoments } from '@/lib/queries';
import { getPostsMeta } from '@/lib/queries';
import { getPersonaUrl } from '@/lib/utils';

// Poetry and Fragments for the interactive cyclical button


// Curated LATEST POSTS with exact text and evocative images


// OLD REFLECTIONS & ARCHIVE with exact text split natively for elegance


export default function WandererPage() {
  const [fragmentIndex, setFragmentIndex] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  
  const [fragmentsData, setFragmentsData] = useState<string[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [archiveEntries, setArchiveEntries] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [fData, jData, pData] = await Promise.all([
          getFragments(),
          getJournalMoments(),
          getPostsMeta()
        ]);
        
        let frags = [];
        if (fData && fData.length > 0) {
          frags = fData.filter((f:any) => !f.hidden).sort((a:any, b:any) => (a.order || 0) - (b.order || 0)).map((f:any) => f.text || f.content);
        }
        setFragmentsData(frags);
        
        if (pData) {
          let visiblePosts = pData.filter((p:any) => !p.hidden && p.status !== 'draft' && (!p.status || p.status.toLowerCase() !== 'draft') && p.persona?.toLowerCase() === 'wanderer');

          const allPosts = visiblePosts.sort((a:any, b:any) => {
             if (a.featured && !b.featured) return -1;
             if (!a.featured && b.featured) return 1;
             return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
          });
          
          const latest = allPosts.slice(0, 3).map((p:any) => ({
             slug: p.slug || p.id,
             date: p.publishedAt || 'Unknown',
             title: p.title,
             excerpt: p.excerpt || 'Quiet reflection.',
             thumbnailUrl: p.coverImageUrl || p.coverImage || null,
             thumbnailAlt: p.title || 'Thumbnail'
          }));
          setLatestPosts(latest);
          
          const archive = allPosts.slice(3).map((p:any) => ({
             title: p.title,
             date: p.publishedAt || 'Unknown',
             slug: p.slug || p.id
          }));
          setArchiveEntries(archive);
        }
        
      } catch (e) {
        console.error("Error loading wanderer data", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleNextFragment = () => {
    if(fragmentsData.length > 0) setFragmentIndex((prev) => (prev + 1) % fragmentsData.length);
  };

  if (loading) return <div className="p-12 text-center text-primary/70 font-mono text-xs max-w-6xl mx-auto min-h-screen">Loading...</div>;

  const currentFrags = fragmentsData.length > 0 ? fragmentsData : [];
  const displayLatest = latestPosts;
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
      className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14 py-12 lg:py-24 relative font-spectral"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* LEFT SIDE: MAIN READING FLOW */}
        <div className="lg:col-span-8 space-y-20 lg:space-y-32">
          
          {/* HERO SECTION */}
          <header className="max-w-2xl select-none">
            <span id="hero-eyebrow" className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.25em] dark:text-[#B97A56] text-[#B67A55] block mb-4 md:mb-5 opacity-80">
              VOLUME IV • WANDERER
            </span>
            <h1 id="hero-heading" className="text-4xl sm:text-4.5xl md:text-5xl italic dark:text-[#E1D5C8] text-[#43382F] font-cormorant tracking-tight leading-tight mb-5">
              Wanderer
            </h1>
            <p id="hero-description" className="dark:text-[#B6A798]/90 text-[#8A7C70] leading-[1.85] text-[15.5px] sm:text-[16.5px] font-light italic mb-8 max-w-xl">
              I write about the places I pass through, the thoughts I cannot carry forever, and the quiet moments that stay with me longer than expected.
            </p>

            {/* Currently Block - Made much more subtle & quiet */}
            <div id="currently-status-box" className="flex items-start gap-4 border-l border-[#B67A55]/20 dark:border-[#B97A56]/20 pl-4 py-1 select-none max-w-lg">
              <div className="flex flex-col">
                <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#B67A55]/70 dark:text-[#B97A56]/75 mb-1 font-medium">
                  CURRENTLY:
                </span>
                <span className="font-spectral text-[13.5px] text-[#63554A] dark:text-[#B6A798]/80 italic leading-relaxed">
                  I have been trying to sit with silence instead of escaping into distractions.
                </span>
              </div>
            </div>
          </header>

          {/* LATEST REFLECTIONS SECTION */}
          <section id="latest-reflections" className="space-y-16 lg:space-y-20">
            <div className="border-b border-[#E5DCCF] dark:border-[#E5DCCF]/15 pb-1.5 select-none">
              <h2 className="font-sans text-[9.5px] uppercase tracking-[0.25em] dark:text-[#B97A56]/85 text-[#B67A55]/85 font-medium tracking-widest block">
                LATEST REFLECTIONS
              </h2>
            </div>

            <div className="space-y-16 lg:space-y-32">
              {displayLatest.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center opacity-60">
                   <p className="font-spectral text-lg italic text-[#8A7C70] dark:text-[#B6A798]">No stories have been shared yet.</p>
                </div>
              ) : displayLatest.map((post, index) => {
                // Break standard rigid alternating rhythm using controlled asymmetrical structures
                // Post 0: Image on left (5 cols), text on right (7 cols) - classic anchor
                // Post 1: Text on left (7 cols), empty gap (1 col), Small image on right (4 cols)
                // Post 2: Image on left (4 cols), empty gap (1 col), text on right (7 cols)
                return (
                  <article key={post.slug} className={`group ${index === 0 ? 'mb-16 lg:mb-28' : index === 1 ? 'mb-20 lg:mb-32' : 'mb-0'}`}>
                    
                    {/* Mobile view post structure - Completely simplified and beautiful */}
                    <div className="block lg:hidden space-y-4">
                      {/* [thumbnail] */}
                      <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#EAE3D5] dark:bg-[#15110E] border border-[#E5DCCF] dark:border-[#E5DCCF]/15 rounded-[1px]">
                        {post.thumbnailUrl ? (
                          <Image
                            src={post.thumbnailUrl}
                            alt={post.thumbnailAlt}
                            fill
                            sizes="(max-w-768px) 100vw, 800px"
                            referrerPolicy="no-referrer"
                            className="object-cover w-full h-full filter grayscale-[22%] contrast-[88%] sepia-[12%] saturate-[75%] brightness-[92%] dark:brightness-[76%]"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-[#EAE3D5] to-[#D5CDBD] dark:from-[#15110E] dark:to-[#221C16]" />
                        )}
                      </div>
                      {/* [title] */}
                      <Link href={`/p/${post.slug}`}>
                        <h3 className="font-cormorant italic text-xl font-normal leading-tight text-[#43382F] dark:text-[#DDD2C5] active:text-[#B67A55] mb-2 pt-1 transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      {/* [excerpt] */}
                      <p className="font-spectral font-light text-[14.5px] leading-relaxed text-[#8A7C70] dark:text-[#B6A798]/90 italic">
                        {post.excerpt}
                      </p>
                      {/* [metadata] - quieted down opacity and tracking */}
                      <div className="text-[9.5px] font-mono tracking-normal text-[#8A7C70]/60 dark:text-[#B6A798]/50 uppercase pt-1">
                        {post.date}
                      </div>
                    </div>

                    {/* Desktop view post structure - Controlled Irregular Asymmetry */}
                    <div className="hidden lg:grid lg:grid-cols-12 gap-0 items-center">
                      {index === 0 && (
                        <>
                          {/* Post 1: Image Left, Text Right */}
                          <div className="lg:col-span-5 pr-10">
                            <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#EAE3D5] dark:bg-[#15110E] border border-[#E5DCCF] dark:border-[#E5DCCF]/15 rounded-[1px] shadow-[0_1px_8px_rgba(0,0,0,0.015)] my-2">
                              {post.thumbnailUrl ? (
                                <Image
                                  src={post.thumbnailUrl}
                                  alt={post.thumbnailAlt}
                                  fill
                                  sizes="320px"
                                  referrerPolicy="no-referrer"
                                  className="object-cover w-full h-full filter grayscale-[22%] contrast-[88%] sepia-[12%] saturate-[75%] brightness-[92%] dark:brightness-[76%] group-hover:grayscale-[8%] group-hover:brightness-[94%] dark:group-hover:brightness-[84%] transition-all duration-700 ease-in-out"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-[#EAE3D5] to-[#D5CDBD] dark:from-[#15110E] dark:to-[#221C16]" />
                              )}
                            </div>
                          </div>
                          <div className="lg:col-span-7 flex flex-col justify-center">
                            <div className="text-[9.5px] font-mono tracking-normal text-[#8A7C70]/60 dark:text-[#B6A798]/50 mb-2.5">
                              {post.date}
                            </div>
                            <Link href={`/p/${post.slug}`}>
                              <h3 className="font-cormorant italic text-[22.5px] font-normal leading-tight text-[#43382F] dark:text-[#DDD2C5] hover:text-[#B67A55] dark:hover:text-[#B97A56] duration-500 transition-colors mb-3.5">
                                {post.title}
                              </h3>
                            </Link>
                            <p className="font-spectral font-light text-[15px] leading-[1.85] text-[#8A7C70] dark:text-[#B6A798]/90 italic max-w-lg">
                              {post.excerpt}
                            </p>
                          </div>
                        </>
                      )}

                      {index === 1 && (
                        <>
                          {/* Post 2: Text Left (Denser, Wider), Gap, Small Image Right */}
                          <div className="lg:col-span-7 flex flex-col justify-center pr-6">
                            <div className="text-[9.5px] font-mono tracking-normal text-[#8A7C70]/60 dark:text-[#B6A798]/50 mb-2.5">
                              {post.date}
                            </div>
                            <Link href={`/p/${post.slug}`}>
                              <h3 className="font-cormorant italic text-[22.5px] font-normal leading-tight text-[#43382F] dark:text-[#DDD2C5] hover:text-[#B67A55] dark:hover:text-[#B97A56] duration-500 transition-colors mb-3.5">
                                {post.title}
                              </h3>
                            </Link>
                            <p className="font-spectral font-light text-[15px] leading-[1.85] text-[#8A7C70] dark:text-[#B6A798]/90 italic max-w-xl">
                              {post.excerpt}
                            </p>
                          </div>
                          
                          {/* 1 col empty buffer to let layout breathe */}
                          <div className="lg:col-span-1" />

                          <div className="lg:col-span-4">
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE3D5] dark:bg-[#15110E] border border-[#E5DCCF] dark:border-[#E5DCCF]/15 rounded-[1px] my-1 opacity-90">
                              {post.thumbnailUrl ? (
                                <Image
                                  src={post.thumbnailUrl}
                                  alt={post.thumbnailAlt}
                                  fill
                                  sizes="260px"
                                  referrerPolicy="no-referrer"
                                  className="object-cover w-full h-full filter grayscale-[25%] contrast-[86%] sepia-[14%] saturate-[70%] brightness-[90%] dark:brightness-[74%] group-hover:grayscale-[5%] group-hover:brightness-[93%] dark:group-hover:brightness-[81%] transition-all duration-700 ease-in-out"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-[#EAE3D5] to-[#D5CDBD] dark:from-[#15110E] dark:to-[#221C16]" />
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {index === 2 && (
                        <>
                          {/* Post 3: Alternate Ratio Image Left, Gap, Text Right */}
                          <div className="lg:col-span-4">
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE3D5] dark:bg-[#15110E] border border-[#E5DCCF] dark:border-[#E5DCCF]/15 rounded-[1px] shadow-[0_1px_8px_rgba(0,0,0,0.015)] my-2">
                              {post.thumbnailUrl ? (
                                <Image
                                  src={post.thumbnailUrl}
                                  alt={post.thumbnailAlt}
                                  fill
                                  sizes="320px"
                                  referrerPolicy="no-referrer"
                                  className="object-cover w-full h-full filter grayscale-[22%] contrast-[88%] sepia-[12%] saturate-[75%] brightness-[92%] dark:brightness-[76%] group-hover:grayscale-[8%] group-hover:brightness-[94%] dark:group-hover:brightness-[84%] transition-all duration-700 ease-in-out"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-[#EAE3D5] to-[#D5CDBD] dark:from-[#15110E] dark:to-[#221C16]" />
                              )}
                            </div>
                          </div>

                          {/* 1 col empty buffer to break the alternating rhythm expectations */}
                          <div className="lg:col-span-1" />

                          <div className="lg:col-span-7 flex flex-col justify-center">
                            <div className="text-[9.5px] font-mono tracking-normal text-[#8A7C70]/60 dark:text-[#B6A798]/50 mb-2.5">
                              {post.date}
                            </div>
                            <Link href={`/p/${post.slug}`}>
                              <h3 className="font-cormorant italic text-[22.5px] font-normal leading-tight text-[#43382F] dark:text-[#DDD2C5] hover:text-[#B67A55] dark:hover:text-[#B97A56] duration-500 transition-colors mb-3.5">
                                {post.title}
                              </h3>
                            </Link>
                            <p className="font-spectral font-light text-[15px] leading-[1.85] text-[#8A7C70] dark:text-[#B6A798]/90 italic max-w-xl">
                              {post.excerpt}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                  </article>
                );
              })}
            </div>
          </section>

          {/* FRAGMENT SECTION - Quietly blended instead of isolated block */}
          <section id="fragment-section" className="py-20 lg:py-28 relative overflow-hidden select-none border-t border-[#E5DCCF]/10 dark:border-[#26201B]/10">
            <div className="flex items-center justify-between mb-8 opacity-75">
              <span className="text-[9.5px] font-sans tracking-[0.25em] text-[#B67A55]/70 dark:text-[#B97A56]/70 uppercase font-medium">
                FRAGMENT • NO. 8
              </span>
              <button 
                onClick={handleNextFragment}
                className="text-[9.5px] font-sans uppercase tracking-[0.1em] text-[#8A7C70]/80 dark:text-[#B6A798]/75 hover:text-[#B67A55] dark:hover:text-[#B97A56] underline cursor-pointer duration-300 transition-colors bg-transparent border-none p-0"
                id="fragment-cycle-button"
              >
                READ ANOTHER
              </button>
            </div>

            <div className="min-h-[70px] flex items-center pr-4">
              <p className="text-[17.5px] sm:text-lg italic font-light text-[#43382F] dark:text-[#E1D5C8] leading-relaxed max-w-xl pl-5 border-l border-[#B67A55]/20 dark:border-[#B97A56]/20 transition-all duration-500 ease-in-out">
                {currentFrags.length > 0 ? `“${currentFrags[fragmentIndex]}”` : "No fragments collected yet."}
              </p>
            </div>
          </section>

          {/* MOBILE EMAIL SIGNUP (Renders purely inline on mobile view only) */}
          <section id="mobile-letters-signup" className="block lg:hidden py-10 border-t border-[#E5DCCF] dark:border-[#E5DCCF]/15 select-none">
            <span className="text-[10px] font-sans tracking-[0.2em] text-[#B67A55]/80 dark:text-[#B97A56]/80 uppercase font-medium block mb-4">
              LETTERS
            </span>
            <p className="font-spectral font-light text-[14px] leading-relaxed dark:text-[#B6A798]/90 text-[#8A7C70] italic mb-6">
              Sometimes I send quiet letters about memories, places, unfinished thoughts, and the things I notice when life slows down.
            </p>
            {subscribed ? (
              <p className="text-xs font-sans tracking-wide text-[#B67A55] dark:text-[#B97A56] italic">
                Thank you. I will write to you soon.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-4 max-w-md w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-transparent border-b border-[#E5DCCF] dark:border-[#E5DCCF]/25 dark:text-[#DDD2C5] text-[#43382F] py-1.5 focus:outline-none focus:border-[#B97A56]/50 dark:focus:border-[#B97A56]/50 transition-colors placeholder:dark:text-[#6F645A] placeholder:text-[#8A7C70]/60 font-spectral italic text-sm"
                  required
                />
                <button 
                  type="submit" 
                  className="dark:text-[#B6A798] text-[#8A7C70] hover:dark:text-[#B97A56] hover:text-[#B67A55] py-1 transition-colors font-spectral italic text-xs uppercase tracking-widest cursor-pointer text-left"
                >
                  Receive Letters
                </button>
              </form>
            )}
            <p className="text-[10.5px] text-[#8A7C70]/70 dark:text-[#B6A798]/50 font-mono tracking-wider mt-4">
              No noise. Just occasional reflections.
            </p>
          </section>

          {/* OLDER REFLECTIONS & ARCHIVE */}
          <section id="older-reflections-archive" className="space-y-12 pb-12 border-t border-[#E5DCCF] dark:border-[#E5DCCF]/15 pt-16">
            <div className="border-b border-[#E5DCCF] dark:border-[#E5DCCF]/15 pb-1.5 select-none">
              <h2 className="font-sans text-[9.5px] uppercase tracking-[0.25em] dark:text-[#B97A56]/85 text-[#B67A55]/85 font-medium tracking-widest block">
                OLDER REFLECTIONS & ARCHIVE
              </h2>
            </div>

            {/* Subtle timeline container - narrowed and intimate */}
            <div className="relative pl-4 sm:pl-5 ml-0 mt-8">
              {/* Vertical timeline line fading naturally to transition into footer area - ultra light and atmospheric */}
              <div className="absolute left-0 top-1.5 bottom-0 w-[1px] bg-gradient-to-b from-[#B67A55]/25 via-[#B67A55]/12 to-transparent dark:from-[#B97A56]/25 dark:via-[#B97A56]/12 dark:to-transparent" />
              
              <div className="space-y-12 md:space-y-14">
                {archiveEntries.length === 0 ? (
                  <div className="py-10 text-[#8A7C70] dark:text-[#B6A798]/60 font-spectral italic opacity-60">
                    No older reflections yet.
                  </div>
                ) : archiveEntries.map((entry, idx) => {
                  return (
                    <div key={idx} className="relative">
                      {/* Quiet and soft timeline marker circle - micro scale for pure atmospheric feeling */}
                      <span className="absolute -left-[18.2px] sm:-left-[22.2px] top-[7px] w-1 h-1 rounded-full bg-[#B67A55]/40 dark:bg-[#B97A56]/40 transition-colors duration-300" />
                      
                      {/* Date Above Title */}
                      <div className="text-[9px] font-mono tracking-normal text-[#8A7C70]/60 dark:text-[#B6A798]/45 uppercase select-none mb-2">
                        {entry.date}
                      </div>

                      {/* Title - dominant, quiet, literary */}
                      <Link 
                        href={entry.slug !== '#' ? `/p/${entry.slug}` : '#'} 
                        className="font-cormorant italic text-[17.5px] md:text-[18.5px] leading-relaxed text-[#43382F] dark:text-[#DDD2C5] hover:text-[#B67A55] dark:hover:text-[#B97A56] duration-500 transition-colors block max-w-xl"
                      >
                        {entry.title}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 sm:pt-8 select-none">
              <Link
                href={getPersonaUrl('wanderer', '/blogs')}
                className="group inline-flex items-center gap-2 font-mono text-[10px] sm:text-[10.5px] uppercase tracking-widest text-[#B67A55] dark:text-[#B97A56] hover:underline"
                id="enter-notebook-feed-link"
              >
                <span>Enter Complete Notebook Feed</span>
                <span className="font-sans inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </section>

        </div>

        {/* RIGHT SIDE: ATMOSPHERIC RAIL (ONLY ON DESKTOP) */}
        {/* Softened border and designed as un-chunky discovered margin notes */}
        <aside id="desktop-atmospheric-rail" className="hidden lg:flex flex-col lg:col-span-4 pl-12 border-l border-[#E5DCCF] dark:border-[#E5DCCF]/15 h-[calc(100vh-200px)] sticky top-36 select-none justify-between my-4 pt-10 pb-6">
          
          {/* TOP: Atmospheric Notes */}
          <div className="space-y-3.5 pr-4">
            <span className="text-[9.5px] font-sans tracking-[0.25em] text-[#B67A55]/85 dark:text-[#B97A56]/85 uppercase font-medium block">
              03:12 AM
            </span>
            <p className="font-spectral text-[13px] leading-[1.75] text-[#807266] dark:text-[#AFA192] italic font-light">
              Rain against the train window again.
            </p>
            <p className="font-spectral text-[13px] leading-[1.75] text-[#807266] dark:text-[#AFA192] italic font-light pb-2">
              Lately I have been revisiting old voice recordings and unfinished notes.
            </p>
          </div>

          <div className="flex-grow h-32" /> {/* Large breathing gap */}

          {/* MIDDLE: Letters Signup Section with very thin border transitions and low product-style contrast */}
          <div className="space-y-4 py-8 border-y border-[#E5DCCF] dark:border-[#E5DCCF]/15 pr-4">
            <span className="text-[9.5px] font-sans tracking-[0.25em] text-[#B67A55]/85 dark:text-[#B97A56]/85 uppercase font-medium block">
              LETTERS
            </span>
            <p className="font-spectral font-light text-[13px] leading-[1.75] dark:text-[#AFA192] text-[#807266] italic">
              Sometimes I send quiet letters about memories, places, unfinished thoughts, and the things I notice when life slows down.
            </p>
            
            {subscribed ? (
              <p className="text-[11.5px] font-sans tracking-wide text-[#B67A55]/90 dark:text-[#B97A56]/90 italic pt-1">
                Thank you. I will write to you soon.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-transparent border-b border-[#E5DCCF] dark:border-[#E5DCCF]/25 dark:text-[#DDD2C5] text-[#43382F] py-1 w-full focus:outline-none focus:border-[#B97A56]/50 dark:focus:border-[#B97A56]/50 transition-colors placeholder:dark:text-[#6F645A] placeholder:text-[#8A7C70]/60 font-spectral italic text-[13.5px]"
                  required
                />
                <button 
                  type="submit" 
                  className="dark:text-[#B6A798]/90 text-[#8A7C70]/90 hover:dark:text-[#B97A56] hover:text-[#B67A55] py-1 w-full transition-all duration-300 font-spectral italic text-[11.5px] uppercase tracking-widest cursor-pointer text-left"
                >
                  Receive Letters
                </button>
              </form>
            )}

            <p className="text-[10.5px] text-[#8A7C70]/70 dark:text-[#B6A798]/50 font-mono tracking-wider">
              No noise. Just occasional reflections.
            </p>
          </div>

          <div className="flex-grow h-32" /> {/* Large breathing gap */}

          {/* BOTTOM: Tiny Forgotten Footer Note */}
          <div className="text-[10.5px] font-mono text-[#8A7C70]/60 dark:text-[#B6A798]/45 italic pt-1 pr-4">
            Last updated late at night.
          </div>

        </aside>

      </div>

      {/* TEMPORAL FOOTNOTE - Transition spaced out gently to create a calm ending rhythm */}
      <footer id="temporal-detail" className="mt-48 md:mt-64 pt-8 border-t border-[#E5DCCF] dark:border-[#E5DCCF]/15 flex flex-col items-center text-center select-none opacity-60">
        <p className="text-[10.5px] font-mono text-[#8A7C70]/60 dark:text-[#B6A798]/50 italic tracking-wide">
          written from a quiet carriage • updated late last night • May 2026
        </p>
      </footer>
    </motion.div>
  );
}
