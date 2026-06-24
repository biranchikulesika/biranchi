-- 1. Create a custom immutable function to convert the text array to a string
CREATE OR REPLACE FUNCTION immutable_array_to_string(arr text[], sep text DEFAULT ' ')
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT array_to_string(arr, sep);
$$;

-- 2. Add the fts column to the posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS fts tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english'::regconfig, coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english'::regconfig, coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(immutable_array_to_string(tags, ' '), '')), 'B') ||
    setweight(to_tsvector('english'::regconfig, coalesce(content, '')), 'C')
) STORED;

-- 3. Create a GIN index on the fts column for fast searching
CREATE INDEX IF NOT EXISTS posts_fts_idx ON posts USING GIN (fts);
