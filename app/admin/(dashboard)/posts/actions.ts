'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createPost } from '@/lib/repositories/post.repository'

export async function submitPost(prevState: any, formData: FormData) {
  try {
    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const persona = formData.get('persona') as string
    const content = formData.get('content') as string
    const draft = formData.get('draft') === 'true'

    if (!title || !slug || !persona || !content) {
      return { error: 'Please fill out all required fields' }
    }

    await createPost({
      title,
      slug,
      persona,
      content,
      draft
    })

  } catch (error: any) {
    return { error: error.message || 'Failed to create post' }
  }

  revalidatePath('/admin/posts')
  redirect('/admin/posts')
}
