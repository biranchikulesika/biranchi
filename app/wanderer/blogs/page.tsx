import React from 'react';
import { BlogHomepage } from '@/components/blog/BlogHomepage';
import { getPosts } from '@/lib/queries';

export default async function WandererBlogsPage() {
  const posts = await getPosts();
  return <BlogHomepage persona="wanderer" databasePosts={posts} />;
}
