'use client';

import { useState, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Code, Type, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/supabase/storage';
import MediaLibraryModal from './MediaLibraryModal';

interface MDXEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  persona?: string;
}

export default function MDXEditor({ content, onChange, className = '', persona = 'builder' }: MDXEditorProps) {
  const monaco = useMonaco();
  const [isUploading, setIsUploading] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Add custom keybindings for markdown formatting
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB, () => applyFormat('**'));
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI, () => applyFormat('*'));
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => applyLink());
  };

  const applyFormat = (wrapper: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    const model = editor.getModel();
    const text = model.getValueInRange(selection);
    
    // If already wrapped, unwrap
    if (text.startsWith(wrapper) && text.endsWith(wrapper)) {
      const unwrapped = text.slice(wrapper.length, -wrapper.length);
      editor.executeEdits('format', [{
        range: selection,
        text: unwrapped,
        forceMoveMarkers: true
      }]);
    } else {
      editor.executeEdits('format', [{
        range: selection,
        text: `${wrapper}${text}${wrapper}`,
        forceMoveMarkers: true
      }]);
    }
    editor.focus();
  };

  const applyLink = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    const model = editor.getModel();
    const text = model.getValueInRange(selection);
    
    const url = window.prompt('URL:');
    if (url === null) return;
    
    const replacement = text ? `[${text}](${url})` : `[Link text](${url})`;
    
    editor.executeEdits('link', [{
      range: selection,
      text: replacement,
      forceMoveMarkers: true
    }]);
    editor.focus();
  };

  const insertComponent = (tag: string, props: Record<string, string> = {}) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    const propsString = Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(' ');
    const tagOpen = `<${tag}${propsString ? ' ' + propsString : ''}>`;
    
    const replacement = `${tagOpen}\n\n</${tag}>\n`;
    
    editor.executeEdits('component', [{
      range: selection,
      text: replacement,
      forceMoveMarkers: true
    }]);
    editor.focus();
  };

  const insertSelfClosingComponent = (tag: string, props: Record<string, string> = {}) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    const propsString = Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(' ');
    const replacement = `<${tag}${propsString ? ' ' + propsString : ''} />\n`;
    
    editor.executeEdits('component', [{
      range: selection,
      text: replacement,
      forceMoveMarkers: true
    }]);
    editor.focus();
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Instead of getting public URL, get the storage path for MDX
      const { path: storagePath } = await uploadImage({ bucket: 'post-images', file }); 
      
      if (storagePath) {
        insertSelfClosingComponent('Image', { path: storagePath, alt: file.name });
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await handleImageUpload(file);
      }
    }
  };

  return (
    <div className={`flex flex-col h-[600px] border border-border rounded-lg overflow-hidden bg-background ${className}`} onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
      <div className="flex items-center gap-1 border-b border-border p-2 bg-[#0c0c0c]">
        <button onClick={() => applyFormat('**')} className="p-1.5 rounded hover:bg-[#1a1a1a] text-neutral-400 hover:text-white transition-colors" title="Bold (Cmd+B)">
          <Bold className="w-4 h-4" />
        </button>
        <button onClick={() => applyFormat('*')} className="p-1.5 rounded hover:bg-[#1a1a1a] text-neutral-400 hover:text-white transition-colors" title="Italic (Cmd+I)">
          <Italic className="w-4 h-4" />
        </button>
        <button onClick={applyLink} className="p-1.5 rounded hover:bg-[#1a1a1a] text-neutral-400 hover:text-white transition-colors" title="Link (Cmd+K)">
          <LinkIcon className="w-4 h-4" />
        </button>
        <button onClick={() => applyFormat('`')} className="p-1.5 rounded hover:bg-[#1a1a1a] text-neutral-400 hover:text-white transition-colors" title="Inline Code">
          <Code className="w-4 h-4" />
        </button>
        
        <div className="w-px h-4 bg-border mx-1"></div>
        
        <button onClick={() => setIsMediaLibraryOpen(true)} className="p-1.5 rounded hover:bg-[#1a1a1a] text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
          <ImageIcon className="w-4 h-4" />
          <span className="text-xs uppercase font-mono">Media Library</span>
        </button>
        
        <div className="w-px h-4 bg-border mx-1"></div>

        <button onClick={() => insertComponent('Callout', { type: 'info' })} className="p-1.5 rounded hover:bg-[#1a1a1a] text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
          <Type className="w-4 h-4" />
          <span className="text-xs uppercase font-mono">Callout</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }}
      />

      <MediaLibraryModal 
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelect={(path, url) => {
          insertSelfClosingComponent('Image', { path, alt: 'Media Library Image' });
          setIsMediaLibraryOpen(false);
        }}
      />

      <div className="flex-1 w-full relative">
        <Editor
          height="100%"
          defaultLanguage="mdx"
          language="mdx"
          theme="vs-dark"
          value={content}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 },
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
          }}
        />
      </div>
    </div>
  );
}
