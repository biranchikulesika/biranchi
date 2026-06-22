'use server';
import { verifyAuth } from '@/lib/auth/verify';
import { PostService } from '@/lib/services/post.service';
import { postSchema } from '@/lib/schemas';

const postService = new PostService();

export async function getPosts() {
  await verifyAuth();
  return await postService.getAll();
}

export async function getPostById(id: string) {
  await verifyAuth();
  return await postService.getById(id);
}

export async function getPostBySlug(slug: string) {
  // It's possible for this to be called from a public route without auth
  if (slug) {
    return await postService.getBySlug(slug);
  }
  return null;
}

export async function checkSlugExists(slug: string, currentId: string | null, persona: string): Promise<boolean> {
  return await postService.checkSlugExists(slug, currentId, persona);
}

export async function createPost(data: any) {
  await verifyAuth();
  const validData = postSchema.parse(data);
  return await postService.create(validData as any);
}

export async function updatePost(id: string, data: any) {
  await verifyAuth();
  const validData = postSchema.parse(data);
  return await postService.update(id, validData as any);
}

export async function deletePost(id: string) {
  await verifyAuth();
  return await postService.delete(id);
}

export async function hidePost(id: string) {
  await verifyAuth();
  return await postService.hide(id);
}

export async function unhidePost(id: string) {
  await verifyAuth();
  return await postService.unhide(id);
}

export async function featurePost(id: string) {
  await verifyAuth();
  return await postService.feature(id);
}

export async function unfeaturePost(id: string) {
  await verifyAuth();
  return await postService.unfeature(id);
}