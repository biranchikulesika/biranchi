'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, Copy, Check } from 'lucide-react';

import { FooterThinker } from '@/components/footer-thinker';
import { FooterBuilder } from '@/components/footer-builder';
import { FooterWanderer } from '@/components/footer-wanderer';
import { FooterOperator } from '@/components/footer-operator';
import { MarkdownRenderer } from '@/components/mdx/MarkdownRenderer';

import { ThemeToggle } from '@/components/theme-toggle';
import { PersonaSwitcher } from '@/components/persona-switcher';
import { PersonaSearch } from '@/components/persona-search';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { FieldNoteDivider } from '@/components/field-note-divider';

const getEmojiForLocation = (location: string): string => {
  const loc = location.toLowerCase();
  if (loc.includes('platform') || loc.includes('coast') || loc.includes('beach') || loc.includes('ocean')) return '🌊';
  if (loc.includes('train') || loc.includes('transit') || loc.includes('rail') || loc.includes('carriage') || loc.includes('district') || loc.includes('cuttack')) return '🚃';
  if (loc.includes('bhubaneswar') || loc.includes('study') || loc.includes('lounge') || loc.includes('town') || loc.includes('puri')) return '📍';
  return '📍';
};

const renderTextWithInlineFormatting = (text: string) => {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeContent = part.slice(1, -1);
      return (
        <code key={index} className="bg-[#EAE3D5]/50 dark:bg-[#1C1814]/75 text-[#B67A55] dark:text-[#B97A56] rounded-[3px] px-1.5 py-0.5 text-[0.85em] font-mono border border-[#E5DCCF]/25 dark:border-[#E5DCCF]/8 mx-0.5 font-normal select-text">
          {codeContent}
        </code>
      );
    }
    const subParts = part.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
    return subParts.map((subPart, subIndex) => {
      if (subPart.startsWith('**') && subPart.endsWith('**')) {
        return <strong key={`${index}-${subIndex}`} className="font-semibold">{subPart.slice(2, -2)}</strong>;
      }
      if (subPart.startsWith('*') && subPart.endsWith('*')) {
        return <em key={`${index}-${subIndex}`} className="italic">{subPart.slice(1, -1)}</em>;
      }
      if (subPart.startsWith('[') && subPart.includes('](')) {
        const match = subPart.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [, linkText, url] = match;
          return (
            <a 
              key={`${index}-${subIndex}`} 
              href={url} 
              target={url.startsWith('http') ? '_blank' : undefined}
              rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="underline underline-offset-4 decoration-[#B67A55]/30 hover:decoration-[#B67A55]/80 dark:decoration-[#B97A56]/30 dark:hover:decoration-[#B97A56]/80 text-[#B67A55] dark:text-[#B97A56] transition-colors"
            >
              {linkText}
            </a>
          );
        }
      }
      return subPart;
    });
  });
};

export interface PostRendererProps {
  post: any | undefined;
  slug: string;
  allPosts: any[];
}

