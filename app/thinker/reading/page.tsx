'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { getPersonaUrl } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { getBooks } from '@/lib/queries';
import type { Book } from '@/lib/types';

// Deterministic cover style generator
const getCoverStyle = (title: string) => {
  const styles = [
    "bg-[#F4F1EA] dark:bg-[#1F2124] text-[#2F3134] dark:text-[#E0DBD3] border-[#E1DDD4] dark:border-[#2F3237]",
    "bg-[#ECE2DB] dark:bg-[#25201C] text-[#423730] dark:text-[#EADEC9] border-[#DECFC5] dark:border-[#38312A]",
    "bg-[#E5E9EC] dark:bg-[#191D21] text-[#2D3338] dark:text-[#CBD3DC] border-[#D1D9E0] dark:border-[#272C33]",
    "bg-[#D7D8D2] dark:bg-[#1A1D1A] text-[#2E302C] dark:text-[#BFC5B9] border-[#C2C4BA] dark:border-[#292D28]",
    "bg-[#EFECE6] dark:bg-[#1C1E20] text-[#2F3134] dark:text-[#DFD8CD] border-[#E6E1D8] dark:border-[#2A2B2E]",
    "bg-[#EBEBE4] dark:bg-[#1D1F1B] text-[#3A3C3F] dark:text-[#DDD8CD] border-[#DCDAD2] dark:border-[#2A2D28]"
  ];
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return styles[Math.abs(hash) % styles.length];
};

