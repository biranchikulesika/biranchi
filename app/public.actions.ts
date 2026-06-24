'use server';

import { getPostsMeta } from '@/lib/queries';

export async function searchPublishedPosts(query: string) {
  if (!query) return [];
  return await getPostsMeta(query);
}
