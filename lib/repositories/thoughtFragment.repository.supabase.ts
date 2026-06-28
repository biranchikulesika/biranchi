import { ThoughtFragment } from '../types';
import { IRepository } from './registry';
import { getSupabaseServerClient } from '../supabase/server';

export class ThoughtFragmentSupabaseRepository implements IRepository<ThoughtFragment> {
  private mapToDB(data: Partial<ThoughtFragment>): any {
    const dbObj: any = {};
    if (data.content !== undefined || data.text !== undefined) dbObj.content = data.content || data.text;
    // We don't have publishedAt or hidden or title in the DB, so we'll just ignore them or map them if needed
    // The DB only has id, content, source, tags, created_at, updated_at
    if (data.publishedAt !== undefined) dbObj.created_at = data.publishedAt; // Best effort to store date
    return dbObj;
  }

  private mapToEntity(dbData: any): ThoughtFragment {
    return {
      id: dbData.id,
      text: dbData.content || '',
      content: dbData.content || '',
      title: '',
      publishedAt: dbData.created_at,
      hidden: false,
      createdAt: dbData.created_at,
      updatedAt: dbData.updated_at,
    };
  }

  async getAll(): Promise<ThoughtFragment[]> {
    const { data, error } = await ((await getSupabaseServerClient()) as any).from('thought_fragments').select('*');
    if (error) throw error;
    return (data || []).map(this.mapToEntity);
  }

  async getById(id: string): Promise<ThoughtFragment | null> {
    const { data, error } = await ((await getSupabaseServerClient()) as any).from('thought_fragments').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async create(data: Omit<ThoughtFragment, 'id'>): Promise<ThoughtFragment | null> {
    const { data: result, error } = await ((await getSupabaseServerClient()) as any).from('thought_fragments').insert(this.mapToDB(data)).select().single();
    if (error) throw error;
    return this.mapToEntity(result);
  }

  async update(id: string, data: Partial<ThoughtFragment>): Promise<ThoughtFragment | null> {
    const { data: result, error } = await ((await getSupabaseServerClient()) as any).from('thought_fragments').update(this.mapToDB(data)).eq('id', id).select().single();
    if (error) throw error;
    return this.mapToEntity(result);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await ((await getSupabaseServerClient()) as any).from('thought_fragments').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
