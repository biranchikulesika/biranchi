import { Question } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class QuestionSupabaseRepository implements IRepository<Question> {
  async getAll(): Promise<Question[]> {
    const { data, error } = await (supabaseServer as any).from('questions').select('*');
    if (error) throw error;
    return data as any as Question[];
  }

  async getById(id: string): Promise<Question | null> {
    const { data, error } = await (supabaseServer as any).from('questions').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return data as any as Question;
  }

  async create(data: Omit<Question, 'id'>): Promise<Question | null> {
    const { data: result, error } = await (supabaseServer as any).from('questions').insert(data as any).select().single();
    if (error) throw error;
    return result as any as Question;
  }

  async update(id: string, data: Partial<Question>): Promise<Question | null> {
    const { data: result, error } = await (supabaseServer as any).from('questions').update(data as any).eq('id', id).select().single();
    if (error) throw error;
    return result as any as Question;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('questions').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
