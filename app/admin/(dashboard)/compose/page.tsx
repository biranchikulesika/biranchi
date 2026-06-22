'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, X, Image as ImageIcon, GripVertical, Check, RefreshCw, 
  Trash2, UploadCloud, Send, Undo, Redo, MessageSquare, List, Settings
} from 'lucide-react';
import { uploadImage } from '@/lib/supabase/storage';
import { getPosts, createPost, updatePost } from '@/app/admin/actions/posts.actions';
import PostRenderer from '@/components/post-renderer/PostRenderer';

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

// Pure utility helper to generate unique identifiers
let blockCounter = 0;
function generateUniqueId(prefix = 'id') {
  blockCounter++;
  return `${prefix}_${blockCounter}_${Date.now().toString(36)}`;
}

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

// Block definitions parser & compiler
const parseToBlocks = (text: string) => {
  if (!text) return [{ id: 'init_text', type: 'text', content: '' }];
  
  const regex = /(<ImageBlock[\s\S]*?\/>)/g;
  const parts = text.split(regex);
  const result: any[] = [];
  
  parts.forEach((part, index) => {
    if (!part) return;
    const trimmed = part.trim();
    if (trimmed.startsWith('<ImageBlock')) {
      const srcMatch = part.match(/src="([^"]*)"/);
      const altMatch = part.match(/alt="([^"]*)"/);
      const captionMatch = part.match(/caption="([^"]*)"/);
      const locationMatch = part.match(/location="([^"]*)"/);
      const creditMatch = part.match(/credit="([^"]*)"/);
      const alignMatch = part.match(/align="([^"]*)"/) || part.match(/alignment="([^"]*)"/);
      
      const srcVal = srcMatch ? srcMatch[1] : '';
      const isUploadingVal = srcVal === 'uploading';
      const uploadIdMatch = part.match(/uploadId="([^"]*)"/);
      const progressMatch = part.match(/progress="([^"]*)"/);
      
      result.push({
        id: uploadIdMatch ? uploadIdMatch[1] : `img_${index}_${Math.random().toString(36).substring(2, 6)}`,
        type: 'image',
        src: srcVal,
        alt: altMatch ? altMatch[1] : 'Image',
        caption: captionMatch ? captionMatch[1] : '',
        location: locationMatch ? locationMatch[1] : '',
        credit: creditMatch ? creditMatch[1] : '',
        align: (alignMatch ? alignMatch[1] : 'center') as 'left' | 'center' | 'right' | 'full',
        isUploading: isUploadingVal,
        uploadId: uploadIdMatch ? uploadIdMatch[1] : '',
        progress: progressMatch ? Number(progressMatch[1]) : 0
      });
    } else {
      const subParts = part.split(/\n\s*\n/);
      subParts.forEach((sub, subIdx) => {
        const subTrim = sub.trim();
        if (!subTrim) return;
        const id = `blk_${index}_${subIdx}_${Math.random().toString(36).substring(2, 6)}`;
        
        if (subTrim === '---' || subTrim === '***') {
          result.push({ id, type: 'divider' });
        } else if (subTrim.startsWith('```')) {
          const lines = sub.split('\\n');
          const codeLines = lines[0].startsWith('```') ? lines.slice(1, -1) : lines;
          result.push({ id, type: 'code', content: codeLines.join('\\n') });
        } else if (subTrim.startsWith('[Choice]') || subTrim.startsWith('--callout')) {
          result.push({ id, type: 'callout', content: subTrim.replace(/^--callout\s*/, '') });
        } else if (subTrim.startsWith('|') && subTrim.includes('|---')) {
          result.push({ id, type: 'table', content: subTrim });
        } else if (subTrim.startsWith('#')) {
          const hMatch = subTrim.match(/^(#{1,6})\s+([\s\S]*)$/);
          const level = hMatch ? hMatch[1].length : 2;
          const content = hMatch ? hMatch[2] : subTrim.replace(/^#+\s*/, '');
          result.push({ id, type: 'heading', level, content });
        } else if (subTrim.startsWith('>')) {
          const content = subTrim.replace(/^>\s*/, '');
          result.push({ id, type: 'quote', content });
        } else if (subTrim.startsWith('- ') || subTrim.startsWith('* ') || /^\d+\.\s/.test(subTrim)) {
          result.push({ id, type: 'list', content: subTrim });
        } else {
          result.push({ id, type: 'text', content: sub });
        }
      });
    }
  });

  if (result.length === 0) {
    result.push({ id: 'init_p', type: 'text', content: '' });
  }
  return result;
};

