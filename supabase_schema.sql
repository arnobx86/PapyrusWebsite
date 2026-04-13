-- Create app_versions table
CREATE TABLE IF NOT EXISTS app_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version_number TEXT NOT NULL,
    apk_url TEXT NOT NULL,
    update_type TEXT NOT NULL CHECK (update_type IN ('soft', 'force')),
    release_notes TEXT,
    is_latest BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Policy to allow anyone to read latest versions
ALTER TABLE app_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read latest" ON app_versions FOR SELECT USING (true);

-- Function to handle marking only one version as latest
CREATE OR REPLACE FUNCTION set_latest_version()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_latest THEN
        UPDATE app_versions SET is_latest = false WHERE id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_latest_version
BEFORE INSERT OR UPDATE ON app_versions
FOR EACH ROW EXECUTE FUNCTION set_latest_version();
