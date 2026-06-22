import React from 'react';
import { ArchivePage } from '@/components/blog/ArchivePage';
import { getPostsMeta } from '@/lib/queries';

export default async function MainArchivePage() {
  const posts = await getPostsMeta();
  return <ArchivePage persona="main" databasePosts={posts} />;
}
