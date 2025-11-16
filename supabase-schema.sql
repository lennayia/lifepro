-- ============================================
-- LIFEPRO DATABASE SCHEMA
-- Kompletní schéma pro Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. STRUKTURA OBSAHU (Admin spravuje)
-- ============================================

-- Kategorie (hlavní sekce jako "Já jsem", "Umím")
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji nebo icon name
  time_period TEXT CHECK (time_period IN ('present', 'past', 'future')),
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sekce (podsekce v kategorii)
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Otázky
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  question_text TEXT NOT NULL,
  help_text TEXT,
  question_type TEXT NOT NULL CHECK (question_type IN (
    'text', 'textarea', 'checkbox', 'radio', 'select',
    'multiselect', 'slider', 'rating', 'date', 'mindmap'
  )),
  "order" INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  is_favorite_allowed BOOLEAN DEFAULT true,
  max_favorites INTEGER DEFAULT 3,
  validation_rules JSONB,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_id, slug)
);

-- Možnosti odpovědí (pro checkbox, radio, select)
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT, -- emoji nebo icon
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. UŽIVATELSKÉ ODPOVĚDI
-- ============================================

-- Odpovědi uživatelů
CREATE TABLE user_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,

  -- Flexibilní odpovědi podle typu
  answer_text TEXT,
  answer_single TEXT, -- option_id pro radio/select
  answer_multiple TEXT[], -- option_ids pro checkbox/multiselect
  answer_number DECIMAL,
  answer_date DATE,
  answer_json JSONB,

  is_favorite BOOLEAN DEFAULT false,
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, question_id)
);

-- Progress uživatele
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,

  total_questions INTEGER DEFAULT 0,
  answered_questions INTEGER DEFAULT 0,
  completion_percentage DECIMAL DEFAULT 0,

  last_visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, category_id, section_id)
);

-- ============================================
-- 3. AI ANALÝZA & VÝSLEDKY
-- ============================================

-- AI analýza výsledků
CREATE TABLE ai_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  patterns JSONB, -- {values: [], skills: [], interests: [], motivations: []}
  suggestions JSONB, -- Array of suggestion objects
  blind_spots JSONB, -- Array of blind spot objects
  connections JSONB, -- Array of connection objects

  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exporty uživatelů
CREATE TABLE user_exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type TEXT CHECK (export_type IN ('pdf', 'json', 'mindmap')),
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. ADMIN & SYSTÉM
-- ============================================

-- Admin uživatelé
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('super_admin', 'editor')),
  permissions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Audit log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT CHECK (action IN ('create', 'update', 'delete')),
  entity_type TEXT CHECK (entity_type IN ('category', 'section', 'question', 'option')),
  entity_id UUID,
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. INDEXY PRO VÝKON
-- ============================================

CREATE INDEX idx_sections_category ON sections(category_id);
CREATE INDEX idx_questions_section ON questions(section_id);
CREATE INDEX idx_options_question ON question_options(question_id);
CREATE INDEX idx_responses_user ON user_responses(user_id);
CREATE INDEX idx_responses_question ON user_responses(question_id);
CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_analyses_user ON ai_analyses(user_id);

-- ============================================
-- 6. FUNKCE PRO AUTOMATICKÉ AKTUALIZACE
-- ============================================

-- Funkce pro aktualizaci updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggery pro updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_responses_updated_at BEFORE UPDATE ON user_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies pro čtení obsahu (všichni vidí publikované)
CREATE POLICY "Everyone can view published categories"
  ON categories FOR SELECT
  USING (is_published = true);

CREATE POLICY "Everyone can view published sections"
  ON sections FOR SELECT
  USING (is_published = true);

CREATE POLICY "Everyone can view published questions"
  ON questions FOR SELECT
  USING (is_published = true);

CREATE POLICY "Everyone can view active options"
  ON question_options FOR SELECT
  USING (is_active = true);

-- Policies pro uživatelské odpovědi (jen vlastní data)
CREATE POLICY "Users can view own responses"
  ON user_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own responses"
  ON user_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own responses"
  ON user_responses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own responses"
  ON user_responses FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pro progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies pro AI analýzy
CREATE POLICY "Users can view own analyses"
  ON ai_analyses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON ai_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies pro exporty
CREATE POLICY "Users can view own exports"
  ON user_exports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own exports"
  ON user_exports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin policies (plný přístup pro adminy)
CREATE POLICY "Admins can do everything with categories"
  ON categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can do everything with sections"
  ON sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can do everything with questions"
  ON questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can do everything with options"
  ON question_options FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Admins můžou vidět všechny odpovědi (pro statistiky)
CREATE POLICY "Admins can view all responses"
  ON user_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- 8. POČÁTEČNÍ DATA (příklad)
-- ============================================

-- Příklad kategorie
INSERT INTO categories (slug, title, description, icon, time_period, "order") VALUES
  ('ja-jsem', 'Já jsem', 'Kdo jsem v současnosti - role, sebepojetí, priority', '🎭', 'present', 1),
  ('umim', 'Umím', 'Co umím dobře - dovednosti, kompetence, talenty', '💪', 'present', 2),
  ('vim', 'Vím', 'Moje vzdělání, zkušenosti, certifikace', '🎓', 'present', 3),
  ('mam-rada', 'Mám rád/a', 'Co mě zajímá, baví, těší', '❤️', 'present', 4),
  ('bavilo-me', 'Bavilo mě', 'Co jsem měl/a rád/a v minulosti', '👶', 'past', 5),
  ('chtel-jsem', 'Chtěl/a jsem', 'Moje sny a přání z minulosti', '🌟', 'past', 6),
  ('chci', 'Chci', 'Moje představy o budoucnosti', '🚀', 'future', 7),
  ('muzu', 'Můžu', 'Moje možnosti a příležitosti', '💡', 'future', 8);

-- Příklad sekce
INSERT INTO sections (category_id, slug, title, description, "order")
SELECT id, 'role', 'Role v životě', 'Jaké role v životě hrajete?', 1
FROM categories WHERE slug = 'ja-jsem';

-- Příklad otázky
INSERT INTO questions (section_id, slug, question_text, help_text, question_type, "order", is_favorite_allowed, max_favorites)
SELECT id, 'momentalne-jsem', 'Momentálně jsem a pracuji jako...', 'Např: na mateřské, OSVČ, zaměstnanec, student...', 'checkbox', 1, true, 3
FROM sections WHERE slug = 'role';

-- Příklady možností
INSERT INTO question_options (question_id, value, label, "order")
SELECT id, 'materska', 'na mateřské', 1 FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'osvc', 'OSVČ', 2 FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'zamestnanec', 'zaměstnanec', 3 FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'student', 'student/ka', 4 FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'pracak', 'na pracáku', 5 FROM questions WHERE slug = 'momentalne-jsem'
UNION ALL
SELECT id, 'brigada', 'na brigádě', 6 FROM questions WHERE slug = 'momentalne-jsem';
