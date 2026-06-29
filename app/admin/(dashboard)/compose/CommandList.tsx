import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { CommandItemProps } from './slashSuggestion';

const CommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  return (
    <div className="bg-[#121212] border border-[#222] rounded-lg shadow-2xl p-2 w-64 max-h-[300px] overflow-y-auto flex flex-col gap-1 z-50">
      {props.items.length ? (
        props.items.map((item: CommandItemProps, index: number) => (
          <button
            className={`flex items-center gap-3 w-full text-left p-2 rounded transition-colors ${
              index === selectedIndex ? 'bg-[#ff7700] text-black' : 'text-neutral-300 hover:bg-[#1a1a1a]'
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className={`p-1.5 rounded ${index === selectedIndex ? 'bg-black/20 text-black' : 'bg-[#1a1a1a] text-neutral-400'}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${index === selectedIndex ? 'text-black' : 'text-white'}`}>{item.title}</span>
              <span className={`text-xs ${index === selectedIndex ? 'text-black/70' : 'text-neutral-500'}`}>{item.description}</span>
            </div>
          </button>
        ))
      ) : (
        <div className="text-neutral-500 text-sm text-center p-4">No results found</div>
      )}
    </div>
  );
});

CommandList.displayName = 'CommandList';
export default CommandList;
