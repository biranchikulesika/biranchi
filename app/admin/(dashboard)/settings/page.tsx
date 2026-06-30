'use client';

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Loader2, KeyRound } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        experimental: {
          passkey: true,
        },
      },
    }
  );

  const registerPasskey = async () => {
    setLoading(true);
    setMessage('');
    try {
      const { data, error } = await supabase.auth.registerPasskey();
      if (error) {
        setMessage('Error: ' + error.message);
      } else {
        setMessage('Passkey registered successfully! You can now use it to log in.');
      }
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-350 mx-auto p-5 md:p-8 lg:p-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-neutral-100 mb-2">System Settings</h1>
          <p className="text-neutral-500 text-sm">Manage global workspace configuration.</p>
        </div>
      </div>

      <div className="max-w-2xl bg-[#111111] p-6 rounded-lg border border-[#1a1a1a] space-y-6 mb-8">
         <div>
            <label className="block text-xs uppercase tracking-widest text-neutral-500 font-mono mb-2">Workspace Name</label>
            <input type="text" className="w-full bg-[#161616] border border-[#222] rounded-md px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-neutral-500" defaultValue="Biranchi Operator Workspace" />
         </div>
      </div>

      <div className="max-w-2xl bg-[#111111] p-6 rounded-lg border border-[#1a1a1a] space-y-6">
        <div>
          <h2 className="text-xl font-medium text-neutral-200 mb-2">Security</h2>
          <p className="text-sm text-neutral-500 mb-6">Manage your authentication methods and security settings.</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#161616] border border-[#222] rounded-md gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neutral-800 rounded-md">
                <KeyRound className="w-5 h-5 text-neutral-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-200">Passkeys</p>
                <p className="text-xs text-neutral-500">Sign in securely using your device's biometric authentication.</p>
              </div>
            </div>
            <button
              onClick={registerPasskey}
              disabled={loading}
              className="flex items-center justify-center min-w-[120px] px-4 py-2 bg-neutral-200 hover:bg-white text-neutral-900 text-sm font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register Passkey'}
            </button>
          </div>
          
          {message && (
            <p className={`mt-4 text-sm ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
