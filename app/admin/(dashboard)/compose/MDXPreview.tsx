'use client';

import { useEffect, useState } from 'react';
import { MDXRenderer } from '@/lib/mdx/renderer';
import { Loader2 } from 'lucide-react';
// Import the compile utility from a server action if needed, or we can compile on client
// For now, we will do a simple client-side fetch to a local api route, or use an action
import { compileMDXAction } from './actions'; 

interface MDXPreviewProps {
  content: string;
  persona?: string;
  className?: string;
}

export default function MDXPreview({ content, persona = 'builder', className = '' }: MDXPreviewProps) {
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
    if (p === 'wanderer') return 'prose-stone font-serif bg-background text-foreground';
    if (p === 'thinker') return 'prose-stone font-serif bg-background text-foreground';
    if (p === 'builder') return 'prose-neutral font-sans bg-background text-foreground prose-invert';
    if (p === 'operator') return 'prose-emerald font-mono bg-background text-foreground';
    return 'prose-stone font-serif bg-background text-foreground';
  };

  return (
    <div className={`relative h-[600px] overflow-y-auto border border-border rounded-lg bg-background p-8 ${className}`}>
      {isCompiling && (
        <div className="absolute top-4 right-4 text-primary">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg font-mono text-sm mb-4">
          Error: {error}
        </div>
      )}

      <div className={`prose max-w-none ${getProseClass(persona)} leading-[1.8]`}>
        {compiled ? (
          <MDXRenderer source={compiled} />
        ) : (
          !error && <div className="text-muted-foreground italic font-sans text-sm">Start typing to see preview...</div>
        )}
      </div>
    </div>
  );
}
