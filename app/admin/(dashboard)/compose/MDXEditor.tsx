'use client';

import { useState, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Code, Type, LayoutTemplate, Quote, TableProperties, Video, X, UploadCloud, FileImage, Search, Heading1, Heading2, Heading3, List, ListOrdered, Minus, Link2 } from 'lucide-react';
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
  actionButtons?: React.ReactNode;
}

const componentLibrary = [
  { name: 'Callout', tag: 'Callout', props: { type: 'info' }, icon: Type, description: 'Highlighted info box', selfClosing: false },
  { name: 'YouTube', tag: 'YouTube', props: { id: 'dQw4w9WgXcQ' }, icon: Video, description: 'Embed a YouTube video', selfClosing: true },
  { name: 'Image', tag: 'Image', props: { path: 'path/to/image.jpg', alt: 'Description' }, icon: ImageIcon, description: 'MDX native image', selfClosing: true },
  { name: 'Table', tag: 'table', props: {}, icon: TableProperties, description: 'Standard HTML table', selfClosing: false },
  { name: 'Blockquote', tag: 'blockquote', props: {}, icon: Quote, description: 'Standard blockquote', selfClosing: false },
  { name: 'Pre', tag: 'pre', props: {}, icon: Code, description: 'Code block wrapper', selfClosing: false },
  { name: 'Heading 1', tag: 'h1', props: {}, icon: Heading1, description: 'Main page heading', selfClosing: false },
  { name: 'Heading 2', tag: 'h2', props: {}, icon: Heading2, description: 'Section heading', selfClosing: false },
  { name: 'Heading 3', tag: 'h3', props: {}, icon: Heading3, description: 'Subsection heading', selfClosing: false },
  { name: 'Unordered List', tag: 'ul', props: {}, icon: List, description: 'Bulleted list', selfClosing: false },
  { name: 'Ordered List', tag: 'ol', props: {}, icon: ListOrdered, description: 'Numbered list', selfClosing: false },
  { name: 'Horizontal Rule', tag: 'hr', props: {}, icon: Minus, description: 'Thematic break', selfClosing: true },
  { name: 'Link', tag: 'a', props: { href: 'https://example.com' }, icon: Link2, description: 'Hyperlink', selfClosing: false },
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
  actionButtons
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

  const displayTabName = (title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.mdx';

  const ToolbarButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <button 
      onClick={onClick} 
      className="p-1.5 hover:bg-[#333] rounded-md text-neutral-400 hover:text-neutral-100 transition-colors flex items-center justify-center" 
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className={`flex flex-col h-full bg-[#1e1e1e] border-l border-[#222] ${className}`} onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
      
      {/* VS Code Editor Tabs */}
      <div className="flex bg-[#111111] h-[35px] shrink-0 overflow-x-auto custom-scrollbar">
        {/* Active Tab */}
        <div className="flex items-center h-full px-3 bg-[#1e1e1e] border-t-2 border-t-[#007acc] text-[#cccccc] cursor-pointer min-w-[140px] max-w-[200px] group transition-colors">
          <Type className="w-3.5 h-3.5 text-[#519aba] mr-2 shrink-0" />
          <span className="text-[13px] font-sans truncate select-none flex-1">
            {displayTabName.replace(/^-+|-+$/g, '') || 'untitled.mdx'}
          </span>
          <X className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 hover:bg-[#333] rounded p-0.5 transition-all shrink-0" />
        </div>
        
        {/* Empty space next to tab */}
        <div className="flex-1 bg-[#111111]"></div>
      </div>

      {/* Unified Toolbar */}
      <div className="flex items-center px-4 h-11 bg-[#181818] border-b border-[#222] shrink-0 gap-6 overflow-x-auto">
        
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Bold} label="Bold (Cmd+B)" onClick={() => applyFormat('**')} />
          <ToolbarButton icon={Italic} label="Italic (Cmd+I)" onClick={() => applyFormat('*')} />
        </div>

        <div className="w-px h-5 bg-[#333]"></div>

        {/* Inline Formatting */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={LinkIcon} label="Link (Cmd+K)" onClick={applyLink} />
          <ToolbarButton icon={Code} label="Inline Code" onClick={() => applyFormat('`')} />
        </div>

        <div className="w-px h-5 bg-[#333]"></div>

        {/* Blocks */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Quote} label="Blockquote" onClick={() => insertComponent('blockquote')} />
          <ToolbarButton icon={LayoutTemplate} label="Code Block (Pre)" onClick={() => insertComponent('pre')} />
          <ToolbarButton icon={TableProperties} label="Table" onClick={() => insertComponent('table')} />
          <ToolbarButton icon={Type} label="Callout Box" onClick={() => insertComponent('Callout', { type: 'info' })} />
        </div>

        <div className="w-px h-5 bg-[#333]"></div>

        {/* Media */}
        <div className="flex items-center gap-1">
          <ToolbarButton icon={ImageIcon} label="Insert Image via URL" onClick={() => insertSelfClosingComponent('Image', { path: 'path/to/image.jpg', alt: 'Description' })} />
          <ToolbarButton icon={FileImage} label="Media Library" onClick={() => setIsMediaLibraryOpen(true)} />
          <ToolbarButton icon={UploadCloud} label="Upload Image" onClick={() => fileInputRef.current?.click()} />
          <ToolbarButton icon={Video} label="Embed YouTube" onClick={() => insertSelfClosingComponent('YouTube', { id: 'dQw4w9WgXcQ' })} />
        </div>

      </div>

      {/* VS Code Breadcrumbs */}
      <div className="flex items-center h-[26px] bg-[#1e1e1e] px-4 text-[#cccccc] shrink-0 text-[12px] font-sans shadow-[0_1px_2px_rgba(0,0,0,0.2)] z-10 relative">
        <span className="opacity-60 font-mono">biranchi</span>
        <span className="mx-2 opacity-40">›</span>
        <span className="opacity-60 font-mono">admin</span>
        <span className="mx-2 opacity-40">›</span>
        <span className="opacity-60 font-mono">compose</span>
        <span className="mx-2 opacity-40">›</span>
        
        <input 
          type="text" 
          value={title} 
          onChange={(e) => onTitleChange(e.target.value)} 
          placeholder="Post Title"
          className="bg-transparent border-none outline-none text-[#cccccc] placeholder-[#666] focus:ring-0 w-32 lg:w-48 shrink-0 py-0"
        />
        <span className="mx-2 opacity-40">›</span>
        <input 
          type="text"
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder="Subtitle"
          className="flex-1 bg-transparent border-none outline-none text-[#cccccc] placeholder-[#666] focus:ring-0 min-w-[150px] py-0 italic"
        />

        {actionButtons && (
          <div className="flex items-center gap-2 ml-4">
            {actionButtons}
          </div>
        )}
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
        <div className="w-72 border-l border-[#222] bg-[#0a0a0a] flex flex-col h-full shrink-0">
          <div className="p-3 border-b border-[#222] bg-[#111]">
            <h3 className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 mb-3 flex items-center gap-2">
              <LayoutTemplate className="w-3.5 h-3.5" /> Component Library
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#222] rounded-md py-1.5 pl-9 pr-3 text-xs font-sans text-neutral-300 focus:outline-none focus:border-[#555] transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            <div className="space-y-1">
              {filteredComponents.length > 0 ? filteredComponents.map((comp) => {
                const Icon = comp.icon;
                return (
                  <button
                    key={comp.name}
                    onClick={() => comp.selfClosing ? insertSelfClosingComponent(comp.tag, comp.props) : insertComponent(comp.tag, comp.props)}
                    className="w-full text-left p-2 rounded-md hover:bg-[#1a1a1a] transition-colors flex items-start gap-3 group"
                  >
                    <div className="p-1.5 bg-[#111] border border-[#222] rounded mt-0.5 group-hover:border-[#333] transition-colors">
                      <Icon className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium font-sans text-neutral-300 group-hover:text-white transition-colors">{comp.name}</div>
                      <div className="text-[11px] font-sans text-neutral-500 truncate mt-0.5">{comp.description}</div>
                    </div>
                  </button>
                );
              }) : (
                <div className="p-4 text-center text-xs font-sans text-neutral-500">
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
