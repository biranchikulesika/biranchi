import { BuilderStatus } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class BuilderStatusSupabaseRepository implements IRepository<BuilderStatus> {
  async getAll(): Promise<BuilderStatus[]> {
    const { data, error } = await (supabaseServer as any).from('builder_statuses').select('*');
    if (error) throw error;
    return data as any as BuilderStatus[];
  }

  async getById(id: string): Promise<BuilderStatus | null> {
    const { data, error } = await (supabaseServer as any).from('builder_statuses').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return data as any as BuilderStatus;
  }

  async create(data: Omit<BuilderStatus, 'id'>): Promise<BuilderStatus | null> {
    const { data: result, error } = await (supabaseServer as any).from('builder_statuses').insert(data as any).select().single();
    if (error) throw error;
    return result as any as BuilderStatus;
  }

  async update(id: string, data: Partial<BuilderStatus>): Promise<BuilderStatus | null> {
    const { data: result, error } = await (supabaseServer as any).from('builder_statuses').update(data as any).eq('id', id).select().single();
    if (error) throw error;
    return result as any as BuilderStatus;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('builder_statuses').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
