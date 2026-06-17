-- migration-2026-06-add-post-fields.sql
-- PURPOSE: Add missing fields to posts table, aligning DB schema with frontend requirements.

ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "subtitle" TEXT;
ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "byline" TEXT;
ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "cover_image_url" TEXT;
ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "cover_image_alt" TEXT;
ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "cover_image_caption" TEXT;
ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "cover_image_location" TEXT;
ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "cover_image_credit" TEXT;
ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "auto_cover_image" BOOLEAN DEFAULT true;
ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "reading_time" INTEGER;
ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "featured" BOOLEAN DEFAULT false;
ALTER TABLE "public"."posts" ADD COLUMN IF NOT EXISTS "hidden" BOOLEAN DEFAULT false;

-- Note: The frontend sends 'draft' as boolean, but we use the "status" enum.
-- We will handle the conversion in the application layer or just use 'status' natively.

-- Note: The frontend might send empty string for persona. We'll alter the persona enum column
-- to be just TEXT to prevent enum casting errors on drafts without persona.
ALTER TABLE "public"."posts" ALTER COLUMN "persona" TYPE TEXT USING persona::TEXT;
DROP TYPE IF EXISTS "public"."persona_type" CASCADE;
