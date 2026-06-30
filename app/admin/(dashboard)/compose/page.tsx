'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, X, Image as ImageIcon, GripVertical, Check, RefreshCw,
  Trash2, UploadCloud, Send, Undo, Redo, MessageSquare, List, Settings,
  Files, Eye, CloudUpload
} from 'lucide-react';
import { uploadImage } from '@/lib/supabase/storage';
import { getPosts, createPost, updatePost, checkSlugExists } from '@/app/admin/actions/posts.actions';
import PostRenderer from '@/components/post-renderer/PostRenderer';
import PublishDrawer from './PublishDrawer';
import MDXEditor from './MDXEditor';
import MDXPreview from './MDXPreview';
import { compileMDXAction } from './actions';
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

const getTitleClass = (persona: string) => {
  const base = "w-full bg-transparent border-none outline-none placeholder-neutral-800 resize-none focus:ring-0 focus:outline-none text-neutral-100 transition-all duration-300";
  if (persona === 'wanderer') return `${base} font-serif font-bold text-4xl md:text-5xl leading-snug tracking-tight`;
  if (persona === 'thinker') return `${base} font-cormorant font-normal text-4xl md:text-5xl leading-[1.07] tracking-tight`;
  if (persona === 'builder') return `${base} font-sans font-semibold text-3xl md:text-4xl leading-snug tracking-tight`;
  if (persona === 'operator') return `${base} font-mono font-bold uppercase text-xl md:text-2xl leading-tight tracking-tight`;
  return `${base} font-serif font-bold text-4xl md:text-5xl leading-snug tracking-tight`;
};

const getSubtitleClass = (persona: string) => {
  const base = "w-full bg-transparent border-none outline-none placeholder-neutral-800 focus:ring-0 focus:outline-none text-neutral-400 transition-all duration-300";
  if (persona === 'wanderer') return `${base} font-serif font-light italic text-lg sm:text-xl leading-relaxed`;
  if (persona === 'thinker') return `${base} font-spectral font-light italic text-[17px] leading-relaxed`;
  if (persona === 'builder') return `${base} font-mono text-[14px] leading-relaxed`;
  if (persona === 'operator') return `${base} font-mono text-[12px] leading-relaxed`;
  return `${base} font-sans font-light text-lg`;
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

  // MDX Preview State
  const [compiledMdx, setCompiledMdx] = useState<any>(null);
  const [isCompilingPreview, setIsCompilingPreview] = useState(false);

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

  useEffect(() => {
    if (activeTab === 'preview' && richTextContent) {
      const compile = async () => {
        setIsCompilingPreview(true);
        try {
          const res = await compileMDXAction(richTextContent);
          if (res.source) {
            setCompiledMdx(res.source);
          } else {
            console.error(res.error);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsCompilingPreview(false);
        }
      };
      compile();
    }
  }, [activeTab, richTextContent]);

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
    <div className={`w-full bg-[#0a0a0a] text-neutral-200 flex flex-col font-sans selection:bg-[#222] ${activeTab === 'preview' ? 'min-h-screen' : 'h-screen overflow-hidden'}`}>

      {/* Main Row */}
      <div className="flex-1 min-h-0 w-full flex flex-row">
        
        {/* Editor or Preview Pane */}
        <div className={`flex-1 min-w-0 flex flex-col bg-[#0a0a0a] ${activeTab === 'preview' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          {dbError && (
            <div className="max-w-2xl mx-auto mt-6 w-full px-4 shrink-0">
              <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-xl text-red-400 text-xs font-mono flex items-center gap-2">
                <span>⚠️</span>
                <span>{dbError}</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-neutral-600 gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-[#ff7700]" />
              <span className="text-xs font-mono tracking-wider">preparing studio drawing tools...</span>
            </div>
          ) : (
            <div className="flex-1 min-h-0 w-full flex flex-col bg-[#0a0a0a]">
              {activeTab === 'composer' ? (
                <main className="w-full flex-1 flex flex-col min-h-0">
                  <div className="w-full flex-1 min-h-0">
                    <MDXEditor 
                      content={richTextContent} 
                      onChange={setRichTextContent} 
                      persona={formData.persona}
                      title={formData.title}
                      onTitleChange={(title) => {
                        setFormData((prev: any) => ({ ...prev, title }));
                        if (!formData.slug || formData.slug.trim() === '') {
                          setFormData((prev: any) => ({ ...prev, slug: slugify(title) }));
                        }
                      }}
                      subtitle={formData.subtitle}
                      onSubtitleChange={(subtitle) => setFormData((prev: any) => ({ ...prev, subtitle }))}
                      actionButtons={
                        <>
                          <button
                            type="button"
                            onClick={() => setActiveTab('preview')}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-sans text-neutral-300 hover:text-white hover:bg-[#333] transition-colors border border-transparent hover:border-[#444]"
                            title="Open Preview"
                          >
                            <Eye className="w-3.5 h-3.5" strokeWidth={1.5} /> Preview
                          </button>
                          <button
                            onClick={() => setIsPublishModalOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-medium font-sans bg-[#ff7700] text-white hover:bg-[#e66a00] transition-colors shadow-sm"
                            title="Publish Settings"
                          >
                            <CloudUpload className="w-3.5 h-3.5" strokeWidth={1.5} /> Publish
                          </button>
                        </>
                      }
                    />
                  </div>
                </main>
              ) : (
                <div className="w-full h-full min-h-screen bg-transparent relative">
                    <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                       <button
                         type="button"
                         onClick={() => setActiveTab('composer')}
                         className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-sans bg-[#111] border border-[#333] text-neutral-300 hover:text-white hover:bg-[#222] transition-colors shadow-lg"
                       >
                         <Undo className="w-4 h-4" strokeWidth={1.5} /> Editor
                       </button>
                       <button
                         onClick={() => setIsPublishModalOpen(true)}
                         className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium font-sans bg-[#ff7700] text-white hover:bg-[#e66a00] transition-colors shadow-lg"
                       >
                         <CloudUpload className="w-4 h-4" strokeWidth={1.5} /> Publish
                       </button>
                    </div>
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
                      compiledMdx={compiledMdx}
                    />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar (Bottom) */}
      <div className="h-[22px] bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] font-sans shrink-0 border-t border-[#005f9e]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 hover:bg-[#ffffff22] px-1 cursor-pointer transition-colors">
            <Check className="w-3 h-3" />
            {saveStatus}
          </span>
          <span className="flex items-center gap-1.5 uppercase hover:bg-[#ffffff22] px-1 cursor-pointer transition-colors">
            <div className={`w-2 h-2 rounded-full ${activePersonaParams.color.replace('text-', 'bg-')}`} />
            {personaDisplayLabel[formData.persona] || 'Writing'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono hover:bg-[#ffffff22] px-1 cursor-pointer transition-colors">{getWordCount()} words</span>
          <span className="font-mono hover:bg-[#ffffff22] px-1 cursor-pointer transition-colors">{getReadingTime()} mins</span>
          <span className="font-mono hover:bg-[#ffffff22] px-1 cursor-pointer transition-colors">UTF-8</span>
          <span className="font-mono hover:bg-[#ffffff22] px-1 cursor-pointer transition-colors">MDX</span>
        </div>
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
