import { JournalMoment } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class JournalMomentSupabaseRepository implements IRepository<JournalMoment> {
  async getAll(): Promise<JournalMoment[]> {
    const { data, error } = await (supabaseServer as any).from('journal_moments').select('*');
    if (error) throw error;
    return data as any as JournalMoment[];
  }

  async getById(id: string): Promise<JournalMoment | null> {
    const { data, error } = await (supabaseServer as any).from('journal_moments').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return data as any as JournalMoment;
  }

  async create(data: Omit<JournalMoment, 'id'>): Promise<JournalMoment | null> {
    const { data: result, error } = await (supabaseServer as any).from('journal_moments').insert(data as any).select().single();
    if (error) throw error;
    return result as any as JournalMoment;
  }

  async update(id: string, data: Partial<JournalMoment>): Promise<JournalMoment | null> {
    const { data: result, error } = await (supabaseServer as any).from('journal_moments').update(data as any).eq('id', id).select().single();
    if (error) throw error;
    return result as any as JournalMoment;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('journal_moments').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
