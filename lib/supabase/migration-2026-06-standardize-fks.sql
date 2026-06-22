-- migration-2026-06-standardize-fks.sql
-- PURPOSE: Standardize referential integrity across the system. Update build_logs to CASCADE instead of SET NULL.

ALTER TABLE "public"."build_logs" DROP CONSTRAINT IF EXISTS build_logs_system_id_fkey;

ALTER TABLE "public"."build_logs" 
  ADD CONSTRAINT build_logs_system_id_fkey 
  FOREIGN KEY ("system_id") REFERENCES "public"."active_systems"("id") ON DELETE CASCADE;

-- If there are any other implied FKs, they should be added here.
