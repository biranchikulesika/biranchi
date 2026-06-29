import { Node, mergeAttributes } from '@tiptap/core';

export default Node.create({
  name: 'summary',
  group: 'summary',
  content: 'text*',
  marks: '',
  defining: true,
  isolating: true,

  parseHTML() {
    return [
      {
        tag: 'summary',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['summary', mergeAttributes(HTMLAttributes, { class: 'font-semibold cursor-pointer outline-none hover:text-white text-neutral-300' }), 0];
  },
});
