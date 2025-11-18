# 🌟 LifePro Development - Claude Code Context

**Vytvořeno:** 18.11.2025
**Účel:** Kompletní kontext pro Claude Code vyvíjející LifePro modul
**Status:** 🚀 Ready to start development

---

## 🎯 Co je LifePro

**LifePro** je modul pro **personal development & life management**:
- 🎯 Goal Setting & Tracking (cíle - short-term, long-term)
- ✅ Habit Tracker (denní/týdenní návyky, streaky, gamifikace)
- 📝 Journal / Reflection (denní deník, gratitude, mood tracking)
- 📚 Resources & Learning (články, workshopy, templates)
- 👥 Community / Support (provider-client vztahy)
- 📊 Analytics & Insights (progress reports, trendy)

---

## 📂 Existující Materiály

**DŮLEŽITÉ:** V `~/Documents/Projekty/` existují složky s předchozí prací na LifePro:

```
~/Documents/Projekty/
├── lifepro-mater/              # Materiály pro LifePro
├── lifepro-original-archiv/    # Původní archiv
└── todo-lifepro.odt            # TODO list
```

### ⚠️ Akce před zahájením vývoje:

1. **Projdi existující materiály:**
   ```bash
   ls ~/Documents/Projekty/lifepro-mater/
   ls ~/Documents/Projekty/lifepro-original-archiv/
   ```

2. **Pokud obsahují kód, vytvoř zálohu:**
   ```bash
   cp -r ~/Documents/Projekty/lifepro-mater ~/Documents/Projekty/lifepro-mater-backup-$(date +%Y%m%d)
   cp -r ~/Documents/Projekty/lifepro-original-archiv ~/Documents/Projekty/lifepro-original-archiv-backup-$(date +%Y%m%d)
   ```

3. **Zkontroluj todo-lifepro.odt** pro feature requirements

---

## 🏗️ Současná Struktura - ProApp Monorepo

LifePro je nyní připraveno jako součást **ProApp monorepo**:

### Lokace:
```
~/Documents/ProApp/packages/lifepro/
```

### Struktura:
```
lifepro/
├── package.json                 # ✅ Hotovo
├── vite.config.js              # ✅ Hotovo (port 3001)
├── index.html                  # ✅ Hotovo
├── .env                        # ✅ Hotovo (Supabase credentials)
├── node_modules/               # ✅ Nainstalováno
└── src/
    ├── client/                 # Klientská sekce (prázdné)
    ├── provider/               # Provider sekce (prázdné)
    ├── contexts/               # Auth contexts (prázdné)
    ├── components/             # Komponenty (prázdné)
    └── utils/                  # Utility (prázdné)
```

### Development:
```bash
cd ~/Documents/ProApp
npm run dev:lifepro    # Spustí LifePro na localhost:3001
```

---

## 🔑 Klíčové Informace

### 1. Supabase - JEDEN Projekt Pro Všechny Moduly

**URL:** `https://qrnsrhrgjzijqphgehra.supabase.co`

**Credentials jsou v `.env`:**
```bash
VITE_SUPABASE_URL=https://qrnsrhrgjzijqphgehra.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**DŮLEŽITÉ:** LifePro používá STEJNÝ Supabase projekt jako CoachPro, ContentPro atd.
- **Oddělení dat:** Table prefixes (`lifepro_*`)
- **Sdílený OAuth:** Google authentication

### 2. Database Schema - Jak Vytvořit Tabulky v Supabase

**DŮLEŽITÉ - Architektura:**
- ✅ ProApp používá **JEDEN Supabase projekt** pro všechny moduly (CoachPro, LifePro, ContentPro, etc.)
- ✅ Data jednotlivých modulů oddělujeme pomocí **table prefixes**:
  - CoachPro: `coachpro_*` (coaches, clients, programs, materials, sessions)
  - LifePro: `lifepro_*` (clients, providers, goals, habits, journal)
  - ContentPro: `contentpro_*`
  - StudyPro: `studypro_*`
  - atd.

**Jak vytvořit tabulky:**

1. **Otevři Supabase Dashboard:**
   - URL: https://supabase.com/dashboard
   - Vyber projekt: `qrnsrhrgjzijqphgehra` (ProApp)

2. **Jdi do SQL Editor:**
   - Levý sidebar → SQL Editor
   - Klikni "New query"

3. **Zkopíruj a spusť SQL:**

```sql
-- ======================================
-- LifePro Database Schema
-- Prefix: lifepro_*
-- ======================================

