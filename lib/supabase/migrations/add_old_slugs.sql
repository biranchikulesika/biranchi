-- Migration script to add old_slugs array column to posts table
ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "old_slugs" TEXT[] DEFAULT '{}';
