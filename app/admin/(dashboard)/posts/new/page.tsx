'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { submitPost } from '../actions'

export default function NewPostPage() {
  const [state, formAction, isPending] = useActionState(submitPost, { error: null })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/posts" 
          className="text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Create New Post</h1>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        {state?.error && (
          <div className="rounded-t-xl bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Failed to create post
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{state.error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form action={formAction} className="px-4 py-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Title
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  placeholder="The Future of Computing"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">
                Slug
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  placeholder="the-future-of-computing"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="persona" className="block text-sm font-medium leading-6 text-gray-900">
                Persona
              </label>
              <div className="mt-2">
                <select
                  id="persona"
                  name="persona"
                  required
                  defaultValue="biranchi"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-black sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value="biranchi">Biranchi</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">
                Content (Markdown)
              </label>
              <div className="mt-2">
                <textarea
                  id="content"
                  name="content"
                  rows={10}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 font-mono"
                  placeholder="Write your post content here..."
                />
              </div>
            </div>

            <div className="col-span-full">
              <fieldset>
                <legend className="text-sm font-medium leading-6 text-gray-900">Publishing Status</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="status-draft"
                      name="draft"
                      type="radio"
                      value="true"
                      defaultChecked
                      className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="status-draft" className="block text-sm font-medium leading-6 text-gray-900">
                      Save as Draft
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="status-published"
                      name="draft"
                      type="radio"
                      value="false"
                      className="h-4 w-4 border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="status-published" className="block text-sm font-medium leading-6 text-gray-900">
                      Publish immediately
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

          </div>
          
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-6">
            <Link href="/admin/posts" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-black px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
