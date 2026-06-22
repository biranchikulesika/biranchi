import React from 'react';
import { ArchivePage } from '@/components/blog/ArchivePage';
import { getPosts } from '@/lib/queries';

export default async function BuilderArchivePage() {
  const posts = await getPosts();
  return <ArchivePage persona="builder" databasePosts={posts} />;
}
