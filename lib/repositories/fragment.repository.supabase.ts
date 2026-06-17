import { Fragment } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class FragmentSupabaseRepository implements IRepository<Fragment> {
  async getAll(): Promise<Fragment[]> {
    const { data, error } = await (supabaseServer as any).from('fragments').select('*');
    if (error) throw error;
    return data as any as Fragment[];
  }

  async getById(id: string): Promise<Fragment | null> {
    const { data, error } = await (supabaseServer as any).from('fragments').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return data as any as Fragment;
  }

  async create(data: Omit<Fragment, 'id'>): Promise<Fragment | null> {
    const { data: result, error } = await (supabaseServer as any).from('fragments').insert(data as any).select().single();
    if (error) throw error;
    return result as any as Fragment;
  }

  async update(id: string, data: Partial<Fragment>): Promise<Fragment | null> {
    const { data: result, error } = await (supabaseServer as any).from('fragments').update(data as any).eq('id', id).select().single();
    if (error) throw error;
    return result as any as Fragment;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('fragments').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
