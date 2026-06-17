import { BuildLog } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class BuildLogSupabaseRepository implements IRepository<BuildLog> {
  async getAll(): Promise<BuildLog[]> {
    const { data, error } = await (supabaseServer as any).from('build_logs').select('*');
    if (error) throw error;
    return data as any as BuildLog[];
  }

  async getById(id: string): Promise<BuildLog | null> {
    const { data, error } = await (supabaseServer as any).from('build_logs').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return data as any as BuildLog;
  }

  async create(data: Omit<BuildLog, 'id'>): Promise<BuildLog | null> {
    const { data: result, error } = await (supabaseServer as any).from('build_logs').insert(data as any).select().single();
    if (error) throw error;
    return result as any as BuildLog;
  }

  async update(id: string, data: Partial<BuildLog>): Promise<BuildLog | null> {
    const { data: result, error } = await (supabaseServer as any).from('build_logs').update(data as any).eq('id', id).select().single();
    if (error) throw error;
    return result as any as BuildLog;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('build_logs').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
