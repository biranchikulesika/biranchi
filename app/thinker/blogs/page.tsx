import React from 'react';
import { BlogHomepage } from '@/components/blog/BlogHomepage';
import { getPosts } from '@/app/admin/actions/posts.actions';

export default async function ThinkerBlogsPage() {
  const posts = await getPosts();
  return <BlogHomepage persona="thinker" databasePosts={posts} />;
}
