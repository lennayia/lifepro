# ProApp - Zastřešující Modulární Platforma

> **Verze**: 1.0.0
> **Datum**: 17.11.2025
> **Účel**: Komplexní kontext pro Claude Code pro vývoj modulární platformy zastřešující všechny Pro aplikace

---

## 🎯 Vize a Poslání

**ProApp** je modulární mono-repository platforma, která integruje a zastřešuje celou rodinu profesionálních aplikací:

- **LifePro** - Nalezení životního poslání a osobnostní analýza
- **CoachPro** - Komplexní platforma pro koučování a mentoring
- **DigiPro** - Digitální marketing a social media management
- **PaymentsPro** - Platební systém a fakturace
- **Další moduly** - Připraveno na rozšíření

### Klíčové Principy

1. **Modulární architektura** - každá aplikace je samostatný modul
2. **Sdílené služby** - autentizace, platby, notifikace, AI
3. **Jednotný design system** - konzistentní UX napříč aplikacemi
4. **Centrální správa** - jeden dashboard pro všechny aplikace
5. **Flexibilní škálování** - možnost používat moduly samostatně nebo dohromady

---

## 🏗️ Architektura

### Struktura Mono-repository

```
proapp/
├── README.md
├── package.json                 # Root package (workspaces)
├── turbo.json                   # Turborepo config
├── tsconfig.json                # Base TypeScript config
├── .env.template                # Environment template
│
├── apps/                        # Aplikační moduly
│   ├── lifepro/                 # LifePro modul
│   │   ├── package.json
│   │   ├── next.config.js
│   │   └── src/
│   │       ├── app/             # Next.js App Router
│   │       ├── modules/         # Specifické moduly LifePro
│   │       └── shared/          # Lokální sdílené komponenty
│   │
│   ├── coachpro/                # CoachPro modul
│   │   ├── package.json
│   │   └── src/
│   │       ├── app/
│   │       ├── modules/
│   │       │   ├── sessions/    # Správa koučovacích sezení
│   │       │   ├── clients/     # CRM pro klienty
│   │       │   ├── calendar/    # Kalendář a plánování
│   │       │   ├── notes/       # Poznámky ze sezení
│   │       │   ├── progress/    # Tracking pokroku klientů
│   │       │   └── resources/   # Vzdělávací materiály
│   │       └── shared/
│   │
│   ├── digipro/                 # DigiPro modul
│   │   ├── package.json
│   │   └── src/
│   │       ├── app/
│   │       ├── modules/
│   │       │   ├── campaigns/   # Marketingové kampaně
│   │       │   ├── content/     # Content management
│   │       │   ├── analytics/   # Analytics a reporting
│   │       │   ├── social/      # Social media management
│   │       │   ├── ads/         # Správa reklam
│   │       │   └── automation/  # Marketing automation
│   │       └── shared/
│   │
│   ├── paymentspro/             # PaymentsPro modul
│   │   ├── package.json
│   │   └── src/
│   │       ├── app/
│   │       ├── modules/
│   │       │   ├── invoices/    # Fakturace
│   │       │   ├── payments/    # Platební brána
│   │       │   ├── subscriptions/ # Předplatné
│   │       │   ├── accounting/  # Účetnictví
│   │       │   └── reports/     # Finanční reporty
│   │       └── shared/
│   │
│   └── dashboard/               # Centrální dashboard
│       ├── package.json
│       └── src/
│           ├── app/
│           │   ├── (auth)/      # Přihlášení
│           │   ├── (dashboard)/ # Hlavní dashboard
│           │   └── (settings)/  # Globální nastavení
│           └── modules/
│               ├── navigation/  # Cross-app navigace
│               ├── notifications/ # Notifikační centrum
│               └── billing/     # Správa předplatného
│
├── packages/                    # Sdílené balíčky
│   ├── ui/                      # Design System
│   │   ├── package.json
│   │   └── src/
│   │       ├── components/      # React komponenty
│   │       │   ├── atoms/       # Základní elementy
│   │       │   ├── molecules/   # Složené komponenty
│   │       │   └── organisms/   # Komplexní komponenty
│   │       ├── theme/           # Téma a styly
│   │       ├── icons/           # Ikonová sada
│   │       └── utils/           # UI utility
│   │
│   ├── shared/                  # Sdílené utility a typy
│   │   ├── package.json
│   │   └── src/
│   │       ├── types/           # TypeScript definice
│   │       │   ├── database.ts
│   │       │   ├── api.ts
│   │       │   └── modules.ts
│   │       ├── utils/           # Utility funkce
│   │       ├── hooks/           # Sdílené React hooks
│   │       ├── constants/       # Konstanty
│   │       └── validators/      # Zod schémata
│   │
│   ├── auth/                    # Autentizační balíček
│   │   ├── package.json
│   │   └── src/
│   │       ├── client.ts        # Client-side auth
│   │       ├── server.ts        # Server-side auth
│   │       ├── middleware.ts    # Auth middleware
│   │       ├── providers/       # OAuth providers
│   │       └── types.ts
│   │
│   ├── database/                # Databázový balíček
│   │   ├── package.json
│   │   └── src/
│   │       ├── client.ts        # Supabase client
│   │       ├── types.ts         # Database types
│   │       ├── migrations/      # SQL migrace
│   │       └── seeds/           # Seed data
│   │
│   ├── ai/                      # AI Services
│   │   ├── package.json
│   │   └── src/
│   │       ├── claude/          # Claude AI integration
│   │       ├── prompts/         # AI prompty
│   │       └── analysis/        # Analytické funkce
│   │
│   ├── payments/                # Platební služby
│   │   ├── package.json
│   │   └── src/
│   │       ├── stripe/          # Stripe integrace
│   │       ├── gopay/           # GoPay integrace
│   │       └── invoicing/       # Fakturační logika
│   │
│   └── notifications/           # Notifikační systém
│       ├── package.json
│       └── src/
│           ├── email/           # Email notifikace
│           ├── push/            # Push notifikace
│           └── sms/             # SMS notifikace
│
├── supabase/                    # Supabase konfigurace
│   ├── config.toml
│   ├── migrations/              # Databázové migrace
│   │   ├── 00_init.sql
│   │   ├── 01_lifepro.sql
│   │   ├── 02_coachpro.sql
│   │   ├── 03_digipro.sql
│   │   ├── 04_paymentspro.sql
│   │   └── 05_shared_services.sql
│   ├── functions/               # Edge Functions
│   └── seed.sql                 # Seed data
│
├── scripts/                     # Utility scripty
│   ├── setup.sh                 # Počáteční setup
│   ├── dev.sh                   # Development start
│   ├── build.sh                 # Build všech modulů
│   └── deploy.sh                # Deployment
│
└── docs/                        # Dokumentace
    ├── architecture.md
    ├── modules/
    │   ├── lifepro.md
    │   ├── coachpro.md
    │   ├── digipro.md
    │   └── paymentspro.md
    ├── api/
    │   └── endpoints.md
    └── deployment/
        └── vercel.md
```

