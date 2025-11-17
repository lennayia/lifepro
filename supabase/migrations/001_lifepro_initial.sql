-- ============================================
-- LIFEPRO Database Migration
-- Prefix: lifepro_
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. STRUKTURA OBSAHU
-- ============================================

-- Categories (hlavní kategorie dotazníku)
CREATE TABLE lifepro_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  time_period TEXT CHECK (time_period IN ('present', 'past', 'future')),
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sections (sekce v rámci kategorie)
CREATE TABLE lifepro_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES lifepro_categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Questions (otázky v rámci sekce)
CREATE TABLE lifepro_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES lifepro_sections(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  question_text TEXT NOT NULL,
  help_text TEXT,
  question_type TEXT NOT NULL CHECK (question_type IN (
    'text', 'textarea', 'checkbox', 'radio', 'select',
    'multiselect', 'slider', 'rating', 'date', 'mindmap'
  )),
  "order" INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT false,
  is_favorite_allowed BOOLEAN NOT NULL DEFAULT false,
  max_favorites INTEGER,
  validation_rules JSONB,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(section_id, slug)
);

-- Question Options (možnosti odpovědí pro select/radio/checkbox)
CREATE TABLE lifepro_question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES lifepro_questions(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. UŽIVATELSKÉ ODPOVĚDI
-- ============================================

-- User Responses (odpovědi uživatelů)
CREATE TABLE lifepro_user_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES lifepro_questions(id) ON DELETE CASCADE,

  -- Flexibilní odpovědi
  answer_text TEXT,
  answer_single TEXT,
  answer_multiple TEXT[],
  answer_number NUMERIC,
  answer_date DATE,
  answer_json JSONB,

  is_favorite BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, question_id)
);

-- User Progress (progres uživatele v kategoriích)
CREATE TABLE lifepro_user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES lifepro_categories(id) ON DELETE CASCADE,
  section_id UUID REFERENCES lifepro_sections(id) ON DELETE SET NULL,

  total_questions INTEGER NOT NULL DEFAULT 0,
  answered_questions INTEGER NOT NULL DEFAULT 0,
  completion_percentage NUMERIC NOT NULL DEFAULT 0,

  last_visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, category_id)
);

-- ============================================
-- 3. AI ANALÝZA & VÝSLEDKY
-- ============================================

-- AI Analyses (AI analýzy odpovědí uživatele)
CREATE TABLE lifepro_ai_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  patterns JSONB NOT NULL,
  suggestions JSONB NOT NULL,
  blind_spots JSONB NOT NULL,
  connections JSONB NOT NULL,

  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Exports (exporty PDF/JSON)
CREATE TABLE lifepro_user_exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  export_type TEXT NOT NULL CHECK (export_type IN ('pdf', 'json', 'mindmap')),
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 4. ADMIN & SYSTÉM
-- ============================================

-- Admin Users (správci systému)
CREATE TABLE lifepro_admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'editor')),
  permissions TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Logs (logy změn adminů)
CREATE TABLE lifepro_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES lifepro_admin_users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('category', 'section', 'question', 'option')),
  entity_id UUID NOT NULL,
  changes JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 5. INDEXY
-- ============================================

-- Categories
CREATE INDEX idx_lifepro_categories_published ON lifepro_categories(is_published);
CREATE INDEX idx_lifepro_categories_order ON lifepro_categories("order");

-- Sections
CREATE INDEX idx_lifepro_sections_category ON lifepro_sections(category_id);
CREATE INDEX idx_lifepro_sections_published ON lifepro_sections(is_published);

-- Questions
CREATE INDEX idx_lifepro_questions_section ON lifepro_questions(section_id);
CREATE INDEX idx_lifepro_questions_type ON lifepro_questions(question_type);
CREATE INDEX idx_lifepro_questions_published ON lifepro_questions(is_published);

-- Question Options
CREATE INDEX idx_lifepro_question_options_question ON lifepro_question_options(question_id);

-- User Responses
CREATE INDEX idx_lifepro_user_responses_user ON lifepro_user_responses(user_id);
CREATE INDEX idx_lifepro_user_responses_question ON lifepro_user_responses(question_id);
CREATE INDEX idx_lifepro_user_responses_favorite ON lifepro_user_responses(is_favorite) WHERE is_favorite = true;

-- User Progress
CREATE INDEX idx_lifepro_user_progress_user ON lifepro_user_progress(user_id);
CREATE INDEX idx_lifepro_user_progress_category ON lifepro_user_progress(category_id);

