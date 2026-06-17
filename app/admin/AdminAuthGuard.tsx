'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  
  // Need to handle cases where we might be outside the App Router provider in standalone tests,
  // but it's safe to assume this will run in Next.js environment.
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user && pathname !== '/admin/login' && !pathname.startsWith('/admin/auth/callback')) {
        router.push('/admin/login');
      } else {
        setAuthed(true);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && pathname !== '/admin/login' && !pathname.startsWith('/admin/auth/callback')) {
        router.push('/admin/login');
      } else if (session) {
        setAuthed(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const isPublicRoute = pathname === '/admin/login' || pathname.startsWith('/admin/auth/callback');

  if (loading && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authed and not on a public route, wait for the redirect
  if (!authed && !isPublicRoute) {
    return null; 
  }

  return (
    <>
      {children}
      {authed && !isPublicRoute && (
        <button
          onClick={handleLogout}
          className="fixed bottom-6 right-6 px-4 py-2 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors text-sm font-medium z-50 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      )}
    </>
  );
}