---

## 🎨 Design System (packages/ui)

### Komponenty

#### Atoms (Základní elementy)
- `Button` - Primární, sekundární, ghost, danger
- `Input` - Text, textarea, number, email, password
- `Checkbox` / `Radio` / `Switch`
- `Badge` - Status, notifikace, štítky
- `Avatar` - Uživatelské avatary
- `Icon` - Jednotná ikonová sada (Lucide)
- `Spinner` - Loading states
- `Tooltip` / `Popover`

#### Molecules (Složené komponenty)
- `Card` - Základní kontejner s padding a stínem
- `FormField` - Input + label + error + helperText
- `SearchBar` - Input s ikonou a filtry
- `DatePicker` - Kalendář pro výběr data
- `Dropdown` - Select menu
- `Tabs` - Záložkový systém
- `Alert` / `Toast` - Notifikace
- `Modal` / `Dialog` - Modální okna
- `Pagination` - Stránkování
- `EmptyState` - Prázdné stavy

#### Organisms (Komplexní komponenty)
- `Navbar` - Hlavní navigace s multi-app switcherem
- `Sidebar` - Boční navigace
- `DataTable` - Tabulka s filtrováním, řazením, stránkováním
- `StatsCard` - Kartička se statistikami
- `ChartCard` - Kartička s grafem
- `UserMenu` - Dropdown s uživatelským menu
- `NotificationCenter` - Centrum notifikací
- `AppSwitcher` - Přepínač mezi aplikacemi

### Téma

