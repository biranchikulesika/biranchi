import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Copy, Check, Code as CodeIcon, ChevronDown } from 'lucide-react';

export default function CodeBlockComponent({ node, updateAttributes, extension }: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = node.textContent;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const language = node.attrs.language;

  return (
    <NodeViewWrapper className="code-block-node relative group my-4 rounded-xl overflow-hidden bg-[#0c0c0c] border border-[#222] shadow-2xl">
      <div 
        className="flex items-center justify-between bg-[#111] px-4 py-2 border-b border-[#222]"
        contentEditable={false}
      >
        <div className="flex items-center gap-2 text-neutral-400">
           <CodeIcon className="w-4 h-4" />
           <div className="relative flex items-center">
             {language && (
               <span className="text-sm text-neutral-300 font-medium mr-1 capitalize pointer-events-none">
                 {language}
               </span>
             )}
             <select 
               className={`bg-transparent text-sm outline-none cursor-pointer hover:text-white transition-colors appearance-none ${!language ? 'text-neutral-500' : 'opacity-0 absolute inset-0'}`}
               value={language || 'null'}
               onChange={(e) => updateAttributes({ language: e.target.value === 'null' ? null : e.target.value })}
               title="Select Language"
             >
               <option value="null">Select language...</option>
               <option value="javascript">JavaScript</option>
               <option value="typescript">TypeScript</option>
               <option value="html">HTML</option>
               <option value="css">CSS</option>
               <option value="python">Python</option>
               <option value="java">Java</option>
               <option value="c">C</option>
               <option value="cpp">C++</option>
               <option value="csharp">C#</option>
               <option value="json">JSON</option>
               <option value="bash">Bash</option>
               <option value="sql">SQL</option>
               <option value="markdown">Markdown</option>
             </select>
             {!language && <ChevronDown className="w-3 h-3 ml-1 opacity-50" />}
           </div>
        </div>
        <button 
          onClick={handleCopy}
          className="text-neutral-500 hover:text-white transition-colors rounded p-1 hover:bg-[#1a1a1a]"
          title="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto min-h-[60px] !m-0 !bg-transparent text-sm">
        <NodeViewContent as="code" className={language ? `language-${language}` : ''} />
      </pre>
    </NodeViewWrapper>
  );
}
