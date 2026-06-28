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
    return SITE_URL.replace('://', `://${subdomain}.`) + path;
  };

  // ── Static routes ──────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    // Root
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/blogs`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/fund`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/newsletter`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/reading`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },

    // Builder persona
    { url: getSubdomainUrl('builder'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: getSubdomainUrl('builder', '/about'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: getSubdomainUrl('builder', '/blogs'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },

    // Thinker persona
    { url: getSubdomainUrl('thinker'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: getSubdomainUrl('thinker', '/about'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: getSubdomainUrl('thinker', '/blogs'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: getSubdomainUrl('thinker', '/reading'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },

    // Wanderer persona
    { url: getSubdomainUrl('wanderer'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: getSubdomainUrl('wanderer', '/about'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: getSubdomainUrl('wanderer', '/blogs'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },

    // Operator persona
    { url: getSubdomainUrl('operator'), lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: getSubdomainUrl('operator', '/about'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: getSubdomainUrl('operator', '/blogs'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
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

    postRoutes = publishedPosts.map((post: any) => ({
      url: `${SITE_URL}/p/${post.slug || post.id}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: post.featured ? 0.9 : 0.8,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch posts', error);
  }

  return [...staticRoutes, ...postRoutes];
}
