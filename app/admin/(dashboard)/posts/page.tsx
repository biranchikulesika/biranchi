import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getPosts } from '@/lib/repositories/post.repository'

export default async function PostsPage() {
  const posts = await getPosts()

  return (
    <div className="p-8 space-y-6 bg-[#0a0a0a] min-h-screen text-[#dedede]">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#dedede]">Posts</h1>
          <p className="mt-2 text-sm text-[#888]">A list of all blog posts including their title, status, and persona.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/admin/compose"
            className="inline-flex items-center gap-2 rounded-md bg-[#dedede] px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border border-[#222] sm:rounded-lg">
              <table className="min-w-full divide-y divide-[#222]">
                <thead className="bg-[#111]">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[#dedede] sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[#dedede]">
                      Persona
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[#dedede]">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-[#dedede]">
                      Slug
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222] bg-[#0a0a0a]">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-[#111] transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-[#dedede] sm:pl-6">
                        {post.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-[#888]">{post.persona}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {post.draft ? (
                          <span className="inline-flex items-center rounded-md border border-yellow-900/50 bg-yellow-900/20 px-2 py-1 text-xs font-medium text-yellow-500">
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md border border-green-900/50 bg-green-900/20 px-2 py-1 text-xs font-medium text-emerald-500">
                            Published
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-[#888]">{post.slug}</td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-[#666]">
                        No posts found. Get writing!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
