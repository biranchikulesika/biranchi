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

export default async function Page({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams?: Promise<{ persona?: string }>
}) {
  const resolvedParams = await params;
  
  const post = await getPostBySlug(resolvedParams.slug);

  // Prevent public viewing of draft/hidden posts via the dynamic route
  if (!post || post.status === 'draft' || (post.status && post.status.toLowerCase() === 'draft') || post.hidden === true) {
    notFound();
  }

  // Fetch only necessary posts metadata for related posts in the renderer
  const posts = await getPostsMeta();
  
  return <PostPageClient post={post} slug={resolvedParams.slug} allPosts={posts} />;
}
