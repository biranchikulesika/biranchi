import React from 'react';
import { BlogHomepage } from '@/components/blog/BlogHomepage';
import { getPostsMeta } from '@/lib/queries';

export default async function WandererBlogsPage() {
  const posts = await getPostsMeta();
  return <BlogHomepage persona="wanderer" databasePosts={posts} />;
}
