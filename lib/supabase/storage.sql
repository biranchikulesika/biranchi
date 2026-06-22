-- FILE: storage.sql
-- PURPOSE: Create and configure Supabase Storage buckets and policies.

-- 1. BUCKETS
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('media', 'media', true),
    ('post-images', 'post-images', true),
    ('cover-images', 'cover-images', true),
    ('persona-assets', 'persona-assets', true),
    ('profile-assets', 'profile-assets', true),
    ('newsletter-assets', 'newsletter-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS POLICIES FOR STORAGE
-- Clear existing policies to maintain idempotency
DROP POLICY IF EXISTS "Public Read Access All" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access All" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Access All" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Access All" ON storage.objects;

-- Allow public to view any object in these public buckets
CREATE POLICY "Public Read Access All"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') );

-- Allow public insert access for development/admin UI (restricted to authenticated)
CREATE POLICY "Public Insert Access All"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') AND auth.role() = 'authenticated' );

-- Allow public update access (restricted to authenticated)
CREATE POLICY "Public Update Access All"
ON storage.objects FOR UPDATE
USING ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') AND auth.role() = 'authenticated' );

-- Allow public delete access (restricted to authenticated)
CREATE POLICY "Public Delete Access All"
ON storage.objects FOR DELETE
USING ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') AND auth.role() = 'authenticated' );
