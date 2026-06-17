import { ThoughtFragment } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class ThoughtFragmentSupabaseRepository implements IRepository<ThoughtFragment> {
  async getAll(): Promise<ThoughtFragment[]> {
    const { data, error } = await (supabaseServer as any).from('thought_fragments').select('*');
    if (error) throw error;
    return data as any as ThoughtFragment[];
  }

  async getById(id: string): Promise<ThoughtFragment | null> {
    const { data, error } = await (supabaseServer as any).from('thought_fragments').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return data as any as ThoughtFragment;
  }

  async create(data: Omit<ThoughtFragment, 'id'>): Promise<ThoughtFragment | null> {
    const { data: result, error } = await (supabaseServer as any).from('thought_fragments').insert(data as any).select().single();
    if (error) throw error;
    return result as any as ThoughtFragment;
  }

  async update(id: string, data: Partial<ThoughtFragment>): Promise<ThoughtFragment | null> {
    const { data: result, error } = await (supabaseServer as any).from('thought_fragments').update(data as any).eq('id', id).select().single();
    if (error) throw error;
    return result as any as ThoughtFragment;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('thought_fragments').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
