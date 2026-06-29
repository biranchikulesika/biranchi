'use client';

import React from 'react';
import PostRenderer from '@/components/post-renderer/PostRenderer';

interface PostPageClientProps {
  post: any | undefined;
  slug: string;
  allPosts: any[];
  fallbackPersona?: string;
  compiledMdx?: any;
}

export default function PostPageClient({ post, slug, allPosts, fallbackPersona, compiledMdx }: PostPageClientProps) {
  return <PostRenderer post={post} slug={slug} allPosts={allPosts} fallbackPersona={fallbackPersona} compiledMdx={compiledMdx} />;
}
