'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Save, X, Eye, EyeOff, Star, ArrowUp, ArrowDown } from 'lucide-react';
import { getBooks, createBook, updateBook, deleteBook, hideBook, unhideBook, featureBook, unfeatureBook } from '@/app/admin/actions/books.actions';
import { FormLabel, InlineError, ValidationSummary, parseDbError } from '@/components/admin/validation';

export default function BookPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<any>({"title":"","author":"","coverImage":"","category":"","status":"reading","notes":"","featured":false});

  const loadData = async () => {
    const data = await getBooks();
    setItems(data || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNew = () => {
    setEditingId(null);
    setDbError(null);
    setFormData({"title":"","author":"","coverImage":"","category":"","status":"reading","notes":"","featured":false});
    setIsEditing(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id || item.persona || 'none');
    setDbError(null);
    setFormData(item);
    setIsEditing(true);
  };

  const errors: Record<string, string> = {};
  if (!formData.title?.trim()) {
    errors.title = "Title is required.";
  }
  if (!formData.author?.trim()) {
    errors.author = "Author is required.";
  }
  const isValid = Object.keys(errors).length === 0;

  const handleSave = async () => {
    if (!isValid) return;
    setDbError(null);
    try {
      if (editingId && editingId !== 'none') {
        await updateBook(editingId, formData);
      } else {
        await createBook(formData);
      }
      setIsEditing(false);
      loadData();
    } catch (err: any) {
      setDbError(parseDbError(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteBook(id);
      if (editingId === id) setIsEditing(false);
      loadData();
    }
  };

  const toggleVisibility = async (item: any) => {
    const isCurrentlyHidden = item.hidden === true;
    if (isCurrentlyHidden) {
      await unhideBook(item.id || item.persona);
    } else {
      await hideBook(item.id || item.persona);
    }
    loadData();
  };

  const toggleFeature = async (item: any) => {
    if (item.featured) {
      await unfeatureBook(item.id || item.persona);
    } else {
      await featureBook(item.id || item.persona);
    }
    loadData();
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-5 md:p-8 lg:p-12 text-neutral-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] tracking-[0.25em] text-[#ff7700] uppercase font-mono font-bold">Workspace Assets</span>
          </div>
          <h1 className="text-3xl font-medium tracking-tight text-neutral-100 mb-2 font-sans">Library (Books)</h1>
          <p className="text-neutral-500 text-sm">Manage critical books for the site.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-neutral-100 text-black px-4 py-2.5 rounded-md text-sm font-medium hover:bg-white transition-colors flex items-center justify-center gap-2 w-fit selection:bg-neutral-800"
        >
          <Plus className="w-4 h-4" />
          New Item
        </button>
      </div>

      <div className="border border-[#1a1a1a] rounded-lg overflow-hidden bg-[#111111]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#1a1a1a] bg-[#0A0A0A]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-semibold font-mono w-[80%]">Details</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-semibold font-mono text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {items.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-[#161616] group transition-colors">
                  <td className="px-6 py-4 animate-fadeIn">
                    
                    <div className="flex flex-col gap-1.5">
                      <p className="font-medium text-neutral-200 text-sm pr-4 line-clamp-1">{String(item['title'] || 'Unnamed Item')}</p>
                      <div className="flex flex-wrap gap-1">
                        {(item.hidden === true) && <span className="px-1.5 py-[2px] rounded text-[9px] uppercase tracking-wider font-mono font-bold bg-[#ff7700]/10 text-[#ff7700]">Hidden</span>}
                        {(item.hidden === false) && <span className="px-1.5 py-[2px] rounded text-[9px] uppercase tracking-wider font-mono font-bold bg-emerald-500/10 text-emerald-500">Visible</span>}
                        {item.featured && <span className="px-1.5 py-[2px] rounded text-[9px] uppercase tracking-wider font-mono font-bold bg-amber-400/10 text-amber-400">Featured</span>}
                        {item.draft && <span className="px-1.5 py-[2px] rounded text-[9px] uppercase tracking-wider font-mono font-bold bg-neutral-500/10 text-neutral-400">Draft</span>}
                        {item.draft === false && <span className="px-1.5 py-[2px] rounded text-[9px] uppercase tracking-wider font-mono font-bold bg-blue-500/10 text-blue-400">Published</span>}
                      </div>
                    </div>

                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => toggleFeature(item)} className={`p-1.5 rounded transition-colors ${item.featured ? 'text-amber-400 hover:bg-amber-400/10' : 'text-neutral-500 hover:text-white hover:bg-[#222]'}`} title="Toggle Feature"><Star className="w-4 h-4" /></button>
                      <button onClick={() => toggleVisibility(item)} className="p-1.5 text-neutral-500 hover:text-white hover:bg-[#222] rounded transition-colors" title="Toggle Visibility">{item.hidden === true ? <EyeOff className="w-4 h-4 text-neutral-600" /> : <Eye className="w-4 h-4" />}</button>
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-neutral-500 hover:text-white hover:bg-[#222] rounded transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id || item.persona)} className="p-1.5 text-red-500/70 hover:text-red-500 hover:bg-[#222] rounded transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-sm text-neutral-500 italic">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isEditing && (
        <div className="mt-12 border-t border-[#1a1a1a] pt-12">
          {Object.keys(errors).length > 0 && isEditing && (
            <ValidationSummary errors={errors} title="Invalid Book Entry" />
          )}

          {dbError && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs rounded-md">
              ⚠️ {dbError}
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium tracking-tight text-neutral-100">
              {editingId ? 'Edit Item' : 'New Item'}
            </h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-[#111111] text-neutral-300 hover:bg-[#1a1a1a] border border-[#222]"
              >
                Cancel
              </button>
              <div className="flex flex-col items-end gap-1">
                <button 
                  onClick={handleSave}
                  disabled={!isValid}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    isValid 
                      ? 'bg-white text-black hover:bg-neutral-200 cursor-pointer' 
                      : 'bg-neutral-800 text-neutral-500 opacity-50 cursor-not-allowed border border-[#222]'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                {!isValid && (
                  <span className="text-[10px] text-neutral-500 font-mono">Complete required fields to save.</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-6 bg-[#111111] p-6 rounded-lg border border-[#1a1a1a]">
            
              <div>
                <FormLabel label="Title" required />
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  className={`w-full bg-[#161616] border rounded-md px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-neutral-500 ${
                    !formData.title?.trim() ? 'border-rose-500/60 focus:border-rose-500' : 'border-[#222]'
                  }`} 
                />
                <InlineError message={!formData.title?.trim() ? 'Title is required.' : undefined} />
              </div>
              <div>
                <FormLabel label="Author" required />
                <input 
                  type="text" 
                  value={formData.author || ''} 
                  onChange={(e) => setFormData({...formData, author: e.target.value})} 
                  className={`w-full bg-[#161616] border rounded-md px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-neutral-500 ${
                    !formData.author?.trim() ? 'border-rose-500/60 focus:border-rose-500' : 'border-[#222]'
                  }`} 
                />
                <InlineError message={!formData.author?.trim() ? 'Author is required.' : undefined} />
              </div>
              <div>
                <FormLabel label="Cover Image URL" />
                <input type="text" value={formData.coverImage || ''} onChange={(e) => setFormData({...formData, coverImage: e.target.value})} className="w-full bg-[#161616] border border-[#222] rounded-md px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-neutral-500" />
              </div>
              <div>
                <FormLabel label="Category" />
                <input type="text" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-[#161616] border border-[#222] rounded-md px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-neutral-500" />
              </div>
              <div>
                <FormLabel label="Status" />
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-[#161616] border border-[#222] rounded-md px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-neutral-500">
                  <option value="reading">reading</option>
                  <option value="finished">finished</option>
                  <option value="paused">paused</option>
                  <option value="wishlist">wishlist</option>
                </select>
              </div>
              <div>
                <FormLabel label="Notes" />
                <textarea value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full h-32 bg-[#161616] border border-[#222] rounded-md px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-neutral-500 resize-none"></textarea>
              </div>
              <div>
                <FormLabel label="Featured" />
                <div className="flex items-center gap-2"><input type="checkbox" checked={formData.featured || false} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="bg-[#161616] border-[#222] rounded" /></div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
