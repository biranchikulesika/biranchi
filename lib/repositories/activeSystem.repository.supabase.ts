import { ActiveSystem } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class ActiveSystemSupabaseRepository implements IRepository<ActiveSystem> {
  private mapToDB(data: Partial<ActiveSystem>): any {
    const dbObj: any = {};
    if ((data as any).name !== undefined) dbObj.name = (data as any).name;
    if (data.title !== undefined) dbObj.name = data.title;
    
    if (data.description !== undefined) dbObj.description = data.description;
    
    if (data.status !== undefined) dbObj.status = data.status;
    if ((data as any).level !== undefined) dbObj.status = (data as any).level;
    return dbObj;
  }

  private mapToEntity(dbData: any): ActiveSystem {
    return {
      id: dbData.id,
      title: dbData.name || '',
      name: dbData.name || '', // UI support
      description: dbData.description || '',
      status: dbData.status || '',
      level: dbData.status || '', // UI support
      stack: [],
      updatedAt: dbData.updated_at,
      order: 0,
      hidden: dbData.status === 'hidden',
      createdAt: dbData.created_at,
    } as any;
  }

  async getAll(): Promise<ActiveSystem[]> {
    const { data, error } = await (supabaseServer as any).from('active_systems').select('*');
    if (error) throw error;
    return (data || []).map(this.mapToEntity);
  }

  async getById(id: string): Promise<ActiveSystem | null> {
    const { data, error } = await (supabaseServer as any).from('active_systems').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async create(data: Omit<ActiveSystem, 'id'>): Promise<ActiveSystem | null> {
    const { data: result, error } = await (supabaseServer as any).from('active_systems').insert(this.mapToDB(data)).select().single();
    if (error) throw error;
    return this.mapToEntity(result);
  }

  async update(id: string, data: Partial<ActiveSystem>): Promise<ActiveSystem | null> {
    const { data: result, error } = await (supabaseServer as any).from('active_systems').update(this.mapToDB(data)).eq('id', id).select().single();
    if (error) throw error;
    return this.mapToEntity(result);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('active_systems').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
