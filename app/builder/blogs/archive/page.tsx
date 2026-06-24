import React from 'react';
import { ArchivePage } from '@/components/blog/ArchivePage';
import { getPostsMeta } from '@/lib/queries';

export default async function BuilderArchivePage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || '';
  const posts = await getPostsMeta(q);
  return <ArchivePage persona="builder" databasePosts={posts} initialSearchQuery={q} />;
}
