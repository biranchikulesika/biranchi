'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Home, Plus, Image as ImageIcon, Mail, Terminal, 
  Activity, Settings, PanelLeftClose, PanelLeft, Sparkles, Menu, X, Info,
  HelpCircle, Book, Quote, Component, ShieldAlert, Wallet,
  Library, Brain, Map, Hash, BookOpen, Zap, Search, LogOut
} from 'lucide-react';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') {
      setTimeout(() => {
        setIsCollapsed(true);
      }, 0);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(open => !open);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };

  // Close mobile menu on path change
  useEffect(() => {
    setTimeout(() => {
      setMobileOpen(false);
    }, 0);
  }, [pathname]);

  const navGroups = [
    {
      title: 'Workspace',
      items: [
        { label: 'Home', href: '/admin', icon: <Home className="w-4 h-4" />, active: true },
      ]
    },
    {
      title: 'Create',
      items: [
        { label: 'New Article', href: '/admin/compose?new=true', icon: <Plus className="w-4 h-4" />, active: true },
      ]
    },
    {
      title: 'Content',
      items: [
        { label: 'Content Library', href: '/admin/library', icon: <Library className="w-4 h-4" />, active: true },
        { label: 'Media', href: '/admin/assets/media', icon: <ImageIcon className="w-4 h-4" />, active: true },
        { label: 'Newsletter', href: '/admin/newsletter', icon: <Mail className="w-4 h-4" />, active: true },
      ]
    },
    {
      title: 'Channels',
      items: [
        { label: 'Forge', href: '/admin/personas/forge', icon: <Zap className="w-4 h-4" />, active: true },
        { label: 'Signal', href: '/admin/personas/signal', icon: <Hash className="w-4 h-4" />, active: true },
        { label: 'Inside the Head', href: '/admin/personas/inside-the-head', icon: <Brain className="w-4 h-4" />, active: true },
        { label: 'Scribble', href: '/admin/personas/scribble', icon: <Map className="w-4 h-4" />, active: true },
      ]
    },
    {
      title: 'System',
      items: [
        { label: 'Fund Records', href: '/admin/fund', icon: <Wallet className="w-4 h-4" />, active: true },
        { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" />, active: true },
        { label: 'View Website', href: '/', icon: <Sparkles className="w-4 h-4" />, active: true, target: "_blank" },
      ]
    }
  ];

  return (
    <div className="flex h-[100dvh] bg-[#0A0A0A] text-neutral-200 font-sans font-light selection:bg-[#222]">
      
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setMobileOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-50 h-full flex flex-col bg-[#0A0A0A] border-r border-[#1a1a1a] transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          ${isCollapsed ? 'md:w-[72px]' : 'md:w-[260px] lg:w-[280px]'} w-[280px]
        `}
      >
        {/* Header */}
        <div className={`h-16 flex items-center border-b border-[#1a1a1a] flex-shrink-0 ${isCollapsed ? 'justify-center px-2' : 'justify-end px-5'}`}>
          {/* Collapse Panel Button on the Right */}
          <button 
            onClick={toggleCollapse}
            className="hidden md:flex text-neutral-500 hover:text-white transition-colors p-1.5 hover:bg-[#161616] rounded-md"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeft className="w-4.5 h-4.5 text-[#ff7700]" /> : <PanelLeftClose className="w-4.5 h-4.5" />}
          </button>
          
          <button 
            className="md:hidden text-neutral-500 hover:text-white transition-colors p-2"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-hide">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className={`px-2.5 text-[9px] uppercase font-mono tracking-widest text-neutral-600 font-semibold mb-1 ${isCollapsed ? 'md:hidden' : ''}`}>
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item, i) => {
                  const isActivePath = pathname === item.href;
                  
                  return item.active ? (
                    <Link 
                      key={i} 
                      href={item.href}
                      target={(item as any).target}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded transition-all group relative
                        ${isActivePath ? 'bg-[#141414] text-white border border-[#222]' : 'text-neutral-400 hover:bg-[#0c0c0c] hover:text-neutral-200 border border-transparent'}
                        ${isCollapsed ? 'md:justify-center' : ''}
                      `}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <div className={`flex-shrink-0 ${isActivePath ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
                        {item.icon}
                      </div>
                      <span className={`whitespace-nowrap text-xs font-normal ${isCollapsed ? 'md:hidden' : 'block'}`}>
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <div 
                      key={i} 
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded transition-all text-neutral-600 cursor-not-allowed group relative
                        ${isCollapsed ? 'md:justify-center' : ''}
                      `}
                      title={isCollapsed ? `${item.label} (Coming Soon)` : undefined}
                    >
                      <div className="flex-shrink-0 opacity-50">
                        {item.icon}
                      </div>
                      <div className={`flex items-center justify-between w-full ${isCollapsed ? 'md:hidden' : 'block'}`}>
                        <span className="whitespace-nowrap text-xs">{item.label}</span>
                        {!isCollapsed && <span className="text-[8px] uppercase font-mono tracking-wider opacity-60">Soon</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer actions */}
        <div className={`p-3 border-t border-[#1a1a1a] ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-2.5 py-1.5 w-full rounded transition-all text-neutral-400 hover:bg-[#161616] hover:text-white border border-transparent ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <div className="flex-shrink-0">
              <LogOut className="w-4 h-4" />
            </div>
            {!isCollapsed && <span className="whitespace-nowrap text-xs">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-14 md:hidden flex items-center px-4 border-b border-[#1a1a1a] bg-[#0A0A0A] flex-shrink-0 gap-4">
          <button 
            onClick={() => setMobileOpen(true)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <Menu className="w-[18px] h-[18px]" />
          </button>
          <div className="font-medium text-sm">Workspace</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0A0A0A]">
          {children}
        </main>
      </div>

      {/* Command Palette */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 backdrop-blur-sm bg-black/40">
          <div 
            className="fixed inset-0" 
            onClick={() => setCommandPaletteOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-[#111] border border-[#222] rounded-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center px-4 border-b border-[#222]">
              <Search className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />
              <input 
                autoFocus
                type="text"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full bg-transparent border-none py-4 outline-none text-neutral-200 placeholder:text-neutral-600 focus:ring-0 text-sm"
              />
              <div className="text-[10px] font-mono text-neutral-500 border border-[#333] px-1.5 py-0.5 rounded ml-2 shrink-0 bg-[#161616]">
                ESC
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide space-y-1">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-neutral-600 font-mono font-semibold">Create</div>
              
              <Link href="/admin/compose?new=true&persona=forge" onClick={() => setCommandPaletteOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#1a1a1a] group cursor-pointer">
                <Plus className="w-4 h-4 text-[#ff7700]" />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white">New Forge Article</span>
              </Link>
              <Link href="/admin/compose?new=true&persona=signal" onClick={() => setCommandPaletteOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#1a1a1a] group cursor-pointer">
                <Plus className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white">New Signal Article</span>
              </Link>
              <Link href="/admin/compose?new=true&persona=inside-the-head" onClick={() => setCommandPaletteOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#1a1a1a] group cursor-pointer">
                <Plus className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white">New Inside the Head Article</span>
              </Link>
              <Link href="/admin/compose?new=true&persona=scribble" onClick={() => setCommandPaletteOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#1a1a1a] group cursor-pointer">
                <Plus className="w-4 h-4 text-sky-500" />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white">New Scribble Article</span>
              </Link>

              <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-neutral-600 font-mono font-semibold mt-2">Navigation</div>
              
              <Link href="/admin/library" onClick={() => setCommandPaletteOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#1a1a1a] group cursor-pointer">
                <Library className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white">Search Articles</span>
              </Link>
              <Link href="/admin/assets/media" onClick={() => setCommandPaletteOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#1a1a1a] group cursor-pointer">
                <ImageIcon className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white">Open Media</span>
              </Link>
              <Link href="/admin/newsletter" onClick={() => setCommandPaletteOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#1a1a1a] group cursor-pointer">
                <Mail className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white">Open Newsletter</span>
              </Link>
              <Link href="/admin/settings" onClick={() => setCommandPaletteOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#1a1a1a] group cursor-pointer">
                <Settings className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white">Open Settings</span>
              </Link>
              <Link href="/" target="_blank" onClick={() => setCommandPaletteOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-[#1a1a1a] group cursor-pointer">
                <Sparkles className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
                <span className="text-sm font-medium text-neutral-300 group-hover:text-white">View Website</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
