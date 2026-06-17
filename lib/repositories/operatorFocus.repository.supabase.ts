import { OperatorFocus } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

export class OperatorFocusSupabaseRepository implements IRepository<OperatorFocus> {
  private mapToDB(data: Partial<OperatorFocus>): any {
    const dbObj: any = {};
    if ((data as any).area !== undefined) dbObj.title = (data as any).area;
    if (data.label !== undefined) dbObj.title = data.label;

    if ((data as any).description !== undefined) dbObj.description = (data as any).description;

    if (data.value !== undefined) dbObj.status = data.value.toString();

    // The table does not have 'hidden' or 'order', it has 'priority' and 'status'
    if (data.order !== undefined) dbObj.priority = data.order;
    return dbObj;
  }

  private mapToEntity(dbData: any): OperatorFocus {
    return {
      id: dbData.id,
      label: dbData.title || '',
      area: dbData.title || '', // UI mapping
      description: dbData.description || '', // UI mapping
      value: dbData.status || '',
      order: dbData.priority || 0,
      hidden: dbData.status === 'hidden',
      createdAt: dbData.created_at,
      updatedAt: dbData.updated_at,
    } as any;
  }

  async getAll(): Promise<OperatorFocus[]> {
    const { data, error } = await (supabaseServer as any).from('operator_focuses').select('*');
    if (error) throw error;
    return (data || []).map(this.mapToEntity);
  }

  async getById(id: string): Promise<OperatorFocus | null> {
    const { data, error } = await (supabaseServer as any).from('operator_focuses').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return this.mapToEntity(data);
  }

  async create(data: Omit<OperatorFocus, 'id'>): Promise<OperatorFocus | null> {
    const { data: result, error } = await (supabaseServer as any).from('operator_focuses').insert(this.mapToDB(data)).select().single();
    if (error) throw error;
    return this.mapToEntity(result);
  }

  async update(id: string, data: Partial<OperatorFocus>): Promise<OperatorFocus | null> {
    const { data: result, error } = await (supabaseServer as any).from('operator_focuses').update(this.mapToDB(data)).eq('id', id).select().single();
    if (error) throw error;
    return this.mapToEntity(result);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('operator_focuses').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}
