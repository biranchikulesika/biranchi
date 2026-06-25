import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default async function proxy(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. builder.biranchi.kulesika.in)
  // In local development, this could be localhost:3000
  let hostname = req.headers.get('host') || 'biranchi.kulesika.in';

  // Remove port if present
  hostname = hostname.split(':')[0];

  // Dynamically map subdomains based on hostname prefix to sustain robustness
  let mappedPath: string | undefined = undefined;
  if (hostname.startsWith('builder.')) {
    mappedPath = '/builder';
  } else if (hostname.startsWith('operator.')) {
    mappedPath = '/operator';
  } else if (hostname.startsWith('wanderer.')) {
    mappedPath = '/wanderer';
  } else if (hostname.startsWith('thinker.')) {
    mappedPath = '/thinker';
  }

  // Check if space points to static asset or bypass routes (/p/, /admin)
  const isFileRequest = url.pathname.includes('.');
  const isBypassPath = 
    url.pathname === '/admin' || 
    url.pathname.startsWith('/admin/') || 
    url.pathname.startsWith('/p/') || 
    isFileRequest;

  // Protect Admin Dashboard Routes
  if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
    return await updateSession(req);
  }

  // Prevent direct access to persona directories in the URL path
  const isDirectPersonaPath = 
    url.pathname === '/builder' || url.pathname.startsWith('/builder/') ||
    url.pathname === '/operator' || url.pathname.startsWith('/operator/') ||
    url.pathname === '/wanderer' || url.pathname.startsWith('/wanderer/') ||
    url.pathname === '/thinker' || url.pathname.startsWith('/thinker/');

  if (isDirectPersonaPath) {
    // Rewrite to a non-existent path to trigger a 404
    // If we're on a persona subdomain, rewrite to a non-existent path within that persona so it uses the persona's 404
    if (mappedPath) {
      return NextResponse.rewrite(new URL(`${mappedPath}/404-not-found-blocked`, req.url));
    }
    return NextResponse.rewrite(new URL('/404-not-found-blocked', req.url));
  }

  // If a subdomain is matched and path is not a bypass path, rewrite the URL to that specific path directory.
  // We avoid rewriting if the URL already starts with that path to avoid infinite loops.
  if (mappedPath && !isBypassPath) {
    // We rewrite the URL to /subdomain_path/original_path
    // E.g., builder.biranchi.../about -> /builder/about
    return NextResponse.rewrite(new URL(`${mappedPath}${url.pathname}`, req.url));
  }

  return NextResponse.next();
}
