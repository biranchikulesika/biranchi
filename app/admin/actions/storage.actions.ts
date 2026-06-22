'use server';

import { verifyAuth } from '@/lib/auth/verify';

export async function uploadImageServerAction(formData: FormData) {
  const file = formData.get('file') as File | null;
  const bucket = formData.get('bucket') as string;

  if (!file || !bucket) {
    throw new Error('File and bucket are required');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed.');
  }

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error('File size exceeds 10MB limit.');
  }

  const { supabase } = await verifyAuth();

  const ext = file.name.split('.').pop() || 'tmp';
  const uuid = crypto.randomUUID();
  const path = `${uuid}.${ext}`;

  // Use the verified supabase client which has the user's context/auth
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload Error:', error);
    throw new Error('Failed to upload image. ' + error.message);
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);

  return { publicUrl, path };
}

export async function deleteImageServerAction(bucket: string, path: string) {
  const { supabase } = await verifyAuth();
  
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error('Delete Error:', error);
    throw new Error('Failed to delete image.');
  }
}
