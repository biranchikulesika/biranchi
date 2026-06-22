import React from 'react';
import { ArchivePage } from '@/components/blog/ArchivePage';
import { getPostsMeta } from '@/lib/queries';

export default async function BuilderArchivePage() {
  const posts = await getPostsMeta();
  return <ArchivePage persona="builder" databasePosts={posts} />;
}
