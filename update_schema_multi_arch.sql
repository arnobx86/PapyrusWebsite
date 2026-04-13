-- Update app_versions table to support architecture-specific APKs
ALTER TABLE app_versions ADD COLUMN IF NOT EXISTS apk_url_arm TEXT;
ALTER TABLE app_versions ADD COLUMN IF NOT EXISTS apk_url_arm64 TEXT;
ALTER TABLE app_versions ADD COLUMN IF NOT EXISTS apk_url_x86 TEXT;

-- Update the activity logs policy if needed
DROP POLICY IF EXISTS "Allow anon read activity" ON activity_logs;
CREATE POLICY "Allow anon read activity" ON activity_logs 
FOR SELECT TO anon USING (true);