const compileFromBlocks = (blocks: any[]) => {
  return blocks.map(b => {
    if (b.type === 'image') {
      let tag = `<ImageBlock
  src="${b.src}"
  alt="${b.alt || 'Image'}"`;
      if (b.caption) tag += `
  caption="${b.caption}"`;
      if (b.location) tag += `
  location="${b.location}"`;
      if (b.credit) tag += `
  credit="${b.credit}"`;
      if (b.align && b.align !== 'center') tag += `
  align="${b.align}"`;
      if (b.isUploading) {
        if (b.uploadId) tag += `
  uploadId="${b.uploadId}"`;
        if (b.progress) tag += `
  progress="${b.progress}"`;
      }
      tag += '\\n/>';
      return tag;
    } else if (b.type === 'heading') {
      return `${'#'.repeat(b.level || 2)} ${b.content}`;
    } else if (b.type === 'quote') {
      return `> ${b.content}`;
    } else if (b.type === 'list') {
      return b.content;
    } else if (b.type === 'divider') {
      return '---';
    } else if (b.type === 'code') {
      return `\`\`\`
${b.content}
\`\`\``;
    } else if (b.type === 'callout') {
      return `> ${b.content}`;
    } else if (b.type === 'table') {
      return b.content;
    } else if (b.type === 'embed') {
      return `<iframe src="${b.src}" width="100%" height="450" frameborder="0" allowfullscreen caption="${b.caption || ''}"></iframe>`;
    } else {
      return b.content;
    }
  }).join('\\n\\n');
};

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
  
  const posts = await getPosts();
  const clashingPost = posts.find((p: any) => p.slug === clean && p.id !== currentId && p.persona === currentPersona);
  if (clashingPost) {
    return { valid: false, error: `The custom URL slug '${clean}' is already in use by another article in the '${currentPersona}' persona.` };
  }
  
  return { valid: true, cleanSlug: clean };
}

