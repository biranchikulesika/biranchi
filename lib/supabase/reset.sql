-- Drop all tables to reset the database
DROP TABLE IF EXISTS posts CASCADE;
DROP FUNCTION IF EXISTS immutable_array_to_string CASCADE;

-- Note: You would normally run schema.sql and storage.sql after this.