-- Základní tabulky (minimální MVP):

CREATE TABLE lifepro_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  photo_url TEXT,
  auth_user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE lifepro_providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  photo_url TEXT,
  auth_user_id UUID,
  bio TEXT,
  specializations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core features:

CREATE TABLE lifepro_goals (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES lifepro_clients(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- career, health, relationships, finance, personal
  target_date DATE,
  status TEXT CHECK (status IN ('active', 'completed', 'paused', 'abandoned')),
  progress INTEGER DEFAULT 0, -- 0-100%
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE lifepro_habits (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES lifepro_clients(id),
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT, -- daily, weekly, custom
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE lifepro_journal (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES lifepro_clients(id),
  entry_date DATE NOT NULL,
  content TEXT,
  mood INTEGER, -- 1-5 scale
  gratitude TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) na všech tabulkách
ALTER TABLE lifepro_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_journal ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (upravit podle potřeby)
CREATE POLICY "Users can view own data" ON lifepro_clients
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own data" ON lifepro_clients
  FOR UPDATE USING (auth.uid() = auth_user_id);
```

4. **Ověř že tabulky existují:**
   - Levý sidebar → Table Editor
   - Měl bys vidět: `lifepro_clients`, `lifepro_providers`, `lifepro_goals`, `lifepro_habits`, `lifepro_journal`

**⚠️ Poznámka o RLS (Row Level Security):**
- RLS je security feature v Supabase
- Určuje KDO může číst/zapisovat která data
- Pro začátek můžeš policies upravit nebo vypnout (pro development)
- Pro production VŽDY zapni RLS a napiš správné policies!

### 3. @proapp/shared Package

LifePro má přístup ke sdílenému package s komponentami a utility:

```javascript
// Auth komponenty
import { GoogleSignInButton } from '@proapp/shared/components/auth';
import { ClientAuthGuard, TesterAuthGuard } from '@proapp/shared/components/auth';

// Vizuální komponenty
import { FlipCard } from '@proapp/shared/components/cards';
import { AnimatedGradient } from '@proapp/shared/components/effects';

// Layout
import { Layout } from '@proapp/shared/components/layout';
import { NavigationFloatingMenu } from '@proapp/shared/components/navigation';

// Hooks
import { useSoundFeedback } from '@proapp/shared/hooks';

// Utility
import { createPhotoStorage } from '@proapp/shared/utils/storage';
import { formatDate, czechMonths } from '@proapp/shared/utils/dateUtils';
import { getVocative } from '@proapp/shared/utils/vocative';

// Context factories (KLÍČOVÉ!)
import { createClientAuthContext } from '@proapp/shared/context/clientAuthContext';
import { createTesterAuthContext } from '@proapp/shared/context/testerAuthContext';

// Themes
import { lightTheme, darkTheme, createAppTheme } from '@proapp/shared/themes';

// Styles
import { BORDER_RADIUS, SPACING } from '@proapp/shared/styles/constants';
import { glow, fadeIn, slideIn } from '@proapp/shared/styles/animations';
```

**Lokace shared package:** `~/Documents/ProApp/packages/shared/`

---

## 🚀 Postup Pro Start Development

### Krok 1: Projdi existující materiály
```bash
# Zkontroluj co už existuje:
ls -la ~/Documents/Projekty/lifepro-mater/
ls -la ~/Documents/Projekty/lifepro-original-archiv/
open ~/Documents/Projekty/todo-lifepro.odt
```

### Krok 2: Záloha existujícího kódu (pokud existuje)
```bash
# Vytvoř timestamped zálohy:
cd ~/Documents/Projekty
cp -r lifepro-mater lifepro-mater-backup-$(date +%Y%m%d-%H%M%S)
cp -r lifepro-original-archiv lifepro-original-archiv-backup-$(date +%Y%m%d-%H%M%S)
```

### Krok 3: Vytvoř databázové tabulky v Supabase
1. Otevři Supabase: https://supabase.com/dashboard
2. Vyber projekt (qrnsrhrgjzijqphgehra)
3. Jdi do SQL Editor
4. Spusť SQL ze sekce "Database Schema" výše
5. Ověř že tabulky existují

### Krok 4: Vytvoř základní soubory

**src/supabaseClient.js:**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials in .env file');
}

// STEJNÝ Supabase jako ostatní ProApp moduly
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**src/contexts/ClientAuthContext.jsx:**
```javascript
import { createClientAuthContext } from '@proapp/shared/context/clientAuthContext';
import { supabase } from '../supabaseClient';

const LifeProClientAuthContext = createClientAuthContext({
  supabase,
  userType: 'lifepro_client',
  profileTable: 'lifepro_clients',
  onboardingPath: '/client/onboarding'
});

export const ClientAuthProvider = LifeProClientAuthContext.Provider;
export const useClientAuth = LifeProClientAuthContext.useAuth;
```

**src/contexts/ProviderAuthContext.jsx:**
```javascript
import { createTesterAuthContext } from '@proapp/shared/context/testerAuthContext';
import { supabase } from '../supabaseClient';

const LifeProProviderAuthContext = createTesterAuthContext({
  supabase,
  userType: 'lifepro_provider',
  profileTable: 'lifepro_providers',
  onboardingPath: '/provider/setup'
});

export const ProviderAuthProvider = LifeProProviderAuthContext.Provider;
export const useProviderAuth = LifeProProviderAuthContext.useAuth;
```

**src/main.jsx:**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme } from '@proapp/shared/themes';
import { ClientAuthProvider } from './contexts/ClientAuthContext';
import { ProviderAuthProvider } from './contexts/ProviderAuthContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <ProviderAuthProvider>
        <ClientAuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ClientAuthProvider>
      </ProviderAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
```

**src/App.jsx:**
```javascript
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientView from './client/ClientView';
import ProviderView from './provider/ProviderView';
import LandingPage from './LandingPage';

function App() {
  return (
    <Routes>
      <Route path="/client/*" element={<ClientView />} />
      <Route path="/provider/*" element={<ProviderView />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/" element={<Navigate to="/landing" />} />
    </Routes>
  );
}

export default App;
```

### Krok 5: Spusť dev server a testuj
```bash
cd ~/Documents/ProApp
npm run dev:lifepro
```

Otevři: `http://localhost:3001`

---

## 📚 Dokumentace & Reference

### Dostupné dokumenty:

1. **`/Users/lenkaroubalova/Documents/ProApp/docs/LIFEPRO_DEVELOPMENT_CONTEXT.md`**
   - Kompletní guide pro LifePro vývoj
   - Všechny dostupné shared komponenty
   - Setup kroky
   - Database schema návrhy

2. **`/Users/lenkaroubalova/Documents/ProApp/docs/PROAPP_COMPLETE_STRUCTURE.md`**
   - Kompletní ProApp monorepo struktura
   - Všech 6 modulů přehled
   - Module template

3. **`/Users/lenkaroubalova/Documents/ProApp/docs/PROAPP_MONOREPO_MIGRATION.md`**
   - Migrace guide
   - Git workflow
   - Troubleshooting

4. **CoachPro jako reference:**
   - Lokace: `~/Documents/ProApp/packages/coachpro/`
   - 318 souborů production-ready kódu
   - Použij jako inspiraci pro strukturu

### CoachPro - Klíčové soubory k prostudování:

```
packages/coachpro/src/
├── main.jsx                    # Entry point pattern
├── App.jsx                     # Routing pattern
├── supabaseClient.js           # Supabase config
├── client/
│   ├── ClientView.jsx          # Client routing
│   ├── ClientDashboard.jsx     # Dashboard with stats
│   ├── ClientWelcome.jsx       # Welcome screen
│   └── ClientCoachSelection.jsx # Selection pattern
├── tester/
│   ├── Dashboard.jsx           # Admin dashboard
│   └── ProgramsPage.jsx        # CRUD operations
└── contexts/
    ├── TesterAuthContext.jsx   # Factory pattern usage
    └── ClientAuthContext.jsx   # Factory pattern usage
```

---

## 🎯 MVP Features (Priority)

### Phase 1: Basic Setup ✅
- [x] Projekt struktura vytvořena
- [x] Dependencies nainstalovány
- [x] .env nakonfigurováno
- [ ] Database tabulky vytvořeny v Supabase
- [ ] Auth contexts implementovány
- [ ] Základní routing (App.jsx, ClientView, ProviderView)

### Phase 2: Core Features 🎯
- [ ] **Goals Module**
  - Seznam cílů
  - Vytvoření/editace cíle
  - Progress tracking (0-100%)
  - Kategorie (career, health, relationships, finance, personal)

- [ ] **Habits Tracker**
  - Seznam návyků
  - Daily check-in
  - Streak system (jako CoachPro)
  - Kalendář s historií

- [ ] **Journal**
  - Denní zápisy
  - Mood tracking (1-5)
  - Gratitude section

### Phase 3: Advanced Features 📚
- [ ] Resources & Learning
- [ ] Analytics & Insights
- [ ] Community / Support

---

## 💡 Best Practices

### 1. Vždy používej @proapp/shared
❌ **NIKDY nevytvářej duplicitní komponenty!**
✅ **Vždy importuj z @proapp/shared**

### 2. Factory Pattern pro Auth
```javascript
// ✅ Správně - parametrizované
const AuthContext = createClientAuthContext({
  supabase,
  userType: 'lifepro_client',
  profileTable: 'lifepro_clients',
  onboardingPath: '/client/onboarding'
});
```

### 3. Table Prefixes
✅ Všechny tabulky začínají `lifepro_*`
✅ Storage buckets: `lifepro-photos/`, `lifepro-resources/`

### 4. Následuj CoachPro Pattern
- Struktura složek (client/, provider/, contexts/)
- Routing pattern (View → Dashboard → Pages)
- Auth guards
- Error handling

### 5. Git Workflow
- ❌ **NIKDY nevytvářej Git větve pro práci**
- ✅ Experimenty = fyzické kopie složek
- ✅ Git jen pro zálohu a push

---

## 🚨 Důležité Poznámky

### Supabase
- ✅ JEDEN Supabase projekt pro všechny ProApp moduly
- ✅ Oddělení pomocí table prefixes (`lifepro_*`)
- ✅ STEJNÉ .env credentials jako CoachPro
- ✅ Sdílený Google OAuth

### OAuth Configuration
- Localhost: `http://localhost:3001` MUSÍ být v Authorized URLs
- Site URL v Supabase = production domain
- OAuth redirectuje na production, ale funguje i na localhost

### Development
- Port: 3001 (jiný než CoachPro 3000)
- Můžeš spustit CoachPro a LifePro současně!

---

## 📞 Kontakt

**Autor:** Lenka Roubalová
**Email:** info@lenkaroubalova.cz
**GitHub:** https://github.com/lennayia/ProApp

---

## ✅ Checklist Před Začátkem

- [ ] Projít existující materiály (lifepro-mater, lifepro-original-archiv)
- [ ] Přečíst todo-lifepro.odt
- [ ] Vytvořit zálohy existujícího kódu
- [ ] Vytvořit lifepro_* tabulky v Supabase
- [ ] Přidat localhost:3001 do Google OAuth Authorized URLs
- [ ] Vytvořit základní soubory (supabaseClient, contexts, main, App)
- [ ] Spustit `npm run dev:lifepro` a ověřit že funguje
- [ ] Implementovat landing page s Google Sign-In
- [ ] Implementovat client dashboard
- [ ] Start s MVP features (Goals nebo Habits)

---

**Status:** 🚀 Ready for development
**Last Updated:** 18.11.2025
**Version:** 1.0 - Initial setup complete
