-- migration-2026-06-fix-post-editor.sql
-- PURPOSE: Relax constraints on the `posts` table to allow auto-saving incomplete drafts.
-- These fields should only be validated during the transition to "published" status.

ALTER TABLE "public"."posts" ALTER COLUMN "title" DROP NOT NULL;
ALTER TABLE "public"."posts" ALTER COLUMN "slug" DROP NOT NULL;
ALTER TABLE "public"."posts" ALTER COLUMN "content" DROP NOT NULL;
ALTER TABLE "public"."posts" ALTER COLUMN "persona" DROP NOT NULL;
