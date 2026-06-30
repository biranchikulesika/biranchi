'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { compileMDXAction } from './actions'; 
import PostRenderer from '@/components/post-renderer/PostRenderer';

interface MDXPreviewProps {
  content: string;
  persona?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function MDXPreview({ content, persona = 'builder', title = '', subtitle = '', className = '' }: MDXPreviewProps) {
  const [compiled, setCompiled] = useState<any>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce the compilation to avoid spamming the server/action while typing
  useEffect(() => {
    if (!content) {
      setCompiled(null);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCompiling(true);
      setError(null);
      try {
        const result = await compileMDXAction(content);
        if (result.error) {
          setError(result.error);
        } else {
          setCompiled(result.source);
        }
      } catch (e: any) {
        setError(e.message || 'Failed to compile MDX');
      } finally {
        setIsCompiling(false);
      }
    }, 1000); // 1s debounce

    return () => clearTimeout(timer);
  }, [content]);

  // Determine styles based on persona similar to PostRenderer
  const getProseClass = (p: string) => {
    return 'bg-background text-foreground';
  };

  const getWordCount = () => {
    if (!content) return 0;
    const cleanText = content.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) return 0;
    return cleanText.split(/\s+/).filter(Boolean).length;
  };

  const readingTime = Math.max(1, Math.ceil(getWordCount() / 220));

  const postMock = {
    title: title || 'Untitled Post',
    subtitle: subtitle || '',
    persona: persona === 'unassigned' ? 'thinker' : persona,
    publishedAt: new Date().toISOString(),
    readingTime: readingTime,
    content: content,
    slug: 'preview-draft'
  };

  return (
    <div className={`relative h-full overflow-hidden rounded-lg bg-background ${className}`}>
      {isCompiling && (
        <div className="absolute top-4 right-4 text-primary z-50 bg-background/50 p-1 rounded-full backdrop-blur-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg font-mono text-sm m-4 z-50 relative">
          Error: {error}
        </div>
      )}

      {compiled ? (
        <PostRenderer 
          postOnly 
          post={postMock} 
          slug="preview-draft" 
          allPosts={[]} 
          compiledMdx={compiled} 
        />
      ) : (
        !error && <div className="text-muted-foreground italic font-sans text-sm p-8">Start typing to see preview...</div>
      )}
    </div>
  );
}
