import React from 'react';
import { ArchivePage } from '@/components/blog/ArchivePage';
import { getPosts } from '@/app/admin/actions';

export default async function MainArchivePage() {
  const posts = await getPosts();
  return <ArchivePage persona="main" databasePosts={posts} />;
}