async function getUniqueSlug(baseSlug: string, currentId: string | null, currentPersona: string): Promise<string> {
  const posts = await getPosts();
  let candidate = baseSlug || 'untitled';
  
  const isConflict = (slugToTest: string) => {
    return posts.some((p: any) => p.slug === slugToTest && p.id !== currentId && p.persona === currentPersona);
  };

  if (!isConflict(candidate)) {
    return candidate;
  }

  let counter = 1;
  while (true) {
    counter++;
    const nextCandidate = `${baseSlug}-${counter}`;
    if (!isConflict(nextCandidate)) {
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
    draft: true
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
    const result = await validateCustomSlug(customUrlVal, currentPostId, formData.persona);
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
      const posts = await getPosts();
      
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
          setWasPublished(!found.draft && !!found.publishedAt);
          setComposerBlocks(parseToBlocks(found.content || ''));
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
          draft: true
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

  // Show "Unsaved" immediately upon any state updates
  useEffect(() => {
    if (loading) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setSaveStatus('Unsaved');
  }, [formData.title, formData.subtitle, formData.persona, formData.coverImageUrl, formData.autoCoverImage, formData.excerpt, composerBlocks, pasteTagsText, loading]);

  useEffect(() => {
    if (loading) return;

    setSaveStatus('Saving...');
    const timer = setTimeout(async () => {
      try {
        const compiled = compileFromBlocks(composerBlocks);
        
        let coverUrl = formData.coverImageUrl;
        if (formData.autoCoverImage) {
          const extMatch = compiled.match(/src="([^"]+)"/);
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

        const payload = {
          ...formData,
          title: titleToSave,
          content: compiled,
          slug: finalSlug,
          tags: splitTags,
          coverImageUrl: coverUrl,
          draft: formData.draft ?? true
        };

        if (currentPostId) {
          await updatePost(currentPostId, payload);
          if (payload.slug !== formData.slug) {
            setFormData((prev: any) => ({ ...prev, slug: payload.slug }));
          }
        } else {
          const created = await createPost(payload);
          if (created && created.id) {
            setCurrentPostId(created.id);
            setFormData((prev: any) => ({ ...prev, slug: created.slug || payload.slug }));
            router.replace(`/admin/compose?id=${created.id}`, { scroll: false });
          }
        }
        setSaveStatus('Saved');
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('Error saving');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    formData.title, 
    formData.subtitle, 
    formData.persona, 
    formData.coverImageUrl, 
    formData.autoCoverImage, 
    formData.excerpt, 
    composerBlocks, 
    pasteTagsText, 
    loading, 
    currentPostId
  ]);

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
    } else if (e.key === 'Backspace' && !composerBlocks[idx].content && composerBlocks.length > 1) {
      e.preventDefault();
      const prevBlockIdx = idx > 0 ? idx - 1 : 0;
      const prevBlockId = composerBlocks[prevBlockIdx].id;
      
      const updated = composerBlocks.filter(b => b.id !== blockId);
      updateBlocksAndSync(updated);
      setSelectedBlockId(prevBlockId);
      setFocusedBlockId(prevBlockId);
      setSlashMenuBlockId(null);
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
    const updated = composerBlocks.filter(b => b.id !== blockId);
    updateBlocksAndSync(updated);
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
    const compiled = compileFromBlocks(composerBlocks);
    if (formData.autoCoverImage) {
      const extMatch = compiled.match(/src="([^"]+)"/);
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

    const payload = {
      ...formData,
      title: titleToSave,
      content: compiled,
      slug: finalSlug,
      tags: splitTags,
      coverImageUrl: coverUrl,
      draft: isNewDraftState,
      publishedAt: isNewDraftState ? null : (wasPublished ? formData.publishedAt : new Date().toISOString())
    };

    try {
      if (currentPostId) {
        await updatePost(currentPostId, payload);
      } else {
        await createPost(payload);
      }
      router.push('/admin/library');
    } catch (err: any) {
      console.error(err);
      setDbError(err?.message || "Write constraints failed on database level.");
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
                      setFormData((prev: any) => {
                        const updated = { ...prev, title: newTitle };
                        if (!wasPublished) {
                          updated.slug = slugify(newTitle);
                        }
                        return updated;
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
                <div className="space-y-4 pt-8 border-t border-[#141414] w-full flex-1">
                  {composerBlocks.map((block, idx) => {
                    const isSelected = selectedBlockId === block.id;

                    return (
                      <div 
                        key={block.id}
                        draggable
                        onDragStart={() => setDraggingBlockIdx(idx)}
                        onDragOver={(e) => { e.preventDefault(); setDragOverBlockIdx(idx); }}
                        onDrop={() => handleBlocksReorder(idx)}
                        className={`group relative py-2 px-1 rounded transition-all w-full ${
                          isSelected ? 'bg-[#0b0b0b]' : 'border-transparent'
                        }`}
                        onClick={(e) => { e.stopPropagation(); setSelectedBlockId(block.id); }}
                      >
                        
                        {/* Drag Handle left of content */}
                        <div className="absolute -left-7 top-[15px] flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="p-1 text-neutral-700 hover:text-neutral-400 cursor-grab">
                            <GripVertical className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Quick Trash */}
                        <div className="absolute -right-7 top-[12px] flex items-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}
                            className="p-1 text-neutral-600 hover:text-red-400 rounded transition-colors"
                            title="Delete Block"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Rendering core writing block fields */}
                        {block.type === 'image' ? (
                          <div className="space-y-2 p-2 bg-[#0e0e0e] border border-[#1b1b1b] rounded-lg">
                            {block.isUploading ? (
                              <div className="py-8 flex flex-col items-center justify-center gap-2">
                                <RefreshCw className="w-5 h-5 animate-spin text-[#ff7700]" />
                                <span className="text-[10px] font-mono text-neutral-500">Uploading cover... {block.progress || 0}%</span>
                              </div>
                            ) : block.src ? (
                              <div className="relative aspect-video rounded overflow-hidden group/img-preview">
                                <img src={block.src} alt={block.alt} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img-preview:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button onClick={() => handleTriggerFilePicker(idx)} className="bg-white hover:bg-neutral-100 text-black text-xs font-mono px-3 py-1.5 rounded font-bold">Change image</button>
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="border border-dashed border-[#222] hover:border-neutral-700 hover:bg-[#121212] rounded-lg py-12 text-center cursor-pointer transition-colors"
                                onClick={() => handleTriggerFilePicker(idx)}
                              >
                                <UploadCloud className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                                <p className="text-xs font-mono text-neutral-400 uppercase">Select active photo frame</p>
                              </div>
                            )}

                            {!block.isUploading && block.src && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                <input 
                                  type="text" 
                                  placeholder="Alternative text (Alt Tag)"
                                  value={block.alt || ''}
                                  onChange={(e) => handleUpdateBlockImageProps(block.id, { alt: e.target.value })}
                                  className="bg-[#121212]/80 border border-[#222] rounded p-2 text-xs text-neutral-300 outline-none"
                                />
                                <input 
                                  type="text" 
                                  placeholder="Image Caption"
                                  value={block.caption || ''}
                                  onChange={(e) => handleUpdateBlockImageProps(block.id, { caption: e.target.value })}
                                  className="bg-[#121212]/80 border border-[#222] rounded p-2 text-xs text-neutral-300 outline-none"
                                />
                              </div>
                            )}
                          </div>
                        ) : block.type === 'heading' ? (
                          <div className="flex gap-2 items-center">
                            <span className="text-[10px] font-mono text-neutral-600 select-none bg-[#111] px-1.5 py-0.5 rounded border border-[#1c1c1c]">H2</span>
                            <textarea 
                              value={block.content} 
                              onChange={(e) => handleTextareaChange(block.id, e.target.value)}
                              onKeyDown={(e) => handleTextareaKeyDown(e, block.id, idx)}
                              placeholder="Section heading..."
                              className="w-full bg-transparent border-none text-2xl font-bold text-neutral-100 outline-none resize-none leading-snug font-sans placeholder-neutral-800 focus:outline-none focus:ring-0"
                              rows={1}
                              autoFocus={focusedBlockId === block.id}
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                              }}
                            />
                          </div>
                        ) : block.type === 'quote' ? (
                          <div className="border-l-2 border-[#ff7700] pl-4">
                            <textarea 
                              value={block.content} 
                              onChange={(e) => handleTextareaChange(block.id, e.target.value)}
                              onKeyDown={(e) => handleTextareaKeyDown(e, block.id, idx)}
                              placeholder="Insert pull quote..."
                              className="w-full bg-transparent border-none text-lg italic text-neutral-400 outline-none resize-none leading-relaxed font-serif placeholder-neutral-800 focus:outline-none focus:ring-0"
                              rows={1}
                              autoFocus={focusedBlockId === block.id}
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                              }}
                            />
                          </div>
                        ) : block.type === 'divider' ? (
                          <div className="py-6 flex items-center justify-center">
                            <div className="w-32 h-[1px] bg-neutral-800 rounded" />
                          </div>
                        ) : block.type === 'code' ? (
                          <div className="font-mono text-sm bg-neutral-950/80 border border-[#222] p-4 rounded-lg">
                            <textarea 
                              value={block.content} 
                              onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                              placeholder="// Swift, C++ or typescript code block..."
                              className="w-full bg-transparent border-none text-xs text-neutral-350 outline-none resize-none leading-relaxed font-mono focus:outline-none focus:ring-0"
                              rows={4}
                            />
                          </div>
                        ) : block.type === 'callout' ? (
                          <div className="p-4 bg-[#ff7700]/5 border border-[#ff7700]/10 rounded-lg text-sm text-neutral-300">
                            <textarea 
                              value={block.content} 
                              onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                              placeholder="Callout insights..."
                              className="w-full bg-transparent border-none outline-none resize-none leading-relaxed font-sans focus:outline-none focus:ring-0"
                              rows={2}
                            />
                          </div>
                        ) : block.type === 'table' ? (
                          <div className="p-3 bg-[#0d0d0d] border border-[#222]/80 rounded-lg">
                            <textarea 
                              value={block.content} 
                              onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                              placeholder="Markdown table: | Col 1 | Col 2 |"
                              className="w-full bg-transparent border-none text-xs text-neutral-300 outline-none resize-none font-mono focus:outline-none focus:ring-0"
                              rows={4}
                            />
                          </div>
                        ) : block.type === 'embed' ? (
                          <div className="p-4 bg-[#0e0e0e] border border-[#1c1c1c] rounded-lg space-y-2">
                            <input 
                              type="text"
                              value={block.src || ''}
                              onChange={(e) => handleUpdateBlockImageProps(block.id, { src: e.target.value })}
                              placeholder="Paste public soundcloud or media URL..."
                              className="w-full bg-[#121212]/80 border border-[#222] rounded p-2 text-xs text-neutral-300 outline-none font-mono"
                            />
                            <input 
                              type="text"
                              value={block.caption || ''}
                              onChange={(e) => handleUpdateBlockImageProps(block.id, { caption: e.target.value })}
                              placeholder="Add description..."
                              className="w-full bg-[#121212]/80 border border-[#222] rounded p-2 text-xs text-neutral-400 outline-none"
                            />
                          </div>
                        ) : block.type === 'list' ? (
                          <div className="flex gap-2.5 items-start">
                            <span className="text-neutral-600 font-semibold select-none mt-1">&#8226;</span>
                            <textarea 
                              value={block.content} 
                              onChange={(e) => handleTextareaChange(block.id, e.target.value)}
                              onKeyDown={(e) => handleTextareaKeyDown(e, block.id, idx)}
                              placeholder="- Item 1"
                              className="w-full bg-transparent border-none text-sm text-neutral-300 outline-none font-mono resize-none leading-relaxed placeholder-neutral-800 focus:outline-none focus:ring-0"
                              rows={2}
                              autoFocus={focusedBlockId === block.id}
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                              }}
                            />
                          </div>
                        ) : (
                          <textarea 
                            value={block.content} 
                            onChange={(e) => handleTextareaChange(block.id, e.target.value)}
                            onKeyDown={(e) => handleTextareaKeyDown(e, block.id, idx)}
                            placeholder="Start writing story segment or type '/' for commands..."
                            className="w-full bg-transparent border-none text-md text-neutral-300 outline-none resize-none leading-relaxed font-sans placeholder-neutral-800 focus:outline-none focus:ring-0"
                            rows={1}
                            autoFocus={focusedBlockId === block.id}
                            onInput={(e) => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = `${target.scrollHeight}px`;
                            }}
                          />
                        )}

                        {/* POPUP SLASH COMMAND DROPDOWN SCREEN */}
                        {slashMenuBlockId === block.id && (
                          <div className="absolute left-4 mt-2 w-72 bg-[#0d0d0d] border border-[#1b1b1b] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-100 flex flex-col max-h-80 overflow-y-auto">
                            <div className="px-3 py-1.5 border-b border-[#141414] text-[9px] font-mono tracking-widest text-[#ff7700] uppercase font-bold select-none">
                              COMMAND BLOCKS
                            </div>
                            <div className="p-1 space-y-0.5">
                              {slashCommands.map((cmd) => (
                                <button
                                  key={cmd.type}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectSlashCommand(block.id, cmd.type);
                                  }}
                                  className="w-full text-left px-2.5 py-1.5 hover:bg-[#161616] text-neutral-300 hover:text-white transition-colors flex flex-col rounded-lg"
                                >
                                  <span className="text-xs font-semibold font-sans">{cmd.label}</span>
                                  <span className="text-[10px] text-neutral-500 font-light leading-none mt-0.5">{cmd.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })}
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
                    content: formData.content, 
                    featured: formData.featured,
                    hidden: formData.hidden,
                    draft: true,
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

      {/* EXCLUSIVELY POSITIONED PUBLISHING DRAWER/SLIDEOVER */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-end p-0 z-50 animate-in fade-in duration-200">
          <div 
            className="bg-[#0c0c0c] border-l border-[#1c1c1c] max-w-lg w-full h-full p-6 md:p-8 flex flex-col justify-between text-neutral-300 relative shadow-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
            id="publishing-drawer"
          >
            
            {/* Slideover Header */}
            <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-4">
              <h2 className="text-sm font-mono font-bold tracking-widest text-[#ff7700] flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>PUBLISH ARTICLE</span>
              </h2>
              <button 
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="p-1.5 hover:bg-[#1a1a1a] rounded text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Contents representing Publish Options */}
            <div className="flex-1 overflow-y-auto py-6 pr-2 space-y-6">
              
              {/* Persona Selector */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-widest font-semibold text-neutral-500 mb-1.5">Compose persona channel</label>
                <select 
                  value={formData.persona}
                  onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                  className="w-full bg-[#141414] border border-[#222] hover:border-neutral-500 text-neutral-200 rounded px-3 py-2 text-xs font-mono outline-none cursor-pointer transition-colors"
                >
                  <option value="builder">Forge (builder persona)</option>
                  <option value="operator">Signal (operator persona)</option>
                  <option value="thinker">Inside the Head (thinker persona)</option>
                  <option value="wanderer">Scribble (wanderer persona)</option>
                </select>
              </div>

              {/* Cover Image Setup */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-widest font-semibold text-neutral-500 mb-2">Cover Image</label>
                {formData.autoCoverImage ? (
                  <div className="space-y-1 bg-[#141414] border border-[#222] rounded p-3">
                    <p className="text-xs text-neutral-400 font-sans">
                      Auto Generated From First Article Image
                    </p>
                    {(() => {
                      const compiledContent = compileFromBlocks(composerBlocks);
                      const extMatch = compiledContent.match(/src="([^"]+)"/);
                      if (extMatch && extMatch[1]) {
                        return (
                          <div className="relative rounded overflow-hidden aspect-video border border-[#222] mt-2 mb-2 max-w-[200px]">
                            <img src={extMatch[1]} alt="auto-extracted thumbnail" className="w-full h-full object-cover" />
                          </div>
                        );
                      }
                      return (
                        <div className="text-[10px] text-neutral-600 font-mono italic my-1.5">
                          (No embedded block images yet)
                        </div>
                      );
                    })()}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, autoCoverImage: false, coverImageUrl: '' })}
                      className="text-[10px] text-[#ff7700] hover:text-[#ff881a] font-mono hover:underline font-semibold block"
                    >
                      [ Use Custom Cover ]
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 bg-[#141414] border border-[#222] rounded p-3">
                    {formData.coverImageUrl ? (
                      <div className="relative rounded overflow-hidden aspect-video border border-[#222] max-w-[260px]">
                        <img src={formData.coverImageUrl} alt="custom cover banner" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, coverImageUrl: '' })}
                          className="absolute right-2 top-2 p-1.5 bg-black/60 rounded-full hover:bg-red-950"
                          title="Delete Custom Cover"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative border border-dashed border-[#222] hover:border-neutral-700 bg-neutral-900 rounded-lg p-5 text-center cursor-pointer transition-colors max-w-[260px]">
                        <UploadCloud className="w-6 h-6 text-neutral-600 mx-auto mb-1.5" />
                        <span className="text-[10px] text-neutral-400 font-mono uppercase block">Upload banner</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleUploadCoverBtn}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, autoCoverImage: true })}
                      className="text-[10px] text-neutral-500 hover:text-neutral-300 font-mono hover:underline block"
                    >
                      [ Switch to Auto Cover ]
                    </button>
                  </div>
                )}
              </div>

              {/* Excerpt Setting */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] uppercase font-mono tracking-widest font-semibold text-neutral-500">Excerpt Summary</label>
                  {!isEditingExcerpt && (
                    <button 
                      type="button" 
                      onClick={() => setIsEditingExcerpt(true)}
                      className="text-[10px] text-[#ff7700] hover:text-[#ff881a] font-mono hover:underline font-medium"
                    >
                      [ Edit ]
                    </button>
                  )}
                </div>
                
                {isEditingExcerpt ? (
                  <div className="space-y-2">
                    <textarea 
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Enter excerpt details..."
                      className="w-full h-20 bg-[#141414] border border-[#222] rounded px-3 py-2 text-xs text-neutral-300 outline-none focus:border-[#ff7700] resize-none font-sans"
                    />
                    <button 
                      type="button" 
                      onClick={() => setIsEditingExcerpt(false)}
                      className="text-[9px] text-neutral-400 hover:text-neutral-200 font-mono bg-neutral-950 border border-[#222] px-2.5 py-1 rounded"
                    >
                      [ Done ]
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 font-sans italic bg-[#141414] border border-[#222] rounded p-2.5 whitespace-pre-wrap">
                    {formData.excerpt || getExcerptFromContent() || '(Auto summary generated on submit)'}
                  </p>
                )}
              </div>

              {/* Tags Selection */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-widest font-semibold text-neutral-500 mb-1.5">Suggested Tags</label>
                <input 
                  type="text" 
                  value={pasteTagsText}
                  onChange={(e) => setPasteTagsText(e.target.value)}
                  placeholder="tech, journals, philosophy"
                  className="w-full bg-[#141414] border border-[#222] focus:border-[#ff7700] rounded px-3 py-2 text-xs font-mono text-neutral-300 outline-none"
                />
              </div>

              {/* URL Customizable slugs */}
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-widest font-semibold text-neutral-500 mb-1.5">URL Slash Segment</label>
                <div className="flex flex-col gap-1.5 bg-[#141414] border border-[#222] rounded p-2.5">
                  <div className="text-xs font-mono text-neutral-400 select-all overflow-x-auto whitespace-nowrap">
                    /p/{formData.slug || 'untitled'}
                  </div>
                  
                  {isCustomizingUrl ? (
                    <div className="space-y-2 mt-1">
                      <input
                        type="text"
                        value={customUrlVal}
                        onChange={(e) => {
                          setCustomUrlVal(e.target.value);
                          setUrlValidationError(null);
                        }}
                        placeholder="slug-path-segment"
                        className="w-full bg-[#0d0d0d] border border-[#222] focus:border-[#ff7700] rounded px-3 py-1.5 text-xs font-mono text-neutral-200 outline-none"
                      />
                      {urlValidationError && (
                        <p className="text-[10px] text-red-500 font-mono italic">
                          {urlValidationError}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleApplyCustomUrl}
                          className="px-2.5 py-1 bg-[#ff7700] hover:bg-[#ff881a] text-black text-[10px] font-mono uppercase font-bold rounded transition-colors"
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomizingUrl(false);
                            setUrlValidationError(null);
                          }}
                          className="px-2.5 py-1 bg-[#222] hover:bg-[#333] text-neutral-400 text-[10px] font-mono uppercase rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomUrlVal(formData.slug || '');
                        setIsCustomizingUrl(true);
                        setUrlValidationError(null);
                      }}
                      className="self-start text-[10px] text-[#ff7700] hover:text-[#ff881a] font-mono block hover:underline transition-all mt-1 font-semibold"
                    >
                      [ Customize ]
                    </button>
                  )}
                </div>
              </div>

              {/* Calculated Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#1c1c1c] text-xs font-mono text-neutral-400">
                <div className="flex flex-col bg-[#141414] border border-[#222] p-2.5 rounded">
                  <span className="text-neutral-500 text-[10px] uppercase font-mono tracking-wider">Word Count</span>
                  <span className="text-neutral-200 font-semibold mt-0.5">{getWordCount()} words</span>
                </div>
                <div className="flex flex-col bg-[#141414] border border-[#222] p-2.5 rounded">
                  <span className="text-neutral-500 text-[10px] uppercase font-mono tracking-wider">Reading Time</span>
                  <span className="text-neutral-200 font-semibold mt-0.5">~ {getReadingTime()} min read</span>
                </div>
              </div>

            </div>

            {/* Slideover actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1c1c1c]">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 border border-[#222] hover:bg-neutral-900 text-neutral-400 hover:text-white text-xs font-sans uppercase rounded transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={async () => {
                  if (isCustomizingUrl) {
                    setUrlValidationError(null);
                    const result = await validateCustomSlug(customUrlVal, currentPostId, formData.persona);
                    if (!result.valid) {
                      setUrlValidationError(result.error || "Invalid slug.");
                      return;
                    }
                    setFormData((prev: any) => ({ ...prev, slug: result.cleanSlug }));
                  }
                  
                  await handleSavePost(false);
                }}
                disabled={saving}
                className="px-5 py-2 bg-[#ff7700] hover:bg-[#ff881a] text-black font-bold text-xs font-sans uppercase rounded flex items-center gap-1.5 transition-colors"
                id="drawer-confirm-publish-btn"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <span>Publish</span>
                )}
              </button>
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