```typescript
// packages/ui/src/theme/index.ts

export const theme = {
  colors: {
    // Brand colors - pro každý modul
    lifepro: {
      primary: '#6366f1',    // Indigo
      secondary: '#8b5cf6',  // Purple
      accent: '#ec4899',     // Pink
    },
    coachpro: {
      primary: '#10b981',    // Emerald
      secondary: '#059669',  // Green
      accent: '#14b8a6',     // Teal
    },
    digipro: {
      primary: '#f59e0b',    // Amber
      secondary: '#f97316',  // Orange
      accent: '#ef4444',     // Red
    },
    paymentspro: {
      primary: '#3b82f6',    // Blue
      secondary: '#2563eb',  // Blue-600
      accent: '#1d4ed8',     // Blue-700
    },

    // Neutrální barvy
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
    },
  },

  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
};
```

---

## 🗄️ Databázové Schéma

### Sdílené Tabulky (všechny moduly)

```sql
-- ============================================================================
-- CORE AUTH & USERS
-- ============================================================================

-- Rozšířené uživatelské profily
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'Europe/Prague',
  locale TEXT DEFAULT 'cs',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizace (pro týmové plány)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_tier TEXT DEFAULT 'free', -- free, starter, pro, enterprise
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Členové organizace
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- owner, admin, member
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- ============================================================================
-- MODULE PERMISSIONS
-- ============================================================================

-- Přístup k modulům
CREATE TABLE module_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL, -- lifepro, coachpro, digipro, paymentspro
  is_enabled BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id, module_name)
);

-- ============================================================================
-- PAYMENTS & SUBSCRIPTIONS
-- ============================================================================

-- Předplatné
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  plan_id TEXT NOT NULL,
  status TEXT DEFAULT 'active', -- active, past_due, canceled, trialing
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Faktury
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id),
  subscription_id UUID REFERENCES subscriptions(id),
  invoice_number TEXT NOT NULL UNIQUE,
  amount_total INTEGER NOT NULL, -- v haléřích
  currency TEXT DEFAULT 'CZK',
  status TEXT DEFAULT 'draft', -- draft, open, paid, void, uncollectible
  due_date DATE,
  paid_at TIMESTAMPTZ,
  stripe_invoice_id TEXT UNIQUE,
  pdf_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  type TEXT NOT NULL, -- info, success, warning, error
  title TEXT NOT NULL,
  message TEXT,
  module TEXT, -- Který modul notifikaci vytvořil
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUDIT LOG
-- ============================================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  organization_id UUID REFERENCES organizations(id),
  module TEXT NOT NULL,
  action TEXT NOT NULL, -- create, update, delete, view
  resource_type TEXT NOT NULL, -- user, client, campaign, invoice...
  resource_id UUID,
  changes JSONB, -- Before/after values
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FILE STORAGE METADATA
-- ============================================================================

CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  module TEXT NOT NULL,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL, -- Cesta v Supabase Storage
  mime_type TEXT,
  size_bytes BIGINT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### LifePro Schéma

```sql
-- ============================================================================
-- LIFEPRO - Personal Discovery Module
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS lifepro;

