'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'motion/react';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { getPersonaUrl } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { DesktopNav, MobileNav } from '@/components/nav-links';
import { PersonaSearch } from '@/components/persona-search';

const MOCK_EMAILS = [
  "nice.try@hacker.com",
  "not.today@biranchi.in",
  "admin@nice-try.com",
  "biranchi.is.watching@you.com",
  "give.up@already.net"
];

const MOCK_PASSWORDS = [
  "password123",
  "biranchi2026",
  "ilovebiranchi",
  "admin1234",
  "hunter2",
  "let_me_in_please"
];

function useMockUserTyping(emails: string[], passwords: string[], typingSpeed = 80, deletingSpeed = 40, pauseDelay = 2000) {
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  
  const [phase, setPhase] = useState<'typing_email' | 'typing_password' | 'paused' | 'deleting' | 'waiting_next'>('typing_email');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    const targetEmail = emails[index % emails.length];
    const targetPassword = passwords[index % passwords.length];

    if (phase === 'typing_email') {
      if (emailText.length < targetEmail.length) {
        timeout = setTimeout(() => {
          setEmailText(targetEmail.substring(0, emailText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setPhase('typing_password');
        }, 400); 
      }
    } else if (phase === 'typing_password') {
      if (passwordText.length < targetPassword.length) {
        timeout = setTimeout(() => {
          setPasswordText(targetPassword.substring(0, passwordText.length + 1));
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => {
          setPhase('paused');
        }, pauseDelay);
      }
    } else if (phase === 'paused') {
      setPhase('deleting');
    } else if (phase === 'deleting') {
      if (passwordText.length > 0) {
        timeout = setTimeout(() => {
          setPasswordText(targetPassword.substring(0, passwordText.length - 1));
        }, deletingSpeed);
      } else if (emailText.length > 0) {
        timeout = setTimeout(() => {
          setEmailText(targetEmail.substring(0, emailText.length - 1));
        }, deletingSpeed);
      } else {
        setPhase('waiting_next');
        timeout = setTimeout(() => {
          setIndex((prev) => prev + 1);
          setPhase('typing_email');
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [emailText, passwordText, phase, index, emails, passwords, typingSpeed, deletingSpeed, pauseDelay]);

  return { emailPlaceholder: emailText, passwordPlaceholder: passwordText };
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { emailPlaceholder, passwordPlaceholder } = useMockUserTyping(MOCK_EMAILS, MOCK_PASSWORDS, 80, 30, 2500);

  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh(); 
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    const redirectUrl = `${window.location.origin}/admin/auth/callback?next=/admin`;

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    }
  };

  return (
    <div className="dark:bg-[#050505] bg-[#F5F5F2] min-h-screen dark:text-[#e5e5e5] text-[#2B2B28] font-sans selection:bg-stone-300 dark:selection:bg-stone-800 selection:text-black dark:selection:text-white flex flex-col relative overflow-hidden">
      
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
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-amber-900/10 blur-[140px] rounded-full pointer-events-none" />

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
        className="relative z-10 w-full max-w-[400px] px-6"
      >


        <div className="dark:bg-[#0A0A0A]/60 bg-white/60 backdrop-blur-xl rounded-3xl border dark:border-stone-800/60 border-stone-200/60 p-8 shadow-2xl shadow-black/5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-xl dark:bg-red-900/20 bg-red-50 dark:border-red-900/50 border-red-100 border p-4 mb-6"
            >
              <h3 className="text-[13px] font-medium dark:text-red-400 text-red-600 text-center">
                {error}
              </h3>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleEmailPasswordLogin}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[13px] font-medium text-primary/80 pl-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-primary/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl dark:bg-stone-900/50 bg-white/50 border dark:border-stone-800/80 border-stone-200 py-2.5 pl-10 pr-4 text-[14px] text-foreground shadow-sm placeholder:text-primary/30 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none transition-all"
                  placeholder={email.length === 0 ? emailPlaceholder : ""}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[13px] font-medium text-primary/80 pl-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-primary/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : (password.length === 0 ? 'text' : 'password')}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl dark:bg-stone-900/50 bg-white/50 border dark:border-stone-800/80 border-stone-200 py-2.5 pl-10 pr-10 text-[14px] text-foreground shadow-sm placeholder:text-primary/30 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none transition-all"
                  placeholder={password.length === 0 ? passwordPlaceholder : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary/40 hover:text-primary/70 focus:outline-none transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-fit justify-center rounded-lg dark:bg-stone-100 bg-stone-900 px-5 py-2 text-[13px] font-medium dark:text-stone-900 text-stone-50 shadow-sm dark:hover:bg-white hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 dark:focus:ring-offset-[#050505] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Authenticate</span>
                )}
              </button>
            </div>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t dark:border-stone-800 border-stone-200" />
            </div>
            <div className="relative flex justify-center text-[11px] font-mono tracking-widest uppercase">
              <span className="dark:bg-[#0A0A0A] bg-white px-4 text-primary/40">
                Or Continue With
              </span>
            </div>
          </div>

          <div>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl dark:bg-stone-900/30 bg-white px-4 py-3 text-[14px] font-medium text-foreground shadow-sm border dark:border-stone-800 border-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 dark:focus:ring-offset-[#050505] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]">
                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335" />
                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4" />
                <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05" />
                <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853" />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center opacity-60">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-primary/50">
            Biranchi · Restricted Area
          </span>
        </div>
      </motion.div>
      </motion.div>
    </div>
  );
}
