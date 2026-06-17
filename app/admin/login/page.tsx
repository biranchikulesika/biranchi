'use client'

import { useActionState } from 'react'
import { login, signInWithGoogle } from './actions'
import { AlertCircle, User } from 'lucide-react'

async function loginAction(prevState: any, formData: FormData) {
  const result = await login(formData)
  if (result?.error) {
    return { error: result.error }
  }
  return { error: null }
}

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, { error: null })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[#dedede]">
          Admin Portal
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#111] py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-[#222]">
          {state?.error && (
            <div className="mb-6 rounded-md bg-red-900/20 border border-red-900/50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-500">
                    Authentication Failed
                  </h3>
                  <div className="mt-2 text-sm text-red-400">
                    <p>{state.error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#dedede]">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full appearance-none rounded-md bg-[#0a0a0a] border border-[#333] px-3 py-2 text-[#dedede] shadow-sm placeholder-[#555] focus:border-[#666] focus:outline-none focus:ring-[#666] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#dedede]">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full appearance-none rounded-md bg-[#0a0a0a] border border-[#333] px-3 py-2 text-[#dedede] shadow-sm placeholder-[#555] focus:border-[#666] focus:outline-none focus:ring-[#666] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full justify-center rounded-md border border-[#333] bg-[#0a0a0a] hover:bg-[#1a1a1a] py-2 px-4 text-sm font-medium text-[#dedede] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#666] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#333]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#111] px-2 text-[#888]">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => signInWithGoogle()}
                type="button"
                className="flex w-full justify-center items-center gap-3 rounded-md border border-[#333] bg-[#0a0a0a] py-2 px-4 text-sm font-medium text-[#dedede] shadow-sm hover:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#666] focus:ring-offset-2 transition-colors"
              >
                <User className="h-5 w-5 text-[#888]" />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
