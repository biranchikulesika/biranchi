import { SOCIAL_LINKS } from './socials';

/**
 * Central SEO configuration.
 * Single source of truth for site URL, author identity, and persona metadata.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    : 'https://biranchi.kulesika.in';

export const SITE_NAME = 'Biranchi';

export const AUTHOR = {
  name: 'Biranchi Kulesika',
  url: 'https://biranchi.kulesika.in',
  twitter: '@BKulesika',
  sameAs: [
    SOCIAL_LINKS.github,
    SOCIAL_LINKS.linkedin,
    SOCIAL_LINKS.twitter,
    SOCIAL_LINKS.instagram,
  ],
} as const;

export const PERSONA_META = {
  builder: {
    title: 'Forge Workspace',
    description: 'Systems, Code, Open Source — the Builder persona of Biranchi Kulesika.',
    ogImage: '/images/og-fallback-builder.png',
  },
  thinker: {
    title: 'Inside The Head',
    description: 'Thoughts, essays, and intellectual explorations by Biranchi Kulesika.',
    ogImage: '/images/og-fallback-thinker.png',
  },
  wanderer: {
    title: 'Scribble Explorer',
    description: 'Journeys, stories, and wanderings by Biranchi Kulesika.',
    ogImage: '/images/og-fallback-wanderer.png',
  },
  operator: {
    title: 'Operator Workspace',
    description: 'Cybersecurity, Ethical Hacking, OSINT — the Operator persona of Biranchi Kulesika.',
    ogImage: '/images/og-fallback-operator.png',
  },
  main: {
    title: 'Biranchi',
    description: 'Personal digital garden and portfolio of Biranchi Kulesika, featuring the Builder, Operator, Thinker, and Wanderer personas.',
    ogImage: '/images/og-main.png',
  },
} as const;

export type PersonaKey = keyof typeof PERSONA_META;

/** Returns an absolute canonical URL for the given path. */
export function getCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/** Returns the absolute OG image URL for a persona. */
export function getPersonaOgImage(persona: PersonaKey): string {
  return `${SITE_URL}${PERSONA_META[persona].ogImage}`;
}

/** Returns the best OG image URL for a post, falling back to persona image. */
export function getPostOgImage(post: { coverImageUrl?: string; persona?: string }): string {
  if (post.coverImageUrl) {
    // If it's already an absolute URL (e.g. from Supabase storage), use it directly
    if (post.coverImageUrl.startsWith('http')) return post.coverImageUrl;
    return `${SITE_URL}${post.coverImageUrl}`;
  }
  const persona = (post.persona as PersonaKey) || 'main';
  return getPersonaOgImage(persona in PERSONA_META ? persona : 'main');
}