-- Kategorie otázek
CREATE TABLE lifepro.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  time_period TEXT, -- present, past, future
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sekce v rámci kategorií
CREATE TABLE lifepro.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES lifepro.categories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Otázky
CREATE TABLE lifepro.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES lifepro.sections(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  help_text TEXT,
  question_type TEXT NOT NULL, -- text, textarea, checkbox, radio, select, slider
  allow_favorite BOOLEAN DEFAULT true,
  max_favorites INTEGER DEFAULT 3,
  sort_order INTEGER DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Možnosti odpovědí
CREATE TABLE lifepro.question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES lifepro.questions(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Odpovědi uživatelů
CREATE TABLE lifepro.user_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES lifepro.questions(id) ON DELETE CASCADE,
  response_text TEXT,
  response_options UUID[], -- Array of option IDs
  is_favorite BOOLEAN DEFAULT false,
  confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- AI Analýzy
CREATE TABLE lifepro.ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL, -- full, partial, quick
  input_data JSONB NOT NULL,
  output_data JSONB NOT NULL,
  model TEXT DEFAULT 'claude-sonnet-4-5',
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress tracking
CREATE TABLE lifepro.user_progress (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  total_questions INTEGER DEFAULT 0,
  answered_questions INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,
  last_category_slug TEXT,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### CoachPro Schéma

```sql
-- ============================================================================
-- COACHPRO - Coaching & Mentoring Module
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS coachpro;

-- Klienti
CREATE TABLE coachpro.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'active', -- active, paused, completed, archived
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  goals JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Koučovací programy/balíčky
CREATE TABLE coachpro.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER,
  sessions_count INTEGER,
  price_amount INTEGER,
  price_currency TEXT DEFAULT 'CZK',
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Přiřazení klientů k programům
CREATE TABLE coachpro.client_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coachpro.clients(id) ON DELETE CASCADE,
  program_id UUID REFERENCES coachpro.programs(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active', -- active, completed, cancelled
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sezení
CREATE TABLE coachpro.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coachpro.clients(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  program_id UUID REFERENCES coachpro.programs(id),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT, -- Zoom link, adresa...
  status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
  notes TEXT, -- Poznámky ze sezení
  action_items JSONB DEFAULT '[]',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Úkoly pro klienty
CREATE TABLE coachpro.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coachpro.clients(id) ON DELETE CASCADE,
  session_id UUID REFERENCES coachpro.sessions(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  priority TEXT DEFAULT 'medium', -- low, medium, high
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pokrok klienta
CREATE TABLE coachpro.client_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coachpro.clients(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL, -- např. "confidence_level", "goal_clarity"
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Vzdělávací zdroje
CREATE TABLE coachpro.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL, -- article, video, worksheet, book, podcast
  url TEXT,
  file_id UUID REFERENCES files(id),
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Přiřazení zdrojů klientům
CREATE TABLE coachpro.client_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES coachpro.clients(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES coachpro.resources(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);
```

### DigiPro Schéma

```sql
-- ============================================================================
-- DIGIPRO - Digital Marketing Module
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS digipro;

-- Projekty/Klienti
CREATE TABLE digipro.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  client_name TEXT,
  description TEXT,
  website_url TEXT,
  industry TEXT,
  target_audience TEXT,
  brand_colors JSONB DEFAULT '{}',
  brand_guidelines TEXT,
  status TEXT DEFAULT 'active', -- active, paused, completed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social media účty
CREATE TABLE digipro.social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES digipro.projects(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- facebook, instagram, linkedin, twitter, tiktok
  account_name TEXT NOT NULL,
  account_url TEXT,
  access_token TEXT, -- Encrypted
  is_connected BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketingové kampaně
CREATE TABLE digipro.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES digipro.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  campaign_type TEXT NOT NULL, -- organic, paid, email, influencer
  start_date DATE NOT NULL,
  end_date DATE,
  budget_amount INTEGER,
  budget_currency TEXT DEFAULT 'CZK',
  status TEXT DEFAULT 'draft', -- draft, active, paused, completed
  goals JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content plánování
CREATE TABLE digipro.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES digipro.projects(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES digipro.campaigns(id),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL, -- post, story, reel, article, video
  content_text TEXT,
  media_urls TEXT[] DEFAULT '{}',
  platforms TEXT[] DEFAULT '{}', -- Na které platformy
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft', -- draft, scheduled, published, archived
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytika
CREATE TABLE digipro.analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES digipro.projects(id) ON DELETE CASCADE,
  social_account_id UUID REFERENCES digipro.social_accounts(id),
  content_item_id UUID REFERENCES digipro.content_items(id),
  metric_type TEXT NOT NULL, -- reach, impressions, engagement, clicks, conversions
  metric_value NUMERIC NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- AI generování obsahu
CREATE TABLE digipro.ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES digipro.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  generation_type TEXT NOT NULL, -- caption, hashtags, article, script
  output_text TEXT,
  model TEXT DEFAULT 'claude-sonnet-4-5',
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### PaymentsPro Schéma

```sql
-- ============================================================================
-- PAYMENTSPRO - Payments & Invoicing Module
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS paymentspro;

-- Zákazníci
CREATE TABLE paymentspro.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT,
  full_name TEXT,
  vat_id TEXT,
  billing_address JSONB,
  phone TEXT,
  stripe_customer_id TEXT UNIQUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produkty/Služby
CREATE TABLE paymentspro.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  product_type TEXT NOT NULL, -- service, product, subscription
  price_amount INTEGER NOT NULL,
  price_currency TEXT DEFAULT 'CZK',
  vat_rate INTEGER DEFAULT 21,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Faktury
CREATE TABLE paymentspro.user_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES paymentspro.customers(id),
  invoice_number TEXT NOT NULL UNIQUE,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal_amount INTEGER NOT NULL,
  vat_amount INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'CZK',
  status TEXT DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  payment_method TEXT, -- bank_transfer, card, cash, gopay
  paid_at TIMESTAMPTZ,
  notes TEXT,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Položky faktur
CREATE TABLE paymentspro.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES paymentspro.user_invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES paymentspro.products(id),
  description TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit_price INTEGER NOT NULL,
  vat_rate INTEGER DEFAULT 21,
  total_price INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Platby
CREATE TABLE paymentspro.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES paymentspro.user_invoices(id),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'CZK',
  payment_method TEXT NOT NULL,
  payment_gateway TEXT, -- stripe, gopay
  gateway_payment_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opakující se faktury
CREATE TABLE paymentspro.recurring_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES paymentspro.customers(id) ON DELETE CASCADE,
  frequency TEXT NOT NULL, -- weekly, monthly, quarterly, yearly
  next_issue_date DATE NOT NULL,
  template_data JSONB NOT NULL, -- Šablona pro generování faktur
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 API Architektura

### REST API Endpoints

#### Autentizace
```
POST   /api/auth/login              # Přihlášení
POST   /api/auth/register           # Registrace
POST   /api/auth/logout             # Odhlášení
POST   /api/auth/forgot-password    # Reset hesla
GET    /api/auth/me                 # Aktuální uživatel
```

#### Organizace
```
GET    /api/organizations           # Seznam organizací
POST   /api/organizations           # Vytvořit organizaci
GET    /api/organizations/:id       # Detail organizace
PATCH  /api/organizations/:id       # Aktualizovat organizaci
DELETE /api/organizations/:id       # Smazat organizaci

GET    /api/organizations/:id/members        # Členové
POST   /api/organizations/:id/members        # Přidat člena
DELETE /api/organizations/:id/members/:userId # Odebrat člena
```

#### LifePro API
```
GET    /api/lifepro/categories                    # Seznam kategorií
GET    /api/lifepro/categories/:slug/sections     # Sekce kategorie
GET    /api/lifepro/sections/:id/questions        # Otázky sekce
POST   /api/lifepro/responses                     # Uložit odpověď
GET    /api/lifepro/progress                      # Progress uživatele
POST   /api/lifepro/analyze                       # AI analýza
GET    /api/lifepro/results                       # Výsledky
GET    /api/lifepro/export/pdf                    # Export PDF
GET    /api/lifepro/export/json                   # Export JSON
```

#### CoachPro API
```
GET    /api/coachpro/clients                      # Seznam klientů
POST   /api/coachpro/clients                      # Nový klient
GET    /api/coachpro/clients/:id                  # Detail klienta
PATCH  /api/coachpro/clients/:id                  # Aktualizovat klienta

GET    /api/coachpro/sessions                     # Seznam sezení
POST   /api/coachpro/sessions                     # Naplánovat sezení
PATCH  /api/coachpro/sessions/:id                 # Aktualizovat sezení
POST   /api/coachpro/sessions/:id/complete        # Dokončit sezení

GET    /api/coachpro/tasks                        # Úkoly
POST   /api/coachpro/tasks                        # Vytvořit úkol
PATCH  /api/coachpro/tasks/:id                    # Aktualizovat úkol

GET    /api/coachpro/analytics/dashboard          # Dashboard analytics
```

#### DigiPro API
```
GET    /api/digipro/projects                      # Seznam projektů
POST   /api/digipro/projects                      # Nový projekt
GET    /api/digipro/projects/:id                  # Detail projektu

GET    /api/digipro/campaigns                     # Kampaně
POST   /api/digipro/campaigns                     # Nová kampaň

GET    /api/digipro/content                       # Content items
POST   /api/digipro/content                       # Vytvořit content
POST   /api/digipro/content/:id/schedule          # Naplánovat publikaci
POST   /api/digipro/content/:id/publish           # Publikovat

POST   /api/digipro/ai/generate-caption           # AI generování
POST   /api/digipro/ai/generate-hashtags          # AI hashtags
POST   /api/digipro/ai/analyze-performance        # AI analýza výkonu

GET    /api/digipro/analytics                     # Analytics data
```

#### PaymentsPro API
```
GET    /api/paymentspro/customers                 # Seznam zákazníků
POST   /api/paymentspro/customers                 # Nový zákazník

GET    /api/paymentspro/invoices                  # Seznam faktur
POST   /api/paymentspro/invoices                  # Nová faktura
GET    /api/paymentspro/invoices/:id              # Detail faktury
GET    /api/paymentspro/invoices/:id/pdf          # PDF faktury
POST   /api/paymentspro/invoices/:id/send         # Odeslat fakturu

POST   /api/paymentspro/payments                  # Zaznamenat platbu
GET    /api/paymentspro/payments/:id              # Detail platby

GET    /api/paymentspro/products                  # Produkty/služby
POST   /api/paymentspro/products                  # Nový produkt
```

---

## 🔐 Autentizace a Autorizace

### Supabase Auth

```typescript
// packages/auth/src/client.ts

import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Hooks
export const useAuth = () => {
  const supabase = createClient()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user }
}
```

### Role-Based Access Control (RBAC)

```typescript
// packages/shared/src/types/permissions.ts

export type Role = 'super_admin' | 'org_owner' | 'org_admin' | 'member'

export type Permission =
  | 'lifepro:*'
  | 'lifepro:read'
  | 'lifepro:write'
  | 'coachpro:*'
  | 'coachpro:clients:read'
  | 'coachpro:clients:write'
  | 'coachpro:sessions:read'
  | 'coachpro:sessions:write'
  | 'digipro:*'
  | 'digipro:content:read'
  | 'digipro:content:write'
  | 'paymentspro:*'
  | 'paymentspro:invoices:read'
  | 'paymentspro:invoices:write'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: ['*'],
  org_owner: ['*'],
  org_admin: [
    'lifepro:*',
    'coachpro:*',
    'digipro:*',
    'paymentspro:read'
  ],
  member: [
    'lifepro:read',
    'lifepro:write',
    'coachpro:clients:read',
    'coachpro:sessions:read'
  ]
}

export const hasPermission = (
  userRole: Role,
  permission: Permission
): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole]
  return permissions.includes('*') || permissions.includes(permission)
}
```

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom Design System (packages/ui)
- **State Management**: React Context + Server Components
- **Forms**: React Hook Form + Zod
- **Animation**: Framer Motion
- **Charts**: Recharts / Chart.js
- **Icons**: Lucide React
- **Date**: date-fns

### Backend
- **Database**: Supabase (PostgreSQL 15+)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Realtime**: Supabase Realtime
- **Edge Functions**: Supabase Edge Functions
- **Emails**: Resend / SendGrid
- **File Upload**: Supabase Storage

### AI & ML
- **LLM**: Claude (Anthropic)
- **Models**: claude-sonnet-4-5, claude-opus-4
- **Use Cases**:
  - LifePro: Osobnostní analýza
  - CoachPro: Generování akcí ze sezení
  - DigiPro: Generování contentu, hashtagů
  - PaymentsPro: OCR faktur, kategorizace výdajů

### Platby
- **Primary**: Stripe
- **Czech**: GoPay
- **Invoicing**: vlastní systém

### DevOps
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (frontend), Supabase (backend)
- **Monitoring**: Sentry
- **Analytics**: Vercel Analytics / Plausible

---

## 📦 Package.json (root)

```json
{
  "name": "proapp",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "test": "turbo run test",
    "clean": "turbo run clean && rm -rf node_modules",
    "db:migrate": "cd supabase && supabase db push",
    "db:seed": "node scripts/seed-all.js"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.0",
    "turbo": "^2.0.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "packageManager": "pnpm@9.0.0"
}
```

---

## 🌍 Environment Variables

### `.env.template`

```bash
# ============================================================================
# SUPABASE
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# ============================================================================
# ANTHROPIC AI
# ============================================================================
ANTHROPIC_API_KEY=sk-ant-api03-xxx

# ============================================================================
# STRIPE
# ============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# ============================================================================
# GOPAY (Optional - pro české platby)
# ============================================================================
GOPAY_GOID=xxx
GOPAY_CLIENT_ID=xxx
GOPAY_CLIENT_SECRET=xxx

# ============================================================================
# EMAIL
# ============================================================================
RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@proapp.cz

# ============================================================================
# SOCIAL MEDIA INTEGRATIONS (DigiPro)
# ============================================================================
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
INSTAGRAM_APP_ID=xxx
INSTAGRAM_APP_SECRET=xxx
LINKEDIN_CLIENT_ID=xxx
LINKEDIN_CLIENT_SECRET=xxx

# ============================================================================
# MONITORING
# ============================================================================
SENTRY_DSN=https://xxx@sentry.io/xxx
VERCEL_ANALYTICS_ID=xxx

# ============================================================================
# APP SETTINGS
# ============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 📱 Dashboard Navigation

### App Switcher Koncept

```typescript
// apps/dashboard/src/components/AppSwitcher.tsx

const apps = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'gray',
  },
  {
    id: 'lifepro',
    name: 'LifePro',
    icon: Compass,
    href: '/lifepro',
    color: 'indigo',
    description: 'Najdi své poslání',
  },
  {
    id: 'coachpro',
    name: 'CoachPro',
    icon: Users,
    href: '/coachpro',
    color: 'emerald',
    description: 'Koučuj profesionálně',
  },
  {
    id: 'digipro',
    name: 'DigiPro',
    icon: Megaphone,
    href: '/digipro',
    color: 'amber',
    description: 'Řiď marketing',
  },
  {
    id: 'paymentspro',
    name: 'PaymentsPro',
    icon: CreditCard,
    href: '/paymentspro',
    color: 'blue',
    description: 'Spravuj finance',
  },
]
```

---

## 🎓 Příklady Použití

### 1. Vytvoření nového uživatele s přístupem k modulům

```typescript
// Po registraci
const onRegister = async (email: string, password: string) => {
  // 1. Vytvořit účet
  const { data: authData } = await supabase.auth.signUp({
    email,
    password,
  })

  // 2. Vytvořit profil
  await supabase.from('profiles').insert({
    id: authData.user.id,
    email,
    full_name: '',
  })

  // 3. Dát přístup k LifePro (free tier)
  await supabase.from('module_access').insert({
    user_id: authData.user.id,
    module_name: 'lifepro',
    is_enabled: true,
  })

  // 4. Inizializovat progress
  await supabase.from('lifepro.user_progress').insert({
    user_id: authData.user.id,
    total_questions: 0,
    answered_questions: 0,
  })
}
```

### 2. Přepínání mezi aplikacemi

```typescript
// Middleware pro kontrolu přístupu k modulu
export const checkModuleAccess = async (
  userId: string,
  moduleName: string
): Promise<boolean> => {
  const { data } = await supabase
    .from('module_access')
    .select('is_enabled, expires_at')
    .eq('user_id', userId)
    .eq('module_name', moduleName)
    .single()

  if (!data?.is_enabled) return false
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return false
  }

  return true
}
```

### 3. Sdílení komponenty napříč moduly

```typescript
// packages/ui/src/components/organisms/DataTable.tsx
export const DataTable = <TData,>({
  columns,
  data,
  onRowClick
}: DataTableProps<TData>) => {
  // Univerzální tabulka použitelná v CoachPro, DigiPro, PaymentsPro
}

