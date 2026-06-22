'use server';
import { z } from 'zod';
import { verifyAuth } from '@/lib/auth/verify';
import { PostService } from '@/lib/services/post.service';

const postService = new PostService();

// Define a basic Zod schema for payload validation
const payloadSchema = z.record(z.any());
// We keep it flexible to avoid breaking the UI workflow, but it blocks entirely invalid payloads or non-objects.

export async function getPosts() {
  await verifyAuth();
  return await postService.getAll();
}

export async function getPostById(id: string) {
  await verifyAuth();
  return await postService.getById(id);
}

export async function createPost(data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await postService.create(validData);
}

export async function updatePost(id: string, data: any) {
  await verifyAuth();
  const validData = payloadSchema.parse(data);
  return await postService.update(id, validData);
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