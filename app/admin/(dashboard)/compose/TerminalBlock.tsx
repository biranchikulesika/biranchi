import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Copy, Check } from 'lucide-react';

export default function TerminalBlock(props: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = props.node.textContent;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <NodeViewWrapper className="terminal-node relative group my-4 rounded-xl overflow-hidden bg-[#050505] border border-[#222] shadow-2xl">
      <div 
        className="flex items-center justify-between bg-[#0a0a0a] px-4 py-2.5 border-b border-[#222]"
        contentEditable={false}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
        </div>
        <button 
          onClick={handleCopy}
          className="text-neutral-500 hover:text-white transition-colors rounded p-1 hover:bg-[#1a1a1a]"
          title="Copy command"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="p-4 font-mono text-sm sm:text-[14px] text-emerald-400/90 leading-relaxed overflow-x-auto min-h-[60px] cursor-text">
        <NodeViewContent className="whitespace-pre-wrap outline-none border-none min-h-[24px]" as="div" />
      </div>
    </NodeViewWrapper>
  );
}
