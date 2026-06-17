import { getPosts } from '@/app/admin/actions';
import PostPageClient from './PostPageClient';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
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

  return <PostPageClient post={post} slug={resolvedParams.slug} allPosts={posts} />;
}
