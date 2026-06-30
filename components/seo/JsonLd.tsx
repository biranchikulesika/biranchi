import React from 'react';
import { SITE_URL, SITE_NAME, AUTHOR, getCanonicalUrl, getPostOgImage } from '@/lib/config/seo';
import type { Post } from '@/lib/types';

/**
 * JSON-LD structured data components for SEO.
 * These render <script type="application/ld+json"> tags that search engines parse.
 * Safe to use in both server and client components.
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

/** Base component that renders a JSON-LD script tag. */
function JsonLdScript({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ---------------------------------------------------------------------------
// Article / BlogPosting schema — for individual post pages
// ---------------------------------------------------------------------------

interface ArticleJsonLdProps {
  post: Post;
  url: string;
}

export function ArticleJsonLd({ post, url }: ArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: AUTHOR.name,
      url: AUTHOR.url,
      sameAs: AUTHOR.sameAs,
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: getPostOgImage(post),
    url,
    ...(post.tags && post.tags.length > 0 && { keywords: post.tags.join(', ') }),
  };

  return <JsonLdScript data={data} />;
}

// ---------------------------------------------------------------------------
// ProfilePage schema — for about pages and persona profiles
// ---------------------------------------------------------------------------

interface ProfilePageJsonLdProps {
  name?: string;
  description?: string;
  url?: string;
  image?: string;
}

export function ProfilePageJsonLd({
  name = AUTHOR.name,
  description = 'Personal digital garden and portfolio featuring the Builder, Operator, Thinker, and Wanderer personas.',
  url = SITE_URL,
  image = `${SITE_URL}/images/og-main.png`,
}: ProfilePageJsonLdProps = {}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name,
      description,
      url: AUTHOR.url,
      image,
      sameAs: AUTHOR.sameAs,
    },
    url,
    name: `${name} — About`,
    description,
  };

  return <JsonLdScript data={data} />;
}

// ---------------------------------------------------------------------------
// WebSite schema — for the root homepage
// ---------------------------------------------------------------------------

interface WebSiteJsonLdProps {
  name?: string;
  description?: string;
  url?: string;
}

export function WebSiteJsonLd({
  name = SITE_NAME,
  description = 'A personal ecosystem showcasing four personas: Builder, Operator, Thinker, and Wanderer',
  url = SITE_URL,
}: WebSiteJsonLdProps = {}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url,
    author: {
      '@type': 'Person',
      name: AUTHOR.name,
      url: AUTHOR.url,
      sameAs: AUTHOR.sameAs,
    },
  };

  return <JsonLdScript data={data} />;
}
