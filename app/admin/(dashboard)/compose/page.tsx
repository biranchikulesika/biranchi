'use client';

import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, X, Image as ImageIcon, GripVertical, Check, RefreshCw,
  Trash2, UploadCloud, Send, Undo, Redo, MessageSquare, List, Settings,
  Files, Eye, CloudUpload, ChevronUp, ChevronRight
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

import { EditorTab } from './MDXEditor';

export type TabData = {
  id: string; // unique tab identifier
  dbId: string | null;
  formData: any;
  richTextContent: string;
  pasteTagsText: string;
  wasPublished: boolean;
  saveStatus: string;
  initialSlug: string;
  isDirty?: boolean;
}

const defaultFormData = {
  persona: 'unassigned',
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
};

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
  // Multi-tab State
  const [tabs, setTabs] = useState<TabData[]>([
    {
      id: generateUniqueId(),
      dbId: null,
      formData: { ...defaultFormData, persona: targetPersona || 'unassigned' },
      richTextContent: '',
      pasteTagsText: '',
      wasPublished: false,
      saveStatus: 'Saved',
      initialSlug: ''
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [draftsList, setDraftsList] = useState<any[]>([]);

  // Derived state for the active tab
  const activeTabData = tabs.find(t => t.id === activeTabId) || tabs[0];
  const formData = activeTabData.formData;
  const richTextContent = activeTabData.richTextContent;
  const pasteTagsText = activeTabData.pasteTagsText;
  const currentPostId = activeTabData.dbId;
  const saveStatus = activeTabData.saveStatus;
  const wasPublished = activeTabData.wasPublished;
  const initialSlug = activeTabData.initialSlug;

  // Setters bridging the gap for the active tab
  const updateActiveTab = (updater: (prev: TabData) => TabData) => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? updater(t) : t));
  };

  const setFormData = (updater: any) => {
    updateActiveTab(t => ({
      ...t,
      formData: typeof updater === 'function' ? updater(t.formData) : { ...t.formData, ...updater },
      isDirty: true
    }));
  };

  const setRichTextContent = (content: string) => {
    updateActiveTab(t => ({ ...t, richTextContent: content, isDirty: true }));
  };

  const setPasteTagsText = (text: string) => {
    updateActiveTab(t => ({ ...t, pasteTagsText: text, isDirty: true }));
  };

  const setCurrentPostId = (id: string | null) => {
    updateActiveTab(t => ({ ...t, dbId: id }));
  };

  const setSaveStatus = (status: string) => {
    updateActiveTab(t => ({ ...t, saveStatus: status }));
  };

  const setWasPublished = (published: boolean) => {
    updateActiveTab(t => ({ ...t, wasPublished: published }));
  };
  
  const setInitialSlug = (slug: string) => {
    updateActiveTab(t => ({ ...t, initialSlug: slug }));
  };

  useEffect(() => {
    if (!loading) {
      if (currentPostId) {
        window.history.replaceState(null, '', `/admin/compose?id=${currentPostId}`);
      } else {
        window.history.replaceState(null, '', `/admin/compose`);
      }
    }
  }, [activeTabId, currentPostId, loading]);

  // UI States (Shared across tabs or specific to the drawer)
  const [isEditingExcerpt, setIsEditingExcerpt] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isCustomizingUrl, setIsCustomizingUrl] = useState(false);
  const [customUrlVal, setCustomUrlVal] = useState('');
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  // MDX Preview State
  const [compiledMdx, setCompiledMdx] = useState<any>(null);
  const [isCompilingPreview, setIsCompilingPreview] = useState(false);

  // Focus and Slash commands
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [slashMenuBlockId, setSlashMenuBlockId] = useState<string | null>(null);

  useEffect(() => {
    if (isDraftsModalOpen) {
      const fetchDrafts = async () => {
        try {
          const res = await getPosts();
          if (res.success) {
            setDraftsList(res.data.filter((p: any) => p.status === 'draft' || !p.status));
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchDrafts();
    }
  }, [isDraftsModalOpen]);

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
        setTabs(prev => {
          const existing = prev.find(t => t.dbId === editId || t.formData.slug === editId);
          if (existing) {
             setTimeout(() => setActiveTabId(existing.id), 0);
             return prev;
          }
          
          const found = (posts || []).find((p: any) => p.id === editId || p.slug === editId);
          if (found) {
            let htmlContent = found.draftContent || found.content || '';
            try {
                const maybeJson = JSON.parse(htmlContent);
                if (Array.isArray(maybeJson)) {
                    htmlContent = compileFromBlocks(maybeJson);
                }
            } catch (e) {}
            
            const newTab: TabData = {
              id: generateUniqueId(),
              dbId: found.id,
              formData: { ...found, tags: found.tags || [], oldSlugs: found.oldSlugs || [] },
              richTextContent: htmlContent,
              pasteTagsText: (found.tags || []).join(', '),
              wasPublished: found.status === 'published' && !!found.publishedAt,
              saveStatus: 'Saved',
              initialSlug: found.slug || '',
              isDirty: false
            };
            setTimeout(() => setActiveTabId(newTab.id), 0);
            return [...prev, newTab];
          } else {
             setTimeout(() => router.push('/admin/compose'), 0);
             return prev;
          }
        });
      } else {
        setTabs(prev => {
          const defaultPersona = targetPersona || 'unassigned';
          // Check if there is already an empty draft for this persona
          const emptyTab = prev.find(t => !t.dbId && !t.richTextContent && t.formData.title === '' && t.formData.persona === defaultPersona);
          if (emptyTab) {
            setTimeout(() => setActiveTabId(emptyTab.id), 0);
            return prev;
          }
          
          const newTab: TabData = {
            id: generateUniqueId(),
            dbId: null,
            formData: { ...defaultFormData, persona: defaultPersona },
            richTextContent: '',
            pasteTagsText: '',
            wasPublished: false,
            saveStatus: 'Saved',
            initialSlug: '',
            isDirty: false
          };
          setTimeout(() => setActiveTabId(newTab.id), 0);
          return [...prev, newTab];
        });
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
  const lastSavedPayloadRef = useRef<Record<string, string>>({});

  // Show "Unsaved" immediately upon any state updates
  useEffect(() => {
    if (loading || !activeTabId) return;

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

    if (!lastSavedPayloadRef.current[activeTabId]) {
      lastSavedPayloadRef.current[activeTabId] = currentPayloadStr;
      return;
    }

    if (lastSavedPayloadRef.current[activeTabId] === currentPayloadStr) {
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
          lastSavedPayloadRef.current[activeTabId] = currentPayloadStr;
          if (payload.slug !== formData.slug) {
            setFormData((prev: any) => ({ ...prev, slug: payload.slug }));
          }
        } else {
          const createdRes = await createPost(payload);
          if (!createdRes.success) throw new Error("error" in createdRes ? createdRes.error : "Error");
          const created = createdRes.data;
          if (created && created.id) {
            setCurrentPostId(created.id);
            lastSavedPayloadRef.current[activeTabId] = currentPayloadStr;
            setFormData((prev: any) => ({ ...prev, slug: created.slug || payload.slug }));
            // Instead of router.replace, just update the URL silently
            window.history.replaceState(null, '', `/admin/compose?id=${created.id}`);
          }
        }
        setSaveStatus(formData.status === 'published' ? 'Saved' : 'Saved as draft');
        updateActiveTab(t => ({ ...t, isDirty: false }));
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
                      onPersonaChange={(persona) => setFormData((prev: any) => ({ ...prev, persona }))}
                      title={formData.title}
                      onTitleChange={(title) => {
                        setFormData((prev: any) => ({ ...prev, title }));
                        if (!formData.slug || formData.slug.trim() === '') {
                          setFormData((prev: any) => ({ ...prev, slug: slugify(title) }));
                        }
                      }}
                      subtitle={formData.subtitle}
                      onSubtitleChange={(subtitle) => setFormData((prev: any) => ({ ...prev, subtitle }))}
                      tabs={tabs.map(t => ({ id: t.id, title: t.formData.title, isDirty: t.isDirty }))}
                      activeTabId={activeTabId}
                      onTabSelect={(id) => setActiveTabId(id)}
                      onTabClose={(id) => {
                        setTabs(prev => {
                          const newTabs = prev.filter(t => t.id !== id);
                          if (newTabs.length === 0) {
                            const emptyTab: TabData = {
                              id: generateUniqueId(), dbId: null, formData: { ...defaultFormData, persona: 'unassigned' },
                              richTextContent: '', pasteTagsText: '', wasPublished: false, saveStatus: 'Saved', initialSlug: '', isDirty: false
                            };
                            setTimeout(() => setActiveTabId(emptyTab.id), 0);
                            return [emptyTab];
                          }
                          if (activeTabId === id) {
                            setTimeout(() => setActiveTabId(newTabs[0].id), 0);
                          }
                          return newTabs;
                        });
                      }}
                      onNewTab={() => {
                        const newTab: TabData = {
                          id: generateUniqueId(), dbId: null, formData: { ...defaultFormData, persona: 'unassigned' },
                          richTextContent: '', pasteTagsText: '', wasPublished: false, saveStatus: 'Saved', initialSlug: '', isDirty: false
                        };
                        setTabs(prev => [...prev, newTab]);
                        setActiveTabId(newTab.id);
                      }}
                      onOpenDrafts={() => setIsDraftsModalOpen(true)}
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
          <div className="relative">
            <button 
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              className="flex items-center gap-1.5 uppercase hover:bg-[#ffffff22] px-1 cursor-pointer transition-colors outline-none"
            >
              <div className={`w-2 h-2 rounded-full ${activePersonaParams.color.replace('text-', 'bg-')}`} />
              {personaDisplayLabel[formData.persona] || 'Writing'}
              <ChevronUp className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {isPersonaMenuOpen && (
              <div className="absolute bottom-full left-0 mb-1 w-48 bg-[#252526] border border-[#454545] shadow-lg rounded-md py-1 z-50 text-[#cccccc]">
                {Object.keys(personaInfoMap).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setFormData((prev: any) => ({ ...prev, persona: key }));
                      setIsPersonaMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#094771] hover:text-white transition-colors flex items-center gap-2 ${formData.persona === key ? 'bg-[#37373d]' : ''}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${personaInfoMap[key].color.replace('text-', 'bg-')}`} />
                    <span className="uppercase text-[10px] tracking-wider">{key}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Click away overlay */}
            {isPersonaMenuOpen && (
              <div className="fixed inset-0 z-40" onClick={() => setIsPersonaMenuOpen(false)} />
            )}
          </div>
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
      
      {/* Drafts Modal */}
      {isDraftsModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b border-[#333]">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">Open Draft</h2>
              <button onClick={() => setIsDraftsModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {draftsList.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-sm italic">
                  No drafts found.
                </div>
              ) : (
                <div className="space-y-1">
                  {draftsList.map(draft => (
                    <button
                      key={draft.id}
                      onClick={() => {
                        setIsDraftsModalOpen(false);
                        const existingTab = tabs.find(t => t.dbId === draft.id);
                        if (existingTab) {
                          setActiveTabId(existingTab.id);
                        } else {
                          const newTab: TabData = {
                            id: generateUniqueId(),
                            dbId: draft.id,
                            formData: { ...draft, tags: draft.tags || [], oldSlugs: draft.oldSlugs || [] },
                            richTextContent: draft.draftContent || draft.content || '',
                            pasteTagsText: (draft.tags || []).join(', '),
                            wasPublished: draft.status === 'published' && !!draft.publishedAt,
                            saveStatus: 'Saved',
                            initialSlug: draft.slug || '',
                            isDirty: false
                          };
                          setTabs(prev => [...prev, newTab]);
                          setActiveTabId(newTab.id);
                        }
                      }}
                      className="w-full flex items-center justify-between p-3 rounded bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-[#444] text-left group"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm text-neutral-200 truncate">{draft.title || 'Untitled'}</span>
                        <span className="text-xs text-neutral-500 truncate">{draft.persona || 'unassigned'} • {new Date(draft.updatedAt || draft.createdAt).toLocaleDateString()}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-[#ff7700] shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
