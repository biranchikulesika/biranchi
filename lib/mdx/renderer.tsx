'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXComponents } from '@/components/mdx/MDXComponents';

interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
}

export function MDXRenderer({ source }: MDXRendererProps) {
  if (!source) return null;

  return (
    <MDXRemote 
      {...source} 
      components={MDXComponents} 
    />
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  // Legacy support for pure markdown if needed, but PostRenderer will handle MDX properly.
  // This is a placeholder wrapper that shouldn't be used directly for raw strings unless necessary.
  return <div className="text-red-500">Use MDXRenderer with compiled source instead of MarkdownRenderer</div>;
}
