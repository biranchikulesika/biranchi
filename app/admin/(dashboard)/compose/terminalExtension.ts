import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import TerminalBlock from './TerminalBlock';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    terminal: {
      setTerminal: () => ReturnType;
      toggleTerminal: () => ReturnType;
    };
  }
}

export default Node.create({
  name: 'terminal',

  group: 'block',

  content: 'text*',

  marks: '',

  code: true,

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="terminal"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'terminal' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TerminalBlock);
  },

  addCommands() {
    return {
      setTerminal:
        () =>
        ({ commands }) => {
          return commands.setNode(this.name);
        },
      toggleTerminal:
        () =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph');
        },
    };
  },
});
