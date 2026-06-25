import type { Metadata } from 'next';
import { getPostsMeta, getPostBySlug } from '@/lib/queries';
import PostPageClient from './PostPageClient';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

export async function generateStaticParams() {
  const posts = await getPostsMeta();
  const publishedPosts = posts.filter((p: any) => p.status !== 'draft' && (!p.status || p.status.toLowerCase() !== 'draft') && p.hidden !== true);
  return publishedPosts.map((post) => ({
    slug: post.slug || post.id,
  }));
}

export async function generateMetadata({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ preview?: string }>
}): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const isPreview = resolvedSearch?.preview === 'true';

  const post = await getPostBySlug(resolvedParams.slug);

  if (!post || (!isPreview && (post.status === 'draft' || (post.status && post.status.toLowerCase() === 'draft') || post.hidden === true))) {
    return {
      title: 'Post Not Found',
    };
  }

  const personaMap: Record<string, string> = {
    builder: '/images/og-fallback-builder.png',
    operator: '/images/og-fallback-operator.png',
    thinker: '/images/og-fallback-thinker.png',
    wanderer: '/images/og-fallback-wanderer.png',
  };

  const ogImage = post.coverImageUrl || personaMap[post.persona] || '/images/og-main.png';

  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: [ogImage],
    },
  };
}

export default async function Page({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams?: Promise<{ persona?: string, preview?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearch = searchParams ? await searchParams : undefined;
  const isPreview = resolvedSearch?.preview === 'true';
  
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  let detectedPersona = resolvedSearch?.persona;
  if (!detectedPersona) {
    if (host.startsWith('builder.')) detectedPersona = 'builder';
    else if (host.startsWith('operator.')) detectedPersona = 'operator';
    else if (host.startsWith('thinker.')) detectedPersona = 'thinker';
    else if (host.startsWith('wanderer.')) detectedPersona = 'wanderer';
    else detectedPersona = 'main';
  }
  
  const post = await getPostBySlug(resolvedParams.slug);

  // For a missing post, or draft/hidden (unless preview), pass undefined
  let finalPost = post;
  if (!post || (!isPreview && (post.status === 'draft' || (post.status && post.status.toLowerCase() === 'draft') || post.hidden === true))) {
    finalPost = undefined;
  }

  // Fetch only necessary posts metadata for related posts in the renderer
  const posts = await getPostsMeta();
  const publishedPosts = posts.filter((p: any) => p.status !== 'draft' && (!p.status || p.status.toLowerCase() !== 'draft') && p.hidden !== true);
  
  return <PostPageClient post={finalPost} slug={resolvedParams.slug} allPosts={publishedPosts} fallbackPersona={detectedPersona} />;
}
