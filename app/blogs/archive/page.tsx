import React from 'react';
import { ArchivePage } from '@/components/blog/ArchivePage';
import { getPosts } from '@/lib/queries';

export default async function MainArchivePage() {
  const posts = await getPosts();
  return <ArchivePage persona="main" databasePosts={posts} />;
}