// Použití v CoachPro
import { DataTable } from '@proapp/ui'

const ClientsTable = () => {
  return (
    <DataTable
      columns={clientColumns}
      data={clients}
      onRowClick={(client) => router.push(`/coachpro/clients/${client.id}`)}
    />
  )
}
```

---

## 🔄 Workflow Příklady

### User Journey: Od LifePro k CoachPro

1. **User vyplní LifePro dotazník**
   - Zjistí, že ho baví pomáhat lidem
   - AI doporučí kariéru kouče

2. **User se zaregistruje na CoachPro trial**
   - Automaticky se vytvoří `module_access` pro CoachPro
   - Dostane 14denní trial zdarma

3. **User přidá prvního klienta**
   - Využije šablony z LifePro pro pochopení klienta
   - Naplánuje první sezení

4. **User upgrade na placený plán**
   - Přes PaymentsPro se vytvoří subscription
   - Stripe automaticky fakturuje měsíčně

5. **User potřebuje marketing**
   - Zapne DigiPro modul
   - Sdílí testimonials klientů na sociální sítě

---

## 🎨 Vizuální Identita Modulů

| Modul | Barva | Ikona | Hlavní Use Case |
|-------|-------|-------|-----------------|
| **LifePro** | Indigo (#6366f1) | 🧭 Compass | Najdi svou cestu |
| **CoachPro** | Emerald (#10b981) | 👥 Users | Koučuj profesionálně |
| **DigiPro** | Amber (#f59e0b) | 📢 Megaphone | Řiď marketing |
| **PaymentsPro** | Blue (#3b82f6) | 💳 CreditCard | Spravuj finance |
| **Dashboard** | Gray (#6b7280) | 🏠 Home | Centrální rozcestník |

---

## 📊 Metriky a KPIs

### LifePro
- Počet registrovaných uživatelů
- % dokončeného dotazníku
- Počet AI analýz
- Conversion rate: zdarma → placené plány

### CoachPro
- Počet aktivních koučů
- Počet klientů per kouč
- Počet dokončených sezení
- Průměrné hodnocení sezení
- Retention rate klientů

### DigiPro
- Počet spravovaných projektů
- Počet publikovaného contentu
- Engagement rate
- ROI kampaní
- AI využití (generování contentu)

### PaymentsPro
- Počet vystavených faktur
- Celkový objem fakturovaný
- Průměrná doba splatnosti
- Conversion rate: vystaveno → zaplaceno

---

## 🚢 Deployment Strategie

### Vercel (Frontend)

```bash
# apps/dashboard/vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