-- AI Analyses
CREATE INDEX idx_lifepro_ai_analyses_user ON lifepro_ai_analyses(user_id);
CREATE INDEX idx_lifepro_ai_analyses_generated ON lifepro_ai_analyses(generated_at);

-- User Exports
CREATE INDEX idx_lifepro_user_exports_user ON lifepro_user_exports(user_id);

-- Admin Users
CREATE INDEX idx_lifepro_admin_users_user ON lifepro_admin_users(user_id);

-- Audit Logs
CREATE INDEX idx_lifepro_audit_logs_admin ON lifepro_audit_logs(admin_id);
CREATE INDEX idx_lifepro_audit_logs_created ON lifepro_audit_logs(created_at);

-- ============================================
-- 6. FUNKCE - Updated_at trigger
-- ============================================

CREATE OR REPLACE FUNCTION lifepro_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplikovat trigger na všechny tabulky s updated_at
CREATE TRIGGER update_lifepro_categories_updated_at BEFORE UPDATE ON lifepro_categories
  FOR EACH ROW EXECUTE FUNCTION lifepro_update_updated_at_column();

CREATE TRIGGER update_lifepro_sections_updated_at BEFORE UPDATE ON lifepro_sections
  FOR EACH ROW EXECUTE FUNCTION lifepro_update_updated_at_column();

CREATE TRIGGER update_lifepro_questions_updated_at BEFORE UPDATE ON lifepro_questions
  FOR EACH ROW EXECUTE FUNCTION lifepro_update_updated_at_column();

CREATE TRIGGER update_lifepro_user_responses_updated_at BEFORE UPDATE ON lifepro_user_responses
  FOR EACH ROW EXECUTE FUNCTION lifepro_update_updated_at_column();

CREATE TRIGGER update_lifepro_user_progress_updated_at BEFORE UPDATE ON lifepro_user_progress
  FOR EACH ROW EXECUTE FUNCTION lifepro_update_updated_at_column();

-- ============================================
-- 7. RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE lifepro_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_user_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_audit_logs ENABLE ROW LEVEL SECURITY;

-- Categories - všichni mohou číst published
CREATE POLICY "Public can view published categories"
  ON lifepro_categories FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage all categories"
  ON lifepro_categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lifepro_admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Sections - všichni mohou číst published
CREATE POLICY "Public can view published sections"
  ON lifepro_sections FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage all sections"
  ON lifepro_sections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lifepro_admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Questions - všichni mohou číst published
CREATE POLICY "Public can view published questions"
  ON lifepro_questions FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage all questions"
  ON lifepro_questions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lifepro_admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Question Options - všichni mohou číst active
CREATE POLICY "Public can view active options"
  ON lifepro_question_options FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage all options"
  ON lifepro_question_options FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lifepro_admin_users
      WHERE user_id = auth.uid()
    )
  );

-- User Responses - uživatel vidí jen své
CREATE POLICY "Users can view their own responses"
  ON lifepro_user_responses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own responses"
  ON lifepro_user_responses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own responses"
  ON lifepro_user_responses FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all responses"
  ON lifepro_user_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lifepro_admin_users
      WHERE user_id = auth.uid()
    )
  );

-- User Progress - uživatel vidí jen svůj
CREATE POLICY "Users can view their own progress"
  ON lifepro_user_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress"
  ON lifepro_user_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
  ON lifepro_user_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- AI Analyses - uživatel vidí jen své
CREATE POLICY "Users can view their own analyses"
  ON lifepro_ai_analyses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert analyses"
  ON lifepro_ai_analyses FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Vložení přes service role

CREATE POLICY "Admins can view all analyses"
  ON lifepro_ai_analyses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lifepro_admin_users
      WHERE user_id = auth.uid()
    )
  );

-- User Exports - uživatel vidí jen své
CREATE POLICY "Users can view their own exports"
  ON lifepro_user_exports FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create exports"
  ON lifepro_user_exports FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admin Users - jen admini mohou číst
CREATE POLICY "Admins can view admin users"
  ON lifepro_admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lifepro_admin_users
      WHERE user_id = auth.uid()
    )
  );

-- Audit Logs - jen admini mohou číst
CREATE POLICY "Admins can view audit logs"
  ON lifepro_audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lifepro_admin_users
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert audit logs"
  ON lifepro_audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lifepro_admin_users
      WHERE user_id = auth.uid()
    )
  );
