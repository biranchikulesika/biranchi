'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

import { getPosts as repoGetPosts, createPost as repoCreatePost } from '@/lib/repositories/post.repository'

// ============== Posts ==============
export async function getPosts() {
  return await repoGetPosts()
}
export async function createPost(input: any) {
  return await repoCreatePost(input)
}