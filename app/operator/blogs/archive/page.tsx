import React from 'react';
import { ArchivePage } from '@/components/blog/ArchivePage';
import { getPosts } from '@/app/admin/actions/posts.actions';

export default async function OperatorArchivePage() {
  const posts = await getPosts();
  return <ArchivePage persona="operator" databasePosts={posts} />;
}
