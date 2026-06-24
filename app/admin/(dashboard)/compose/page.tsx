'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
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
import BlockList from './BlockList';
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

  const [composerBlocks, setComposerBlocks] = useState<any[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pasteTagsText, setPasteTagsText] = useState('');

  // Drag states for Block Reordering
  const [draggingBlockIdx, setDraggingBlockIdx] = useState<number | null>(null);
  const [dragOverBlockIdx, setDragOverBlockIdx] = useState<number | null>(null);

  const updateBlocksAndSync = (newBlocks: any[]) => {
    setComposerBlocks(newBlocks);
    const compiled = compileFromBlocks(newBlocks);
    setFormData((prev: any) => ({ ...prev, content: compiled }));
  };

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
  const loadPostToComposer = async () => {
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
          let parsedBlocks;
          try {
              const contentToParse = found.draftContent || found.content || '[]';
              const maybeJson = JSON.parse(contentToParse);
              if (Array.isArray(maybeJson) && maybeJson.length > 0) {
                  parsedBlocks = maybeJson;
              } else {
                  parsedBlocks = parseToBlocks(contentToParse);
              }
          } catch (e) {
              parsedBlocks = parseToBlocks(found.draftContent || found.content || '');
          }
          setComposerBlocks(parsedBlocks);
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
        setComposerBlocks([{ id: 'first_para', type: 'text', content: '' }]);
      }
    } catch (e) {
      console.error('Error in workspace composer initialization: ', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPostToComposer();
  }, [editId, targetPersona]);

  const getWordCount = () => {
    const text = compileFromBlocks(composerBlocks);
    if (!text) return 0;
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) return 0;
    return cleanText.split(/\s+/).filter(Boolean).length;
  };

  const getReadingTime = () => {
    const words = getWordCount();
    return Math.max(1, Math.ceil(words / 220));
  };

  const getExcerptFromContent = () => {
    const firstTextB = composerBlocks.find(b => b.type === 'text' && b.content?.trim());
    if (firstTextB) {
      const text = firstTextB.content.trim();
      return text.length > 150 ? text.substring(0, 147) + '...' : text;
    }
    return '';
  };

  const getEffectiveCoverImage = () => {
    if (!formData.autoCoverImage && formData.coverImageUrl) {
      return formData.coverImageUrl;
    }
    const compiledContent = compileFromBlocks(composerBlocks);
    const extMatch = compiledContent.match(/src="([^"]+)"/);
    if (extMatch) return extMatch[1];
    return null;
  };

  // Continuous Autosave Implementation with dynamic content-driven extraction
  const isInitialMount = useRef(true);
  const lastSavedPayloadRef = useRef<string | null>(null);

  // Show "Unsaved" immediately upon any state updates
  useEffect(() => {
    if (loading) return;
    
    const compiledContent = JSON.stringify(composerBlocks);
    const splitTags = pasteTagsText.split(',').map(t => t.trim()).filter(Boolean);
    const currentPayloadStr = JSON.stringify({
      title: formData.title || '',
      subtitle: formData.subtitle || '',
      persona: formData.persona || '',
      coverImageUrl: formData.coverImageUrl || '',
      autoCoverImage: formData.autoCoverImage,
      excerpt: formData.excerpt || '',
      content: compiledContent,
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
  }, [formData.title, formData.subtitle, formData.persona, formData.coverImageUrl, formData.autoCoverImage, formData.excerpt, composerBlocks, pasteTagsText, loading]);

  useEffect(() => {
    if (loading || saveStatus !== 'Unsaved') return;

    setSaveStatus('Saving...');
    const timer = setTimeout(async () => {
      try {
        const compiledContent = JSON.stringify(composerBlocks);
        const compiledLegacy = compileFromBlocks(composerBlocks);
        
        let coverUrl = formData.coverImageUrl;
        if (formData.autoCoverImage) {
          const extMatch = compiledLegacy.match(/src="([^"]+)"/);
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
          draftContent: compiledContent,
          tags: splitTags,
        });

        const payload = {
          ...formData,
          title: titleToSave,
          draftContent: compiledContent,
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
    composerBlocks, 
    pasteTagsText, 
    loading, 
    currentPostId,
    wasPublished,
    formData.slug,
    formData.status
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

  const [deletedBlockState, setDeletedBlockState] = useState<{ block: any, index: number, originalId: string, timerId?: NodeJS.Timeout } | null>(null);

  const undoDeleteBlock = () => {
    if (!deletedBlockState) return;
    clearTimeout(deletedBlockState.timerId);
    const newBlocks = [...composerBlocks];
    newBlocks.splice(deletedBlockState.index, 0, deletedBlockState.block);
    updateBlocksAndSync(newBlocks);
    setDeletedBlockState(null);
  };

  // Handle Slash command replacement 
  const handleSelectSlashCommand = (blockId: string, cmdType: string) => {
    const idx = composerBlocks.findIndex(b => b.id === blockId);
    if (idx === -1) return;
    
    const currentBlock = composerBlocks[idx];
    let cleanedContent = currentBlock.content ? currentBlock.content.trim() : '';
    if (cleanedContent.endsWith('/')) {
      cleanedContent = cleanedContent.slice(0, -1).trim();
    }
    
    const updatedBlocks = [...composerBlocks];
    updatedBlocks[idx] = { ...currentBlock, content: cleanedContent };
    
    const shouldReplace = !cleanedContent;
    const newId = generateUniqueId('blk_added');
    let newBlock: any;
    
    if (cmdType === 'heading') {
      newBlock = { id: newId, type: 'heading', level: 2, content: '' };
    } else if (cmdType === 'image') {
      newBlock = { id: newId, type: 'image', src: '', alt: 'Image', caption: '' };
    } else if (cmdType === 'quote') {
      newBlock = { id: newId, type: 'quote', content: '' };
    } else if (cmdType === 'divider') {
      newBlock = { id: newId, type: 'divider' };
    } else if (cmdType === 'code') {
      newBlock = { id: newId, type: 'code', content: '' };
    } else if (cmdType === 'callout') {
      newBlock = { id: newId, type: 'callout', content: '' };
    } else if (cmdType === 'table') {
      newBlock = { id: newId, type: 'table', content: '| Header 1 | Header 2 |\\n|---|---|\\n| Cell 1 | Cell 2 |' };
    } else if (cmdType === 'list') {
      newBlock = { id: newId, type: 'list', content: '- ' };
    } else if (cmdType === 'embed') {
      newBlock = { id: newId, type: 'embed', src: '', caption: '' };
    } else {
      newBlock = { id: newId, type: 'text', content: '' };
    }
    
    if (shouldReplace) {
      updatedBlocks[idx] = newBlock;
    } else {
      updatedBlocks.splice(idx + 1, 0, newBlock);
    }
    
    updateBlocksAndSync(updatedBlocks);
    setSelectedBlockId(newId);
    setFocusedBlockId(newId);
    setSlashMenuBlockId(null);
    
    if (cmdType === 'image') {
      handleTriggerFilePicker(shouldReplace ? idx : idx + 1);
    }
  };

  const handleTextareaChange = (blockId: string, val: string) => {
    handleUpdateBlockContent(blockId, val);
    const lastChar = val.trim();
    if (lastChar.endsWith('/')) {
      setSlashMenuBlockId(blockId);
    } else {
      setSlashMenuBlockId(null);
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, blockId: string, idx: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      const newId = generateUniqueId('blk_enter');
      const newBlock = { id: newId, type: 'text', content: '' };
      
      const updated = [...composerBlocks];
      updated.splice(idx + 1, 0, newBlock);
      
      updateBlocksAndSync(updated);
      setSelectedBlockId(newId);
      setFocusedBlockId(newId);
      setSlashMenuBlockId(null);
    } else if (e.key === 'Backspace') {
      const target = e.target as HTMLTextAreaElement;
      if (target.selectionStart === 0 && target.selectionEnd === 0 && idx > 0) {
        e.preventDefault();
        
        const currentBlock = composerBlocks[idx];
        const prevBlockIdx = idx - 1;
        const prevBlock = composerBlocks[prevBlockIdx];
        
        const updated = [...composerBlocks];
        updated.splice(idx, 1);
        
        if (prevBlock.type === 'text' || prevBlock.type === 'heading' || prevBlock.type === 'quote') {
            const cursorPosition = (prevBlock.content || '').length;
            updated[prevBlockIdx] = {
                ...prevBlock,
                content: (prevBlock.content || '') + (currentBlock.content || '')
            };
            updateBlocksAndSync(updated);
            setSelectedBlockId(prevBlock.id);
            setFocusedBlockId(prevBlock.id);
            setSlashMenuBlockId(null);
            
            // Note: In React, we delay setting the cursor to allow render
            setTimeout(() => {
                const el = document.querySelector(`textarea[data-block-id="${prevBlock.id}"]`) as HTMLTextAreaElement;
                if (el) {
                    el.focus();
                    el.setSelectionRange(cursorPosition, cursorPosition);
                }
            }, 0);
        } else {
            // Just delete empty block if previous is not text mergeable
            if (!currentBlock.content) {
                updateBlocksAndSync(updated);
                setSelectedBlockId(prevBlock.id);
                setFocusedBlockId(prevBlock.id);
                setSlashMenuBlockId(null);
            }
        }
      }
    }
  };

  const handleAddBlock = (type: 'text' | 'heading' | 'quote' | 'list' | 'image' | 'divider' | 'code', initialContent = '', index?: number) => {
    const id = generateUniqueId('blk_added');
    let newBlock: any;
    if (type === 'image') {
      newBlock = {
        id,
        type: 'image',
        src: '',
        alt: 'Image',
        caption: '',
        isUploading: false,
        progress: 0,
      };
    } else if (type === 'heading') {
      newBlock = {
        id,
        type: 'heading',
        level: 2,
        content: initialContent || '',
      };
    } else if (type === 'quote') {
      newBlock = {
        id,
        type: 'quote',
        content: initialContent || '',
      };
    } else if (type === 'list') {
      newBlock = {
        id,
        type: 'list',
        content: initialContent || '- ',
      };
    } else if (type === 'divider') {
      newBlock = {
        id,
        type: 'divider',
      };
    } else if (type === 'code') {
      newBlock = {
        id,
        type: 'code',
        content: initialContent || '',
      };
    } else {
      newBlock = {
        id,
        type: 'text',
        content: initialContent || '',
      };
    }

    let updated = [...composerBlocks];
    if (typeof index === 'number') {
      updated.splice(index + 1, 0, newBlock);
    } else {
      updated.push(newBlock);
    }
    updateBlocksAndSync(updated);
    setSelectedBlockId(id);
    setFocusedBlockId(id);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (composerBlocks.length <= 1) {
      updateBlocksAndSync([{ id: 'fallback', type: 'text', content: '' }]);
      return;
    }
    const idx = composerBlocks.findIndex(b => b.id === blockId);
    if (idx === -1) return;
    const blockToDel = composerBlocks[idx];

    const updated = composerBlocks.filter(b => b.id !== blockId);
    updateBlocksAndSync(updated);

    if (deletedBlockState?.timerId) {
      clearTimeout(deletedBlockState.timerId);
    }
    
    const timerId = setTimeout(() => {
      setDeletedBlockState(null);
    }, 5000);
    
    setDeletedBlockState({ block: blockToDel, index: idx, originalId: blockId, timerId });
  };

  const handleUpdateBlockContent = (blockId: string, text: string) => {
    const updated = composerBlocks.map(b => {
      if (b.id === blockId) {
        return { ...b, content: text };
      }
      return b;
    });
    updateBlocksAndSync(updated);
  };

  const handleUpdateBlockImageProps = (blockId: string, props: Partial<any>) => {
    const updated = composerBlocks.map(b => {
      if (b.id === blockId) {
        return { ...b, ...props };
      }
      return b;
    });
    updateBlocksAndSync(updated);
  };

  const handleContentFilesUpload = async (files: FileList | File[], index?: number) => {
    const file = files[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const uploadId = generateUniqueId('upload');
    const newBlock = {
      id: uploadId,
      type: 'image',
      src: 'uploading',
      alt: file.name.split('.')[0] || 'Image',
      isUploading: true,
      progress: 0,
    };

    let updated = [...composerBlocks];
    const insertIdx = typeof index === 'number' ? index : updated.length - 1;
    if (insertIdx >= 0 && insertIdx < updated.length) {
      updated.splice(insertIdx + 1, 0, newBlock);
    } else {
      updated.push(newBlock);
    }
    setComposerBlocks(updated);
    setIsUploading(true);

    let progressSim = 0;
    const interval = setInterval(() => {
      progressSim += Math.floor(Math.random() * 8) + 4;
      if (progressSim > 92) {
        progressSim = 92;
        clearInterval(interval);
      }
      setComposerBlocks(prev => 
        prev.map(b => (b.id === uploadId ? { ...b, progress: progressSim } : b))
      );
    }, 200);

    try {
      const { publicUrl } = await uploadImage({ bucket: 'post-images', file });
      clearInterval(interval);
      
      setComposerBlocks(prev => {
        const next = prev.map(b => {
          if (b.id === uploadId) {
            return {
              ...b,
              src: publicUrl,
              isUploading: false,
              progress: 100,
            };
          }
          return b;
        });
        setFormData((fd: any) => ({ ...fd, content: compileFromBlocks(next) }));
        return next;
      });
    } catch (err: any) {
      clearInterval(interval);
      setComposerBlocks(prev => {
        const next = prev.map(b => {
          if (b.id === uploadId) {
            return {
              ...b,
              isUploading: false,
              src: '',
              alt: `Upload failed: ${file.name}`
            };
          }
          return b;
        });
        setFormData((fd: any) => ({ ...fd, content: compileFromBlocks(next) }));
        return next;
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTriggerFilePicker = (index?: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await handleContentFilesUpload([file], index);
      }
    };
    input.click();
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = async (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleContentFilesUpload(Array.from(files), index);
    }
  };

  const handleUploadCoverBtn = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { publicUrl } = await uploadImage({ bucket: 'post-images', file });
      setFormData({ ...formData, coverImageUrl: publicUrl });
    } catch (err: any) {
      alert('Cover image upload error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBlocksReorder = (targetIdx: number) => {
    if (draggingBlockIdx === null) return;
    const reordered = [...composerBlocks];
    const [dragged] = reordered.splice(draggingBlockIdx, 1);
    reordered.splice(targetIdx, 0, dragged);
    updateBlocksAndSync(reordered);
    setDraggingBlockIdx(null);
    setDragOverBlockIdx(null);
  };

  const handleSavePost = async (isNewDraftState: boolean) => {
    setDbError(null);
    setSaving(true);
    
    let coverUrl = formData.coverImageUrl;
    const compiledHtml = compileFromBlocks(composerBlocks);
    const compiledJson = JSON.stringify(composerBlocks);

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

  const slashCommands = [
    { type: 'heading', label: 'Heading', desc: 'Add a section heading (H2)' },
    { type: 'image', label: 'Image', desc: 'Upload or insert an image' },
    { type: 'quote', label: 'Quote', desc: 'Add a styled blockquote' },
    { type: 'divider', label: 'Divider', desc: 'Insert a horizontal divider line' },
    { type: 'code', label: 'Code Block', desc: 'Insert a block of system code' },
    { type: 'callout', label: 'Callout', desc: 'Add a highlighted callout block' },
    { type: 'table', label: 'Table', desc: 'Insert a structured data table' },
    { type: 'list', label: 'List', desc: 'Insert a bulleted list' },
    { type: 'embed', label: 'Embed', desc: 'Embed public media or web pages' },
  ];

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

      {/* Simplified Toolbar containing ONLY standard text flow formatting commands */}
      {activeTab === 'composer' && !loading && (
        <div className="flex items-center justify-center py-2 bg-[#0a0a0a] border-b border-[#151515] overflow-x-auto px-4 sticky top-[61px] z-30 scrollbar-hide">
          <div className="flex items-center gap-1 bg-[#121212] border border-[#222]/80 px-4 py-1 rounded-full shadow-2xl text-neutral-400 text-sm max-w-full">
            <button 
              type="button" 
              onClick={() => {
                if (typeof document !== 'undefined') document.execCommand('undo');
              }}
              className="p-1.5 hover:text-white rounded transition-colors" 
              title="Undo"
            >
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button 
              type="button" 
              onClick={() => {
                if (typeof document !== 'undefined') document.execCommand('redo');
              }}
              className="p-1.5 hover:text-white rounded transition-colors" 
              title="Redo"
            >
              <Redo className="w-3.5 h-3.5" />
            </button>
            
            <div className="w-px h-3.5 bg-[#222] mx-1 shrink-0" />

            <button 
              type="button" 
              onClick={() => handleAddBlock('heading')} 
              className="px-2 py-1 hover:text-white rounded text-xs font-mono font-bold"
              title="Heading"
            >
              Heading
            </button>

            <button 
              type="button" 
              onClick={() => {
                const idx = composerBlocks.findIndex(b => b.id === selectedBlockId);
                if (idx !== -1 && composerBlocks[idx].type === 'text') {
                  handleUpdateBlockContent(selectedBlockId!, `${composerBlocks[idx].content} **bold**`);
                }
              }}
              className="px-2 py-1 hover:text-white rounded text-xs font-bold font-sans"
              title="Bold"
            >
              Bold
            </button>

            <button 
              type="button" 
              onClick={() => {
                const idx = composerBlocks.findIndex(b => b.id === selectedBlockId);
                if (idx !== -1 && composerBlocks[idx].type === 'text') {
                  handleUpdateBlockContent(selectedBlockId!, `${composerBlocks[idx].content} *italic*`);
                }
              }}
              className="px-2 py-1 hover:text-white rounded text-xs italic font-serif"
              title="Italic"
            >
              Italic
            </button>

            <button 
              type="button" 
              onClick={() => {
                const idx = composerBlocks.findIndex(b => b.id === selectedBlockId);
                if (idx !== -1 && composerBlocks[idx].type === 'text') {
                  handleUpdateBlockContent(selectedBlockId!, `${composerBlocks[idx].content} <u>underline</u>`);
                }
              }}
              className="px-2 py-1 hover:text-white rounded text-xs underline"
              title="Underline"
            >
              Underline
            </button>

            <button 
              type="button" 
              onClick={() => {
                const idx = composerBlocks.findIndex(b => b.id === selectedBlockId);
                if (idx !== -1 && composerBlocks[idx].type === 'text') {
                  handleUpdateBlockContent(selectedBlockId!, `${composerBlocks[idx].content} [Link](https://example.com)`);
                }
              }}
              className="px-2 py-1 hover:text-white rounded text-xs"
              title="Link"
            >
              Link
            </button>

            <button 
              type="button" 
              onClick={() => handleAddBlock('quote')} 
              className="px-2 py-1 hover:text-white rounded text-xs"
              title="Quote"
            >
              Quote
            </button>

            <button 
              type="button" 
              onClick={() => handleAddBlock('list')} 
              className="px-2 py-1 hover:text-white rounded text-xs font-mono"
              title="List"
            >
              List
            </button>

            <button 
              type="button" 
              onClick={() => handleAddBlock('code')} 
              className="px-2 py-1 hover:text-white rounded text-xs font-mono"
              title="Code Block"
            >
              Code
            </button>

            <button 
              type="button" 
              onClick={() => {
                const selectedIdx = composerBlocks.findIndex(b => b.id === selectedBlockId);
                handleTriggerFilePicker(selectedIdx >= 0 ? selectedIdx : undefined);
              }} 
              className="px-2 py-1 hover:text-white rounded text-xs" 
              title="Insert Image"
            >
              Image
            </button>

            <button 
              type="button" 
              onClick={() => handleAddBlock('divider')} 
              className="px-2 py-1 hover:text-white rounded text-xs font-mono"
              title="Divider"
            >
              Divider
            </button>
          </div>
        </div>
      )}

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
                className="w-full max-w-[840px] mx-auto px-6 py-12 md:py-20 flex flex-col min-h-screen"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e)}
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
                  
                  <textarea
                    value={formData.subtitle} 
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="An elegant subtitle leads the narrative..."
                    className="w-full bg-transparent border-none text-lg text-neutral-400 font-light outline-none placeholder-neutral-800 font-sans resize-none focus:ring-0 focus:outline-none"
                    rows={1}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />
                </div>

                {/* Sub-blocks writing stream */}
                <BlockList
                  composerBlocks={composerBlocks}
                  selectedBlockId={selectedBlockId}
                  focusedBlockId={focusedBlockId}
                  slashMenuBlockId={slashMenuBlockId}
                  slashCommands={slashCommands}
                  setDraggingBlockIdx={setDraggingBlockIdx}
                  setDragOverBlockIdx={setDragOverBlockIdx}
                  handleBlocksReorder={handleBlocksReorder}
                  setSelectedBlockId={setSelectedBlockId}
                  handleDeleteBlock={handleDeleteBlock}
                  handleTriggerFilePicker={handleTriggerFilePicker}
                  handleUpdateBlockImageProps={handleUpdateBlockImageProps}
                  handleTextareaChange={handleTextareaChange}
                  handleTextareaKeyDown={handleTextareaKeyDown}
                  handleUpdateBlockContent={handleUpdateBlockContent}
                  handleSelectSlashCommand={handleSelectSlashCommand}
                />
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
                    content: formData.content, 
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
        className="fixed bottom-6 right-6 z-40 bg-[#121212] hover:bg-[#1a1a1a] border border-[#222] p-3.5 text-neutral-400 hover:text-white rounded-full shadow-2xl transition-all duration-200 flex items-center justify-center group"
        title="Article Settings & Publishing Setup"
        id="editor-settings-floating-btn"
      >
        <Settings className="w-5 h-5 text-neutral-400 group-hover:text-[#ff7700] transition-colors" />
      </button>

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