### Supabase (Backend)

```bash
# Migrace
supabase db push

# Edge Functions
supabase functions deploy ai-analyze
supabase functions deploy send-notification
```

---

## 🔮 Roadmap

### Phase 1: Foundation (Q1 2025)
- [x] Monorepo setup
- [x] Design system (packages/ui)
- [x] Auth systém
- [x] LifePro migrovat do mono-repo
- [ ] Dashboard aplikace
- [ ] Billing & Subscriptions

### Phase 2: CoachPro (Q2 2025)
- [ ] Správa klientů
- [ ] Plánování sezení
- [ ] Poznámky a úkoly
- [ ] Progress tracking
- [ ] Resource library
- [ ] Email notifikace

### Phase 3: DigiPro (Q3 2025)
- [ ] Správa projektů
- [ ] Social media kalendář
- [ ] Content plánování
- [ ] AI generování contentu
- [ ] Basic analytics
- [ ] Instagram/Facebook integrace

### Phase 4: PaymentsPro (Q4 2025)
- [ ] Správa zákazníků
- [ ] Fakturace
- [ ] Stripe integrace
- [ ] GoPay integrace
- [ ] Opakující se faktury
- [ ] Finanční reporty

### Phase 5: Advanced Features (2026)
- [ ] Mobile aplikace (React Native)
- [ ] WhatsApp integrace
- [ ] Advanced AI features
- [ ] Team collaboration
- [ ] API pro třetí strany
- [ ] White-label řešení

