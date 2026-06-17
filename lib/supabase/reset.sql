-- ==========================================
-- SUPABASE RESET SCRIPT (DISPOSABLE DATABASE STATE)
-- ==========================================

-- NOTE: This script intentionally DOES NOT touch the `auth` schema.
-- Admin users, passwords, and Google OAuth identities in `auth.users` 
-- will remain perfectly intact across database resets.

-- 1. DELETE STORAGE OBJECTS AND BUCKETS SECURELY
-- Delete all object metadata references in specific buckets
DELETE FROM storage.objects 
WHERE bucket_id IN ('posts', 'books', 'fund', 'shared');

-- Delete the custom storage buckets
DELETE FROM storage.buckets 
WHERE id IN ('posts', 'books', 'fund', 'shared');

-- Drop storage policies to ensure a totally clean slate for schema.sql
DROP POLICY IF EXISTS "Public Access to posts bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin Access to posts bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to books bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin Access to books bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to fund bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin Access to fund bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to shared bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin Access to shared bucket" ON storage.objects;

-- 2. DROP APPLICATION TABLES (CASCADE AUTOMATICALLY REMOVES FOREIGN KEYS, INDEXES, AND POLICIES)
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS subscribers CASCADE;
DROP TABLE IF EXISTS newsletter_profiles CASCADE;
DROP TABLE IF EXISTS newsletter_issues CASCADE;
DROP TABLE IF EXISTS redistribution_records CASCADE;
DROP TABLE IF EXISTS operator_focuses CASCADE;
DROP TABLE IF EXISTS build_logs CASCADE;
DROP TABLE IF EXISTS active_systems CASCADE;
DROP TABLE IF EXISTS builder_statuses CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS fragments CASCADE;
DROP TABLE IF EXISTS journal_moments CASCADE;
DROP TABLE IF EXISTS thought_fragments CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS field_notes CASCADE;
DROP TABLE IF EXISTS posts CASCADE;

-- 3. DROP CUSTOM FUNCTIONS
DROP FUNCTION IF EXISTS is_admin() CASCADE;

-- 4. ENSURE CLEAN SYSTEM STATE FOR RE-CREATION
-- The system is now reset and ready to fully run schema.sql from scratch.