import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { uploadImage } from '@/lib/supabase/storage';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Heading2, List, ListOrdered, Quote, Video, Loader2 } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export default function RichTextEditor({ content, onChange, className = '' }: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#ff7700] hover:underline underline-offset-4 cursor-pointer transition-colors',
        },
      }),
      Youtube.configure({
        width: 840,
        height: 472.5,
        HTMLAttributes: {
          class: 'rounded-xl overflow-hidden my-4 border border-[#222]',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your story... Use markdown like # for headings or just begin typing.',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-p:text-neutral-300 prose-headings:text-neutral-100 prose-a:text-[#ff7700] prose-strong:text-white max-w-none focus:outline-none min-h-[400px]',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Prevent cursor jump by only updating if entirely different
      if (!editor.isFocused) {
          editor.commands.setContent(content || '');
      }
    }
  }, [content, editor]);

  const handleImageUpload = async (file: File) => {
    if (!editor) return;
    setIsUploading(true);
    try {
      const { publicUrl } = await uploadImage({ bucket: 'post-images', file });
      if (publicUrl) {
        editor.chain().focus().setImage({ src: publicUrl, alt: file.name }).run();
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTriggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const addYoutubeVideo = () => {
    if (!editor) return;
    const url = prompt('Enter YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 840,
        height: 472.5,
      });
    }
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor) {
    return <div className="min-h-[400px] flex items-center justify-center text-neutral-500 font-mono text-sm">Loading editor...</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Floating Toolbar inside editor for images/youtube */}
      <div className="absolute -top-12 right-0 flex items-center gap-1 bg-[#0c0c0c] border border-[#222] p-1 rounded-lg z-10 shadow-lg">
        <button
          type="button"
          onClick={handleTriggerFilePicker}
          disabled={isUploading}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1a1a1a] rounded transition-colors disabled:opacity-50"
          title="Upload Image"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={addYoutubeVideo}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
          title="Embed YouTube Video"
        >
          <Video className="w-4 h-4" />
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

      {/* Bubble Menu for text selection formatting */}
      {editor && (
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ duration: 100 }} 
          shouldShow={({ editor, view, state, from, to }) => {
            const { selection } = state;
            const { empty } = selection;
            const hasEditorFocus = view.hasFocus();
            return hasEditorFocus && !empty && !editor.isActive('image');
          }}
          className="flex items-center bg-[#0c0c0c] border border-[#222] p-1 rounded-lg shadow-2xl overflow-hidden gap-0.5"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'bg-[#ff7700] text-black' : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'bg-[#ff7700] text-black' : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'}`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={setLink}
            className={`p-1.5 rounded transition-colors ${editor.isActive('link') ? 'bg-[#ff7700] text-black' : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'}`}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-[#222] mx-1"></div>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#ff7700] text-black' : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'}`}
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-[#ff7700] text-black' : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-[#ff7700] text-black' : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'}`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-[#ff7700] text-black' : 'text-neutral-400 hover:bg-[#1a1a1a] hover:text-white'}`}
          >
            <Quote className="w-4 h-4" />
          </button>
        </BubbleMenu>
      )}

      {/* Bubble Menu for Images (Alt Text and Title) */}
      {editor && (
        <BubbleMenu 
          editor={editor} 
          tippyOptions={{ duration: 100 }} 
          shouldShow={({ editor }) => editor.isActive('image')}
          className="flex flex-col bg-[#0c0c0c] border border-[#222] p-2 rounded-lg shadow-2xl overflow-hidden gap-2 min-w-[240px]"
        >
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-mono text-neutral-500 px-1">Alt Text (Accessibility)</label>
            <input 
              type="text" 
              placeholder="Describe the image..."
              value={editor.getAttributes('image').alt || ''}
              onChange={(e) => editor.chain().focus().updateAttributes('image', { alt: e.target.value }).run()}
              className="w-full bg-[#111] border border-[#222] text-xs text-white p-2 rounded outline-none focus:border-[#ff7700] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-mono text-neutral-500 px-1">Caption / Title</label>
            <input 
              type="text" 
              placeholder="Caption shown on hover..."
              value={editor.getAttributes('image').title || ''}
              onChange={(e) => editor.chain().focus().updateAttributes('image', { title: e.target.value }).run()}
              className="w-full bg-[#111] border border-[#222] text-xs text-white p-2 rounded outline-none focus:border-[#ff7700] transition-colors"
            />
          </div>
        </BubbleMenu>
      )}

      <div className="border border-transparent hover:border-[#111] transition-colors rounded-xl p-4 -mx-4 group">
        <EditorContent editor={editor} />
      </div>
      
      {/* Editor Styles applied directly for placeholder */}
      <style dangerouslySetInnerHTML={{__html: `
        .is-editor-empty:first-child::before {
          color: #404040;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #404040;
          pointer-events: none;
          height: 0;
        }
      `}} />
    </div>
  );
}
