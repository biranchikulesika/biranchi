import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { PluginKey } from '@tiptap/pm/state';
import tippy from 'tippy.js';
import { ReactRenderer } from '@tiptap/react';
import CommandList from './CommandList';

const extensionName = 'slashCommand';

export default Extension.create({
  name: extensionName,

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        pluginKey: new PluginKey(extensionName),
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
