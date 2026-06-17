-- FILE: schema.sql
-- PURPOSE: Creates the entire database schema from scratch.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE "public"."post_status" AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."newsletter_status" AS ENUM ('draft', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."book_status" AS ENUM ('to-read', 'reading', 'read');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "public"."persona_type" AS ENUM ('builder', 'operator', 'thinker', 'wanderer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. FUNCTIONS
CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. TABLES & AUTOMATION TRIGGERS

-- ACTIVE SYSTEMS
CREATE TABLE IF NOT EXISTS "public"."active_systems" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_active_systems_updated_at ON "public"."active_systems";
CREATE TRIGGER update_active_systems_updated_at BEFORE UPDATE ON "public"."active_systems" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- BOOKS
CREATE TABLE IF NOT EXISTS "public"."books" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "cover_image" TEXT,
    "link" TEXT,
    "status" book_status NOT NULL DEFAULT 'to-read',
    "rating" INTEGER CHECK (rating >= 1 AND rating <= 5),
    "review" TEXT,
    "date_finished" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_books_updated_at ON "public"."books";
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON "public"."books" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_books_status ON "public"."books"("status");

-- BUILD LOGS
CREATE TABLE IF NOT EXISTS "public"."build_logs" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "system_id" UUID REFERENCES "public"."active_systems"("id") ON DELETE SET NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_build_logs_updated_at ON "public"."build_logs";
CREATE TRIGGER update_build_logs_updated_at BEFORE UPDATE ON "public"."build_logs" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_build_logs_system ON "public"."build_logs"("system_id");

-- BUILDER STATUS
CREATE TABLE IF NOT EXISTS "public"."builder_status" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "current_focus" TEXT NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_builder_status_updated_at ON "public"."builder_status";
CREATE TRIGGER update_builder_status_updated_at BEFORE UPDATE ON "public"."builder_status" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- FIELD NOTES
CREATE TABLE IF NOT EXISTS "public"."field_notes" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "location" TEXT,
    "date" TIMESTAMPTZ DEFAULT NOW(),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_field_notes_updated_at ON "public"."field_notes";
CREATE TRIGGER update_field_notes_updated_at BEFORE UPDATE ON "public"."field_notes" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- FRAGMENTS
CREATE TABLE IF NOT EXISTS "public"."fragments" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "content" TEXT NOT NULL,
    "type" TEXT,
    "tags" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_fragments_updated_at ON "public"."fragments";
CREATE TRIGGER update_fragments_updated_at BEFORE UPDATE ON "public"."fragments" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- THOUGHT FRAGMENTS
CREATE TABLE IF NOT EXISTS "public"."thought_fragments" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "content" TEXT NOT NULL,
    "source" TEXT,
    "tags" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_thought_fragments_updated_at ON "public"."thought_fragments";
CREATE TRIGGER update_thought_fragments_updated_at BEFORE UPDATE ON "public"."thought_fragments" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- JOURNAL MOMENTS
CREATE TABLE IF NOT EXISTS "public"."journal_moments" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "content" TEXT NOT NULL,
    "mood" TEXT,
    "date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_journal_moments_updated_at ON "public"."journal_moments";
CREATE TRIGGER update_journal_moments_updated_at BEFORE UPDATE ON "public"."journal_moments" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- NEWSLETTER PROFILES
CREATE TABLE IF NOT EXISTS "public"."newsletter_profiles" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "from_email" TEXT,
    "from_name" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_newsletter_profiles_updated_at ON "public"."newsletter_profiles";
CREATE TRIGGER update_newsletter_profiles_updated_at BEFORE UPDATE ON "public"."newsletter_profiles" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- NEWSLETTER ISSUES
CREATE TABLE IF NOT EXISTS "public"."newsletter_issues" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "profile_id" UUID REFERENCES "public"."newsletter_profiles"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "content" TEXT NOT NULL,
    "status" newsletter_status NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_newsletter_issues_updated_at ON "public"."newsletter_issues";
CREATE TRIGGER update_newsletter_issues_updated_at BEFORE UPDATE ON "public"."newsletter_issues" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_nl_issues_profile ON "public"."newsletter_issues"("profile_id");
CREATE INDEX IF NOT EXISTS idx_nl_issues_status ON "public"."newsletter_issues"("status");

-- SUBSCRIBERS
CREATE TABLE IF NOT EXISTS "public"."subscribers" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" TEXT UNIQUE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_subscribers_updated_at ON "public"."subscribers";
CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON "public"."subscribers" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "subscriber_id" UUID NOT NULL REFERENCES "public"."subscribers"("id") ON DELETE CASCADE,
    "profile_id" UUID NOT NULL REFERENCES "public"."newsletter_profiles"("id") ON DELETE CASCADE,
    "status" TEXT NOT NULL DEFAULT 'subscribed',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE("subscriber_id", "profile_id")
);
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON "public"."subscriptions";
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON "public"."subscriptions" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- OPERATOR FOCUSES
CREATE TABLE IF NOT EXISTS "public"."operator_focuses" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in-progress',
    "priority" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_operator_focuses_updated_at ON "public"."operator_focuses";
CREATE TRIGGER update_operator_focuses_updated_at BEFORE UPDATE ON "public"."operator_focuses" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- POSTS
CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT,
    "subtitle" TEXT,
    "byline" TEXT,
    "slug" TEXT,
    "content" TEXT,
    "excerpt" TEXT,
    "cover_image_url" TEXT,
    "cover_image_alt" TEXT,
    "cover_image_caption" TEXT,
    "cover_image_location" TEXT,
    "cover_image_credit" TEXT,
    "auto_cover_image" BOOLEAN DEFAULT true,
    "status" post_status NOT NULL DEFAULT 'draft',
    "persona" TEXT,
    "reading_time" INTEGER,
    "featured" BOOLEAN DEFAULT false,
    "hidden" BOOLEAN DEFAULT false,
    "published_at" TIMESTAMPTZ,
    "tags" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE NULLS NOT DISTINCT ("persona", "slug")
);
DROP TRIGGER IF EXISTS update_posts_updated_at ON "public"."posts";
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX IF NOT EXISTS idx_posts_status on "public"."posts"("status");
CREATE INDEX IF NOT EXISTS idx_posts_persona on "public"."posts"("persona");

