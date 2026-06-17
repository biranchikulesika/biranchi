-- Migration: Update slug unique constraint from global to per-persona
-- Drop the existing unique constraint on "slug"
ALTER TABLE "public"."posts" DROP CONSTRAINT IF EXISTS posts_slug_key;

-- Add a multi-column unique constraint on (persona, slug)
-- Using NULLS NOT DISTINCT ensures null personas are still distinguished properly 
-- though it's typically fine to just use UNIQUE(persona, slug) if we are on PG 15+
-- Since Supabase uses PG15, UNIQUE NULLS NOT DISTINCT is good.
ALTER TABLE "public"."posts" ADD CONSTRAINT posts_persona_slug_key UNIQUE NULLS NOT DISTINCT ("persona", "slug");
