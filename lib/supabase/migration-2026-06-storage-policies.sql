-- storage-migration.sql

-- Insert buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('media', 'media', true),
    ('post-images', 'post-images', true),
    ('cover-images', 'cover-images', true),
    ('persona-assets', 'persona-assets', true),
    ('profile-assets', 'profile-assets', true),
    ('newsletter-assets', 'newsletter-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public Read Access All"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') );

-- Allow public insert access for development/admin UI (or authenticated if auth is configured, but this allows anon)
CREATE POLICY "Public Insert Access All"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') );

-- Allow public update access
CREATE POLICY "Public Update Access All"
ON storage.objects FOR UPDATE
USING ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') );

-- Allow public delete access
CREATE POLICY "Public Delete Access All"
ON storage.objects FOR DELETE
USING ( bucket_id IN ('media', 'post-images', 'cover-images', 'persona-assets', 'profile-assets', 'newsletter-assets') );
