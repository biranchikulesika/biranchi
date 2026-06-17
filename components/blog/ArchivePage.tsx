'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

import { Post } from '@/lib/types';
import { PERSONA_BLOG_THEMES } from './themes';
import { Search } from './Search';
import { ArchiveTimeline } from './ArchiveTimeline';

export interface ArchivePageProps {
  persona: 'main' | 'wanderer' | 'thinker' | 'builder' | 'operator';
  databasePosts: any[];
}

export function ArchivePage({ persona, databasePosts }: ArchivePageProps) {
  const theme = PERSONA_BLOG_THEMES[persona] || PERSONA_BLOG_THEMES.wanderer;
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    // Collect static database posts
    const dbPosts = persona === 'main'
      ? databasePosts.filter(p => !p.hidden)
      : databasePosts.filter(p => p.persona === persona && !p.hidden);

    setTimeout(() => {
      setPosts(dbPosts);
    }, 0);
  }, [persona]);

  // Filter posts by search query matching title, subtitle, category or excerpt
  const filteredPosts = posts.filter(post => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleVal = (post.title || '').toLowerCase();
    const subVal = (post.subtitle || '').toLowerCase();
    const excerptVal = (post.excerpt || '').toLowerCase();
    const catVal = (post.category || '').toLowerCase();
    return titleVal.includes(query) || subVal.includes(query) || excerptVal.includes(query) || catVal.includes(query);
  });

  return (
    <div className={`w-full min-h-screen ${theme.containerClass}`}>
      <div className="mx-auto px-6 sm:px-10 lg:px-14 pt-6 pb-12 lg:pt-8 lg:pb-16 space-y-6 lg:max-w-5xl sm:max-w-6xl">
        
        {/* Minimal Timeline Archive Header */}
        <header className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 select-none border-b w-full ${theme.borderColor}`}>
          <div className="space-y-1">
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${theme.titleFont} ${theme.primaryColor}`}>
              {theme.archiveTitle}
            </h1>
            <p className="text-xs opacity-65 font-light">
              {theme.archiveSubtitle}
            </p>
          </div>
          <div className="w-full sm:w-auto sm:min-w-[280px] lg:min-w-[320px]">
            <Search value={searchQuery} onChange={setSearchQuery} persona={persona === 'main' ? 'wanderer' : persona} />
          </div>
        </header>

        {/* CHRONOLOGICAL TIMELINE */}
        <section id="archive-chronological-feed" className="py-6 select-text">
          <AnimatePresence mode="wait">
            {filteredPosts.length > 0 ? (
              <ArchiveTimeline posts={filteredPosts} persona={persona} />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`py-16 text-center flex flex-col justify-center items-center gap-4 border border-dashed rounded ${theme.borderColor}`}
              >
                <ShieldAlert className="w-6 h-6 opacity-45 text-rose-500" />
                <div className="font-mono text-xs text-rose-500/80 uppercase tracking-widest leading-loose">
                  query returned zero traces
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className={`font-mono text-[10px] uppercase hover:underline ${theme.accentColor}`}
                >
                  Clear filter query
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>
    </div>
  );
}

export default ArchivePage;
