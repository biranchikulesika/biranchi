import { OperatorFocus } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class OperatorFocusSupabaseRepository implements IRepository<OperatorFocus> {
  async getAll(): Promise<OperatorFocus[]> {
    const { data, error } = await (supabaseServer as any).from('operator_focuses').select('*');
    if (error) throw error;
    return data as any as OperatorFocus[];
  }

  async getById(id: string): Promise<OperatorFocus | null> {
    const { data, error } = await (supabaseServer as any).from('operator_focuses').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return data as any as OperatorFocus;
  }

  async create(data: Omit<OperatorFocus, 'id'>): Promise<OperatorFocus | null> {
    const { data: result, error } = await (supabaseServer as any).from('operator_focuses').insert(data as any).select().single();
    if (error) throw error;
    return result as any as OperatorFocus;
  }

  async update(id: string, data: Partial<OperatorFocus>): Promise<OperatorFocus | null> {
    const { data: result, error } = await (supabaseServer as any).from('operator_focuses').update(data as any).eq('id', id).select().single();
    if (error) throw error;
    return result as any as OperatorFocus;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('operator_focuses').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
