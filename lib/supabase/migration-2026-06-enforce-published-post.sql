-- migration-2026-06-enforce-published-post.sql
-- PURPOSE: Enforce that title, slug, content, and persona are NOT NULL when status = 'published'.

CREATE OR REPLACE FUNCTION validate_published_post()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.status = 'published' THEN
    IF NEW.title IS NULL OR trim(NEW.title) = '' THEN
      RAISE EXCEPTION 'title cannot be null or empty for a published post';
    END IF;
    IF NEW.slug IS NULL OR trim(NEW.slug) = '' THEN
      RAISE EXCEPTION 'slug cannot be null or empty for a published post';
    END IF;
    IF NEW.content IS NULL OR trim(NEW.content) = '' THEN
      RAISE EXCEPTION 'content cannot be null or empty for a published post';
    END IF;
    IF NEW.persona IS NULL OR trim(NEW.persona) = '' THEN
      RAISE EXCEPTION 'persona cannot be null or empty for a published post';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_published_post_constraints ON "public"."posts";
CREATE TRIGGER enforce_published_post_constraints
  BEFORE INSERT OR UPDATE ON "public"."posts"
  FOR EACH ROW EXECUTE FUNCTION validate_published_post();
