import React from 'react';
import { ArchivePage } from '@/components/blog/ArchivePage';
import { getPosts } from '@/app/admin/actions';

export default async function BuilderArchivePage() {
  const posts = await getPosts();
  return <ArchivePage persona="builder" databasePosts={posts} />;
}
