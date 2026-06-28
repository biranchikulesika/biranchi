'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'motion/react';
import { Loader2, AtSign, KeyRound, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { getPersonaUrl } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { PersonaSearch } from '@/components/persona-search';
import { ParticleCanvas } from '@/components/ui/particle-canvas';
import { useFakeTyping } from '@/hooks/use-fake-typing';
import { useAuthSequence } from '@/hooks/use-auth-sequence';
import { authenticateUser } from './actions';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const router = useRouter();

  const {
    authStatus,
    statusMessage,
    runVerificationSequence,
    showFailureMessage,
    runSuccessSequence,
    clearStatus,
  } = useAuthSequence();

  const handleFakeSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const {
    fakeEmail,
    fakePassword,
    isFakeTyping,
    handleInputFocus,
    handleInputBlur,
    handleMouseEnter,
    handleMouseLeave,
  } = useFakeTyping(handleFakeSubmit, email, password);

  const handleEmailBlur = () => {
    handleInputBlur();
    if (!isFakeTyping && email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError(null);
      }
    }
  };

  const currentEmail = isFakeTyping ? fakeEmail : email;
  const currentPassword = isFakeTyping ? fakePassword : password;


  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearStatus();

    // Fast path: Immediately attempt to authenticate.
    const { error: signInError } = await authenticateUser(email, password);

    if (signInError) {
      // Drama path for attackers/failures: Waste their time with fake verifying sequences
      await runVerificationSequence();
      
      setLoading(false);
      setPassword('');
      showFailureMessage();
      setTimeout(() => {
        document.getElementById('password')?.focus();
      }, 50);
      return;
    }

    // Success path for the owner: Instant login, absolutely zero drama!
    router.push('/admin');
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    clearStatus();

    const redirectUrl = `${window.location.origin}/admin/auth/callback?next=/admin`;

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (signInError) {
      showFailureMessage();
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-[#050505] bg-[#F5F5F2] min-h-screen dark:text-[#e5e5e5] text-[#2B2B28] font-sans selection:bg-stone-300 dark:selection:bg-stone-800 selection:text-black dark:selection:text-white flex flex-col relative overflow-hidden select-none">

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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-1 flex-col items-center justify-center pt-24 relative"
      >
        {/* Background Particle Canvas */}
        <div id="particle-canvas-container" className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 opacity-60">
          <ParticleCanvas />
        </div>

        {/* Back to main site link */}
        <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
          <Link
            href={getPersonaUrl('main')}
            className="font-mono text-[10px] tracking-[0.2em] uppercase dark:text-stone-400 text-stone-500 hover:text-foreground transition-colors"
          >
            ← Return
          </Link>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full max-w-[420px] px-6 flex flex-col items-center sm:-mt-12"
      >
        {/* Floating Status Message to prevent layout shift */}
        <div className="absolute bottom-[calc(100%+1.5rem)] left-0 w-full flex justify-center pointer-events-none px-6">
          {authStatus !== 'idle' && statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`rounded-2xl border px-5 py-3.5 shadow-lg backdrop-blur-2xl max-w-[320px] w-full pointer-events-auto transition-colors ${
                  authStatus === 'success'
                    ? 'dark:bg-emerald-950/40 bg-emerald-50/80 dark:border-emerald-900/30 border-emerald-200/50 dark:shadow-emerald-900/10'
                    : 'dark:bg-black/40 bg-white/60 dark:border-white/[0.08] border-black/[0.04] shadow-[0_4px_20px_rgb(0,0,0,0.05)] dark:shadow-none'
                }`}
            >
              <h3 className={`text-[13px] font-medium text-center whitespace-pre-wrap leading-relaxed ${
                  authStatus === 'success'
                    ? 'dark:text-emerald-400 text-emerald-600'
                    : 'text-foreground'
                }`}>
                {statusMessage}
              </h3>
            </motion.div>
          )}
        </div>

        <div 
          className="relative w-full dark:bg-white/[0.04] bg-white/20 backdrop-blur-[40px] rounded-[2.5rem] border dark:border-white/[0.12] border-white/40 p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_0_80px_rgba(255,255,255,0.04)] transition-all overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Subtle rim light effect */}
          <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none border dark:border-white/[0.1] border-white/60" style={{ mixBlendMode: 'overlay' }}></div>
          <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]"></div>
          
          <div className="text-center mb-10 relative z-10">
            <h1 className="text-3xl md:text-[34px] font-serif font-light tracking-tight text-foreground">
              Biranchi CMS
            </h1>
          </div>

          <form className="space-y-3 relative z-10" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-foreground z-20">
                    <AtSign strokeWidth={1.25} className={`h-[18px] w-[18px] transition-colors ${emailError ? 'text-stone-500 dark:text-stone-400' : 'text-primary/30 group-focus-within:text-foreground'}`} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required={!isFakeTyping}
                    readOnly={isFakeTyping}
                    value={currentEmail}
                    onChange={(e) => {
                      if (!isFakeTyping) {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleEmailBlur}
                    className={`block w-full rounded-2xl border py-3 pl-11 pr-4 text-[14px] shadow-sm focus:outline-none transition-all cursor-text relative z-10 read-only:focus:ring-0 read-only:focus:border-transparent ${
                      emailError
                        ? 'dark:bg-white/[0.04] bg-black/[0.02] backdrop-blur-md dark:border-stone-400/40 border-stone-400/50 text-foreground placeholder:text-primary/50 focus:border-stone-400 dark:focus:border-stone-300 focus:ring-4 focus:ring-stone-500/10 hover:dark:bg-white/[0.06] hover:bg-black/[0.04]'
                        : 'dark:bg-white/[0.02] bg-white/30 backdrop-blur-md dark:border-white/[0.1] border-black/[0.05] text-foreground placeholder:text-primary/30 focus:border-black/20 dark:focus:border-white/20 focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:bg-white/50 dark:focus:bg-white/[0.05] hover:dark:bg-white/[0.04] hover:bg-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]'
                    }`}
                    placeholder={isFakeTyping ? "" : "Email address"}
                  />
                </div>
                {emailError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-stone-600 dark:text-stone-400 text-[11px] font-medium pl-1 mt-2"
                  >
                    {emailError}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-foreground">
                    <KeyRound strokeWidth={1.25} className="h-[18px] w-[18px] text-primary/30 group-focus-within:text-foreground transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={isFakeTyping ? 'text' : (showPassword ? 'text' : 'password')}
                    autoComplete="current-password"
                    required={!isFakeTyping}
                    readOnly={isFakeTyping}
                    value={currentPassword}
                    onChange={(e) => {
                      if (!isFakeTyping) setPassword(e.target.value);
                    }}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    className="block w-full rounded-2xl dark:bg-white/[0.02] bg-white/30 backdrop-blur-md border dark:border-white/[0.1] border-black/[0.05] py-3 pl-11 pr-11 text-[14px] text-foreground shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] placeholder:text-primary/30 focus:border-black/20 dark:focus:border-white/20 focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:bg-white/50 dark:focus:bg-white/[0.05] focus:outline-none transition-all hover:dark:bg-white/[0.04] hover:bg-white/40 read-only:focus:ring-0 read-only:focus:border-transparent cursor-text relative z-10"
                    placeholder={isFakeTyping ? "" : "Password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-primary/30 hover:text-primary/60 focus:outline-none transition-colors z-20"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff strokeWidth={1.25} className="h-[18px] w-[18px]" /> : <Eye strokeWidth={1.25} className="h-[18px] w-[18px]" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 pb-1 relative group w-full">
                <button
                  type="submit"
                  disabled={loading || !currentEmail || !currentPassword || currentPassword.length < 6 || !!emailError}
                  className="w-full flex justify-center rounded-2xl dark:bg-white bg-black px-5 py-3 text-[14px] font-medium dark:text-black text-white shadow-[0_2px_10px_rgb(0,0,0,0.1)] dark:shadow-[0_2px_20px_rgb(255,255,255,0.15)] dark:hover:bg-stone-200 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 dark:focus:ring-offset-[#050505] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
                {/* Premium Custom Tooltip */}
                {(!currentEmail || !currentPassword || currentPassword.length < 6 || !!emailError) && !loading && (
                  <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 dark:bg-white text-white dark:text-black text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg backdrop-blur-md z-50">
                    Please fill in your email and password
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-black/90 dark:border-t-white"></div>
                  </div>
                )}
              </div>
            </form>

            <div className="relative my-5 flex items-center z-10">
              <div className="flex-grow border-t border-black/[0.08] dark:border-white/[0.1]"></div>
              <span className="mx-4 text-[10px] font-mono tracking-widest text-primary/30 uppercase">OR</span>
              <div className="flex-grow border-t border-black/[0.08] dark:border-white/[0.1]"></div>
            </div>

            <div className="relative z-10">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-white/20 dark:bg-white/[0.02] backdrop-blur-md px-4 py-3 text-[13px] font-medium text-foreground border border-white/40 dark:border-white/[0.1] cursor-pointer hover:bg-white/60 dark:hover:bg-white/[0.08] hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.02)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 dark:focus:ring-offset-[#050505] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[16px] w-[16px] transition-all duration-300">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="mt-6 flex justify-center relative z-10">
              <span className="flex items-center gap-2.5 text-[11px] text-primary/40 font-medium tracking-wide">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500/60"></span>
                </span>
                Secure Workspace
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
