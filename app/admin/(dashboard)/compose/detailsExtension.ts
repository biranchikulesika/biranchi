import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    details: {
      setDetails: () => ReturnType;
      unsetDetails: () => ReturnType;
    };
  }
}

export default Node.create({
  name: 'details',
  group: 'block',
  content: 'summary block+',
  defining: true,

  parseHTML() {
    return [
      {
        tag: 'details',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['details', mergeAttributes(HTMLAttributes, { class: 'my-4 border border-[#333] rounded-lg p-2 bg-[#111]/30' }), 0];
  },

  addCommands() {
    return {
      setDetails:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name);
        },
      unsetDetails:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },
});
