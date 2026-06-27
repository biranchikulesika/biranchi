-- FILE: storage.sql
-- PURPOSE: Creates the storage buckets and their RLS policies.

-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('media', 'media', true),
('post-images', 'post-images', true),
('cover-images', 'cover-images', true),
('persona-assets', 'persona-assets', true),
('profile-assets', 'profile-assets', true),
('newsletter-assets', 'newsletter-assets', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for Objects
-- Enable RLS on objects (it should be enabled by default in Supabase, but just to be sure)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public to read objects
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') );

-- Allow authenticated admins to insert/update/delete objects
CREATE POLICY "Admin Upload Access" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') );
CREATE POLICY "Admin Update Access" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') );
CREATE POLICY "Admin Delete Access" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') );

-- End of storage.sql
