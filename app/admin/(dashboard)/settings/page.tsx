import React from 'react';

export default function SettingsPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto p-5 md:p-8 lg:p-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-neutral-100 mb-2">System Settings</h1>
          <p className="text-neutral-500 text-sm">Manage global workspace configuration.</p>
        </div>
      </div>
      
      <div className="max-w-2xl bg-[#111111] p-6 rounded-lg border border-[#1a1a1a] space-y-6">
         <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 font-mono mb-2">Workspace Name</label>
            <input type="text" className="w-full bg-[#161616] border border-[#222] rounded-md px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-neutral-500" defaultValue="Biranchi Operator Workspace" />
         </div>
      </div>
    </div>
  );
}