---

## 🤝 Contributing Guidelines

### Konvence

**Git Branches**
```
feature/lifepro-export-pdf
feature/coachpro-calendar
fix/digipro-analytics-bug
chore/update-dependencies
```

**Commit Messages**
```
feat(lifepro): add PDF export functionality
fix(coachpro): resolve calendar timezone issue
chore(deps): update dependencies
docs(readme): update installation steps
```

**PR Template**
```markdown
## What
Brief description of changes

## Why
Motivation and context

## How
Implementation details

## Testing
- [ ] Unit tests added
- [ ] Integration tests pass
- [ ] Manual testing done

## Screenshots
(if applicable)
```

---

## 📞 Kontakty a Podpora

- **Email**: support@proapp.cz
- **Dokumentace**: https://docs.proapp.cz
- **Status**: https://status.proapp.cz

---

## 📜 License

Proprietary - All rights reserved

---

**Vytvořeno**: 17.11.2025
**Autor**: Claude Code
**Verze**: 1.0.0

---

## 🎯 Pro Claude Code: Důležité Poznámky

Když pracuješ na ProApp projektu:

1. **Vždy respektuj modulární strukturu** - každá aplikace je samostatný modul
2. **Používej sdílené balíčky** - nepřepisuj to, co už je v packages/
3. **Konzistentní naming** - všechny prefixy jsou `lifepro_`, `coachpro_`, atd.
4. **TypeScript first** - vždy typuj vše
5. **Design system** - používej komponenty z packages/ui
6. **RLS je kritické** - každá tabulka musí mít Row Level Security
7. **AI je drahé** - optimalizuj použití Claude API
8. **Testuj cross-module** - změny v shared packages ovlivňují všechny moduly

### Rychlé Příkazy

```bash
# Spustit celý projekt
pnpm dev

# Spustit jen LifePro
pnpm dev --filter lifepro

# Build všech modulů
pnpm build

# Typechecking
pnpm type-check

# Migrace databáze
pnpm db:migrate

# Seed data
pnpm db:seed
```
