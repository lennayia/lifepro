-- Přidej sloupce pro hierarchii sekcí
-- Spusť v Supabase SQL Editor

ALTER TABLE lifepro.lifepro_sections
ADD COLUMN level INTEGER DEFAULT 0,
ADD COLUMN parent_slug TEXT;

-- Přidej index pro rychlejší dotazy
CREATE INDEX idx_sections_parent ON lifepro.lifepro_sections(parent_slug);
CREATE INDEX idx_sections_level ON lifepro.lifepro_sections(level);

-- Hotovo!
