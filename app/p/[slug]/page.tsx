import type { Metadata } from 'next';
import { getPostsMeta, getPostBySlug } from '@/lib/queries';
import PostPageClient from './PostPageClient';
import { notFound } from 'next/navigation';

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
  
  const post = await getPostBySlug(resolvedParams.slug);

  // Prevent public viewing of draft/hidden posts via the dynamic route
  if (!post || (!isPreview && (post.status === 'draft' || (post.status && post.status.toLowerCase() === 'draft') || post.hidden === true))) {
    notFound();
  }

  // Fetch only necessary posts metadata for related posts in the renderer
  const posts = await getPostsMeta();
  const publishedPosts = posts.filter((p: any) => p.status !== 'draft' && (!p.status || p.status.toLowerCase() !== 'draft') && p.hidden !== true);
  
  return <PostPageClient post={post} slug={resolvedParams.slug} allPosts={publishedPosts} />;
}
