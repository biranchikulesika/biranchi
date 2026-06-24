-- 1. Create a custom immutable function to convert the text array to a string
CREATE OR REPLACE FUNCTION immutable_array_to_string(arr text[], sep text DEFAULT ' ')
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
    SELECT array_to_string(arr, sep);
$$;

-- 2. Create the posts table
CREATE TABLE IF NOT EXISTS posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text,
    excerpt text,
    tags text[],
    content text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    
    -- 3. Embed the GENERATED column for Full-Text Search
    fts tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english'::regconfig, coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english'::regconfig, coalesce(excerpt, '')), 'B') ||
        setweight(to_tsvector('english'::regconfig, coalesce(immutable_array_to_string(tags, ' '), '')), 'B') ||
        setweight(to_tsvector('english'::regconfig, coalesce(content, '')), 'C')
    ) STORED
);

-- 4. Create the GIN index for fast text search
CREATE INDEX IF NOT EXISTS posts_fts_idx ON posts USING GIN (fts);
