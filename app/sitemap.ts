import type { MetadataRoute } from 'next';
import { getPostsMeta } from '@/lib/queries';
import { SITE_URL } from '@/lib/config/seo';

/**
 * Dynamic sitemap generator.
 * Fetches all published posts from Supabase and combines with static routes.
 * Next.js automatically serves this at /sitemap.xml.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const getSubdomainUrl = (subdomain: string, path: string = '') => {
    const cleanPath = path === '/' ? '' : path;
    return SITE_URL.replace('://', `://${subdomain}.`) + cleanPath;
  };

  // ── Static routes ──────────────────────────────────────────────────────
  
  const mainRoutes = ['', '/about', '/blogs', '/blogs/archive', '/terms', '/fund', '/newsletter'];
  const builderRoutes = ['', '/about', '/blogs', '/blogs/archive', '/newsletter'];
  const thinkerRoutes = ['', '/about', '/blogs', '/blogs/archive', '/newsletter', '/reading'];
  const wandererRoutes = ['', '/about', '/blogs', '/blogs/archive', '/newsletter'];
  const operatorRoutes = ['', '/about', '/blogs', '/blogs/archive', '/newsletter'];

  const staticRoutes: MetadataRoute.Sitemap = [
    // Main domain routes
    ...mainRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: (route === '' ? 'daily' : 'monthly') as 'daily' | 'monthly' | 'weekly' | 'yearly',
      priority: route === '' ? 1.0 : 0.7,
    })),

    // Builder persona
    ...builderRoutes.map((route) => ({
      url: getSubdomainUrl('builder', route),
      lastModified: now,
      changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: route === '' ? 0.8 : 0.6,
    })),

    // Thinker persona
    ...thinkerRoutes.map((route) => ({
      url: getSubdomainUrl('thinker', route),
      lastModified: now,
      changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: route === '' ? 0.8 : 0.6,
    })),

    // Wanderer persona
    ...wandererRoutes.map((route) => ({
      url: getSubdomainUrl('wanderer', route),
      lastModified: now,
      changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: route === '' ? 0.8 : 0.6,
    })),

    // Operator persona
    ...operatorRoutes.map((route) => ({
      url: getSubdomainUrl('operator', route),
      lastModified: now,
      changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: route === '' ? 0.8 : 0.6,
    })),
  ];

  // ── Dynamic post routes ────────────────────────────────────────────────
  let postRoutes: MetadataRoute.Sitemap = [];

  try {
    const posts = await getPostsMeta();
    const publishedPosts = posts.filter(
      (p: any) =>
        p.status !== 'draft' &&
        (!p.status || p.status.toLowerCase() !== 'draft') &&
        p.hidden !== true
    );

    const validSubdomains = ['builder', 'thinker', 'wanderer', 'operator'];

    postRoutes = publishedPosts.map((post: any) => {
      let postUrl = `${SITE_URL}/p/${post.slug || post.id}`;
      
      if (post.persona && validSubdomains.includes(post.persona)) {
        postUrl = getSubdomainUrl(post.persona, `/p/${post.slug || post.id}`);
      }

      return {
        url: postUrl,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
        changeFrequency: 'weekly' as const,
        priority: post.featured ? 0.9 : 0.8,
      };
    });
  } catch (error) {
    console.error('Sitemap: Failed to fetch posts', error);
  }

  return [...staticRoutes, ...postRoutes];
}
