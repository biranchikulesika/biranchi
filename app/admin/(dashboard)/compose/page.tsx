'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, X, Image as ImageIcon, GripVertical, Check, RefreshCw,
  Trash2, UploadCloud, Send, Undo, Redo, MessageSquare, List, Settings
} from 'lucide-react';
import { uploadImage } from '@/lib/supabase/storage';
import { getPosts, createPost, updatePost, checkSlugExists } from '@/app/admin/actions/posts.actions';
import PostRenderer from '@/components/post-renderer/PostRenderer';
import PublishDrawer from './PublishDrawer';
import RichTextEditor from './RichTextEditor';
import { generateUniqueId, parseToBlocks, compileFromBlocks } from '@/lib/parsers';
import { parseDbError } from '@/components/admin/validation';

// Visual theme configurations based on active persona
const personaInfoMap: Record<string, { label: string; system: string; color: string; bg: string }> = {
  'builder': { label: 'Forge', system: 'BUILDER SYSTEM', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  'operator': { label: 'Signal', system: 'OPERATOR SYSTEM', color: 'text-emerald-500', bg: 'bg-[#ff7700]/10' },
  'thinker': { label: 'Inside the Head', system: 'SYNAPSE THOUGHTS', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  'wanderer': { label: 'Scribble', system: 'WANDERER MEMORY', color: 'text-sky-500', bg: 'bg-sky-500/10' }
};

const personaDisplayLabel: Record<string, string> = {
  'builder': 'Writing in Forge',
  'operator': 'Writing in Signal',
  'thinker': 'Writing in Inside the Head',
  'wanderer': 'Writing in Scribble',
};

function formatToDatetimeLocal(isoString?: string): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function validateCustomSlug(
  customSlug: string,
  currentId: string | null,
  currentPersona: string
): Promise<{ valid: boolean; cleanSlug?: string; error?: string }> {
  const clean = customSlug.trim().toLowerCase();

  if (!clean) {
    return { valid: false, error: "Slug cannot be empty." };
  }

  const validCharsRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!validCharsRegex.test(clean)) {
    return { valid: false, error: "Slug must contain only lowercase letters, numbers, and single hyphens. No leading/trailing hyphens or special characters." };
  }

  const systemRoutes = ['admin', 'blogs', 'p', 'thinker', 'wanderer', 'builder', 'operator', 'about', 'newsletter', 'reading', 'phrases', 'quotes', 'api'];
  if (systemRoutes.includes(clean)) {
    return { valid: false, error: `Slug '${clean}' is reserved for system routing.` };
  }

  const conflictRes = await checkSlugExists(clean, currentId, currentPersona);
  const isConflict = conflictRes.success ? conflictRes.data : false;
  if (isConflict) {
    return { valid: false, error: `The custom URL slug '${clean}' is already in use by another article in the '${currentPersona}' persona.` };
  }

  return { valid: true, cleanSlug: clean };
}

async function getUniqueSlug(baseSlug: string, currentId: string | null, currentPersona: string): Promise<string> {
  let candidate = baseSlug || 'untitled';

  const res1 = await checkSlugExists(candidate, currentId, currentPersona);
  if (!(res1.success ? res1.data : false)) {
    return candidate;
  }

  let counter = 1;
  while (true) {
    counter++;
    const nextCandidate = `${baseSlug}-${counter}`;
    const res2 = await checkSlugExists(nextCandidate, currentId, currentPersona);
    if (!(res2.success ? res2.data : false)) {
      return nextCandidate;
    }
  }
}

function ComposePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const targetPersona = searchParams.get('persona');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'composer' | 'preview'>('composer');
  const [dbError, setDbError] = useState<string | null>(null);

  // Advanced publishing configuration states
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('Saved');
  const [isEditingExcerpt, setIsEditingExcerpt] = useState(false);
  const [initialSlug, setInitialSlug] = useState('');
  const [wasPublished, setWasPublished] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isCustomizingUrl, setIsCustomizingUrl] = useState(false);
  const [customUrlVal, setCustomUrlVal] = useState('');
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);

  // Focus and Slash commands
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [slashMenuBlockId, setSlashMenuBlockId] = useState<string | null>(null);

  // Core Form Data
  const [formData, setFormData] = useState<any>({
    persona: '',
    title: '',
    subtitle: '',
    byline: '',
    slug: '',
    oldSlugs: [],
    excerpt: '',
    coverImageUrl: '',
    coverImageAlt: 'Cover Image',
    coverImageCaption: '',
    coverImageLocation: '',
    coverImageCredit: '',
    autoCoverImage: true,
    content: '',
    tags: [],
    publishedAt: '',
    featured: false,
    hidden: false,
    status: 'draft'
  });

  const [richTextContent, setRichTextContent] = useState('');
  const [pasteTagsText, setPasteTagsText] = useState('');

  const handleApplyCustomUrl = async () => {
    setUrlValidationError(null);
    const resultObj = await validateCustomSlug(customUrlVal, currentPostId, formData.persona);
            const result = resultObj;
    if (!result.valid) {
      setUrlValidationError(result.error || "Invalid slug.");
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      slug: result.cleanSlug
    }));

    setIsCustomizingUrl(false);
  };

  // Fetch / Select Post
  const loadPostToComposer = useCallback(async () => {
    setLoading(true);
    try {
      const postsResponse = await getPosts();
      const posts = postsResponse.success ? postsResponse.data : [];

      if (editId) {
        const found = (posts || []).find((p: any) => p.id === editId || p.slug === editId);
        if (found) {
          setFormData({
            ...found,
            tags: found.tags || [],
            oldSlugs: found.oldSlugs || []
          });
          setCurrentPostId(found.id);
          setInitialSlug(found.slug || '');
          setWasPublished(found.status === 'published' && !!found.publishedAt);
          let htmlContent = found.draftContent || found.content || '';
          try {
              const maybeJson = JSON.parse(htmlContent);
              if (Array.isArray(maybeJson)) {
                  htmlContent = compileFromBlocks(maybeJson);
              }
          } catch (e) {
              // It's already HTML
          }
          setRichTextContent(htmlContent);
          setPasteTagsText((found.tags || []).join(', '));
        } else {
          router.push('/admin/compose');
        }
      } else {
        const defaultPersona = targetPersona || 'builder';
        setFormData({
          persona: defaultPersona,
          title: '',
          subtitle: '',
          byline: '',
          slug: '',
          oldSlugs: [],
          excerpt: '',
          coverImageUrl: '',
          coverImageAlt: 'Cover Image',
          coverImageCaption: '',
          coverImageLocation: '',
          coverImageCredit: '',
          autoCoverImage: true,
          content: '',
          tags: [],
          publishedAt: '',
          featured: false,
          hidden: false,
          status: 'draft'
        });
        setCurrentPostId(null);
        setInitialSlug('');
        setWasPublished(false);
        setRichTextContent('');
      }
    } catch (e) {
      console.error('Error in workspace composer initialization: ', e);
    } finally {
      setLoading(false);
    }
  }, [editId, targetPersona, router]);

  useEffect(() => {
    loadPostToComposer();
  }, [editId, targetPersona, loadPostToComposer]);

  const getWordCount = () => {
    if (!richTextContent) return 0;
    const cleanText = richTextContent.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) return 0;
    return cleanText.split(/\s+/).filter(Boolean).length;
  };

  const getReadingTime = () => {
    const words = getWordCount();
    return Math.max(1, Math.ceil(words / 220));
  };

  const getExcerptFromContent = () => {
    if (!richTextContent) return '';
    const cleanText = richTextContent.replace(/<[^>]*>/g, ' ').trim();
    return cleanText.length > 150 ? cleanText.substring(0, 147) + '...' : cleanText;
  };

  const getEffectiveCoverImage = () => {
    if (!formData.autoCoverImage && formData.coverImageUrl) {
      return formData.coverImageUrl;
    }
    const extMatch = richTextContent.match(/src="([^"]+)"/);
    if (extMatch) return extMatch[1];
    return null;
  };

  // Continuous Autosave Implementation with dynamic content-driven extraction
  const isInitialMount = useRef(true);
  const lastSavedPayloadRef = useRef<string | null>(null);

  // Show "Unsaved" immediately upon any state updates
  useEffect(() => {
    if (loading) return;

    const splitTags = pasteTagsText.split(',').map(t => t.trim()).filter(Boolean);
    const currentPayloadStr = JSON.stringify({
      title: formData.title || '',
      subtitle: formData.subtitle || '',
      persona: formData.persona || '',
      coverImageUrl: formData.coverImageUrl || '',
      autoCoverImage: formData.autoCoverImage,
      excerpt: formData.excerpt || '',
      content: richTextContent,
      tags: splitTags,
    });

    if (isInitialMount.current) {
      isInitialMount.current = false;
      lastSavedPayloadRef.current = currentPayloadStr;
      return;
    }

    if (lastSavedPayloadRef.current === currentPayloadStr) {
      return; // No actual content delta
    }

    setSaveStatus('Unsaved');
  }, [formData.title, formData.subtitle, formData.persona, formData.coverImageUrl, formData.autoCoverImage, formData.excerpt, richTextContent, pasteTagsText, loading]);

  useEffect(() => {
    if (loading || saveStatus !== 'Unsaved') return;

    setSaveStatus('Saving...');
    const timer = setTimeout(async () => {
      try {
        let coverUrl = formData.coverImageUrl;
        if (formData.autoCoverImage) {
          const extMatch = richTextContent.match(/src="([^"]+)"/);
          if (extMatch) {
            coverUrl = extMatch[1];
          } else {
            coverUrl = '';
          }
        }

        const titleToSave = formData.title.trim() || '';
        let baseSlug = formData.slug || (titleToSave ? slugify(titleToSave) : 'untitled-post');
        if (!baseSlug) {
          baseSlug = 'untitled';
        }

        let finalSlug = baseSlug;
        if (!wasPublished) {
          finalSlug = await getUniqueSlug(baseSlug, currentPostId, formData.persona);
        }

        const splitTags = pasteTagsText.split(',').map(t => t.trim()).filter(Boolean);

        const currentPayloadStr = JSON.stringify({
          title: titleToSave,
          subtitle: formData.subtitle || '',
          persona: formData.persona || '',
          coverImageUrl: coverUrl,
          autoCoverImage: formData.autoCoverImage,
          excerpt: formData.excerpt || '',
          draftContent: richTextContent,
          tags: splitTags,
        });

        const payload = {
          ...formData,
          title: titleToSave,
          draftContent: richTextContent,
          slug: finalSlug,
          tags: splitTags,
          coverImageUrl: coverUrl,
          status: formData.status ?? 'draft'
        };

        if (currentPostId) {
          const updateRes = await updatePost(currentPostId, payload);
          if (!updateRes.success) throw new Error("error" in updateRes ? updateRes.error : "Error");
          lastSavedPayloadRef.current = currentPayloadStr;
          if (payload.slug !== formData.slug) {
            setFormData((prev: any) => ({ ...prev, slug: payload.slug }));
          }
        } else {
          const createdRes = await createPost(payload);
          if (!createdRes.success) throw new Error("error" in createdRes ? createdRes.error : "Error");
          const created = createdRes.data;
          if (created && created.id) {
            setCurrentPostId(created.id);
            lastSavedPayloadRef.current = currentPayloadStr;
            setFormData((prev: any) => ({ ...prev, slug: created.slug || payload.slug }));
            router.replace(`/admin/compose?id=${created.id}`, { scroll: false });
          }
        }
        setSaveStatus(formData.status === 'published' ? 'Saved' : 'Saved as draft');
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('Error saving');
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [
    saveStatus,
    formData.title,
    formData.subtitle,
    formData.persona,
    formData.coverImageUrl,
    formData.autoCoverImage,
    formData.excerpt,
    richTextContent,
    pasteTagsText,
    loading,
    currentPostId,
    wasPublished,
    formData.slug,
    formData.status,
    formData,
    router
  ]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'Unsaved' || saveStatus === 'Saving...' || saveStatus === 'Error saving') {
        e.preventDefault();
        const msg = "You have unsaved changes. Are you sure you want to leave?";
        e.returnValue = msg;
        return msg;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);



  const handleSavePost = async (isNewDraftState: boolean) => {
    setDbError(null);
    setSaving(true);

    let coverUrl = formData.coverImageUrl;
    const compiledHtml = richTextContent;
    const compiledJson = richTextContent;

    if (formData.autoCoverImage) {
      const extMatch = compiledHtml.match(/src="([^"]+)"/);
      if (extMatch) coverUrl = extMatch[1];
      else coverUrl = '';
    }

    const titleToSave = formData.title.trim() || 'Untitled Post';
    let baseSlug = formData.slug || slugify(titleToSave);
    if (!baseSlug) {
      baseSlug = 'untitled';
    }

    let finalSlug = baseSlug;
    if (!wasPublished) {
      finalSlug = await getUniqueSlug(baseSlug, currentPostId, formData.persona);
    }

    const splitTags = pasteTagsText.split(',').map(t => t.trim()).filter(Boolean);

    const isPublishing = !isNewDraftState;

    const payload: any = {
      ...formData,
      title: titleToSave,
      slug: finalSlug,
      tags: splitTags,
      coverImageUrl: coverUrl,
      status: isNewDraftState ? 'draft' : 'published',
      publishedAt: formData.publishedAt ? formData.publishedAt : (isNewDraftState ? null : new Date().toISOString())
    };

    if (isPublishing) {
      payload.content = compiledHtml;
      payload.draftContent = compiledJson;
    } else {
      payload.draftContent = compiledJson;
    }

    try {
      if (currentPostId) {
        const upRes = await updatePost(currentPostId, payload);
        if (!upRes.success) throw new Error("error" in upRes ? upRes.error : "Error");
      } else {
        const createRes2 = await createPost(payload);
        if (!createRes2.success) throw new Error("error" in createRes2 ? createRes2.error : "Error");
      }
      router.push('/admin/library');
    } catch (err: any) {
      console.error(err);
      setDbError(parseDbError(err) || "Write constraints failed on database level.");
    } finally {
      setSaving(false);
    }
  };



  const activePersonaParams = personaInfoMap[formData.persona] || { label: 'Universal', system: 'ECOSYSTEM', color: 'text-neutral-400', bg: 'bg-neutral-850' };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-neutral-200 flex flex-col font-sans selection:bg-[#222]">

      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#181818] bg-[#0c0c0c] shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/library"
            className="flex items-center gap-1.5 text-xs font-mono uppercase text-neutral-400 hover:text-white bg-[#111] hover:bg-[#161616] border border-[#222] px-3 py-1.5 rounded-lg transition-all"
            id="back-to-library-btn"
          >
            <span>← Back</span>
          </Link>

          <span className="text-neutral-800 font-mono">/</span>

          <span className={`text-xs font-mono uppercase ${activePersonaParams.color} flex items-center gap-1 bg-[#111] px-3 py-1 rounded-full border border-[#1b1b1b]`}>
            <span className={`w-1.5 h-1.5 rounded-full ${activePersonaParams.color.replace('text-', 'bg-')}`} />
            <span>{personaDisplayLabel[formData.persona] || 'Writing'}</span>
          </span>

          <span className="text-neutral-800 font-mono">/</span>

          {/* Simple Draft Autosave Status Display */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500">
            <span className={`w-1.5 h-1.5 rounded-full ${
              saveStatus === 'Saving...' ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'
            }`} />
            <span>{saveStatus}</span>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab(prev => prev === 'composer' ? 'preview' : 'composer')}
            className={`px-3 py-1.5 border rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-[#ff7700]/10 border-[#ff7700] text-[#ff7700]'
                : 'bg-[#111] border-[#1b1b1b] text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
            id="preview-toggle-btn"
          >
            {activeTab === 'preview' ? 'Writing' : 'Preview'}
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData((prev: any) => {
                const updated = { ...prev };
                if (!updated.excerpt) {
                  updated.excerpt = getExcerptFromContent();
                }
                return updated;
              });
              setIsPublishModalOpen(true);
            }}
            className="px-4 py-1.5 bg-[#ff7700] hover:bg-[#ff881a] text-black font-bold text-xs font-mono uppercase rounded-lg transition-colors shadow-lg shadow-orange-500/5"
            id="publish-drawer-trigger"
          >
            Publish
          </button>
        </div>
      </header>



      {dbError && (
        <div className="max-w-2xl mx-auto mt-6 w-full px-4">
          <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-xs font-mono flex items-center gap-2">
            <span>⚠️</span>
            <span>{dbError}</span>
          </div>
        </div>
      )}

      {/* Main Container Area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col bg-[#0a0a0a]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-neutral-600 gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-[#ff7700]" />
            <span className="text-xs font-mono tracking-wider">preparing studio drawing tools...</span>
          </div>
        ) : (
          <div className="flex-1 w-full bg-[#0a0a0a]">
            {activeTab === 'composer' ? (
              <main
                className="w-full max-w-210 mx-auto px-6 py-12 md:py-20 flex flex-col min-h-screen"
              >
                {/* Title & Subtitle Inputs */}
                <div className="space-y-4 mb-10 w-full">
                  <textarea
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setFormData((prev: any) => ({ ...prev, title: newTitle }));
                    }}
                    onBlur={(e) => {
                      const newTitle = e.target.value;
                      setFormData((prev: any) => {
                        if (!prev.slug || prev.slug.trim() === '') {
                          return { ...prev, slug: slugify(newTitle) };
                        }
                        return prev;
                      });
                    }}
                    placeholder="Title"
                    className="w-full bg-transparent border-none text-4xl md:text-5xl font-semibold text-neutral-155 outline-none placeholder-neutral-800 resize-none leading-snug font-serif tracking-tight focus:ring-0 focus:outline-none"
                    rows={1}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />

                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="An elegant subtitle leads the narrative..."
                    className="w-full bg-transparent border-none text-lg text-neutral-400 font-light outline-none placeholder-neutral-800 font-sans focus:ring-0 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const editorEl = document.querySelector('.ProseMirror');
                        if (editorEl) {
                          (editorEl as HTMLElement).focus();
                        }
                      }
                    }}
                  />
                </div>

                {/* Rich Text Editor stream */}
                <div className="w-full relative mt-4">
                  <RichTextEditor 
                    content={richTextContent} 
                    onChange={setRichTextContent} 
                  />
                </div>
              </main>
            ) : (
              /* High-Fidelity Preview inside actual Persona Layout via PostRenderer */
              <div className="w-full h-full min-h-screen bg-transparent">
                <PostRenderer
                  post={{
                    id: currentPostId || 'preview-draft',
                    slug: formData.slug || 'preview-draft-slug',
                    persona: formData.persona,
                    title: formData.title || 'Untitled Post',
                    subtitle: formData.subtitle || '',
                    excerpt: formData.excerpt || '',
                    tags: splitTagsFromText(pasteTagsText),
                    publishedAt: formData.publishedAt || new Date().toISOString(),
                    readingTime: getReadingTime(),
                    coverImageUrl: getEffectiveCoverImage(),
                    coverImageLocation: formData.coverImageLocation,
                    autoCoverImage: formData.autoCoverImage,
                    content: richTextContent,
                    featured: formData.featured,
                    hidden: formData.hidden,
                    status: 'draft',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  } as any}
                  slug={formData.slug || 'preview-draft-slug'}
                  allPosts={[]}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating fixed Settings and Publishing Button in Bottom-Right Corner of Screen */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        {activeTab === 'composer' && (
          <div className="hidden md:flex bg-[#121212] border border-[#222] px-4 py-2 rounded-full shadow-2xl items-center gap-3 text-xs font-mono text-neutral-500 mr-2">
            <span>{getWordCount()} words</span>
            <div className="w-px h-3 bg-[#333]"></div>
            <span>{getReadingTime()} min read</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setFormData((prev: any) => {
              const updated = { ...prev };
              if (!updated.excerpt) {
                updated.excerpt = getExcerptFromContent();
              }
              return updated;
            });
            setIsPublishModalOpen(true);
          }}
          className="bg-[#121212] hover:bg-[#1a1a1a] border border-[#222] p-3.5 text-neutral-400 hover:text-white rounded-full shadow-2xl transition-all duration-200 flex items-center justify-center group"
          title="Article Settings & Publishing Setup"
          id="editor-settings-floating-btn"
        >
          <Settings className="w-5 h-5 text-neutral-400 group-hover:text-[#ff7700] transition-colors" />
        </button>
      </div>

      <PublishDrawer
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        personaInfoMap={personaInfoMap}
        saving={saving}
        isCustomizingUrl={isCustomizingUrl}
        setIsCustomizingUrl={setIsCustomizingUrl}
        customUrlVal={customUrlVal}
        setCustomUrlVal={setCustomUrlVal}
        urlValidationError={urlValidationError}
        setUrlValidationError={setUrlValidationError}
        pasteTagsText={pasteTagsText}
        setPasteTagsText={setPasteTagsText}
        getExcerptFromContent={getExcerptFromContent}
        getWordCount={getWordCount}
        getReadingTime={getReadingTime}
        handleApplyCustomUrl={handleApplyCustomUrl}
        validateCustomSlug={validateCustomSlug}
        handleSavePost={handleSavePost}
        currentPostId={currentPostId}
        wasPublished={wasPublished}
        isEditingExcerpt={isEditingExcerpt}
        setIsEditingExcerpt={setIsEditingExcerpt}
      />
</div>
  );
}

function splitTagsFromText(text: string): string[] {
  if (!text) return [];
  return text.split(',').map(t => t.trim()).filter(Boolean);
}

export default function ComposePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-24 text-neutral-600 gap-3">
        <RefreshCw className="w-5 h-5 animate-spin" style={{ color: '#ff7700' }} />
        <span className="text-xs font-mono">preparing studio workspace...</span>
      </div>
    }>
      <ComposePageContent />
    </Suspense>
  );
}
