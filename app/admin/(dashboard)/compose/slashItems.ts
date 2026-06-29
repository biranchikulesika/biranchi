import { Heading1, Heading2, Heading3, List, ListOrdered, Quote, Terminal, Minus, Table, Type, Code } from 'lucide-react';
import { Editor } from '@tiptap/core';

export const getSlashItems = () => [
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    icon: Heading1,
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    icon: Heading2,
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    icon: Heading3,
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bulleted list.',
    icon: List,
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    icon: ListOrdered,
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Quote',
    description: 'Capture a quote.',
    icon: Quote,
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode('blockquote').run();
    },
  },
  {
    title: 'Code Block',
    description: 'Capture a code snippet.',
    icon: Code,
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode('codeBlock').run();
    },
  },
  {
    title: 'Terminal Block',
    description: 'A stylish terminal window.',
    icon: Terminal,
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode('terminal').run();
    },
  },
  {
    title: 'Divider',
    description: 'Visually divide blocks.',
    icon: Minus,
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: 'Table',
    description: 'Insert a table.',
    icon: Table,
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    },
  },
  {
    title: 'Toggle List',
    description: 'Collapsible details block.',
    icon: Type,
    command: ({ editor, range }: { editor: Editor; range: any }) => {
      editor.chain().focus().deleteRange(range).setNode('details').run();
    },
  },
];