export default function PostRenderer({ post, slug, allPosts }: PostRendererProps) {
  const [copied, setCopied] = useState(false);
  const [, setScrollPercent] = useState(0);
  const [, setShowToTop] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [activeTab, setActiveTab] = useState<'top' | 'latest'>('top');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        setCurrentUrl(window.location.href);
      }, 0);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.documentElement;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      if (scrollHeight > 0) {
        const percent = (container.scrollTop / scrollHeight) * 100;
        setScrollPercent(Math.round(percent));
      }
      setShowToTop(container.scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen dark:bg-[#050505] bg-[#F5F5F2] flex flex-col justify-center items-center px-6 py-20 font-mono text-center">
        <div className="max-w-md w-full space-y-6">
          <div className="text-stone-400 text-xs tracking-widest uppercase">[ ERROR: 404 ]</div>
          <h1 className="font-serif text-2xl tracking-tight dark:text-stone-200 text-[#2B2B28]">Article Not Found</h1>
          <p className="text-xs font-light dark:text-stone-500 text-[#6E6A64] leading-relaxed">
            The slug &quot;{slug}&quot; does not resolve to any publication within the multi-persona ecosystem.
          </p>
          <div className="pt-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 border dark:border-stone-800 border-stone-300 dark:hover:bg-stone-900 hover:bg-stone-100 transition-all text-xs px-5 py-2"
            >
              <ArrowLeft className="w-3 h-3" /> Return to Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValue.trim()) {
      setIsSubscribed(true);
      setEmailValue('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  const p = post.persona;

  const themes = {
    "wanderer": {
      "wrapper": `font-sans dark:bg-[#0A0A0C] bg-[#FAFAF9] dark:text-[#E4E4E7] text-[#1D1D20] selection:bg-[rgba(197,128,89,0.22)] min-h-screen`,
      "headerBg": `dark:bg-[#0A0A0C]/90 bg-[#FAFAF9]/95 border-b border-[#1E1E22] dark:border-zinc-800/40`,
      "themeToggleText": `dark:text-[#C58059] text-[#A66039] font-serif italic`,
      "meta": `font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#A66039] dark:text-[#C58059] mb-3`,
      "title": `font-serif font-bold leading-[1.12] text-3xl md:text-4.5xl lg:text-5xl tracking-tight dark:text-white text-zinc-900 mb-3`,
      "subtitle": `font-serif font-light italic text-[16px] sm:text-[18px] dark:text-zinc-400 text-zinc-650 leading-relaxed mb-6 pb-4 border-b border-[#1E1E22] dark:border-zinc-800/40`,
      "heroBorder": `border-[#1E1E22] dark:border-zinc-800/40`,
      "heroBg": `bg-[#131418] dark:bg-black/40`,
      "heroFilter": `filter saturate-[95%] brightness-[92%] dark:brightness-[84%]`,
      "badgeClass": `font-sans text-xs tracking-wide text-white bg-black/60 border border-white/10`,
      "caption": `text-zinc-500 dark:text-zinc-500 font-sans tracking-wide leading-relaxed text-xs`,
      "paragraph": `font-serif text-[17px] sm:text-[18.2px] leading-[1.78] dark:text-zinc-200 text-zinc-800 mb-6`,
      "linkHover": `hover:text-[#A66039] dark:hover:text-[#C58059]`,
      "quoteBorder": `border-[#A66039] dark:border-[#C58059]`,
      "quoteText": `font-serif italic text-[1.25rem] sm:text-[1.4rem] dark:text-zinc-100 text-zinc-905`,
      "h2": `font-serif font-bold text-2xl md:text-3xl dark:text-white text-zinc-900 mt-10 mb-4`,
      "h3": `font-serif font-bold text-xl md:text-2xl dark:text-white text-zinc-900 mt-8 mb-3`,
      "sidenoteLine": `border-[#A66039]/30 dark:border-[#C58059]/30`,
      "sidenoteText": `font-sans text-[12px] text-zinc-500 italic`,
      "codeWrapper": `dark:bg-[#131418] bg-white text-zinc-900 dark:text-zinc-100 border border-[#1E1E22] dark:border-zinc-800/45`,
      "codeHeader": `border-[#1E1E22] dark:border-zinc-800/45 opacity-70`,
      "divider": `text-[#A66039]/40 dark:text-[#C58059]/40 font-mono`,
      "tableHead": `text-[#A66039] dark:text-[#C58059] font-serif italic`,
      "tableBorder": `border-[#1E1E22] dark:border-zinc-800/40`,
      "tableRowHover": `hover:bg-zinc-800/10 dark:hover:bg-zinc-900/10`,
      "tableCellBorder": `border-[#1E1E22] dark:border-zinc-800/40`,
      "shareBorder": `border-[#1E1E22] dark:border-zinc-800/40`,
      "shareTitle": `text-zinc-500`,
      "shareIcon": `border-[#1E1E22] dark:border-zinc-800/40 text-zinc-400 hover:text-[#A66039] dark:hover:text-[#C58059] hover:border-[#A66039] dark:hover:border-[#C58059] hover:bg-zinc-800/10 dark:hover:bg-zinc-900/10`,
      "shareCheck": `text-[#A66039] dark:text-[#C58059]`,
      "relatedSectionBorder": `border-[#1E1E22] dark:border-zinc-800/40`,
      "relatedLabel": `text-zinc-500 font-sans tracking-widest font-semibold text-[10px]`,
      "relatedItemBorder": `border-[#1E1E22] dark:border-[#1E1E22]`,
      "relatedTitleText": `font-serif font-bold text-[15.5px] sm:text-[16px] text-zinc-800 dark:text-zinc-100 group-hover:text-[#A66039] dark:group-hover:text-[#C58059]`,
      "relatedDate": `text-zinc-500`,
      "newsletterBorder": `border-[#1E1E22] dark:border-zinc-800/45`,
      "newsletterLabel": `text-[#A66039] dark:text-[#C58059]`,
      "newsletterDesc": `font-serif italic text-sm text-zinc-400`,
      "newsletterMsg": `font-sans text-xs text-zinc-300 bg-zinc-900/30 p-3 rounded border border-emerald-950/20`,
      "newsletterInputLine": `border-[#1E1E22] dark:border-zinc-800 dark:text-zinc-100 text-zinc-800 focus:border-[#C58059] placeholder:text-zinc-500 font-sans text-xs`,
      "newsletterSubmit": `text-[#A66039] dark:text-[#C58059] hover:text-[#D59069] font-sans font-bold uppercase text-[10px] tracking-widest`,
      "tabBorder": `border-[#1E1E22] dark:border-zinc-800/45`,
      "tabActive": `text-[#A66039] dark:text-[#C58059] bg-zinc-800/20 dark:bg-zinc-900/30 font-serif italic shadow-sm`,
      "tabInactive": `text-zinc-500 hover:text-white font-serif italic`,
      "discoveryExcerpt": `font-sans text-xs text-zinc-400`,
      "viewAllBorder": `border-[#1E1E22] dark:border-[#1E1E22]`,
      "viewAllAction": `font-serif italic text-[14px] text-[#A66039] dark:text-[#C58059] hover:underline`,
      "wordingRelatedReflections": `RELATED DISPATCHES`,
      "wordingLetters": `INSIDE THE HEAD DISPATCH`,
      "wordingLettersDesc": `Occasional meditations, essays, and direct inquiries sent straight into your quiet inbox.`,
      "wordingLettersReg": `Subscription recorded. Dispatches will arrive in your quiet moments.`,
      "wordingLettersBtn": `Receive Dispatches`,
      "wordingViewAll": `View Complete Notebook Feed`
    },
    "thinker": {
      "wrapper": `font-sans dark:bg-[#111417] bg-[#F4F3F1] dark:text-[#D7D4CE] text-[#2F3134] selection:bg-[#E2DFDA] dark:selection:bg-white/10`,
      "headerBg": `dark:bg-[#12161A]/80 bg-[#F4F3F1]/85 border-[#E2DFDA] dark:border-[rgba(255,255,255,0.03)]`,
      "themeToggleText": `dark:text-[#D7D4CE] text-[#2F3134] font-sans font-light`,
      "meta": `font-mono text-[9.5px] uppercase tracking-[0.25em] text-[#7F786F] dark:text-[#9A9388] font-medium mb-2`,
      "title": `font-cormorant font-normal leading-[1.07] text-4xl md:text-5xl lg:text-5xl tracking-tight dark:text-[#D8D1C7] text-[#2F3134] mb-2`,
      "subtitle": `font-spectral font-light italic text-[15.5px] sm:text-[17px] dark:text-[#9A9388] text-[#555A5E] leading-relaxed mb-6 pb-4 border-b border-[#E2DFDA] dark:border-stone-800`,
      "heroBorder": `border-[#E2DFDA] dark:border-stone-800`,
      "heroBg": `bg-[#E2DFDA] dark:bg-[#12161A]`,
      "heroFilter": `filter grayscale-[20%] contrast-[90%] sepia-[5%] saturate-[85%] brightness-[95%] dark:brightness-[80%]`,
      "badgeClass": `font-sans tracking-wide text-white/95 bg-black/40 border-white/10`,
      "caption": `text-[#6F7175] dark:text-[#7F786F] font-mono tracking-[0.12em]`,
      "paragraph": `font-sans font-light text-[1.1rem] leading-[1.8] dark:text-[#D7D4CE] text-[#2F3134]`,
      "linkHover": `hover:text-stone-500 dark:hover:text-stone-400`,
      "quoteBorder": `border-[#2F3134] dark:border-[#D7D4CE]`,
      "quoteText": `font-spectral italic text-[1.35rem] sm:text-[1.55rem] dark:text-[#D7D4CE]/95 text-[#2F3134]/95`,
      "h2": `font-cormorant text-2xl md:text-3.5xl dark:text-[#D8D1C7] text-[#2F3134]`,
      "h3": `font-cormorant text-xl md:text-2xl dark:text-[#D8D1C7] text-[#2F3134]`,
      "sidenoteLine": `border-[#E2DFDA] dark:border-stone-800`,
      "sidenoteText": `font-mono text-[11px] text-[#6F7175] dark:text-[#7F786F]`,
      "codeWrapper": `dark:bg-[#12161A] bg-[#E2DFDA] border-[#E2DFDA] dark:border-stone-800 text-stone-800 dark:text-stone-300`,
      "codeHeader": `border-[#E2DFDA] dark:border-stone-800 opacity-60`,
      "divider": `text-[#6F7175]/30 dark:text-[#7F786F]/30 font-mono`,
      "tableHead": `text-[#2F3134] dark:text-[#D7D4CE] font-sans`,
      "tableBorder": `border-[#E2DFDA] dark:border-stone-800`,
      "tableRowHover": `hover:bg-[#E2DFDA]/50 dark:hover:bg-[#12161A]/50`,
      "tableCellBorder": `border-[#E2DFDA] dark:border-stone-800`,
      "shareBorder": `border-[#E2DFDA] dark:border-stone-800`,
      "shareTitle": `text-[#6F7175] dark:text-[#7F786F]`,
      "shareIcon": `border-[#E2DFDA] dark:border-stone-800 text-[#6F7175] dark:text-[#7F786F] hover:text-[#2F3134] dark:hover:text-[#D7D4CE] hover:border-[#2F3134] dark:hover:border-[#D7D4CE] hover:bg-[#E2DFDA]/40 dark:hover:bg-[#12161A]/40`,
      "shareCheck": `text-stone-500 dark:text-stone-400`,
      "relatedSectionBorder": `border-[#E2DFDA] dark:border-stone-800`,
      "relatedLabel": `text-[#7F786F] dark:text-[#9A9388] font-sans`,
      "relatedItemBorder": `border-[#E2DFDA] dark:border-stone-800`,
      "relatedTitleText": `font-cormorant font-light text-[17px] sm:text-[18.5px] text-[#2F3134] dark:text-[#D7D4CE] group-hover:text-stone-500`,
      "relatedDate": `text-[#6F7175] dark:text-[#7F786F]`,
      "newsletterBorder": `border-[#E2DFDA] dark:border-stone-800`,
      "newsletterLabel": `text-[#7F786F] dark:text-[#9A9388]`,
      "newsletterDesc": `font-spectral italic text-[14px] text-[#555A5E] dark:text-[#9A9388]`,
      "newsletterMsg": `font-mono text-[11px] text-[#2F3134] dark:text-[#D7D4CE]`,
      "newsletterInputLine": `border-[#E2DFDA] dark:border-stone-800 dark:text-[#D7D4CE] text-[#2F3134] focus:border-[#2F3134] dark:focus:border-[#D7D4CE] placeholder:text-[#6F7175]/60 font-sans`,
      "newsletterSubmit": `text-[#6F7175] dark:text-[#7F786F] hover:text-[#2F3134] dark:hover:text-[#D7D4CE] font-sans uppercase text-[10px] tracking-widest`,
      "tabBorder": `border-[#E2DFDA] dark:border-stone-800`,
      "tabActive": `text-[#2F3134] dark:text-[#D7D4CE] bg-[#E2DFDA] dark:bg-stone-800 font-sans text-[13px] shadow-sm`,
      "tabInactive": `text-[#6F7175] dark:text-[#7F786F] hover:text-[#2F3134] dark:hover:text-[#D7D4CE] font-sans text-[13px]`,
      "discoveryExcerpt": `font-sans font-light text-[#555A5E] dark:text-[#9A9388]`,
      "viewAllBorder": `border-[#E2DFDA] dark:border-stone-800`,
      "viewAllAction": `font-sans text-[14px] text-[#2F3134] dark:text-[#D7D4CE] hover:text-stone-500`,
      "wordingRelatedReflections": `FURTHER REFLECTIONS`,
      "wordingLetters": `RECEIVE DISPATCHES`,
      "wordingLettersDesc": `Occasional thoughts from quieter corners, sent straight from the source.`,
      "wordingLettersReg": `You are registered. Dispatches will arrive in your quiet moments.`,
      "wordingLettersBtn": `Join Dispatch`,
      "wordingViewAll": `View All Thoughts`
    },
    "builder": {
      "wrapper": `font-sans dark:bg-neutral-950 bg-[#F3F2EE] dark:text-neutral-300 text-[#222222] selection:bg-neutral-800`,
      "headerBg": `dark:bg-neutral-950/80 bg-[#F3F2EE]/85 border-[#E7E4DD] dark:border-neutral-900`,
      "themeToggleText": `dark:text-neutral-400 text-[#5E5A53] font-mono`,
      "meta": `font-mono text-[9.5px] uppercase tracking-widest dark:text-neutral-500 text-[#8B867C] font-medium mb-2`,
      "title": `font-sans font-semibold leading-snug text-3xl md:text-4xl lg:text-4.5xl tracking-tight text-[#111111] dark:text-neutral-100 mb-2`,
      "subtitle": `font-mono text-[13px] sm:text-[14px] dark:text-neutral-500 text-stone-600 leading-relaxed mb-6 pb-4 border-b border-[#E7E4DD] dark:border-neutral-900`,
      "heroBorder": `border-[#E7E4DD] dark:border-neutral-900`,
      "heroBg": `bg-[#E7E4DD] dark:bg-neutral-900`,
      "heroFilter": `filter grayscale-[10%]`,
      "badgeClass": `font-mono tracking-wide text-white/95 bg-black/50 border-white/10`,
      "caption": `text-stone-500 dark:text-neutral-500 font-mono tracking-widest`,
      "paragraph": `font-sans font-light text-[1.05rem] leading-[1.8] dark:text-neutral-300 text-[#222222]`,
      "linkHover": `hover:text-stone-600 dark:hover:text-neutral-400 font-medium`,
      "quoteBorder": `border-stone-400 dark:border-neutral-700`,
      "quoteText": `font-mono text-[13px] dark:text-neutral-400 text-stone-600`,
      "h2": `font-sans font-semibold text-xl md:text-2xl dark:text-neutral-200 text-[#111111]`,
      "h3": `font-sans font-medium text-lg md:text-xl dark:text-neutral-200 text-[#111111]`,
      "sidenoteLine": `border-[#E7E4DD] dark:border-neutral-800`,
      "sidenoteText": `font-mono text-[11px] text-stone-500 dark:text-neutral-500`,
      "codeWrapper": `dark:bg-[#0A0A0A] bg-white border border-[#E7E4DD] dark:border-neutral-900 text-stone-800 dark:text-stone-300`,
      "codeHeader": `border-[#E7E4DD] dark:border-neutral-900 opacity-60`,
      "divider": `text-[#E7E4DD] dark:text-neutral-900 font-mono`,
      "tableHead": `text-[#111111] dark:text-neutral-200 font-sans uppercase`,
      "tableBorder": `border-[#E7E4DD] dark:border-neutral-900`,
      "tableRowHover": `hover:bg-white dark:hover:bg-neutral-900`,
      "tableCellBorder": `border-[#E7E4DD] dark:border-neutral-900`,
      "shareBorder": `border-[#E7E4DD] dark:border-neutral-800`,
      "shareTitle": `text-stone-500 dark:text-neutral-500`,
      "shareIcon": `border-[#E7E4DD] dark:border-neutral-900 text-stone-500 dark:text-neutral-500 hover:text-[#111111] dark:hover:text-neutral-100 hover:border-[#111111] dark:hover:border-neutral-100 hover:bg-white dark:hover:bg-neutral-900`,
      "shareCheck": `text-stone-800 dark:text-neutral-300`,
      "relatedSectionBorder": `border-[#E7E4DD] dark:border-neutral-900`,
      "relatedLabel": `text-[#5E5A53] dark:text-neutral-500 font-mono`,
      "relatedItemBorder": `border-[#E7E4DD] dark:border-neutral-900`,
      "relatedTitleText": `font-sans font-medium text-[15px] sm:text-[16px] text-[#111111] dark:text-neutral-200 group-hover:opacity-80`,
      "relatedDate": `text-stone-505 dark:text-neutral-500`,
      "newsletterBorder": `border-[#E7E4DD] dark:border-neutral-900`,
      "newsletterLabel": `text-[#5E5A53] dark:text-neutral-500 font-mono`,
      "newsletterDesc": `font-mono text-[12px] text-stone-605 dark:text-neutral-400`,
      "newsletterMsg": `font-mono text-[11px] text-[#111111] dark:text-neutral-200`,
      "newsletterInputLine": `border-[#E7E4DD] dark:border-neutral-800 dark:text-neutral-200 text-[#111111] focus:border-stone-400 dark:focus:border-neutral-600 placeholder:text-stone-400 dark:placeholder:text-neutral-600 font-mono text-[11px]`,
      "newsletterSubmit": `text-stone-600 dark:text-neutral-400 hover:text-[#111111] dark:hover:text-neutral-200 font-mono uppercase tracking-widest text-[10px]`,
      "tabBorder": `border-[#E7E4DD] dark:border-neutral-900`,
      "tabActive": `text-[#111111] dark:text-neutral-200 bg-white dark:bg-neutral-800 font-sans text-xs shadow-sm`,
      "tabInactive": `text-stone-500 dark:text-neutral-500 hover:text-[#111111] dark:hover:text-neutral-200 font-sans text-xs`,
      "discoveryExcerpt": `font-mono text-[12px] text-stone-500 dark:text-neutral-550`,
      "viewAllBorder": `border-[#E7E4DD] dark:border-neutral-900`,
      "viewAllAction": `font-sans font-medium text-[13px] text-[#111111] dark:text-neutral-200 hover:opacity-85`,
      "wordingRelatedReflections": `RELATED BUILDS`,
      "wordingLetters": `BUILD DISPATCH`,
      "wordingLettersDesc": `System engineering drafts and project summaries.`,
      "wordingLettersReg": `You are registered. Dispatches will arrive shortly.`,
      "wordingLettersBtn": `Join Dispatch`,
      "wordingViewAll": `View All Builds`
    },
    "operator": {
      "wrapper": `font-mono dark:bg-[#080b09] bg-[#EDF1EC] dark:text-[#7f9e8a] text-[#1F2822] selection:bg-[#1e2722] selection:text-[#a3c2af]`,
      "headerBg": `dark:bg-[#080b09]/80 bg-[#EDF1EC]/85 border-[#D6DED5] dark:border-[#1e2722]`,
      "themeToggleText": `dark:text-[#6d8775] text-[#5F7A69] font-mono`,
      "meta": `font-mono text-[10px] uppercase tracking-widest dark:text-[#4e6054] text-[#5C6A61] font-bold mb-2`,
      "title": `font-mono font-bold uppercase leading-tight text-xl md:text-2xl lg:text-3xl tracking-tight dark:text-[#a3c2af] text-[#1E3025] mb-2`,
      "subtitle": `font-mono text-[12px] dark:text-[#6d8775] text-[#3E5245] leading-relaxed mb-6 pb-4 border-b border-[#D6DED5] dark:border-[#1e2722]`,
      "heroBorder": `border-[#D6DED5] dark:border-[#1e2722]`,
      "heroBg": `bg-[#EDF1EC] dark:bg-black/20`,
      "heroFilter": `filter grayscale-[50%] contrast-[120%]`,
      "badgeClass": `font-mono tracking-widest text-[#a3c2af] bg-[#1e2722] border-[none]`,
      "caption": `text-[#5C6A61] dark:text-[#4e6054] font-mono tracking-widest`,
      "paragraph": `font-mono text-[13px] leading-[1.8] dark:text-[#a0bfab] text-[#121c15] tracking-wide`,
      "linkHover": `hover:opacity-75 underline`,
      "quoteBorder": `border-[#D6DED5] dark:border-[#1e2722]`,
      "quoteText": `font-mono text-xs dark:text-[#8cb89b] text-[#2c3d31]`,
      "h2": `font-mono font-bold text-sm tracking-wider dark:text-[#a3c2af] text-[#1E3025] uppercase mt-[3.0rem] mb-[1.0rem] pt-1`,
      "h3": `font-mono font-bold text-[13px] tracking-wider dark:text-[#a3c2af] text-[#1E3025] uppercase mt-[2.0rem] mb-[0.75rem]`,
      "sidenoteLine": `border-[#D6DED5] dark:border-[#1e2722]`,
      "sidenoteText": `font-mono text-[10px] dark:text-[#6d8775] text-[#3E5245]`,
      "codeWrapper": `dark:bg-black/30 bg-white/40 border border-dashed border-[#D6DED5] dark:border-[#1e2722] text-[#2c3d31] dark:text-[#8cb89b]`,
      "codeHeader": `border-dashed border-[#D6DED5] dark:border-[#1e2722] opacity-60`,
      "divider": `text-[#D6DED5] dark:text-[#1e2722] font-mono tracking-[0.5em]`,
      "tableHead": `text-[#1E3025] dark:text-[#a3c2af] font-mono`,
      "tableBorder": `border-dashed border-[#D6DED5] dark:border-[#1e2722]`,
      "tableRowHover": `hover:bg-[#D6DED5]/20 dark:hover:bg-[#1e2722]/20`,
      "tableCellBorder": `border-dashed border-[#D6DED5] dark:border-[#1e2722]`,
      "shareBorder": `border-dashed border-[#D6DED5] dark:border-[#1e2722]`,
      "shareTitle": `text-[#5C6A61] dark:text-[#4e6054]`,
      "shareIcon": `rounded-[none] border border-[#D6DED5] dark:border-[#1e2722] text-[#5C6A61] dark:text-[#4e6054] hover:text-[#1E3025] dark:hover:text-[#a3c2af] hover:bg-[#D6DED5]/40 dark:hover:bg-[#1e2722]/40`,
      "shareCheck": `text-[#a3c2af] dark:text-[#a3c2af]`,
      "relatedSectionBorder": `border-[#D6DED5] dark:border-[#1e2722]`,
      "relatedLabel": `text-[#5C6A61] dark:text-[#4e6054] font-mono`,
      "relatedItemBorder": `border-[#D6DED5] dark:border-[#1e2722]`,
      "relatedTitleText": `font-mono text-[13px] text-[#2C3D31] dark:text-[#7f9e8a] group-hover:text-[#1E3025] dark:group-hover:text-[#a3c2af] uppercase`,
      "relatedDate": `text-[#5C6A61] dark:text-[#4e6054]`,
      "newsletterBorder": `border-[#D6DED5] dark:border-[#1e2722]`,
      "newsletterLabel": `text-[#5C6A61] dark:text-[#4e6054]`,
      "newsletterDesc": `font-mono text-[11px] text-[#3E5245] dark:text-[#6d8775]`,
      "newsletterMsg": `font-mono text-[10px] text-green-700 dark:text-green-400 p-2 border border-dashed border-[#D6DED5] dark:border-[#1e2722]`,
      "newsletterInputLine": `border-[#D6DED5] dark:border-[#1e2722] dark:text-[#a0bfab] text-[#121c15] focus:outline-none placeholder:text-[#5C6A61]/60 font-mono text-[10px] italic`,
      "newsletterSubmit": `text-[#5C6A61] dark:text-[#4e6054] hover:text-[#1E3025] dark:hover:text-[#a3c2af] font-mono tracking-widest text-[9px] uppercase`,
      "tabBorder": `border border-dashed border-[#D6DED5] dark:border-[#1e2722] rounded-[none]`,
      "tabActive": `text-[#1E3025] dark:text-[#a3c2af] bg-[#D6DED5]/40 dark:bg-[#1e2722]/40 font-mono text-[11px] rounded-[none]`,
      "tabInactive": `text-[#5C6A61] dark:text-[#4e6054] hover:text-[#1E3025] dark:hover:text-[#a3c2af] font-mono text-[11px] rounded-[none]`,
      "discoveryExcerpt": `font-mono text-[11px] text-[#3E5245] dark:text-[#6d8775]`,
      "viewAllBorder": `border-[#D6DED5] dark:border-[#1e2722]`,
      "viewAllAction": `font-mono text-[12px] text-[#2C3D31] dark:text-[#7f9e8a] hover:text-[#1E3025] dark:hover:text-[#a3c2af]`,
      "wordingRelatedReflections": `RELATED SIGNALS`,
      "wordingLetters": `DISPATCH CHANNEL`,
      "wordingLettersDesc": `Occasional signals. Operational notes. Infrastructure observations.`,
      "wordingLettersReg": `SYS_DISPATCH: REGISTERED_SUCCESSFULLY`,
      "wordingLettersBtn": `[SUB]`,
      "wordingViewAll": `View All Signals`
    }
  };

  const theme = themes[p] || themes.wanderer;

  // Safeguard
  const databasePosts = allPosts || [];
  const personaPosts = databasePosts.filter((x: any) => x.persona === p && !x.hidden);
  const latestPosts = [...personaPosts].sort((a: any, b: any) => new Date(b.date || b.publishedAt || b.createdAt).getTime() - new Date(a.date || a.publishedAt || a.createdAt).getTime());

  const topSlugsMap: Record<string, string[]> = {
    thinker: ['attention-vs-connection', 'solitude-vs-isolation', 'moral-clarity'],
    builder: ['designing-systems-that-feel-human', 'systems-fail-slowly', 'developer-portfolios-artificial'],
    operator: ['operational-silence-stability', 'convenience-first-attack-surface', 'systems-fail-slowly'],
    wanderer: ['temporary-places-comfort', 'conversations-that-stayed-longer', 'certain-places-familiar', 'evening-train-ride', 'rainy-train-ride-notes']
  };
  const topSlugsOrder = topSlugsMap[p] || [];

  const topPosts = [...personaPosts].sort((a, b) => {
    const idxA = topSlugsOrder.indexOf(a.slug);
    const idxB = topSlugsOrder.indexOf(b.slug);
    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
  });

  const otherPosts = personaPosts.filter((x: any) => x.slug !== slug);
  const uniqueRelatedTitles = new Set();
  const relatedPostsList: { title: string; slug: string; date: string }[] = [];

  otherPosts.forEach((postItem: any) => {
    if (!uniqueRelatedTitles.has(postItem.title) && postItem.title !== post.title) {
      uniqueRelatedTitles.add(postItem.title);
      relatedPostsList.push({ 
        title: postItem.title, 
        slug: postItem.slug, 
        date: postItem.publishedAt ? new Intl.DateTimeFormat('en-US', {month:'short', day:'numeric', year:'numeric'}).format(new Date(postItem.publishedAt)) : postItem.date || 'Unknown Date'
      });
    }
  });

  const renderRelatedReflections = () => (
    <div className={"space-y-3 " + (p === 'operator' ? 'font-mono' : p === 'thinker' ? 'font-sans' : 'font-spectral')}>
      <span className={"text-[10px] uppercase tracking-[0.25em] font-semibold block " + theme.relatedLabel}>
        {theme.wordingRelatedReflections}
      </span>
      <div className="flex flex-col space-y-3">
        {relatedPostsList.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className={"border-b pb-3 last:border-0 last:pb-0 " + theme.relatedItemBorder}
          >
            <Link
              href={`/p/${item.slug}`}
              className="group block"
            >
              <h5 className={`transition-colors leading-snug ${theme.relatedTitleText}`}>
                {item.title}
              </h5>
              <span className={"font-mono text-[9px] uppercase tracking-wider block mt-1 " + theme.relatedDate}>
                {item.date}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNewsletter = (withTopDivider = true) => (
    <div className={`space-y-4 ${withTopDivider ? 'border-t pt-6 ' + theme.newsletterBorder : ''}`}>
      <span className={"text-[10px] uppercase tracking-[0.25em] font-semibold block " + theme.newsletterLabel}>
        {theme.wordingLetters}
      </span>
      <p className={"leading-relaxed " + theme.newsletterDesc}>
        {theme.wordingLettersDesc}
      </p>
      
      {isSubscribed ? (
        <div className={"py-2 " + theme.newsletterMsg}>
          {theme.wordingLettersReg}
        </div>
      ) : (
        <form onSubmit={handleSubscribeSubmit} className="flex flex-col gap-3.5 max-w-xs pt-0.5">
          <input
            type="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            placeholder={p === 'operator' ? "SYS_USER_EMAIL=(...)" : "Your email address"}
            className={"bg-transparent border-b py-1 focus:outline-none transition-colors " + theme.newsletterInputLine}
            required
          />
          <button
            type="submit"
            className={"transition-colors cursor-pointer text-left py-1 w-fit " + theme.newsletterSubmit}
          >
            {theme.wordingLettersBtn}
          </button>
        </form>
      )}
    </div>
  );

  const displayDate = post.date || (post.publishedAt ? new Intl.DateTimeFormat('en-US', {month:'long', day:'numeric', year:'numeric'}).format(new Date(post.publishedAt)) : 'Unknown Date');

  const renderArticleHeader = () => (
    <>
      <div className={"mb-2 select-none " + theme.meta}>
        {p.toUpperCase()} • {displayDate.toUpperCase()} • {String(post.readingTime || '').toUpperCase()} {typeof post.readingTime === 'number' ? 'MIN READ' : ''}
      </div>

      <h1 className={theme.title}>
        {post.title}
      </h1>

      <div className={theme.subtitle}>
        {p !== 'operator' && '"'}{post.subtitle}{p !== 'operator' && '"'}
      </div>

      {post.byline && (
        <div className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mb-6 font-medium tracking-wide uppercase select-none pb-2 border-b border-[#222]/35">
          {post.byline}
        </div>
      )}

      {post.heroImage && (
        <div className="my-[2.5rem] block w-full relative">
          <div className={`relative overflow-hidden w-full border ${theme.heroBg} ${theme.heroBorder}`}>
            <img 
              src={post.heroImage} 
              alt={post.title} 
              className={`w-full h-auto aspect-[16/10] object-cover ${theme.heroFilter}`}
              referrerPolicy="no-referrer"
            />
            {post.location && (
              <div className={`absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 text-[10.5px] backdrop-blur-[6px] rounded-full select-none ${theme.badgeClass}`}>
                <span>{getEmojiForLocation(post.location)}</span>
                <span>{post.location}</span>
              </div>
            )}
          </div>
          {post.heroCaption && (
            <div className={"mt-2.5 text-center text-[11px] uppercase max-w-[80%] mx-auto opacity-55 leading-relaxed select-none " + theme.caption}>
              {post.heroCaption}
            </div>
          )}
        </div>
      )}
    </>
  );

  const renderArticleBody = () => {
    if (typeof post.content === 'string') {
      return (
        <div 
          className={`leading-[1.8] outline-none max-w-none ${
            p === 'builder' ? 'prose prose-invert prose-neutral text-neutral-300 font-sans' :
            p === 'operator' ? 'prose-emerald text-[#a0bfab] font-mono' :
            p === 'thinker' ? 'prose-stone text-stone-300 font-serif' :
            'prose-stone text-[#DDD2C5]/90 font-serif'
          }`}
        >
          <MarkdownRenderer content={post.content} />
        </div>
      );
    }

    return (
      <article className="space-y-0">
        {post.content.map((block, idx) => {
          if (block.type === 'paragraph') {
            return (
              <p 
                key={idx} 
                className={`mb-[1.5rem] last:mb-0 [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors ${theme.paragraph} ${theme.linkHover}`}
              >
                {renderTextWithInlineFormatting(block.text)}
              </p>
            );
          }

          if (block.type === 'blockquote') {
            return (
              <blockquote 
                key={idx} 
                className={`border-l-[2px] pl-8 mt-[2.5rem] mb-[2.5rem] py-1 leading-relaxed ${theme.quoteBorder} ${theme.quoteText}`}
              >
                &quot;{renderTextWithInlineFormatting(block.text)}&quot;
              </blockquote>
            );
          }

          if (block.type === 'h2') {
            return (
              <h2 
                key={idx} 
                className={theme.h2}
              >
                {block.text}
              </h2>
            );
          }

          if (block.type === 'h3') {
            return (
              <h3 
                key={idx} 
                className={theme.h3}
              >
                {block.text}
              </h3>
            );
          }

          if (block.type === 'sidenote') {
            return (
              <div key={idx} className="my-[2.0rem] space-y-3">
                <p className={`[&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors ${theme.paragraph} ${theme.linkHover}`}>
                  {renderTextWithInlineFormatting(block.text)}
                </p>
                <div className={`pl-5 border-l leading-relaxed py-0.5 select-none ${theme.sidenoteLine} ${theme.sidenoteText}`}>
                  {block.sidenoteText}
                </div>
              </div>
            );
          }

          if (block.type === 'code') {
            return (
              <div key={idx} className={`my-[2.0rem] ${p === 'operator'?'rounded-none':'rounded-lg'} font-mono overflow-hidden ${theme.codeWrapper}`}>
                <div className={`flex justify-between items-center px-6 py-2.5 border-b font-mono text-[10px] uppercase tracking-wider ${theme.codeHeader}`}>
                  <span>{block.codeLang || 'source'}</span>
                </div>
                <pre className="p-6 overflow-x-auto text-[12.5px] leading-relaxed max-md:text-[11.5px] select-text">
                  <code>{block.text}</code>
                </pre>
              </div>
            );
          }

          if (block.type === 'fragment' || block.text === '---' || block.text === '***') {
            return (
              <div key={idx} className={`my-8 flex justify-center select-none tracking-[0.5em] ${theme.divider}`}>
                •••
              </div>
            );
          }

          if (block.type === 'list' || block.type === 'ul') {
            const listItems = block.items || [block.text];
            return (
              <ul key={idx} className={`list-disc pl-6 space-y-[0.8rem] mb-[1.5rem] ${theme.paragraph}`}>
                {listItems.map((itemValue, i) => (
                  <li key={i}>{renderTextWithInlineFormatting(itemValue)}</li>
                ))}
              </ul>
            );
          }

          if (block.type === 'table') {
            const rows = block.rows || [];
            const headers = block.headers || [];
            return (
              <div key={idx} className="my-10 overflow-x-auto w-full">
                <table className="w-full text-left border-collapse text-[16px] md:text-[18px]">
                  {headers.length > 0 && (
                    <thead>
                      <tr className={"border-b " + theme.tableBorder}>
                        {headers.map((h, i) => (
                          <th key={i} className={"py-3 px-4 font-normal uppercase text-xs tracking-widest " + theme.tableHead}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {rows.map((row, ri) => (
                      <tr key={ri} className={`border-b last:border-0 transition-colors ${theme.tableCellBorder} ${theme.tableRowHover}`}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="py-3 px-4 font-light">{renderTextWithInlineFormatting(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          return null;
        })}
      </article>
    );
  };

  const renderContextMarker = () => {
    if (!post.location) return null;

    let type = 'observed-at';
    let value = post.location;

    if (post.slug === 'evening-train-ride') {
      type = 'transit';
      value = 'District 8 → Central Terminal';
    } else if (post.slug === 'conversations-that-stayed-longer') {
      type = 'observed-at';
      value = 'Coastal Platform 2';
    } else if (post.slug === 'certain-places-familiar') {
      type = 'written-from';
      value = 'Old Town Study';
    } else if (post.slug === 'rainy-train-ride-notes') {
      type = 'field-note';
      value = 'Central Transit Line';
    } else if (post.slug === 'temporary-places-comfort') {
      type = 'custom';
      value = 'Terminal Lounge';
    }

    return <FieldNoteDivider type={type as any} value={value} />;
  };

  const renderShareSection = () => (
    <div className="mt-4 mb-8 pb-8 border-b border-[#E5DCCF]/80 dark:border-[#E5DCCF]/15 text-center space-y-4">
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A7C70]/60 dark:text-[#B6A798]/50 block">
        Share this reflection
      </span>
      <div className="flex flex-row justify-center items-center gap-4 flex-nowrap whitespace-nowrap">
        <a
          href={`https://twitter.com/intent/tweet?url=${currentUrl ? encodeURIComponent(currentUrl) : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E5DCCF]/60 dark:border-[#E5DCCF]/15 text-[#8A7C70] dark:text-[#B6A798]/70 hover:text-[#B67A55] dark:hover:text-[#B97A56] hover:border-[#B67A55] dark:hover:border-[#B97A56] hover:bg-[#EAE3D5]/40 dark:hover:bg-[#15110E]/40 transition-all duration-300"
          title="Share on Twitter"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
          </svg>
        </a>

        <a
          href={`https://www.linkedin.com/shareArticle?url=${currentUrl ? encodeURIComponent(currentUrl) : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E5DCCF]/60 dark:border-[#E5DCCF]/15 text-[#8A7C70] dark:text-[#B6A798]/70 hover:text-[#B67A55] dark:hover:text-[#B97A56] hover:border-[#B67A55] dark:hover:border-[#B97A56] hover:bg-[#EAE3D5]/40 dark:hover:bg-[#15110E]/40 transition-all duration-300"
          title="Share on LinkedIn"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>

        <a
          href={`https://api.whatsapp.com/send?text=${currentUrl ? encodeURIComponent(currentUrl) : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E5DCCF]/60 dark:border-[#E5DCCF]/15 text-[#8A7C70] dark:text-[#B6A798]/70 hover:text-[#B67A55] dark:hover:text-[#B97A56] hover:border-[#B67A55] dark:hover:border-[#B97A56] hover:bg-[#EAE3D5]/40 dark:hover:bg-[#15110E]/40 transition-all duration-300"
          title="Share on WhatsApp"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </a>

        <button
          onClick={handleCopyLink}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#E5DCCF]/60 dark:border-[#E5DCCF]/15 text-[#8A7C70] dark:text-[#B6A798]/70 hover:text-[#B67A55] dark:hover:text-[#B97A56] hover:border-[#B67A55] dark:hover:border-[#B97A56] hover:bg-[#EAE3D5]/40 dark:hover:bg-[#15110E]/40 transition-all duration-300 cursor-pointer"
          title={copied ? "Copied!" : "Copy Link"}
        >
          {copied ? <Check className="w-[18px] h-[18px] text-[#B67A55] dark:text-[#B97A56]" /> : <Copy className="w-[18px] h-[18px]" />}
        </button>
      </div>
    </div>
  );

  const renderDiscoveryDesktop = () => (
    <div className="mt-16 w-full flex flex-col">
      <div className="flex mb-8">
        <div className={"inline-flex p-[3px] bg-transparent " + (p === 'operator' ? '' : 'rounded-full border ') + theme.tabBorder}>
          <button
            onClick={() => setActiveTab('top')}
            className={`px-4 py-1.5 cursor-pointer transition-all ${p === 'operator' ? '' : 'rounded-full '} ${
              activeTab === 'top' ? theme.tabActive : theme.tabInactive
            }`}
          >
            Top
          </button>
          <button
            onClick={() => setActiveTab('latest')}
            className={`px-4 py-1.5 cursor-pointer transition-all ${p === 'operator' ? '' : 'rounded-full '} ${
              activeTab === 'latest' ? theme.tabActive : theme.tabInactive
            }`}
          >
            Latest
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        {(activeTab === 'top' ? topPosts : latestPosts).slice(0, 3).map((item) => (
          <Link
            key={item.slug}
            href={`/p/${item.slug}`}
            className={"group block border-b py-8 first:pt-2 last:pb-0 last:border-0 " + theme.relatedItemBorder}
          >
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1 min-w-0">
                <h4 className={"transition-colors leading-snug " + theme.relatedTitleText}>
                  {item.title}
                </h4>
                <p className={"mt-2 leading-relaxed line-clamp-1 " + theme.discoveryExcerpt}>
                  {item.excerpt}
                </p>
                <span className={"font-mono text-[9px] uppercase tracking-wider block mt-3 " + theme.relatedDate}>
                  {item.date}
                </span>
              </div>
              {item.heroImage && (
                <div className={"w-24 sm:w-28 aspect-[4/3] flex-shrink-0 overflow-hidden select-none border " + theme.heroBg + " " + theme.heroBorder + (p==='operator'?' rounded-none':'')}>
                  <img 
                    src={item.heroImage} 
                    alt={item.title} 
                    className={`w-full h-full object-cover ${theme.heroFilter} group-hover:scale-105 transition-transform duration-500`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className={"pt-6 border-t mt-8 " + theme.viewAllBorder}>
        <Link
          href={`/${p}`}
          className={"inline-flex items-center gap-1 transition-all " + theme.viewAllAction}
        >
          {theme.wordingViewAll} <span className="font-sans">→</span>
        </Link>
      </div>
    </div>
  );

  const renderDiscoveryMobile = () => (
    <>
      <div className="flex mb-6">
        <div className={"inline-flex p-[3px] bg-transparent " + (p === 'operator' ? '' : 'rounded-full border ') + theme.tabBorder}>
          <button
            onClick={() => setActiveTab('top')}
            className={`px-4 py-1.5 cursor-pointer transition-all ${p === 'operator' ? '' : 'rounded-full '} ${
              activeTab === 'top' ? theme.tabActive + ' shadow-sm' : theme.tabInactive
            }`}
          >
            Top
          </button>
          <button
            onClick={() => setActiveTab('latest')}
            className={`px-4 py-1.5 cursor-pointer transition-all ${p === 'operator' ? '' : 'rounded-full '} ${
              activeTab === 'latest' ? theme.tabActive + ' shadow-sm' : theme.tabInactive
            }`}
          >
            Latest
          </button>
        </div>
      </div>

      <div className="flex flex-col">
        {(activeTab === 'top' ? topPosts : latestPosts).slice(0, 3).map((item) => (
          <Link
            key={item.slug}
            href={`/p/${item.slug}`}
            className={"group block border-b py-8 first:pt-1 last:pb-0 last:border-0 " + theme.relatedItemBorder}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h4 className={"transition-colors leading-snug " + theme.relatedTitleText}>
                  {item.title}
                </h4>
                <p className={"mt-1.5 leading-relaxed line-clamp-1 " + theme.discoveryExcerpt}>
                  {item.excerpt}
                </p>
                <span className={"font-mono text-[9px] uppercase tracking-wider block mt-2 " + theme.relatedDate}>
                  {item.date}
                </span>
              </div>
              {item.heroImage && (
                <div className={"w-20 aspect-[4/3] flex-shrink-0 overflow-hidden select-none border " + theme.heroBg + " " + theme.heroBorder + (p==='operator'?' rounded-none':'')}>
                  <img 
                    src={item.heroImage} 
                    alt={item.title} 
                    className={`w-full h-full object-cover ${theme.heroFilter} group-hover:scale-105 transition-transform duration-500`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className={"pt-6 border-t mt-6 mb-12 " + theme.viewAllBorder}>
        <Link
          href={`/${p}`}
          className={"inline-flex items-center gap-1 transition-all " + theme.viewAllAction}
        >
          {theme.wordingViewAll} <span className="font-sans">→</span>
        </Link>
      </div>
    </>
  );

  const CurrentFooter = { thinker: FooterThinker, builder: FooterBuilder, operator: FooterOperator, wanderer: FooterWanderer }[p] || FooterWanderer;
  const personaCapitalized = p.charAt(0).toUpperCase() + p.slice(1);
  const mobileNavBg = p === "thinker" ? "dark:bg-[#171B20] bg-[#ECEAE7]" : p === "wanderer" ? "dark:bg-[#221C18] bg-[#EEE7DE]" : p === "builder" ? "dark:bg-neutral-950 bg-[#F3F2EE]" : "dark:bg-[#080b09] bg-[#EDF1EC]";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`min-h-screen flex flex-col relative w-full overflow-x-clip ${theme.wrapper}`}
    >
      <header className={`sticky top-0 z-40 w-full p-4 md:p-6 flex justify-between items-center bg-opacity-70 backdrop-blur-md border-b ${theme.headerBg}`}>
        <PersonaSwitcher currentPersona={personaCapitalized} currentStyle={theme.themeToggleText} />
        <div className="flex items-center gap-1 md:gap-2">
          <DesktopNav persona={p as any} />
          <PersonaSearch persona={personaCapitalized} mobileBgColor={mobileNavBg} />
          <ThemeToggle />
          <MobileNav persona={p as any} mobileBgColor={mobileNavBg} />
        </div>
      </header>

      <main className="flex-1 w-full px-5 sm:px-8 md:px-12 lg:px-16 pt-8 md:pt-10 pb-20 relative z-10">
        <div className="max-w-[1050px] mx-auto w-full">
          
          <div className="hidden lg:grid grid-cols-10 gap-16 w-full items-start">
            <div className="col-span-6 flex flex-col w-full">
              {renderArticleHeader()}
              {renderArticleBody()}
              {renderContextMarker()}
              {renderShareSection()}
              {renderDiscoveryDesktop()}
            </div>

            <div className="col-span-4 pl-4 sticky top-24 h-[calc(100vh-6rem)] flex flex-col justify-center self-start">
              <div className="space-y-12 w-full">
                {renderRelatedReflections()}
                {renderNewsletter(true)}
              </div>
            </div>
          </div>

          <div className="block lg:hidden w-full max-w-[650px] mx-auto flex flex-col">
            {renderArticleHeader()}
            {renderArticleBody()}
            {renderContextMarker()}
            {renderShareSection()}
            
            <div className={`mb-6 pb-6 border-b ${theme.relatedSectionBorder}`}>
              {renderRelatedReflections()}
            </div>

            <div className={`mb-6 pb-6 border-b ${theme.relatedSectionBorder}`}>
              {renderNewsletter(false)}
            </div>

            {renderDiscoveryMobile()}
          </div>

        </div>
      </main>

      <CurrentFooter />
    </motion.div>
  );
}