-- QUESTIONS
CREATE TABLE IF NOT EXISTS "public"."questions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_questions_updated_at ON "public"."questions";
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON "public"."questions" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- REDISTRIBUTION RECORDS
CREATE TABLE IF NOT EXISTS "public"."redistribution_records" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "amount" DECIMAL(12,2) NOT NULL,
    "recipient" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DROP TRIGGER IF EXISTS update_redistribution_records_updated_at ON "public"."redistribution_records";
CREATE TRIGGER update_redistribution_records_updated_at BEFORE UPDATE ON "public"."redistribution_records" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- 5. ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
ALTER TABLE "public"."active_systems" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."books" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."build_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."builder_status" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."field_notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."fragments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."thought_fragments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."journal_moments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."newsletter_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."newsletter_issues" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."subscribers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."operator_focuses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."questions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."redistribution_records" ENABLE ROW LEVEL SECURITY;

-- Clear previous policies to enforce idempotency
DO $$ 
DECLARE
    row RECORD;
BEGIN
    FOR row IN SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON "public".%I', row.policyname, row.tablename);
    END LOOP;
END $$;

-- Admin full access across all tables
DO $$
DECLARE
    t_name text;
BEGIN
    FOR t_name IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('CREATE POLICY "Admin full access" ON "public".%I FOR ALL USING (auth.role() = ''authenticated'');', t_name);
    END LOOP;
END $$;

-- Public read access policies for published or public data
CREATE POLICY "Public read active systems" ON "public"."active_systems" FOR SELECT USING (status = 'active');
CREATE POLICY "Public read books" ON "public"."books" FOR SELECT USING (true);
CREATE POLICY "Public read build logs" ON "public"."build_logs" FOR SELECT USING (true);
CREATE POLICY "Public read builder status" ON "public"."builder_status" FOR SELECT USING (true);
CREATE POLICY "Public read field notes" ON "public"."field_notes" FOR SELECT USING (true);
CREATE POLICY "Public read fragments" ON "public"."fragments" FOR SELECT USING (true);
CREATE POLICY "Public read thought fragments" ON "public"."thought_fragments" FOR SELECT USING (true);
CREATE POLICY "Public read journal moments" ON "public"."journal_moments" FOR SELECT USING (true);
CREATE POLICY "Public read newsletter profiles" ON "public"."newsletter_profiles" FOR SELECT USING (true);
CREATE POLICY "Public read published newsletter issues" ON "public"."newsletter_issues" FOR SELECT USING (status = 'published');
CREATE POLICY "Public read operator focuses" ON "public"."operator_focuses" FOR SELECT USING (true);
CREATE POLICY "Public read published posts" ON "public"."posts" FOR SELECT USING (status = 'published');
CREATE POLICY "Public read questions" ON "public"."questions" FOR SELECT USING (true);
CREATE POLICY "Public read redistribution records" ON "public"."redistribution_records" FOR SELECT USING (true);

-- Allow public to insert into subscriber tables
CREATE POLICY "Public can subscribe" ON "public"."subscribers" FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can manage own subscription" ON "public"."subscriptions" FOR ALL USING (true);

-- Validation Note:
-- SELECT * FROM "public"."posts" LIMIT 1;
-- Queries shouldn't fail and should respect RLS.
