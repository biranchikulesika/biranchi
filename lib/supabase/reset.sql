-- ==========================================
-- SUPABASE RESET SCRIPT (DISPOSABLE DATABASE STATE)
-- ==========================================

-- 1. DELETE STORAGE OBJECTS AND BUCKETS SECURELY
-- Delete all object metadata references in specific buckets
DELETE FROM storage.objects 
WHERE bucket_id IN ('posts', 'books', 'fund', 'shared');

-- Delete the custom storage buckets
DELETE FROM storage.buckets 
WHERE id IN ('posts', 'books', 'fund', 'shared');

-- 2. DROP APPLICATION VIEWS (IF ANY)
-- (No custom views exist, but we cascade drop tables which automatically handles dependent objects)

-- 3. DROP APPLICATION TABLES (CASCADE AUTOMATICALLY REMOVES FOREIGN KEYS, INDEXES, AND POLICIES)
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

-- 4. DROP CUSTOM FUNCTIONS & DEPENDENTS
DROP FUNCTION IF EXISTS is_admin() CASCADE;

-- 5. ENSURE CLEAN SYSTEM STATE FOR RE-CREATION
-- The system is now reset and ready to fully run schema.sql from scratch.
