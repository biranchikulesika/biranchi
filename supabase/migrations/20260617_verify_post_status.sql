-- Migration: Ensure post_status ENUM contains 'draft', 'published', 'archived'
-- The issue was traced to the TypeScript repository mapping layer in lib/repositories/post.repository.supabase.ts
-- The Database ENUM already supports 'published' correctly, so this is just an idempotent safety verification.

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
    CREATE TYPE "public"."post_status" AS ENUM ('draft', 'published', 'archived');
  END IF;
END $$;
