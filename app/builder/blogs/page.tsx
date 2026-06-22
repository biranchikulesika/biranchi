import React from 'react';
import { BlogHomepage } from '@/components/blog/BlogHomepage';
import { getPosts } from '@/app/admin/actions/posts.actions';

export default async function BuilderBlogsPage() {
  const posts = await getPosts();
  return <BlogHomepage persona="builder" databasePosts={posts} />;
}
