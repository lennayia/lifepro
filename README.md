# LifePro - React + Vite Edition

**Profesionální aplikace pro osobní rozvoj a sebehodnocení**

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)
[![Material-UI](https://img.shields.io/badge/MUI-5.14-blue)](https://mui.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

---

## 📋 Obsah

- [O Projektu](#o-projektu)
- [Funkce](#funkce)
- [Technologie](#technologie)
- [Instalace](#instalace)
- [Spuštění](#spuštění)
- [Struktura Projektu](#struktura-projektu)
- [Databáze](#databáze)
- [Deployment](#deployment)

---

## 🎯 O Projektu

LifePro je komplexní aplikace pro osobní rozvoj, která pomáhá uživatelům:
- Vyhodnotit své silné a slabé stránky
- Sledovat pokrok v různých oblastech života
- Získat personalizované insights pomocí AI
- Exportovat výsledky do profesionálních PDF reportů

### Migrace z Next.js

Tento projekt byl úspěšně migrován z Next.js na React + Vite pro:
- ⚡ Rychlejší development build (10x rychlejší HMR)
- 📦 Menší production bundle
- 🔧 Jednodušší konfigurace
- 🚀 Lepší performance

---

## ✨ Funkce

### ✅ Implementováno (v2.0.0)

#### 1. **User Authentication**
- Registrace a přihlášení přes Supabase Auth
- Email verifikace
- Password reset
- Session management

#### 2. **Questionnaire System**
- 65 kategorií osobního rozvoje
- 237 sekcí
- 1054 otázek
- Auto-save odpovědí
- Progress tracking
- Favorite marking
- **Search & Filter** - Fulltext vyhledávání + 3 filtry

#### 3. **Admin Interface**
- CRUD operace pro kategorie
- CRUD operace pro sekce
- CRUD operace pro otázky
- Slug auto-generování
- Filtering a search
- Publikování/skrývání obsahu

#### 4. **Results & Analytics**
- Celkové statistiky
- Pokrok po kategoriích
- **Radar chart** vizualizace
- **Bar chart** porovnání
- Seznam oblíbených odpovědí
- **PDF export**

#### 5. **Help & Documentation**
- Kompletní FAQ stránka
- 10 detailních návodů
- Quick links na hlavní témata
- Kontaktní formulář

#### 6. **Performance**
- React.lazy code splitting
- Suspense loading states
- Optimized bundle size
- Lazy loading routes

### 🚧 V Plánu (v3.0.0)

- 🤖 AI Analýza (Claude API)
- 📧 Email notifikace
- 📊 Progress tracking over time
- 🌙 Dark mode toggle
- 🌍 Multi-language (EN, SK)

---

## 🛠️ Technologie

### Frontend
- **React 18.2** - UI framework
- **Vite 5.0** - Build tool & dev server
- **Material-UI 5.14** - Component library
- **React Router 6.20** - Client-side routing
- **Recharts 2.15** - Charts & visualizations
- **jsPDF 2.5** - PDF generation
- **Lucide React 0.294** - Icons

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security
  - Real-time subscriptions

### Development
- **ESLint** - Code linting
- **Vite plugins** - React, Path aliases

---

## 📦 Instalace

### Požadavky
- Node.js 18+
- npm nebo yarn
- Supabase účet

### 1. Clone repository
```bash
git clone https://github.com/lennayia/lifepro.git
cd lifepro
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup

Vytvořte `.env` soubor v root složce:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

Spusťte SQL skripty v Supabase SQL Editor:

```sql
-- 1. Vytvoření tabulek
CREATE TABLE lifepro_categories (...);
CREATE TABLE lifepro_sections (...);
CREATE TABLE lifepro_questions (...);
CREATE TABLE lifepro_user_responses (...);

-- 2. Row Level Security
ALTER TABLE lifepro_categories ENABLE ROW LEVEL SECURITY;
-- ... atd.
```

### 5. Import Categories

```bash
npm run import:categories
```

Tento příkaz naimportuje 65 kategorií z `categories-data.json`.

---

## 🚀 Spuštění

### Development Mode
```bash
npm run dev
```
Aplikace běží na `http://localhost:5173`

### Production Build
```bash
npm run build
```
Build se vytvoří v `dist/` složce.

### Preview Production Build
```bash
npm run preview
```

---

## 📁 Struktura Projektu

```
lifepro/
├── public/              # Static assets
├── src/
│   ├── components/      # React komponenty
│   │   ├── admin/       # Admin CRUD komponenty
│   │   └── visualizations/  # Charts & grafy
│   ├── lib/
│   │   └── supabase/    # Supabase client
│   ├── pages/           # Page komponenty
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── QuestionnairePage.jsx
│   │   ├── QuestionnaireDetailPage.jsx
│   │   ├── ResultsPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── AdminPage.jsx
│   │   └── HelpPage.jsx
│   ├── shared/          # Shared komponenty
│   │   └── context/     # React contexts
│   ├── utils/           # Utility funkce
│   │   └── pdfExport.js # PDF generování
│   ├── App.jsx          # Root komponenta
│   └── main.jsx         # Entry point
├── scripts/             # Build & utility skripty
├── FEATURES_DOCUMENTATION.md  # Detailní dokumentace
├── SESSION_CONTEXT.md   # Kontext pro další session
├── .env                 # Environment variables
├── vite.config.js       # Vite konfigurace
└── package.json
```

---

## 💾 Databáze

### Schema Overview

```
lifepro_categories (65 záznamů)
  └── lifepro_sections (237 záznamů)
      └── lifepro_questions (1054 záznamů)
          └── lifepro_user_responses (dynamic)
```

### lifepro_categories
```sql
CREATE TABLE lifepro_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  "order" INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### lifepro_user_responses
```sql
CREATE TABLE lifepro_user_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID REFERENCES lifepro_questions(id) ON DELETE CASCADE,
  answer_multiple TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);
```

### Row Level Security

```sql
-- Users mohou číst pouze své vlastní odpovědi
CREATE POLICY "Users can view own responses"
  ON lifepro_user_responses FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🚢 Deployment

### Vercel (Doporučeno)

1. Push do GitHub repository
2. Import projektu do Vercel
3. Nastavte Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## 📝 Scripts

```json
{
  "dev": "vite",                    // Dev server
  "build": "vite build",            // Production build
  "preview": "vite preview",        // Preview build
  "lint": "eslint .",              // Linting
  "import:categories": "node scripts/importCategories.js"
}
```

---

## 📚 Dokumentace

### Hlavní dokumenty:

- **FEATURES_DOCUMENTATION.md** - Detailní popis všech funkcí
- **SESSION_CONTEXT.md** - Kontext pro další development session
- **README.md** - Tento dokument

### In-App Nápověda:

- `/help` - Kompletní FAQ a návody
- 10 detailních průvodců funkcemi
- Quick links na hlavní témata

---

## 🗺️ Roadmap

### v2.0.0 ✅ (Current - 2025-11-19)
- ✅ Admin Interface
- ✅ PDF Export
- ✅ Advanced Visualizations (Radar, Bar charts)
- ✅ Search & Filter
- ✅ Performance Optimizations
- ✅ Help/FAQ Page

### v3.0.0 🚧 (Plánováno)
- 🤖 AI Analysis (Claude API)
- 📧 Email Notifications
- 📊 Progress Tracking Over Time
- 🌙 Dark Mode
- 🌍 Internationalization

### v4.0.0 💭 (Budoucnost)
- 📱 Mobile App (React Native)
- 👥 Team Sharing & Collaboration
- 🎯 Goal Setting & Tracking
- 📈 Advanced Analytics Dashboard

---

## 📊 Performance Metriky

### Build Statistics (po optimalizaci):
```
dist/assets/index.js                638.68 kB │ gzip: 195.49 kB (main)
dist/assets/ResultsPage.js          789.69 kB │ gzip: 244.41 kB (lazy)
dist/assets/AdminPage.js             57.45 kB │ gzip:  15.44 kB (lazy)
dist/assets/QuestionnaireDetail.js   18.76 kB │ gzip:   6.66 kB (lazy)
dist/assets/DashboardPage.js         19.43 kB │ gzip:   6.70 kB (lazy)
dist/assets/HelpPage.js              ~12.00 kB │ gzip:  ~4.00 kB (lazy)
```

### Optimalizace:
- ✅ Code splitting pomocí React.lazy
- ✅ Lazy loading všech stránek kromě auth
- ✅ Suspense loading states
- ✅ Initial bundle z 765 kB → 638 kB

---

## 🔐 Bezpečnost

### Implementováno:
- ✅ Supabase Auth s email verifikací
- ✅ Row Level Security (RLS) na všech tabulkách
- ✅ HTTPS komunikace
- ✅ User-specific data queries
- ✅ Auth check na každé protected page

### TODO:
- ❌ Admin role check
- ❌ Rate limiting pro API calls
- ❌ Input sanitization

---

## 🤝 Contributing

Příspěvky jsou vítány! Prosím dodržujte tyto kroky:

1. Fork projektu
2. Vytvořte feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit změny (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otevřete Pull Request

---

## 👥 Autoři

- **Lenka** - Product Owner
- **Claude (Anthropic AI)** - Development Assistant

---

## 📄 License

Tento projekt je privátní. Všechna práva vyhrazena.

---

## 📞 Kontakt

Pro otázky nebo podporu:
- Email: support@lifepro.cz
- In-App Help: `/help`

---

## 🙏 Poděkování

- Material-UI team za skvělou knihovnu
- Supabase za backend infrastructure
- Vite team za nejrychlejší build tool
- Recharts za krásné grafy

---

**Built with ❤️ using React + Vite**

**Poslední aktualizace:** 2025-11-19
**Verze:** 2.0.0
