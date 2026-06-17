import { Post } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class PostSupabaseRepository implements IRepository<Post> {
  async getAll(): Promise<Post[]> {
    const { data, error } = await (supabaseServer as any).from('posts').select('*');
    if (error) throw error;
    return data as any as Post[];
  }

  async getById(id: string): Promise<Post | null> {
    const { data, error } = await (supabaseServer as any).from('posts').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return data as any as Post;
  }

  async create(data: Omit<Post, 'id'>): Promise<Post | null> {
    const { data: result, error } = await (supabaseServer as any).from('posts').insert(data as any).select().single();
    if (error) throw error;
    return result as any as Post;
  }

  async update(id: string, data: Partial<Post>): Promise<Post | null> {
    const { data: result, error } = await (supabaseServer as any).from('posts').update(data as any).eq('id', id).select().single();
    if (error) throw error;
    return result as any as Post;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('posts').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
