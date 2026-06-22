import { Post } from '../types';
import { IRepository } from './registry';
import { supabaseServer } from '../supabase/server';

function toDbFormat(data: Partial<Post>) {
  const result: any = {
    title: data.title,
    subtitle: data.subtitle,
    byline: data.byline,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt,
    persona: data.persona,
    cover_image_url: data.coverImageUrl,
    cover_image_alt: data.coverImageAlt,
    cover_image_caption: data.coverImageCaption,
    cover_image_location: data.coverImageLocation,
    cover_image_credit: data.coverImageCredit,
    auto_cover_image: data.autoCoverImage,
    reading_time: data.readingTime,
    featured: data.featured,
    hidden: data.hidden,
    tags: data.tags
  };

  if (data.status !== undefined) {
    result.status = data.status;
  }

  if (data.publishedAt !== undefined) {
    result.published_at = data.publishedAt;
  }

  return result;
}

function fromDbFormat(dbData: any): Post {
  if (!dbData) return dbData;
  return {
    id: dbData.id,
    title: dbData.title,
    subtitle: dbData.subtitle,
    byline: dbData.byline,
    slug: dbData.slug,
    content: dbData.content,
    excerpt: dbData.excerpt,
    status: dbData.status,
    persona: dbData.persona,
    coverImageUrl: dbData.cover_image_url,
    coverImageAlt: dbData.cover_image_alt,
    coverImageCaption: dbData.cover_image_caption,
    coverImageLocation: dbData.cover_image_location,
    coverImageCredit: dbData.cover_image_credit,
    autoCoverImage: dbData.auto_cover_image,
    readingTime: dbData.reading_time,
    featured: dbData.featured,
    hidden: dbData.hidden,
    publishedAt: dbData.published_at,
    tags: dbData.tags || [],
    createdAt: dbData.created_at,
    updatedAt: dbData.updated_at
  };
}

export class PostSupabaseRepository implements IRepository<Post> {
  async getAll(): Promise<Post[]> {
    const { data, error } = await (supabaseServer as any).from('posts').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(`Supabase Error [${error.code}]: ${error.message}`);
    return (data || []).map(fromDbFormat);
  }

  async getById(id: string): Promise<Post | null> {
    const { data, error } = await (supabaseServer as any).from('posts').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw new Error(`Supabase Error [${error.code}]: ${error.message}`);
    if (!data) return null;
    return fromDbFormat(data);
  }

  async create(data: Omit<Post, 'id'>): Promise<Post | null> {
    const payload = toDbFormat(data);
    const { data: result, error } = await (supabaseServer as any).from('posts').insert(payload).select().single();
    if (error) throw new Error(`Database Error on Create [${error.code}]: ${error.message}`);
    return fromDbFormat(result);
  }

  async update(id: string, data: Partial<Post>): Promise<Post | null> {
    const payload = toDbFormat(data);
    
    // Remove undefined values, leave nulls for deletion
    Object.keys(payload).forEach(key => {
      if ((payload as any)[key] === undefined) delete (payload as any)[key];
    });

    const { data: result, error } = await (supabaseServer as any).from('posts').update(payload).eq('id', id).select().single();
    if (error) throw new Error(`Database Error on Update [${error.code}]: ${error.message}`);
    return fromDbFormat(result);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await (supabaseServer as any).from('posts').delete().eq('id', id);
    if (error) throw new Error(`Database Error on Delete [${error.code}]: ${error.message}`);
    return true;
  }
}
