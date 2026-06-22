import React from 'react';
import { ArchivePage } from '@/components/blog/ArchivePage';
import { getPosts } from '@/lib/queries';

export default async function WandererArchivePage() {
  const posts = await getPosts();
  return <ArchivePage persona="wanderer" databasePosts={posts} />;
}
