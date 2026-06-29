'use client';

import { useState, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Code, Type, Loader2, Search, LayoutTemplate, Quote, TableProperties, Video } from 'lucide-react';
import { uploadImage } from '@/lib/supabase/storage';
import MediaLibraryModal from './MediaLibraryModal';

interface MDXEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  persona?: string;
  title: string;
  onTitleChange: (title: string) => void;
  subtitle: string;
  onSubtitleChange: (subtitle: string) => void;
  wordCount: number;
  readingTime: number;
}

const componentLibrary = [
  { name: 'Callout', tag: 'Callout', props: { type: 'info' }, icon: Type, description: 'Highlighted info box', selfClosing: false },
  { name: 'YouTube', tag: 'YouTube', props: { id: 'dQw4w9WgXcQ' }, icon: Video, description: 'Embed a YouTube video', selfClosing: true },
  { name: 'Image', tag: 'Image', props: { path: 'path/to/image.jpg', alt: 'Description' }, icon: ImageIcon, description: 'MDX native image', selfClosing: true },
  { name: 'Table', tag: 'table', props: {}, icon: TableProperties, description: 'Standard HTML table', selfClosing: false },
  { name: 'Blockquote', tag: 'blockquote', props: {}, icon: Quote, description: 'Standard blockquote', selfClosing: false },
  { name: 'Pre', tag: 'pre', props: {}, icon: Code, description: 'Code block wrapper', selfClosing: false },
];

export default function MDXEditor({ 
  content, 
  onChange, 
  className = '', 
  persona = 'builder',
  title,
  onTitleChange,
  subtitle,
  onSubtitleChange,
  wordCount,
  readingTime
}: MDXEditorProps) {
  const monaco = useMonaco();
  const [isUploading, setIsUploading] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredComponents = componentLibrary.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={`flex flex-col h-full border border-border rounded-lg overflow-hidden bg-background ${className}`} onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
      {/* Top Toolbar */}
      <div className="flex items-center justify-between border-b border-border p-1 bg-[#0c0c0c] shrink-0">
        <div className="flex items-center gap-1 pl-1">
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
            <span className="text-[11px] uppercase font-mono tracking-wider">Media Library</span>
          </button>
          
          <div className="w-px h-4 bg-border mx-2"></div>
          
          <input 
            type="text" 
            value={title} 
            onChange={(e) => onTitleChange(e.target.value)} 
            placeholder="Post Title..."
            className="bg-transparent border-none outline-none text-sm font-sans font-semibold text-neutral-200 placeholder-neutral-600 focus:ring-0 ml-1 w-64 md:w-96"
          />
        </div>
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

      <div className="flex flex-1 min-h-0 relative">
        {/* Editor Area */}
        <div className="flex-1 min-w-0 flex flex-col relative h-full">
          {/* Subtitle & Stats Bar */}
          <div className="flex items-center justify-between border-b border-border bg-[#111] px-4 py-2 shrink-0">
            <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-500 shrink-0">
              <span>{wordCount} words</span>
              <div className="w-px h-3 bg-[#333]"></div>
              <span>{readingTime} min read</span>
            </div>
            <input 
              type="text"
              value={subtitle}
              onChange={(e) => onSubtitleChange(e.target.value)}
              placeholder="An elegant subtitle leads the narrative..."
              className="flex-1 ml-4 bg-transparent border-none outline-none text-[13px] font-serif text-neutral-400 placeholder-neutral-700 text-right focus:ring-0"
            />
          </div>
          
          <div className="flex-1 relative">
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
                padding: { top: 24, bottom: 48 },
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

        {/* Right Sidebar Component Library */}
        <div className="w-72 border-l border-border bg-[#0a0a0a] flex flex-col h-full shrink-0">
          <div className="p-3 border-b border-border bg-[#111]">
            <h3 className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2">
              <LayoutTemplate className="w-3.5 h-3.5" /> Component Library
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#222] rounded-md py-1.5 pl-9 pr-3 text-xs font-mono text-neutral-300 focus:outline-none focus:border-[#ff7700] transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {filteredComponents.length > 0 ? filteredComponents.map((comp) => {
                const Icon = comp.icon;
                return (
                  <button
                    key={comp.name}
                    onClick={() => comp.selfClosing ? insertSelfClosingComponent(comp.tag, comp.props) : insertComponent(comp.tag, comp.props)}
                    className="w-full text-left p-2.5 rounded-md hover:bg-[#1a1a1a] transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-1.5 bg-[#111] border border-[#222] rounded mt-0.5 group-hover:border-[#333] transition-colors">
                      <Icon className="w-4 h-4 text-neutral-400 group-hover:text-[#ff7700] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold font-sans text-neutral-300 group-hover:text-white transition-colors">{comp.name}</div>
                      <div className="text-[11px] font-mono text-neutral-500 truncate mt-0.5">{comp.description}</div>
                    </div>
                  </button>
                );
              }) : (
                <div className="p-4 text-center text-xs font-mono text-neutral-500">
                  No components found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
