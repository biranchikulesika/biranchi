'use client';

import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { PersonaSearch } from '@/components/persona-search';
import { getPersonaUrl } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { getRedistributionRecords } from '@/lib/queries';
import { ThemeToggle } from '@/components/theme-toggle';
import { SOCIAL_LINKS } from '@/lib/config/socials';
import jsPDF from 'jspdf';





export default function FundPage() {
  const [flowStep, setFlowStep] = useState<'idle' | 'identity' | 'processing' | 'success'>('idle');
  const [identityOption, setIdentityOption] = useState<'anonymous' | 'name' | 'name_email'>('anonymous');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [mockTxId, setMockTxId] = useState('');
  const [mockReceiptId, setMockReceiptId] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [savedEmail, setSavedEmail] = useState('');
  const [updateEmailInput, setUpdateEmailInput] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  const [amount, setAmount] = useState('');

  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [isRecordsOpen, setIsRecordsOpen] = useState(false);

  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({
    '2026': true
  });

  const toggleYear = (year: string) => {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;

  const [records, setRecords] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [redirectedTotal, setRedirectedTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  const [localCurrency, setLocalCurrency] = useState<{code: string, rate: number} | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRedistributionRecords();
        if (data) {
           // Sort by descending date
           const sorted = data.filter((r:any) => !r.hidden).sort((a:any, b:any) => new Date(b.donatedAt || 0).getTime() - new Date(a.donatedAt || 0).getTime());

           let total = 0;
           const formattedRecords = sorted.map((r:any, idx:number) => {
              const amt = Number(r.amount) || 0;
              total += amt;
              return {
                 id: r.id || idx,
                 date: r.donatedAt ? new Date(r.donatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown',
                 amount: `₹${amt.toLocaleString()}`,
                 name: r.destination,
                 category: 'Community',
                 desc: r.description,
                 proof: r.proofUrl || '#'
              };
           });
           setRecords(formattedRecords);
           setRedirectedTotal(total);

           // dynamically calculate history
           const yearGroups: Record<string, any> = {};
           sorted.forEach((r:any) => {
              const amt = Number(r.amount) || 0;
              const d = new Date(r.donatedAt || 0);
              const year = d.getFullYear().toString();
              const month = d.toLocaleDateString('en-US', {month: 'short'});
              if (!yearGroups[year]) yearGroups[year] = { total: 0, months: {} };
              yearGroups[year].total += amt;
              if (!yearGroups[year].months[month]) yearGroups[year].months[month] = 0;
              yearGroups[year].months[month] += amt;
           });

           const newHistory = Object.keys(yearGroups).sort((a,b)=>Number(b)-Number(a)).map(year => {
              const yg = yearGroups[year];
              return {
                 year,
                 total: `₹${yg.total.toLocaleString()}`,
                 months: Object.keys(yg.months).map(m => ({ month: m, amount: `₹${yg.months[m].toLocaleString()}` }))
              };
           });
           setHistory(newHistory);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
    
    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    async function fetchRates() {
      try {
        const cached = sessionStorage.getItem('local_currency_rate');
        if (cached) {
          setLocalCurrency(JSON.parse(cached));
          return;
        }

        const ipRes = await fetch('https://ipapi.co/currency/');
        if (!ipRes.ok) return;
        const code = (await ipRes.text()).trim();

        if (!code || code === 'INR' || code.length !== 3) return;

        const rateRes = await fetch('https://open.er-api.com/v6/latest/INR');
        if (!rateRes.ok) return;
        const rateData = await rateRes.json();
        const rate = rateData.rates[code];

        if (rate) {
          const data = { code, rate };
          sessionStorage.setItem('local_currency_rate', JSON.stringify(data));
          setLocalCurrency(data);
        }
      } catch (err) {
        // This commonly fails if the user has an ad-blocker (e.g. Brave) blocking ipapi.co.
        // It gracefully falls back to displaying INR, so we just log a debug warning.
        console.warn("Currency localization info skipped (likely blocked by privacy extensions).");
      }
    }
    fetchRates();
  }, []);

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseInt(amount) < 10) return;
    setFlowStep('identity');
  };

  const handleIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    setFlowStep('processing');
    
    try {
      // 1. Create order on our backend
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          name: donorName.trim() || undefined,
          email: donorEmail.trim() || undefined,
          phone: donorPhone.trim() || undefined
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Failed to create order');
        setFlowStep('identity');
        return;
      }
      
      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Biranchi',
        description: 'Contribution to Fund',
        order_id: data.orderId,
        handler: function (response: any) {
          // On Success
          setMockReceiptId(`RG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
          setMockTxId(response.razorpay_payment_id);
          
          if (identityOption === 'name_email') {
             setSavedEmail(donorEmail);
          }
          setFlowStep('success');
          window.scrollTo({ top: 0, behavior: 'instant' });
        },
        prefill: {
          name: donorName.trim(),
          email: donorEmail.trim(),
          contact: donorPhone.trim()
        },
        theme: {
          color: '#050505'
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert('Payment failed: ' + response.error.description);
        setFlowStep('identity');
      });
      rzp.open();
      
    } catch (err) {
      console.error(err);
      alert('An error occurred during checkout');
      setFlowStep('identity');
    }
  };

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    // Minimalistic modern receipt design
    doc.setFontSize(22);
    doc.text('RECEIPT', 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('OF CONTRIBUTION', 20, 38);
    
    doc.setTextColor(0);
    doc.setFontSize(12);
    
    doc.text(`Receipt ID: ${mockReceiptId}`, 20, 60);
    doc.text(`Date: ${dateStr}`, 20, 70);
    doc.text(`Transaction ID: ${mockTxId}`, 20, 80);
    
    doc.text(`Contributor: ${donorName || 'Anonymous'}`, 20, 100);
    if (donorEmail) {
       doc.text(`Email: ${donorEmail}`, 20, 110);
    }
    if (donorPhone) {
       doc.text(`Phone: ${donorPhone}`, 20, donorEmail ? 120 : 110);
    }
    
    doc.setFontSize(16);
    doc.text(`Amount: INR ${amount}`, 20, 140);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Status: Collected (Pending Redistribution)', 20, 160);
    doc.text('Thank you for your generosity.', 20, 170);
    doc.text('This contribution will become part of a future redistribution cycle.', 20, 176);
    
    doc.save(`Receipt_${mockReceiptId}.pdf`);
  };

  const handleEmailSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (updateEmailInput) {
          setSavedEmail(updateEmailInput);
          setIsUpdatingEmail(false);
          setUpdateEmailInput('');
      }
  };

  const renderIdentityState = () => {
    if (identityOption === 'anonymous') {
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 font-sans font-light text-[15px] dark:text-[#a09a8e] text-[#55514a] leading-relaxed">
            <p>You contributed anonymously.</p>
            <p>If you&apos;d like updates about future redistribution records, you may optionally share an email address below.</p>
          </div>
          {!savedEmail ? (
            <form onSubmit={handleEmailSave} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center max-w-md w-full">
              <input type="email" required placeholder="Email (optional)" value={updateEmailInput} onChange={e => setUpdateEmailInput(e.target.value)} className="w-full bg-transparent border-b dark:border-stone-700 border-stone-300 py-3 outline-none font-sans text-[15px] focus:dark:border-stone-400 focus:border-stone-600 transition-colors" />
              <button type="submit" disabled={!updateEmailInput} className="px-6 py-3 border dark:border-stone-800 border-stone-300 dark:text-stone-300 text-stone-700 hover:bg-black/5 dark:hover:bg-white/5 transition-colors uppercase tracking-[0.2em] text-[10px] font-medium disabled:opacity-30 whitespace-nowrap">Save Email</button>
            </form>
          ) : (
             <div className="font-mono text-[11px] uppercase tracking-widest dark:text-stone-400 text-stone-600 flex items-center gap-3">
               <span>Email saved: {savedEmail}</span>
               <button onClick={() => setSavedEmail('')} className="underline opacity-60 hover:opacity-100">Edit</button>
             </div>
          )}
        </div>
      );
    }
    if (identityOption === 'name') {
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 font-sans font-light text-[15px] dark:text-[#a09a8e] text-[#55514a] leading-relaxed">
            <p>Thank you, {donorName}.</p>
            <p>If you&apos;d like updates about future redistribution records, you may optionally add an email address below.</p>
          </div>
          {!savedEmail ? (
            <form onSubmit={handleEmailSave} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center max-w-md w-full">
              <input type="email" required placeholder="Email (optional)" value={updateEmailInput} onChange={e => setUpdateEmailInput(e.target.value)} className="w-full bg-transparent border-b dark:border-stone-700 border-stone-300 py-3 outline-none font-sans text-[15px] focus:dark:border-stone-400 focus:border-stone-600 transition-colors" />
              <button type="submit" disabled={!updateEmailInput} className="px-6 py-3 border dark:border-stone-800 border-stone-300 dark:text-stone-300 text-stone-700 hover:bg-black/5 dark:hover:bg-white/5 transition-colors uppercase tracking-[0.2em] text-[10px] font-medium disabled:opacity-30 whitespace-nowrap">Save Email</button>
            </form>
          ) : (
             <div className="font-mono text-[11px] uppercase tracking-widest dark:text-stone-400 text-stone-600 flex items-center gap-3">
               <span>Email saved: {savedEmail}</span>
               <button onClick={() => setSavedEmail('')} className="underline opacity-60 hover:opacity-100">Edit</button>
             </div>
          )}
        </div>
      );
    }
    if (identityOption === 'name_email') {
      return (
        <div className="flex flex-col gap-6 items-start">
          <div className="flex flex-col gap-2 font-sans font-light text-[15px] dark:text-[#a09a8e] text-[#55514a] leading-relaxed">
            <p>Thank you, {donorName}.</p>
            <p>Important updates related to redistribution records may be sent to:</p>
            <p className="dark:text-stone-300 text-stone-700 mt-2">{savedEmail}</p>
          </div>
          {isUpdatingEmail ? (
            <form onSubmit={handleEmailSave} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full max-w-md mt-2">
              <input type="email" required placeholder="New Email" value={updateEmailInput} onChange={e => setUpdateEmailInput(e.target.value)} className="w-full bg-transparent border-b dark:border-stone-700 border-stone-300 py-3 outline-none font-sans text-[15px] focus:dark:border-stone-400 focus:border-stone-600 transition-colors" />
              <button type="submit" disabled={!updateEmailInput} className="px-6 py-3 border dark:border-stone-800 border-stone-300 dark:text-stone-300 text-stone-700 hover:bg-black/5 dark:hover:bg-white/5 transition-colors uppercase tracking-[0.2em] text-[10px] font-medium disabled:opacity-30 whitespace-nowrap">Update</button>
              <button type="button" onClick={() => setIsUpdatingEmail(false)} className="px-6 py-3 dark:text-stone-400 text-stone-500 uppercase tracking-[0.2em] text-[10px] font-medium hover:opacity-70 transition-opacity">Cancel</button>
            </form>
          ) : (
            <button onClick={() => setIsUpdatingEmail(true)} className="mt-2 px-6 py-3 border dark:border-stone-800 border-stone-300 dark:text-stone-300 text-stone-700 hover:bg-black/5 dark:hover:bg-white/5 transition-colors uppercase tracking-[0.2em] text-[10px] font-medium">Update Email</button>
          )}
        </div>
      );
    }
    return null;
  };

  const totalPages = Math.ceil(records.length / recordsPerPage);
  const paginatedRecords = records.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  if (flowStep === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full dark:bg-[#050505] bg-[#F5F5F2] dark:text-[#e5e5e5] text-[#2B2B28] flex flex-col font-sans overflow-x-hidden relative min-h-screen dark:selection:bg-stone-800 selection:bg-stone-300 dark:selection:text-white selection:text-black"
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

        <div className="grow flex flex-col items-start justify-center px-6 pt-32 pb-16 max-w-2xl mx-auto w-full min-h-[70vh]">
          <h1 className="font-serif text-3xl md:text-4xl italic dark:text-stone-200 text-stone-800 tracking-tight mb-2">
            Thank You
          </h1>
          <p className="font-sans font-light text-[15px] dark:text-[#a09a8e] text-[#55514a] mb-12">
            Your contribution has been received.
          </p>

          <div className="w-full flex items-center justify-center py-6 mb-12 border dark:border-stone-800 border-stone-200 dark:bg-[#080808] bg-[#f8f8f8]">
            <span className="font-mono text-sm md:text-base uppercase tracking-[0.2em] dark:text-stone-300 text-stone-700">
              {mockReceiptId}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full">
            <button onClick={handleDownloadReceipt} className="flex-1 w-full px-6 py-4 border dark:border-stone-800 border-stone-300 dark:text-stone-300 text-stone-700 hover:bg-black/5 dark:hover:bg-white/5 transition-colors uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-medium text-center">
              Download Receipt
            </button>
            <button onClick={() => setIsShareOpen(true)} className="flex-1 w-full px-6 py-4 border dark:border-stone-800 border-stone-300 dark:text-stone-300 text-stone-700 hover:bg-black/5 dark:hover:bg-white/5 transition-colors uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-medium text-center">
              Share Contribution
            </button>
          </div>

          <div className="w-full pt-12 border-t dark:border-stone-800/40 border-stone-200/80 text-left flex flex-col gap-4">
            {renderIdentityState()}
          </div>
        </div>

        {/* SHARE MODAL (Contextual to Success page) */}
        <AnimatePresence>
          {isShareOpen && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-950/40 dark:bg-black/80 backdrop-blur-md"
                onClick={() => setIsShareOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 w-full max-w-100 flex flex-col gap-6"
              >
                <div className="aspect-square w-full dark:bg-[#030303] bg-white border dark:border-stone-800 border-stone-300 p-8 md:p-10 flex flex-col justify-between text-left shadow-2xl relative">
                  <div>
                    <div className="font-serif italic text-2xl dark:text-stone-200 text-stone-800">Redirected Generosity</div>
                    <div className="mt-8">
                       <span className="font-sans text-5xl dark:text-stone-200 text-stone-800 tracking-tight">₹{amount}</span>
                       <span className="block font-mono text-[10px] uppercase tracking-widest dark:text-stone-500 text-stone-500 mt-2">Contributed</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t dark:border-stone-800/40 border-stone-200/80 pt-6">
                    <span className="font-sans font-light text-[13px] md:text-sm dark:text-stone-400 text-stone-500 leading-relaxed">
                      The contribution will become part of a future redistribution cycle.
                    </span>
                    <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] dark:text-stone-600 text-stone-400">
                      biranchi.dev/fund
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsShareOpen(false)}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] dark:text-stone-500 text-stone-400 hover:dark:text-stone-300 hover:text-stone-600 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Footer */}
        <footer className="w-full px-6 md:px-16 lg:px-24 py-6 md:py-14 flex flex-col md:flex-row justify-between items-center gap-5 md:gap-4 z-50 bg-transparent border-t dark:border-stone-850/20 border-[#ECEBE6]">
          {/* Left */}
          <div className="md:flex-1 flex justify-center md:justify-start order-1 text-center md:text-left">
            <span className="font-sans font-light text-[14px] dark:text-stone-500/60 text-[#6E6A64]/60">
              Most things take longer than expected.
            </span>
          </div>

          {/* Center */}
          <div className="md:flex-1 flex flex-col items-center gap-1 order-2 text-center">
            <span className="font-serif text-[15px] md:text-[16px] dark:text-stone-500/70 text-[#6E6A64]/70 tracking-wide">
              Biranchi Kulesika
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] dark:text-stone-600/50 text-[#6E6A64]/50">
              India · 2026
            </span>
          </div>

          {/* Right */}
          <div className="md:flex-1 flex justify-center md:justify-end items-center gap-5 md:gap-6 order-3 font-sans font-light text-[14px] dark:text-stone-500/60 text-[#6E6A64]/60">
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="hover:dark:text-stone-400 hover:text-stone-900 transition-colors duration-500">
              GitHub
            </a>
            <span className="dark:text-stone-800/50 text-[#6E6A64]/40 md:hidden">·</span>
            <a href={SOCIAL_LINKS.email} className="hover:dark:text-stone-400 hover:text-stone-900 transition-colors duration-500">
              Email
            </a>
          </div>
        </footer>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-full dark:bg-[#050505] bg-[#F5F5F2] dark:text-[#e5e5e5] text-[#2B2B28] flex flex-col font-sans overflow-x-hidden relative min-h-screen dark:selection:bg-stone-800 selection:bg-stone-300 dark:selection:text-white selection:text-black"
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

      <main className="grow pt-32 pb-4 md:pt-40 px-6 md:px-12 mx-auto w-full max-w-6xl flex flex-col">

        {/* SCREEN 1: MESSAGE + ACTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start pb-16 md:pb-32">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-6 md:gap-8 lg:pr-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl italic dark:text-stone-200 text-stone-800 tracking-tight leading-tight">
              Redirected Generosity
            </h1>
            <div className="flex flex-col gap-4 font-sans font-light text-[15px] md:text-lg leading-relaxed dark:text-[#a09a8e] text-[#55514a]">
              <p>I don&apos;t depend on contributions.</p>
              <p>If you&apos;d like to support this ecosystem anyway, the contribution won&apos;t stay here.</p>
              <p>Funds received through this page are redirected to people, causes, and initiatives documented below.</p>
              <p>After unavoidable payment processing and transfer costs, the remaining amount becomes part of the redistribution cycle.</p>
            </div>
            <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest dark:text-stone-500 text-stone-400 mt-2">
              REDIRECTED, NOT RETAINED.
            </span>
          </div>

          {/* RIGHT SIDE: PAYMENT BOX */}
          <div className="w-full max-w-md ml-auto flex flex-col gap-5 border dark:border-stone-800 border-stone-300 p-8 md:p-10 dark:bg-[#080808] bg-white">
            <h2 className="font-serif text-xl md:text-2xl italic dark:text-stone-200 text-stone-800 mb-2">Pass It Forward</h2>

            <form onSubmit={handleInitialSubmit} className="flex flex-col gap-5">
              <div className="flex items-center border-b dark:border-stone-700 border-stone-300 py-3 transition-colors focus-within:dark:border-stone-400 focus-within:border-stone-600">
                <span className="font-sans text-xl dark:text-stone-400 text-stone-600 mr-2">₹</span>
                <input
                  type="number"
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full bg-transparent font-sans text-lg outline-none placeholder:dark:text-stone-700 placeholder:text-stone-400 dark:text-stone-200 text-stone-800"
                />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider dark:text-stone-500 text-stone-500 -mt-2">Minimum ₹10</span>

              <button type="submit" className="px-6 py-4 mt-2 border dark:border-stone-800 border-stone-300 dark:text-stone-200 text-stone-800 hover:bg-black/5 dark:hover:bg-white/5 transition-colors uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-medium w-full text-center">
                Continue
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    const section = document.getElementById('generosity-redirected');
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="font-sans font-light text-[11px] md:text-xs dark:text-stone-500 text-stone-400 hover:dark:text-stone-300 hover:text-stone-600 transition-colors tracking-wide"
                >
                  See where it goes ↓
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* SCREEN 2: TRANSPARENCY + PROOF */}
        <section id="generosity-redirected" className="flex flex-col gap-12 md:gap-16 pt-16 md:pt-24 border-t dark:border-stone-800/40 border-stone-200/80">

          {/* HEADER */}
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-3xl md:text-4xl italic dark:text-stone-200 text-stone-800 tracking-tight">Generosity Redirected</h2>
            <div className="flex flex-col gap-2 font-sans font-light text-[15px] md:text-base leading-relaxed dark:text-[#a09a8e] text-[#55514a]">
              <p>Public records of where redistributed funds were directed.</p>
              <p>Amounts shown reflect distributions made after payment processing and transfer costs.</p>
            </div>
          </div>

          {/* TABLE */}
          <div className="flex flex-col border-t dark:border-stone-800/40 border-stone-200/80">
            {records.length === 0 ? (
              <div className="py-12 border-b dark:border-stone-800/40 border-stone-200/80 text-left flex flex-col gap-4">
                <p className="font-sans font-light text-[15px] dark:text-[#a09a8e] text-[#55514a]">No redistribution records yet.</p>
                <p className="font-sans font-light text-[15px] dark:text-[#a09a8e] text-[#55514a]">When funds are redirected, the recipient, amount, date, and supporting proof will appear here.</p>
              </div>
            ) : (
              <>
                {/* Table Header (Desktop Only) */}
                <div className="hidden md:flex py-4 px-2 border-b dark:border-stone-800/40 border-stone-200/80 font-mono text-[10px] uppercase tracking-widest text-stone-500">
                   <div className="md:w-3/12">Date</div>
                   <div className="md:w-3/12">Amount</div>
                   <div className="md:w-6/12">Recipient</div>
                </div>

                {/* Table Rows */}
                {paginatedRecords.map((r) => (
                  <div key={r.id} className="flex items-center py-5 md:py-6 md:px-2 border-b dark:border-stone-800/40 border-stone-200/80 group hover:dark:bg-stone-900/20 hover:bg-stone-50 transition-colors">

                    <div className="flex w-full">
                      <div className="w-3/12 shrink-0 my-auto font-mono text-[10px] md:text-[13px] uppercase tracking-widest text-stone-500 md:font-sans md:normal-case md:tracking-normal md:dark:text-[#a09a8e] md:text-[#55514a]">
                        {r.date}
                      </div>

                      <div className="w-3/12 shrink-0 my-auto font-sans text-lg md:text-xl dark:text-stone-200 text-stone-800 tracking-tight">
                        {r.amount}
                      </div>

                      <div className="w-6/12 my-auto">
                        <button
                          onClick={() => setSelectedRecipient(r)}
                          className="text-left font-sans text-[15px] md:text-base dark:text-stone-200 text-stone-800 tracking-tight underline decoration-stone-500/30 underline-offset-4 hover:decoration-stone-500 transition-colors"
                        >
                          {r.name}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination (Only show if > 4 records) */}
                {records.length > 4 && (
                  <div className="flex items-center justify-between py-6 px-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 disabled:opacity-30 transition-colors"
                    >
                      ← Prev
                    </button>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 disabled:opacity-30 transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* TRANSPARENCY SUMMARY */}
          <div className="flex flex-col items-center justify-center text-center gap-6 py-4 md:py-8">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-stone-500">Redirected So Far</span>
              <span className="font-sans text-5xl md:text-7xl text-stone-800 dark:text-stone-200 tracking-tight">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(redirectedTotal)}
              </span>
              {redirectedTotal === 0 ? (
                <span className="font-sans text-[13px] md:text-[14px] dark:text-stone-500 text-stone-400 mt-2">
                  No funds have been redistributed yet.
                </span>
              ) : localCurrency ? (
                <span title="Approximate value based on current exchange rates." className="font-sans text-[13px] md:text-[14px] dark:text-stone-500 text-stone-400 cursor-help mt-1">
                  ≈ {new Intl.NumberFormat(undefined, {style: 'currency', currency: localCurrency.code, maximumFractionDigits: 0}).format(redirectedTotal * localCurrency.rate)} <span className="font-light opacity-70 ml-1">(Current estimate)</span>
                </span>
              ) : null}
            </div>

            <button
              onClick={() => setIsRecordsOpen(!isRecordsOpen)}
              className="mt-4 px-6 py-3 border dark:border-stone-800 border-stone-300 dark:text-stone-300 text-stone-700 hover:bg-black/5 dark:hover:bg-white/5 transition-colors uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-medium"
            >
              {isRecordsOpen ? 'Close Records' : 'View Full Records'}
            </button>

            <AnimatePresence>
              {isRecordsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden w-full max-w-lg mx-auto"
                >
                  <div className="flex flex-col font-mono text-xs md:text-sm mt-12 pt-8 border-t dark:border-stone-800/40 border-stone-200/80 text-left">

                    {/* Timestamp */}
                    <div className="font-mono text-[9px] uppercase tracking-wider dark:text-stone-500 text-stone-400 mb-8 leading-relaxed text-center flex flex-col gap-4">
                      <span>Last updated:<br/>1 June 2026, 9:42 PM IST</span>
                      <span className="font-sans font-light text-[11px] normal-case tracking-normal dark:text-stone-600 text-stone-400">
                        All records are maintained in Indian Rupees (INR).<br/>Approximate local currency equivalents may vary with exchange rates.
                      </span>
                    </div>

                    {history.length === 0 ? (
                      <div className="py-8 text-center flex flex-col gap-4">
                        <p className="font-sans font-light text-[14px] dark:text-[#a09a8e] text-[#55514a]">No contributions have been recorded yet.</p>
                        <p className="font-sans font-light text-[14px] dark:text-[#a09a8e] text-[#55514a]">Collection history updates automatically when contributions are received.</p>
                      </div>
                    ) : (
                      history.map((yData: any, idx: number) => {
                        const isExpanded = expandedYears[yData.year];
                        return (
                          <div key={yData.year} className={`flex flex-col border-b dark:border-stone-800/40 border-stone-200/80 ${idx === 0 ? 'border-t' : ''}`}>
                            <button
                              onClick={() => toggleYear(yData.year)}
                              className="flex justify-between items-center py-6 text-left focus:outline-none hover:opacity-70 transition-opacity w-full"
                            >
                              <span className="font-sans font-medium text-base dark:text-stone-200 text-stone-800">
                                {isExpanded ? '▼' : '▶'} {yData.year}
                              </span>
                              <span className="font-sans font-medium text-base dark:text-stone-400 text-stone-600">
                                {yData.total}
                              </span>
                            </button>

                            {isExpanded && (
                              <div className="flex flex-col gap-4 pb-8 md:px-4 text-[11px] uppercase tracking-widest dark:text-stone-400 text-stone-600">
                                {yData.months.map((m: any, mIdx: number) => (
                                  <div key={mIdx} className="flex justify-between">
                                    <span>{m.month}</span>
                                    <span>{m.amount}</span>
                                  </div>
                                ))}
                                {yData.months.length === 0 && (
                                  <div className="text-center font-sans font-light normal-case opacity-70">No contributions recorded for this year.</div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="flex justify-center pt-8 pb-12 md:pb-16">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-[10px] uppercase tracking-[0.2em] dark:text-stone-500 text-stone-500 hover:dark:text-stone-300 hover:text-stone-800 transition-colors flex items-center gap-2"
          >
            Pass It Forward <span className="text-sm">↑</span>
          </button>
        </section>

        {/* CLOSING SECTION */}
        <section className="text-center mx-auto flex flex-col gap-3 md:gap-4 w-full pt-16 md:pt-24 pb-12 md:pb-16 border-t dark:border-stone-800/40 border-stone-200/80">
          <p className="font-serif text-2xl md:text-3xl italic dark:text-stone-300 text-stone-700 tracking-tight">A contribution is appreciated.</p>
          <p className="font-serif text-2xl md:text-3xl italic dark:text-stone-300 text-stone-700 tracking-tight">Attention is appreciated too.</p>
          <p className="font-serif text-2xl md:text-3xl italic dark:text-stone-300 text-stone-700 tracking-tight">Both are forms of generosity.</p>
        </section>

      </main>

      {/* Global Footer */}
      <footer className="w-full px-6 md:px-16 lg:px-24 py-6 md:py-14 flex flex-col md:flex-row justify-between items-center gap-5 md:gap-4 z-50 bg-transparent border-t dark:border-stone-850/20 border-[#ECEBE6]">
        {/* Left */}
        <div className="md:flex-1 flex justify-center md:justify-start order-1 text-center md:text-left">
          <span className="font-sans font-light text-[14px] dark:text-stone-500/60 text-[#6E6A64]/60">
            Most things take longer than expected.
          </span>
        </div>

        {/* Center */}
        <div className="md:flex-1 flex flex-col items-center gap-1 order-2 text-center">
          <span className="font-serif text-[15px] md:text-[16px] dark:text-stone-500/70 text-[#6E6A64]/70 tracking-wide">
            Biranchi Kulesika
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] dark:text-stone-600/50 text-[#6E6A64]/50">
            India · 2026
          </span>
        </div>

        {/* Right */}
        <div className="md:flex-1 flex justify-center md:justify-end items-center gap-5 md:gap-6 order-3 font-sans font-light text-[14px] dark:text-stone-500/60 text-[#6E6A64]/60">
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer" className="hover:dark:text-stone-400 hover:text-stone-900 transition-colors duration-500">
            GitHub
          </a>
          <span className="dark:text-stone-800/50 text-[#6E6A64]/40 md:hidden">·</span>
          <a href={SOCIAL_LINKS.email} className="hover:dark:text-stone-400 hover:text-stone-900 transition-colors duration-500">
            Email
          </a>
        </div>
      </footer>

      {/* RECIPIENT MODAL */}
      <AnimatePresence>
        {selectedRecipient && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-stone-950/20 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedRecipient(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg dark:bg-[#0a0a0a] bg-[#fafafa] border dark:border-stone-800 border-stone-200 p-8 md:p-12 flex flex-col gap-8 shadow-2xl z-10"
            >
              <button
                className="absolute top-6 right-6 font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 transition-colors"
                onClick={() => setSelectedRecipient(null)}
              >
                Close
              </button>

              <h3 className="font-serif text-2xl md:text-3xl italic dark:text-stone-200 text-stone-800 pr-8">
                {selectedRecipient.name}
              </h3>

              <div className="flex flex-col gap-6 pt-6 border-t dark:border-stone-800/40 border-stone-200/80">

                 <div className="flex flex-col gap-2">
                   <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Category</span>
                   <span className="font-sans text-[15px] dark:text-stone-300 text-stone-700 leading-none">{selectedRecipient.category}</span>
                 </div>

                 <div className="flex justify-between gap-4">
                   <div className="flex flex-col gap-2">
                     <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Amount</span>
                     <span className="font-sans text-[15px] dark:text-stone-300 text-stone-700 leading-none">{selectedRecipient.amount}</span>
                   </div>
                   <div className="flex flex-col gap-2 text-right">
                     <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Date</span>
                     <span className="font-sans text-[15px] dark:text-stone-300 text-stone-700 leading-none">{selectedRecipient.date}</span>
                   </div>
                 </div>

                 <div className="flex flex-col gap-2">
                   <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Description</span>
                   <span className="font-sans font-light text-[15px] leading-relaxed dark:text-[#a09a8e] text-[#55514a]">{selectedRecipient.desc}</span>
                 </div>

                 <div className="mt-4 pt-2">
                   <a href={selectedRecipient.proof} target="_blank" rel="noreferrer" className="inline-block text-center font-mono text-[10px] uppercase tracking-[0.2em] px-6 py-3 border dark:border-stone-700 border-stone-300 dark:text-stone-300 text-stone-700 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      View Document
                   </a>
                 </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IDENTITY MODAL */}
      <AnimatePresence>
        {flowStep === 'identity' && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/20 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setFlowStep('idle')}
            />
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              className="relative w-full max-w-lg dark:bg-[#0a0a0a] bg-[#fafafa] border dark:border-stone-800 border-stone-200 p-8 md:p-12 flex flex-col gap-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                className="absolute top-6 right-6 font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 transition-colors"
                onClick={() => setFlowStep('idle')}
              >
                Close
              </button>
              <h3 className="font-serif text-2xl italic dark:text-stone-200 text-stone-800 pr-8">How would you like to contribute?</h3>

              <form onSubmit={handleIdentitySubmit} className="flex flex-col gap-6 pt-2">
                 <div className="flex flex-col gap-4">

                   <div className="flex flex-col gap-4">
                     <p className="font-sans font-light text-[13px] dark:text-stone-400 text-stone-500 mb-2">
                       Feel free to provide your details below for the payment receipt. All fields are completely optional—leave them blank to remain anonymous.
                     </p>
                     
                     <input 
                       type="text" 
                       placeholder="Name (Optional)" 
                       value={donorName} 
                       onChange={e => setDonorName(e.target.value)} 
                       className="w-full bg-transparent border-b dark:border-stone-700 border-stone-300 py-3 outline-none font-sans text-[15px] dark:text-stone-200 text-stone-800 focus:dark:border-stone-400 focus:border-stone-600 transition-colors" 
                     />
                     
                     <input 
                       type="email" 
                       placeholder="Email (Optional)" 
                       value={donorEmail} 
                       onChange={e => setDonorEmail(e.target.value)} 
                       className="w-full bg-transparent border-b dark:border-stone-700 border-stone-300 py-3 outline-none font-sans text-[15px] dark:text-stone-200 text-stone-800 focus:dark:border-stone-400 focus:border-stone-600 transition-colors" 
                     />
                     
                     <input 
                       type="tel" 
                       placeholder="Phone Number (Optional)" 
                       value={donorPhone} 
                       onChange={e => setDonorPhone(e.target.value)} 
                       className="w-full bg-transparent border-b dark:border-stone-700 border-stone-300 py-3 outline-none font-sans text-[15px] dark:text-stone-200 text-stone-800 focus:dark:border-stone-400 focus:border-stone-600 transition-colors" 
                     />
                   </div>

                 </div>

                 <div className="pt-2">
                   <button type="submit" className="w-full px-6 py-4 border dark:border-stone-800 border-stone-300 dark:text-stone-200 text-stone-800 hover:bg-black/5 dark:hover:bg-white/5 transition-colors uppercase tracking-[0.2em] text-[10px] md:text-[11px] font-medium text-center">
                     Continue to Payment
                   </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROCESSING MODAL */}
      <AnimatePresence>
        {flowStep === 'processing' && (
          <div className="fixed inset-0 z-110lex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/30 dark:bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 flex flex-col items-center gap-6"
            >
               <div className="w-8 h-8 border-[3px] dark:border-stone-800 border-stone-300 border-t-stone-200 dark:border-t-stone-800 rounded-full animate-spin" />
               <span className="font-mono text-[11px] uppercase tracking-[0.2em] dark:text-stone-400 text-stone-600">Processing Payment...</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

