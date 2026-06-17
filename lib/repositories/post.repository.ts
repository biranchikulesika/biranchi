import { createSupabaseServerClient } from '@/lib/supabase/server'

export interface PostInput {
  title: string
  slug: string
  persona: string
  content: string
  draft: boolean
}

export async function getPosts() {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createPost(input: PostInput) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        title: input.title,
        slug: input.slug,
        persona: input.persona,
        content: input.content,
        draft: input.draft,
        publishedAt: input.draft ? null : new Date().toISOString()
      }
    ])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}
