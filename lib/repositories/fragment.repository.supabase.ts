import { Fragment } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class FragmentSupabaseRepository implements IRepository<Fragment> {
  private mapToDB(data: Partial<Fragment>): any {
    const dbObj: any = {};
    if (data.quote !== undefined) dbObj.quote = data.quote;
    if (data.source !== undefined) dbObj.source = data.source;
    if (data.title !== undefined) dbObj.title = data.title;
    if (data.body !== undefined) {
       dbObj.body = data.body;
       if (data.quote === undefined) {
         dbObj.quote = data.body; // Fallback to avoid NOT NULL constraint
       }
    }
    return dbObj;
  }

  private mapToEntity(dbData: any): Fragment {
    return {
      id: dbData.id,
      quote: dbData.quote || '',
      source: dbData.source || '',
      title: dbData.title || '',
      body: dbData.body || '',
      hidden: false,
      createdAt: dbData.created_at,
      updatedAt: dbData.updated_at,
    };
  }

  async getAll(): Promise<Fragment[]> {
    const { data, error } = await (supabaseServer as any).from('fragments').select('*');
    if (error) throw error;
    return (data || []).map(this.mapToEntity);
  }

  async getById(id: string): Promise<Fragment | null> {
    const { data, error } = await (supabaseServer as any).from('fragments').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async create(data: Omit<Fragment, 'id'>): Promise<Fragment | null> {
    const { data: result, error } = await (supabaseServer as any).from('fragments').insert(this.mapToDB(data)).select().single();
    if (error) throw error;
    return this.mapToEntity(result);
  }

  async update(id: string, data: Partial<Fragment>): Promise<Fragment | null> {
    const { data: result, error } = await (supabaseServer as any).from('fragments').update(this.mapToDB(data)).eq('id', id).select().single();
    if (error) throw error;
    return this.mapToEntity(result);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('fragments').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
