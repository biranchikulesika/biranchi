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
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Full Access to Storage" ON storage.objects;

-- Allow public to view any object in these public buckets
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') );

-- Allow authenticated admins to full control over these buckets (Insert, Update, Delete, Select)
CREATE POLICY "Admin Full Access to Storage"
ON storage.objects FOR ALL
USING ( auth.role() = 'authenticated' );
