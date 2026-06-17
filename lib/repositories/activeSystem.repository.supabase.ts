import { ActiveSystem } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class ActiveSystemSupabaseRepository implements IRepository<ActiveSystem> {
  async getAll(): Promise<ActiveSystem[]> {
    const { data, error } = await (supabaseServer as any).from('active_systems').select('*');
    if (error) throw error;
    return data as any as ActiveSystem[];
  }

  async getById(id: string): Promise<ActiveSystem | null> {
    const { data, error } = await (supabaseServer as any).from('active_systems').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return data as any as ActiveSystem;
  }

  async create(data: Omit<ActiveSystem, 'id'>): Promise<ActiveSystem | null> {
    const { data: result, error } = await (supabaseServer as any).from('active_systems').insert(data as any).select().single();
    if (error) throw error;
    return result as any as ActiveSystem;
  }

  async update(id: string, data: Partial<ActiveSystem>): Promise<ActiveSystem | null> {
    const { data: result, error } = await (supabaseServer as any).from('active_systems').update(data as any).eq('id', id).select().single();
    if (error) throw error;
    return result as any as ActiveSystem;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('active_systems').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