export default function ReadingPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        const fetchedBooks = await getBooks();
        setBooks(fetchedBooks.filter(b => !b.hidden)); // Filter out hidden books if that field exists or just use them
      } catch (err) {
        console.error("Failed to load books", err);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const recommendedBooks = books.filter(b => b.featured);
  const bookshelfBooks = books.filter(b => !b.featured);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center font-sans dark:text-[#A7A39B] text-[#55524B] antialiased">
        <p className="text-[11px] font-mono tracking-widest uppercase opacity-70">Dusting the shelves...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full font-sans dark:text-[#A7A39B] text-[#55524B] antialiased"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-16">
        
        {/* Back navigation */}
        <Link 
          href={getPersonaUrl('thinker', '/')} 
          className="group text-[11px] tracking-[0.15em] font-mono text-[#7E7A73] hover:text-[#2F3134] dark:hover:text-[#DEDAD3] transition-colors duration-300 inline-flex items-center gap-2 mb-12 uppercase"
        >
          <span>&larr;</span> Back to Thinker
        </Link>

        {/* Page Header */}
        <header className="mb-16 md:mb-24">
          <span className="text-[10px] md:text-[11px] tracking-[0.25em] text-[#7E7A73] mb-4 block font-mono uppercase opacity-70">
            Study // Bookshelf
          </span>
          <h1 className="text-4xl md:text-5xl text-[#2F3134] dark:text-[#DEDAD3] tracking-wide font-cormorant font-normal leading-tight mb-4 select-none">
            Reading Shelf
          </h1>
          <p className="text-[#8E8A81] dark:text-[#7E7A73] text-[15.5px] md:text-lg font-light leading-relaxed max-w-xl mb-6">
            Books that shaped how I think, learn, and see the world.
          </p>
          <div className="text-[11px] font-mono tracking-widest text-[#7E7A73]/70 uppercase select-none">
            {books.length} {books.length === 1 ? 'book' : 'books'} collected so far
          </div>
        </header>

        {books.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-[#E2DFDA] dark:border-[rgba(255,255,255,0.03)] rounded-sm">
            <p className="text-[#8E8A81] dark:text-[#7E7A73] text-[15px] font-light">
              The shelf is currently empty. Check back soon for new additions.
            </p>
          </div>
        ) : (
          <div className="space-y-24 md:space-y-36">
            
            {/* SECTION 1: RECOMMENDED FIRST */}
            {recommendedBooks.length > 0 && (
              <section id="recommended" className="scroll-mt-24">
                <span className="text-[10px] md:text-[11px] tracking-[0.25em] text-[#7E7A73] block font-mono uppercase opacity-70 mb-10 w-full border-b border-[#E2DFDA] dark:border-[rgba(255,255,255,0.03)] pb-3">
                  Recommended First
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-10 lg:gap-x-12 gap-y-12 sm:gap-y-16">
                  {recommendedBooks.map((book, idx) => {
                    const coverStyle = getCoverStyle(book.title);
                    return (
                    <div key={book.id || idx} className="group flex flex-col justify-between">
                      <div className="w-full">
                        {/* Simulated Book Cover Graphic */}
                        <div className={`aspect-[2/3] w-full max-w-[170px] sm:max-w-[190px] mx-auto md:mx-0 relative mb-6 rounded-sm shadow-sm md:shadow-md border ${coverStyle} overflow-hidden select-none flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1`}>
                          {/* Spine Crease / Ridge Overlay */}
                          <div className="absolute top-0 bottom-0 left-2 sm:left-3 w-[1px] bg-black/10 dark:bg-white/5 shadow-[1px_0_2px_rgba(0,0,0,0.05),-1px_0_1px_rgba(255,255,255,0.1)] h-full" />
                          
                          <div className="flex flex-col h-full justify-between relative z-10 pl-1.5 sm:pl-2">
                            {/* Top corner label */}
                            <span className="text-[7.5px] sm:text-[8px] font-mono tracking-[0.2em] opacity-40 uppercase">
                              Recommended
                            </span>
                            
                            {/* Title in striking cormorant italic typography */}
                            <div className="my-auto py-3 sm:py-4">
                              <h4 className="text-lg sm:text-xl md:text-2xl font-cormorant font-normal leading-tight tracking-wide mb-1 line-clamp-2 select-text">
                                {book.title}
                              </h4>
                              <p className="text-[10px] sm:text-[11.5px] italic font-cormorant opacity-75 line-clamp-1 select-text">
                                by {book.author}
                              </p>
                            </div>
                            
                            {/* Bottom publisher detail */}
                            <div className="flex items-center justify-between border-t border-current/10 pt-2 sm:pt-3 opacity-30 text-[7px] sm:text-[8px] font-mono tracking-wider">
                              <span>EDITION 01</span>
                              <span>STUDY</span>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-cormorant font-normal text-[#2F3134] dark:text-[#DEDAD3] tracking-wide mb-1">
                          {book.title}
                        </h3>
                        <p className="text-[11px] sm:text-[11.5px] italic font-cormorant text-[#7E7A73] mb-3">
                          by {book.author}
                        </p>
                      </div>
                      
                      {/* Personal Note */}
                      {book.notes && (
                        <div className="min-h-[2.5rem] mt-1">
                          <p className="text-[13px] sm:text-[13.5px] text-[#55524B] dark:text-[#A7A39B] leading-relaxed font-light line-clamp-2">
                            {book.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              </section>
            )}

            {/* SECTION 2: BOOK SHELF */}
            {bookshelfBooks.length > 0 && (
              <section id="bookshelf" className="scroll-mt-24 pb-16">
                <span className="text-[10px] md:text-[11px] tracking-[0.25em] text-[#7E7A73] block font-mono uppercase opacity-70 mb-10 w-full border-b border-[#E2DFDA] dark:border-[rgba(255,255,255,0.03)] pb-3">
                  Book Shelf
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-12">
                  {bookshelfBooks.map((book, idx) => {
                    const coverStyle = getCoverStyle(book.title);
                    return (
                    <div 
                      key={book.id || idx} 
                      className="group cursor-pointer flex flex-col justify-between"
                      onClick={() => {
                        // Future prep: clickable block ready for navigation hook
                      }}
                    >
                      <div className="w-full">
                        {/* Simulated Book Cover Graphic */}
                        <div className={`aspect-[2/3] w-full relative mb-4 rounded-sm border ${coverStyle} overflow-hidden select-none flex flex-col justify-between p-3 sm:p-4 transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1`}>
                          {/* Spine Crease / Ridge Overlay */}
                          <div className="absolute top-0 bottom-0 left-2 sm:left-2.5 w-[1px] bg-black/10 dark:bg-white/5 shadow-[1px_0_2px_rgba(0,0,0,0.05)] h-full" />
                          
                          <div className="flex flex-col h-full justify-between relative z-10 pl-1.5 sm:pl-2">
                            {/* Small serial identifier */}
                            <span className="text-[6.5px] sm:text-[7.5px] font-mono tracking-widest opacity-40 uppercase truncate block">
                              No. {String(idx + 1).padStart(2, '0')}
                            </span>
                            
                            {/* Small elegant serif heading */}
                            <div className="my-auto py-1 sm:py-2">
                              <h4 className="text-[11px] sm:text-xs md:text-sm font-cormorant leading-tight tracking-wide font-normal mb-0.5 line-clamp-2 select-text">
                                {book.title}
                              </h4>
                              <p className="text-[8px] sm:text-[9.5px] font-sans font-light opacity-75 line-clamp-1 select-text">
                                {book.author}
                              </p>
                            </div>
                            
                            {/* Shelf marking */}
                            <div className="flex items-center justify-between text-[6.5px] sm:text-[7.5px] font-mono tracking-widest opacity-35 whitespace-nowrap overflow-hidden">
                              <span className="truncate">{book.category?.toUpperCase() || 'STUDY'}</span>
                              <span className="opacity-70">B.K.</span>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-[13px] sm:text-[14.5px] md:text-base font-sans font-normal text-[#2F3134] dark:text-[#DEDAD3] leading-snug mb-0.5 group-hover:text-[#7E7A73] transition-colors duration-200 line-clamp-2 min-h-[2.25rem] sm:min-h-[2.75rem]">
                          {book.title}
                        </h3>
                        <p className="text-[10.5px] sm:text-[11.5px] italic font-cormorant text-[#7E7A73]/95 mb-2 leading-none line-clamp-1">
                          by {book.author}
                        </p>
                      </div>
                      
                      {/* Elegant Outlined Category Tag Pill */}
                      {book.category && (
                        <div className="mt-1">
                          <span className="inline-block text-[8px] sm:text-[9px] tracking-wider font-mono text-[#7E7A73] uppercase border border-[#E2DFDA] dark:border-[rgba(255,255,255,0.06)] px-2 py-0.5 rounded-full select-none opacity-85 hover:opacity-100 transition-opacity">
                            {book.category}
                          </span>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              </section>
            )}

          </div>
        )}

      </div>
    </motion.div>
  );
}
