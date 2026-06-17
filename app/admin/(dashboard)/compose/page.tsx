'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Undo, Redo } from 'lucide-react'
import { createPost } from '@/app/admin/actions'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function ComposeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const persona = searchParams.get('persona') || 'thinker'

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [content, setContent] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePublish = async () => {
    setIsSaving(true)
    setError(null)
    try {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `post-${Date.now()}`
      await createPost({
        title: title || 'Untitled',
        slug,
        persona,
        content: `# ${title}\n\n${subtitle ? `> ${subtitle}\n\n` : ''}${content}`,
        draft: false
      })
      router.push('/admin/posts')
    } catch (e: any) {
      console.error(e)
      setError(e.message || 'Failed to publish post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const renderPreview = () => {
    return (
      <div className="max-w-6xl mx-auto py-12 px-6 lg:px-12 flex flex-col lg:flex-row gap-16">
        <div className="flex-1 max-w-3xl">
          <div className="mb-12">
            <p className="text-[11px] font-mono tracking-widest text-[#555] uppercase mb-6 flex items-center gap-2">
              <span className="text-[#8a8a8a]">{persona}</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>1 MIN READ</span>
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-[#dedede] leading-tight mb-4">
              {title || 'Untitled'}
            </h1>
            {subtitle && (
              <p className="text-lg text-[#737373] font-mono font-medium">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="prose prose-invert prose-p:text-[#dedede] prose-headings:text-[#dedede] prose-a:text-emerald-500 max-w-none text-lg leading-loose font-mono">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || 'content here.'}
            </ReactMarkdown>
          </div>
          
          {persona === 'operator' && (
             <div className="pt-24">
               <div className="text-[10px] font-mono font-semibold tracking-[0.2em] text-center text-[#555] uppercase mb-8">SHARE THIS REFLECTION</div>
               <div className="flex justify-center gap-4 border-b border-[#1a1a1a] pb-24">
                 {['twitter', 'linkedin', 'message', 'copy'].map(icon => (
                   <div key={icon} className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-[#777] cursor-pointer hover:bg-[#111] transition-colors">
                     <div className="w-4 h-4 bg-current" style={{ clipPath: 'circle(50%)' }}></div>
                   </div>
                 ))}
               </div>
               
               <div className="pt-12 text-sm text-[#888] font-mono hover:text-[#dedede] cursor-pointer w-max">
                 View All Signals →
               </div>
             </div>
          )}
        </div>
        
        {persona === 'operator' && (
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-16 pt-8">
             <div>
               <h3 className="text-[10px] font-mono font-semibold tracking-[0.2em] text-[#555] uppercase mb-6">RELATED SIGNALS</h3>
               <div className="h-px bg-[#1a1a1a] w-full"></div>
             </div>
             
             <div>
               <h3 className="text-[10px] font-mono font-semibold tracking-[0.2em] text-[#555] uppercase mb-6">DISPATCH CHANNEL</h3>
               <p className="text-sm text-[#8a8a8a] font-mono mb-8 leading-relaxed">
                 Occasional signals. Operational notes. Infrastructure observations.
               </p>
               <input 
                 type="text" 
                 placeholder="SYS_USER_EMAIL=(...)" 
                 className="w-full bg-transparent border-b border-[#333] pb-2 text-sm font-mono text-[#dedede] placeholder-[#444] focus:outline-none focus:border-[#666]"
               />
               <button className="text-[10px] font-mono font-semibold tracking-[0.2em] text-[#555] uppercase mt-4 hover:text-[#dedede]">
                 [SUB]
               </button>
             </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-[#1a1a1a] flex items-center justify-between px-6 shrink-0 bg-[#0a0a0a] z-10 sticky top-0">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[#737373] hover:text-white transition-colors">
            <ArrowLeft size={16} /> BACK
          </button>
          
          <div className="h-4 w-px bg-[#222]"></div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-mono text-[#8a8a8a] tracking-wider uppercase">
                WRITING IN {persona}
              </span>
            </div>
            
            <div className="h-4 w-px bg-[#222]"></div>
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#333]"></span>
              <span className="text-xs font-mono text-[#555]">
                {isSaving ? 'Saving...' : 'Saved'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="text-xs font-mono font-medium tracking-wider text-[#dedede] hover:text-white transition-colors px-4 py-2 border border-[#333] rounded hover:bg-[#111]"
          >
            {isPreview ? 'WRITING' : 'PREVIEW'}
          </button>
          <button 
            onClick={handlePublish}
            disabled={isSaving}
            className="text-xs font-mono font-medium tracking-wider text-black bg-[#ff8a00] hover:bg-[#ff9d2e] transition-colors px-6 py-2 rounded disabled:opacity-50 inline-flex"
          >
            {isSaving ? 'PUBLISHING...' : 'PUBLISH'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative">
        {isPreview ? (
          renderPreview()
        ) : (
          <div className="max-w-3xl mx-auto py-12 px-6">
            
            {/* Toolbar */}
            <div className="flex justify-center mb-16 sticky top-6 z-20">
              <div className="flex items-center gap-1.5 px-4 py-2 bg-[#111] border border-[#222] rounded-full shadow-2xl backdrop-blur-md bg-opacity-80">
                <button className="p-1.5 text-[#737373] hover:text-white rounded"><Undo size={14} /></button>
                <button className="p-1.5 text-[#737373] hover:text-white rounded"><Redo size={14} /></button>
                <div className="w-px h-4 bg-[#333] mx-2"></div>
                <button className="p-1.5 text-[#737373] hover:text-white text-xs font-medium px-2">Heading</button>
                <button className="p-1.5 text-[#737373] hover:text-white font-bold text-xs px-2">Bold</button>
                <button className="p-1.5 text-[#737373] hover:text-white italic text-xs px-2">Italic</button>
                <button className="p-1.5 text-[#737373] hover:text-white underline text-xs px-2">Underline</button>
                <button className="p-1.5 text-[#737373] hover:text-white text-xs px-2">Link</button>
                <button className="p-1.5 text-[#737373] hover:text-white text-xs px-2">Quote</button>
                <button className="p-1.5 text-[#737373] hover:text-white text-xs px-2">List</button>
                <button className="p-1.5 text-[#737373] hover:text-white text-xs px-2">Code</button>
                <button className="p-1.5 text-[#737373] hover:text-white text-xs px-2">Image</button>
                <button className="p-1.5 text-[#737373] hover:text-white text-xs px-2">Divider</button>
              </div>
            </div>

            {/* Editor Input Area */}
            <div className="flex flex-col gap-6">
              {error && (
                <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-md text-red-500 text-sm">
                  {error}
                </div>
              )}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-transparent text-4xl md:text-5xl font-serif text-[#dedede] placeholder-[#333] border-none outline-none focus:ring-0 p-0"
              />
              
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="An elegant subtitle leads the narrative..."
                className="w-full bg-transparent text-xl font-sans text-[#a3a3a3] placeholder-[#333] border-none outline-none focus:ring-0 p-0"
              />
              
              <div className="h-px w-full bg-[#222] my-4"></div>
              
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing story segment or type '/' for commands..."
                className="w-full h-[50vh] bg-transparent text-lg font-sans text-[#dedede] placeholder-[#333] border-none outline-none focus:ring-0 p-0 resize-none leading-relaxed"
              />
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default function ComposePage() {
  return (
    <Suspense fallback={<div className="p-8 text-[#888]">Loading editor...</div>}>
      <ComposeContent />
    </Suspense>
  )
}
