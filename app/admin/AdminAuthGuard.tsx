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
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  const supabase = createBrowserClient(
    supabaseUrl,
    supabaseKey
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

  const isPublicRoute = pathname === '/admin/login' || (pathname?.startsWith('/admin/auth/callback') ?? false);

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
    </>
  );
}
