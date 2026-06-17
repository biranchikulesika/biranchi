'use client';

import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { PERSONA_BLOG_THEMES } from './themes';

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  persona: 'wanderer' | 'thinker' | 'builder' | 'operator';
}

export function Search({ value, onChange, persona }: SearchProps) {
  const theme = PERSONA_BLOG_THEMES[persona] || PERSONA_BLOG_THEMES.wanderer;

  // Custom adaptive classes for input styling
  const getInputStyles = () => {
    switch (persona) {
      case 'operator':
        return 'font-mono text-xs border border-dashed focus:border-solid bg-black/40 px-3 py-2 text-[#7f9e8a] placeholder-[#5C6A61]/50 border-[#1e2722] focus:ring-1 focus:ring-[#7f9e8a]/30';
      case 'builder':
        return 'font-mono text-[#222222] dark:text-neutral-300 text-xs border border-neutral-350 dark:border-neutral-900 bg-[#E7E4DD]/50 dark:bg-neutral-900/40 px-3.5 py-2 placeholder-stone-400 dark:placeholder-neutral-600 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/10 rounded-md';
      case 'thinker':
        return 'font-sans text-stone-700 dark:text-[#D1CDC5] text-sm border-b bg-transparent py-2 px-1 focus:border-stone-500 placeholder-[#7F786F]/50 border-[#E2DFDA] dark:border-stone-850';
      case 'wanderer':
      default:
        return 'font-sans text-white text-xs sm:text-sm bg-[#131418] border border-[#212328] px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-md placeholder-zinc-500 focus:outline-none focus:border-[#C58059]';
    }
  };

  const getIconStyles = () => {
    switch (persona) {
      case 'operator':
        return 'text-[#5C6A61]';
      case 'builder':
        return 'text-stone-450 dark:text-neutral-500';
      case 'thinker':
        return 'text-[#7F786F]/60';
      case 'wanderer':
      default:
        return 'text-[#8A7C70]/60';
    }
  };

  return (
    <div className={`relative w-full flex items-center ${persona === 'wanderer' ? 'max-w-none' : 'max-w-lg mx-auto md:my-6'}`}>
      <div className="absolute right-3 pointer-events-none">
        <SearchIcon className={`w-4 h-4 ${getIconStyles()}`} id="search-icon" />
      </div>
      <input
        type="text"
        id="archive-search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={theme.searchText}
        className={`w-full outline-none transition-all pr-10 ${getInputStyles()}`}
      />
    </div>
  );
}
