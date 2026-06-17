import { supabaseClient } from '@/lib/supabase/client';

export type StorageBucket = 'posts' | 'books' | 'fund' | 'shared';

export interface UploadOptions {
  bucket: StorageBucket;
  file: File;
}

export async function uploadImage({ bucket, file }: UploadOptions) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed.');
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 10MB limit.');
  }

  const ext = file.name.split('.').pop() || 'tmp';
  const uuid = crypto.randomUUID();
  const path = `${uuid}.${ext}`;

  const { data, error } = await supabaseClient.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload Error:', error);
    throw new Error('Failed to upload image. ' + error.message);
  }

  const { data: { publicUrl } } = supabaseClient.storage.from(bucket).getPublicUrl(path);

  return { publicUrl, path };
}

export async function deleteImage(bucket: StorageBucket, path: string) {
  const { error } = await supabaseClient.storage.from(bucket).remove([path]);
  if (error) {
    console.error('Delete Error:', error);
    throw new Error('Failed to delete image.');
  }
}

export async function getRecentUploads(bucket: StorageBucket, limit: number = 10) {
  const { data, error } = await supabaseClient.storage.from(bucket).list('', {
    limit,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc' }
  });

  if (error) {
    console.error('List Error:', error);
    return [];
  }

  return data
    .filter(file => file.name !== '.emptyFolderPlaceholder')
    .map(file => {
      const { data: { publicUrl } } = supabaseClient.storage.from(bucket).getPublicUrl(file.name);
      return {
        name: file.name,
        created_at: file.created_at,
        publicUrl,
        path: file.name
      };
    });
}
