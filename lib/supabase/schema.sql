-- SUPABASE SCHEMA GENERATION (FROZEN)

-- ==========================================
-- 1. EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. TABLES (unchanged from your original)
-- ==========================================
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  persona TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  "coverImageUrl" TEXT,
  "coverImageAlt" TEXT,
  "coverImageCaption" TEXT,
  "coverImageLocation" TEXT,
  "coverImageCredit" TEXT,
  "autoCoverImage" BOOLEAN DEFAULT false NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  "readingTime" INTEGER,
  "publishedAt" TIMESTAMPTZ,
  featured BOOLEAN DEFAULT false NOT NULL,
  hidden BOOLEAN DEFAULT false NOT NULL,
  draft BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE field_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  "publishedAt" TIMESTAMPTZ,
  featured BOOLEAN DEFAULT false NOT NULL,
  hidden BOOLEAN DEFAULT false NOT NULL,
  draft BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  hidden BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE thought_fragments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL,
  "publishedAt" TIMESTAMPTZ,
  hidden BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE journal_moments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  "timeLabel" TEXT NOT NULL,
  hidden BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE fragments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quote TEXT NOT NULL,
  source TEXT NOT NULL,
  hidden BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE books (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  "coverImage" TEXT,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('reading', 'finished', 'paused', 'wishlist')),
  notes TEXT,
  featured BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE builder_statuses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "operationalState" TEXT NOT NULL,
  "statusText" TEXT NOT NULL,
  "currentFocus" TEXT NOT NULL,
  "lastUpdated" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE active_systems (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  stack TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  "order" INTEGER NOT NULL,
  hidden BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE build_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('manual', 'automated')),
  "aiGenerated" BOOLEAN DEFAULT false NOT NULL,
  "generatedAt" TIMESTAMPTZ,
  "generationModel" TEXT,
  "relatedCommits" TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  "relatedRepositories" TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  hidden BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE operator_focuses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  hidden BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE redistribution_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  amount NUMERIC NOT NULL,
  destination TEXT NOT NULL,
  description TEXT NOT NULL,
  "proofUrl" TEXT,
  "internalNotes" TEXT,
  "donatedAt" TIMESTAMPTZ NOT NULL,
  "transactionReference" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE newsletter_issues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  persona TEXT NOT NULL,
  title TEXT NOT NULL,
  subject TEXT,
  "previewText" TEXT,
  content TEXT NOT NULL,
  "publishedAt" TIMESTAMPTZ,
  hidden BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE newsletter_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  persona TEXT NOT NULL,
  description TEXT NOT NULL,
  "frequencyText" TEXT NOT NULL,
  "philosophyText" TEXT NOT NULL,
  "expectationItems" TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  "isVerified" BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "subscriberId" UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
  persona TEXT NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE("subscriberId", persona)
);

-- ==========================================
-- 3. INDEXES
-- ==========================================

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_persona ON posts(persona);
CREATE INDEX idx_field_notes_category ON field_notes(category);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_build_logs_date ON build_logs(date);
CREATE INDEX idx_newsletter_issues_persona ON newsletter_issues(persona);
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscriptions_subscriber_persona ON subscriptions("subscriberId", persona);

-- ==========================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE thought_fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fragments ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE builder_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_focuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE redistribution_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Helper function for Admin access (Supports Google Auth & Email/Password inherently)
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.jwt() ->> 'email' IN ('biranchikulesika@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Post Policies
CREATE POLICY "Public can view published and not hidden posts" ON posts FOR SELECT USING (draft = false AND hidden = false AND "publishedAt" <= now());
CREATE POLICY "Admins have full access to posts" ON posts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Field Note Policies
CREATE POLICY "Public can view published and not hidden field notes" ON field_notes FOR SELECT USING (draft = false AND hidden = false AND "publishedAt" <= now());
CREATE POLICY "Admins have full access to field notes" ON field_notes FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Thought Fragment Policies
CREATE POLICY "Public can view published and not hidden thought fragments" ON thought_fragments FOR SELECT USING (hidden = false AND "publishedAt" <= now());
CREATE POLICY "Admins have full access to thought fragments" ON thought_fragments FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Newsletter Issues Policies
CREATE POLICY "Public can view published and not hidden newsletter issues" ON newsletter_issues FOR SELECT USING (hidden = false AND "publishedAt" <= now());
CREATE POLICY "Admins have full access to newsletter issues" ON newsletter_issues FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Generally Public Readable (excluding hidden ones where applicable)
CREATE POLICY "Public can view active question" ON questions FOR SELECT USING (hidden = false);
CREATE POLICY "Public can view active journal moments" ON journal_moments FOR SELECT USING (hidden = false);
CREATE POLICY "Public can view active fragments" ON fragments FOR SELECT USING (hidden = false);
CREATE POLICY "Public can view active books" ON books FOR SELECT USING (true);
CREATE POLICY "Public can view builder statuses" ON builder_statuses FOR SELECT USING (true);
CREATE POLICY "Public can view active systems" ON active_systems FOR SELECT USING (hidden = false);
CREATE POLICY "Public can view active build logs" ON build_logs FOR SELECT USING (hidden = false);
CREATE POLICY "Public can view operator focuses" ON operator_focuses FOR SELECT USING (hidden = false);
CREATE POLICY "Public can view redistribution records" ON redistribution_records FOR SELECT USING (true);
CREATE POLICY "Public can view newsletter profiles" ON newsletter_profiles FOR SELECT USING (true);

-- Admin catch-all
CREATE POLICY "Admins full access to questions" ON questions FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins full access to journal_moments" ON journal_moments FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins full access to fragments" ON fragments FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins full access to books" ON books FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins full access to builder_statuses" ON builder_statuses FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins full access to active_systems" ON active_systems FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins full access to build_logs" ON build_logs FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins full access to operator_focuses" ON operator_focuses FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins full access to redistribution_records" ON redistribution_records FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins full access to newsletter_profiles" ON newsletter_profiles FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins full access to subscribers" ON subscribers FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins full access to subscriptions" ON subscriptions FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Subscriber self-management
CREATE POLICY "Subscribers can insert themselves" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Subscribers can insert subscriptions" ON subscriptions FOR INSERT WITH CHECK (true);

-- ==========================================
-- 5. STORAGE BUCKETS SETUP
-- ==========================================

-- Create public buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('posts', 'posts', true),
  ('books', 'books', true),
  ('fund', 'fund', true),
  ('shared', 'shared', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Bucket Policies
CREATE POLICY "Public Access to posts bucket" ON storage.objects FOR SELECT USING (bucket_id = 'posts');
CREATE POLICY "Admin Access to posts bucket" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'posts' AND public.is_admin()) WITH CHECK (bucket_id = 'posts' AND public.is_admin());

CREATE POLICY "Public Access to books bucket" ON storage.objects FOR SELECT USING (bucket_id = 'books');
CREATE POLICY "Admin Access to books bucket" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'books' AND public.is_admin()) WITH CHECK (bucket_id = 'books' AND public.is_admin());

CREATE POLICY "Public Access to fund bucket" ON storage.objects FOR SELECT USING (bucket_id = 'fund');
CREATE POLICY "Admin Access to fund bucket" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'fund' AND public.is_admin()) WITH CHECK (bucket_id = 'fund' AND public.is_admin());

CREATE POLICY "Public Access to shared bucket" ON storage.objects FOR SELECT USING (bucket_id = 'shared');
CREATE POLICY "Admin Access to shared bucket" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'shared' AND public.is_admin()) WITH CHECK (bucket_id = 'shared' AND public.is_admin());