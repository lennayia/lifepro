// ============================================
// LIFEPRO - TypeScript Database Types
// Typy pro celou databázi
// ============================================

export type TimePeriod = 'present' | 'past' | 'future'

export type QuestionType =
  | 'text'           // krátký text
  | 'textarea'       // dlouhý text
  | 'checkbox'       // vícenásobný výběr
  | 'radio'          // jeden výběr
  | 'select'         // dropdown
  | 'multiselect'    // multi dropdown
  | 'slider'         // 1-10
  | 'rating'         // hvězdičky
  | 'date'           // datum
  | 'mindmap'        // vizuální mapa (custom component)

// ============================================
// 1. STRUKTURA OBSAHU
// ============================================

export interface Category {
  id: string
  slug: string
  title: string
  description: string | null
  icon: string | null
  time_period: TimePeriod | null
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  category_id: string
  slug: string
  title: string
  description: string | null
  order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  section_id: string
  slug: string
  question_text: string
  help_text: string | null
  question_type: QuestionType
  order: number
  is_required: boolean
  is_favorite_allowed: boolean
  max_favorites: number | null
  validation_rules: Record<string, any> | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface QuestionOption {
  id: string
  question_id: string
  value: string
  label: string
  icon: string | null
  order: number
  is_active: boolean
  created_at: string
}

// ============================================
// 2. UŽIVATELSKÉ ODPOVĚDI
// ============================================

export interface UserResponse {
  id: string
  user_id: string
  question_id: string

  // Flexibilní odpovědi
  answer_text: string | null
  answer_single: string | null
  answer_multiple: string[] | null
  answer_number: number | null
  answer_date: string | null
  answer_json: Record<string, any> | null

  is_favorite: boolean
  notes: string | null

  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  category_id: string
  section_id: string | null

  total_questions: number
  answered_questions: number
  completion_percentage: number

  last_visited_at: string
  updated_at: string
}

// ============================================
// 3. AI ANALÝZA & VÝSLEDKY
// ============================================

export interface AIPattern {
  values: string[]
  skills: string[]
  interests: string[]
  motivations: string[]
}

export interface AISuggestion {
  title: string
  description: string
  confidence: number
  reasoning: string[]
  next_steps: string[]
}

export interface AIBlindSpot {
  observation: string
  suggestion: string
}

export interface AIConnection {
  theme: string
  related_answers: string[]
  insight: string
}

export interface AIAnalysis {
  id: string
  user_id: string
  patterns: AIPattern
  suggestions: AISuggestion[]
  blind_spots: AIBlindSpot[]
  connections: AIConnection[]
  generated_at: string
}

export interface UserExport {
  id: string
  user_id: string
  export_type: 'pdf' | 'json' | 'mindmap'
  file_url: string
  created_at: string
}

// ============================================
// 4. ADMIN & SYSTÉM
// ============================================

export type AdminRole = 'super_admin' | 'editor'

export interface AdminUser {
  id: string
  user_id: string
  role: AdminRole
  permissions: string[]
  created_at: string
}

export type AuditAction = 'create' | 'update' | 'delete'
export type AuditEntityType = 'category' | 'section' | 'question' | 'option'

export interface AuditLog {
  id: string
  admin_id: string
  action: AuditAction
  entity_type: AuditEntityType
  entity_id: string
  changes: Record<string, any>
  created_at: string
}

// ============================================
// 5. ROZŠÍŘENÉ TYPY (s relacemi)
// ============================================

export interface CategoryWithSections extends Category {
  sections: Section[]
}

export interface SectionWithQuestions extends Section {
  questions: Question[]
  category?: Category
}

export interface QuestionWithOptions extends Question {
  options: QuestionOption[]
  section?: Section
}

export interface UserResponseWithQuestion extends UserResponse {
  question: Question
}

// ============================================
// 6. FORMULÁŘOVÉ TYPY
// ============================================

export interface CreateCategoryInput {
  slug: string
  title: string
  description?: string
  icon?: string
  time_period?: TimePeriod
  order?: number
  is_published?: boolean
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string
}

export interface CreateSectionInput {
  category_id: string
  slug: string
  title: string
  description?: string
  order?: number
  is_published?: boolean
}

export interface UpdateSectionInput extends Partial<CreateSectionInput> {
  id: string
}

export interface CreateQuestionInput {
  section_id: string
  slug: string
  question_text: string
  help_text?: string
  question_type: QuestionType
  order?: number
  is_required?: boolean
  is_favorite_allowed?: boolean
  max_favorites?: number
  validation_rules?: Record<string, any>
  is_published?: boolean
}

export interface UpdateQuestionInput extends Partial<CreateQuestionInput> {
  id: string
}

export interface CreateQuestionOptionInput {
  question_id: string
  value: string
  label: string
  icon?: string
  order?: number
  is_active?: boolean
}

export interface UpdateQuestionOptionInput extends Partial<CreateQuestionOptionInput> {
  id: string
}

export interface CreateUserResponseInput {
  question_id: string
  answer_text?: string
  answer_single?: string
  answer_multiple?: string[]
  answer_number?: number
  answer_date?: string
  answer_json?: Record<string, any>
  is_favorite?: boolean
  notes?: string
}

export interface UpdateUserResponseInput extends Partial<CreateUserResponseInput> {
  id: string
}

// ============================================
// 7. STATISTIKY & DASHBOARD
// ============================================

export interface AdminDashboardStats {
  total_users: number
  active_today: number
  total_categories: number
  total_sections: number
  total_questions: number
  total_options: number
  total_responses: number
  avg_completion: number
}

export interface CategoryStats {
  category_id: string
  category_name: string
  total_questions: number
  total_responses: number
  completion_rate: number
  avg_time_spent: number
}

// ============================================
// 8. SUPABASE SPECIFIC
// ============================================

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>
      }
      sections: {
        Row: Section
        Insert: Omit<Section, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Section, 'id' | 'created_at' | 'updated_at'>>
      }
      questions: {
        Row: Question
        Insert: Omit<Question, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Question, 'id' | 'created_at' | 'updated_at'>>
      }
      question_options: {
        Row: QuestionOption
        Insert: Omit<QuestionOption, 'id' | 'created_at'>
        Update: Partial<Omit<QuestionOption, 'id' | 'created_at'>>
      }
      user_responses: {
        Row: UserResponse
        Insert: Omit<UserResponse, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserResponse, 'id' | 'created_at' | 'updated_at'>>
      }
      user_progress: {
        Row: UserProgress
        Insert: Omit<UserProgress, 'id' | 'last_visited_at' | 'updated_at'>
        Update: Partial<Omit<UserProgress, 'id' | 'last_visited_at' | 'updated_at'>>
      }
      ai_analyses: {
        Row: AIAnalysis
        Insert: Omit<AIAnalysis, 'id' | 'generated_at'>
        Update: Partial<Omit<AIAnalysis, 'id' | 'generated_at'>>
      }
      user_exports: {
        Row: UserExport
        Insert: Omit<UserExport, 'id' | 'created_at'>
        Update: Partial<Omit<UserExport, 'id' | 'created_at'>>
      }
      admin_users: {
        Row: AdminUser
        Insert: Omit<AdminUser, 'id' | 'created_at'>
        Update: Partial<Omit<AdminUser, 'id' | 'created_at'>>
      }
      audit_logs: {
        Row: AuditLog
        Insert: Omit<AuditLog, 'id' | 'created_at'>
        Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>
      }
    }
  }
}
