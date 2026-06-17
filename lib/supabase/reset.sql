-- FILE: reset.sql
-- PURPOSE: Completely remove database schema for clean slate.

-- Drop all tables (Cascade handles foreign keys and views)
DROP TABLE IF EXISTS "public"."subscriptions" CASCADE;
DROP TABLE IF EXISTS "public"."subscribers" CASCADE;
DROP TABLE IF EXISTS "public"."redistribution_records" CASCADE;
DROP TABLE IF EXISTS "public"."questions" CASCADE;
DROP TABLE IF EXISTS "public"."posts" CASCADE;
DROP TABLE IF EXISTS "public"."operator_focuses" CASCADE;
DROP TABLE IF EXISTS "public"."newsletter_profiles" CASCADE;
DROP TABLE IF EXISTS "public"."newsletter_issues" CASCADE;
DROP TABLE IF EXISTS "public"."journal_moments" CASCADE;
DROP TABLE IF EXISTS "public"."thought_fragments" CASCADE;
DROP TABLE IF EXISTS "public"."fragments" CASCADE;
DROP TABLE IF EXISTS "public"."field_notes" CASCADE;
DROP TABLE IF EXISTS "public"."builder_status" CASCADE;
DROP TABLE IF EXISTS "public"."build_logs" CASCADE;
DROP TABLE IF EXISTS "public"."books" CASCADE;
DROP TABLE IF EXISTS "public"."active_systems" CASCADE;

-- Drop Enums
DROP TYPE IF EXISTS "public"."post_status" CASCADE;
DROP TYPE IF EXISTS "public"."newsletter_status" CASCADE;
DROP TYPE IF EXISTS "public"."book_status" CASCADE;
DROP TYPE IF EXISTS "public"."persona_type" CASCADE;

-- Drop Functions
DROP FUNCTION IF EXISTS "public"."update_updated_at_column" CASCADE;
DROP FUNCTION IF EXISTS "public"."generate_unique_slug" CASCADE;
