import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config/seo';

/**
 * Robots.txt configuration.
 * Allows all major search engine and AI crawlers access to public routes.
 * Blocks /admin and /api paths from indexing.
 * Next.js automatically serves this at /robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/api', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
