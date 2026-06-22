import { getPosts } from '@/lib/queries';
import PostPageClient from './PostPageClient';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getPosts();
  const publishedPosts = posts.filter((p: any) => p.draft !== true && (!p.status || p.status.toLowerCase() !== 'draft') && p.hidden !== true);
  return publishedPosts.map((post) => ({
    slug: post.slug || post.id,
  }));
}

export default async function Page({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams?: Promise<{ persona?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const queryPersona = resolvedSearchParams.persona;
  
  const posts = await getPosts();
  let post;
  
  if (queryPersona) {
    post = posts.find((p: any) => 
      (p.slug === resolvedParams.slug || p.id === resolvedParams.slug) && 
      p.persona === queryPersona
    );
  }
  
  if (!post) {
    post = posts.find((p: any) => p.slug === resolvedParams.slug || p.id === resolvedParams.slug);
  }

  // Prevent public viewing of draft/hidden posts via the dynamic route
  if (post && (post.draft === true || (post.status && post.status.toLowerCase() === 'draft') || post.hidden === true)) {
    notFound();
  }

  if (!post) {
    notFound();
  }

  return <PostPageClient post={post} slug={resolvedParams.slug} allPosts={posts} />;
}
