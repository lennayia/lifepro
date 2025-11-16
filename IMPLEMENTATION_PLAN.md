# LifePro - Implementační Plán (Hybridní Přístup)

**Datum:** 16.11.2025
**Cíl:** Vytvořit LifePro kompatibilní s ekosystémem CoachPro, PaymentsPro, DigiPro

---

## 🎯 Hybridní Přístup - Shrnutí

### **Co kombinujeme:**

**Z CoachPro (Design & Moduly):**
- ✅ MUI (Material-UI) místo Tailwind
- ✅ Shared komponenty (FlipCard, AnimatedGradient, PhotoUpload, atd.)
- ✅ Shared hooks (useSoundFeedback, useModernEffects, useResponsive)
- ✅ Shared utils (czechGrammar, imageCompression, validation)
- ✅ Shared styles (animations, borderRadius, modernEffects, colors)
- ✅ Lucide React icons (místo emoji nebo jiných ikon)
- ✅ Design system (barvy, border radius, glassmorphism)
- ✅ Czech language first

**Z aktuálního LifePro (Architektura & Data):**
- ✅ Next.js 15 + TypeScript (modernější než Vite)
- ✅ Dynamická databáze (categories/sections/questions)
- ✅ Admin rozhraní pro správu otázek
- ✅ Supabase backend
- ✅ Komplexní obsah z PDF (122 stran materiálu)

**Výsledek:**
- ✅ Next.js + MUI + CoachPro shared moduly + Dynamický content system
- ✅ Konzistence s ekosystémem Pro aplikací
- ✅ Flexibilní správa obsahu bez code changes
- ✅ Škálovatelnost a rozšiřitelnost

---

## 📦 Tech Stack (Finální)

```javascript
{
  // Frontend Framework
  "next": "^15.0.0",              // Server components, App Router
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.3.0",

  // UI Framework (Z CoachPro)
  "@mui/material": "^5.15.0",     // Komponenty
  "@mui/icons-material": "^5.15.0",
  "@emotion/react": "^11.11.0",   // MUI dependencies
  "@emotion/styled": "^11.11.0",

  // Icons (Lucide - podle požadavku)
  "lucide-react": "^0.323.0",     // Moderní ikony

  // Animations (Z CoachPro)
  "framer-motion": "^11.0.0",     // FlipCard animace

  // Backend & Database
  "@supabase/supabase-js": "^2.39.0",
  "@supabase/auth-helpers-nextjs": "^0.8.7",

  // AI
  "@anthropic-ai/sdk": "^0.17.0", // Claude API

  // Forms & Validation
  "react-hook-form": "^7.49.0",
  "@hookform/resolvers": "^3.3.4",
  "zod": "^3.22.4",

  // Utilities
  "date-fns": "^3.3.0",           // Czech date formatting
  "clsx": "^2.1.0",               // Class merging

  // Image Compression (Z CoachPro)
  "browser-image-compression": "^2.0.2"
}
```

**❌ CO NEPOUŽÍVÁME:**
- ❌ Tailwind CSS (nahrazeno MUI)
- ❌ tailwind-merge (nepotřebujeme)
- ❌ autoprefixer, postcss (nepotřebujeme s MUI)

---

## 📂 Finální File Structure

```
lifepro/
├── public/
│   └── logo.svg
│
├── src/
│   ├── app/                            # Next.js App Router
│   │   ├── layout.tsx                  # Root layout s MUI ThemeProvider
│   │   ├── page.tsx                    # Homepage
│   │   │
│   │   ├── (auth)/                     # Auth group
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── auth-callback/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (user)/                     # User pages
│   │   │   ├── layout.tsx              # User layout s NavigationFloatingMenu
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx            # Dashboard s FlipCards pro kategorie
│   │   │   ├── questionnaire/
│   │   │   │   └── [category]/
│   │   │   │       └── page.tsx        # Dynamické otázky
│   │   │   ├── results/
│   │   │   │   └── page.tsx            # AI analýza a výsledky
│   │   │   └── profile/
│   │   │       └── page.tsx            # ProfileScreen z CoachPro
│   │   │
│   │   ├── (admin)/                    # Admin pages
│   │   │   ├── layout.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx            # Admin dashboard
│   │   │   │   ├── categories/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── sections/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── questions/
│   │   │   │       └── page.tsx
│   │   │
│   │   └── api/                        # API routes
│   │       ├── auth/
│   │       │   └── callback/
│   │       │       └── route.ts
│   │       └── ai/
│   │           └── analyze/
│   │               └── route.ts
│   │
│   ├── modules/                        # Domain-specific modules
│   │   └── life/
│   │       ├── components/             # LifePro-specific komponenty
│   │       │   ├── DimensionCard.tsx   # Použije FlipCard z shared
│   │       │   ├── QuestionForm.tsx
│   │       │   ├── CategoryProgress.tsx
│   │       │   ├── SrdcovkaButton.tsx  # "Favorite" tlačítko
│   │       │   └── WordCloud.tsx
│   │       │
│   │       └── utils/
│   │           ├── storage.ts          # Supabase queries
│   │           ├── analysis.ts         # Pattern detection
│   │           └── synthesis.ts        # AI prompt generation
│   │
│   └── shared/                         # COPIED FROM COACHPRO
│       ├── components/
│       │   ├── cards/
│       │   │   ├── FlipCard.jsx        ✅ Hotové
│       │   │   └── BaseCard.jsx
│       │   ├── effects/
│       │   │   └── AnimatedGradient.jsx
│       │   ├── GoogleSignInButton.jsx
│       │   ├── RegisterForm.jsx
│       │   ├── WelcomeScreen.jsx
│       │   ├── ProfileScreen.jsx
│       │   ├── PhotoUpload.jsx
│       │   ├── FloatingMenu.jsx
│       │   ├── NavigationFloatingMenu.jsx
│       │   ├── Breadcrumbs.jsx
│       │   ├── Footer.jsx
│       │   └── Layout.jsx
│       │
│       ├── context/
│       │   ├── LifeAuthContext.tsx     # Nové (based on TesterAuthContext)
│       │   └── NotificationContext.jsx
│       │
│       ├── hooks/
│       │   ├── useSoundFeedback.js     ✅ Hotové
│       │   ├── useModernEffects.js
│       │   └── useResponsive.js
│       │
│       ├── utils/
│       │   ├── imageCompression.js
│       │   ├── photoStorage.js
│       │   ├── czechGrammar.js         ✅ Hotové
│       │   ├── validation.js
│       │   ├── dateFormatters.js
│       │   └── generateCode.js
│       │
│       ├── styles/
│       │   ├── animations.js           # Framer Motion presets
│       │   ├── borderRadius.js
│       │   ├── modernEffects.js        # Glassmorphism
│       │   └── colors.js
│       │
│       └── constants/
│           └── icons.ts                # Lucide React icons
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   ✅ Hotové
│   │   ├── server.ts
│   │   └── middleware.ts
│   └── theme/
│       └── muiTheme.ts                 # MUI theme s CoachPro barvami
│
├── types/
│   └── database.ts                     ✅ Hotové
│
├── supabase-schema.sql                 ✅ Hotové
├── supabase-seed.sql                   # Nové - pre-fill s daty z PDF
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.example
```

---

## 🗄️ Databázová Struktura

### **Existující Tabulky** (z supabase-schema.sql):
```sql
✅ categories         -- Hlavní kategorie (JSEM, VÍM, UMÍM, MÁM RÁD/A)
✅ sections           -- Podsekce (Role, Vzdělání, Dovednosti)
✅ questions          -- Otázky s různými typy
✅ question_options   -- Možnosti pro checkbox/radio/select
✅ user_responses     -- Odpovědi uživatelů
✅ user_progress      -- Progress tracking
✅ ai_analyses        -- AI analýzy
✅ user_exports       -- PDF/JSON exporty
✅ admin_users        -- Admin přístup
✅ audit_logs         -- Audit trail
```

### **Nové: Pre-fill Data z PDF**

Vytvoříme `supabase-seed.sql` s obsahem:

**Kategorie** (z PDF):
1. **JSEM** (Přítomnost) - 1P-x
2. **VÍM** (Přítomnost) - 2P-x
3. **UMÍM** (Přítomnost) - 3P-x
4. **MÁM RÁD/A** (Přítomnost) - 4P-x
5. **BAVILO MĚ** (Minulost) - xM-x
6. **CHTĚL/A JSEM** (Minulost) - xM-x
7. **CHCI** (Budoucnost) - xB-x
8. **MŮŽU** (Budoucnost) - xB-x

**Sekce** (příklady z PDF):
- JSEM → Role v životě (1P-2)
- JSEM → Sebepojetí (1P-3)
- JSEM → Priority (1P-4)
- VÍM → Vzdělání (2P-1)
- VÍM → Kurzy (2P-1)
- UMÍM → Hlavou (3P-0)
- UMÍM → Rukama (3P-0)
- MÁM RÁD/A → Planeta (4P-1-1)

**Otázky** (z PDF - cca 300-500 otázek):
- "Momentálně jsem..." (checkbox: OSVČ, na mateřské, student, ...)
- "Co tě baví nejvíc?" (checkbox s možnostmi)
- "V životě hrajeme nespočet rolí..." (mindmap)
- atd.

---

## 🎨 Design System (Z CoachPro)

### **Barvy**
```javascript
// lib/theme/muiTheme.ts

import { createTheme } from '@mui/material/styles';
import { THEME_COLORS } from '@/shared/styles/colors';

export const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#8FBC8F',      // Soft green (CoachPro)
      light: '#B2D8B2',
      dark: '#556B2F',
    },
    secondary: {
      main: '#D4A574',      // Warm beige
      light: '#E6C9A8',
      dark: '#A67C52',
    },
    background: {
      default: mode === 'dark' ? '#0a0f0a' : '#f5f5f0',
      paper: mode === 'dark' ? '#1a2410' : '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,       // BORDER_RADIUS.card
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

### **Border Radius**
```javascript
// shared/styles/borderRadius.js
export const BORDER_RADIUS = {
  none: 0,
  compact: 8,
  card: 12,
  button: 8,
  input: 8,
  modal: 16,
  pill: 50,
};
```

### **Animations**
```javascript
// shared/styles/animations.js
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};
```

### **Lucide Icons**
```typescript
// shared/constants/icons.ts
import {
  Home, User, Settings, LogOut,
  Heart, Sparkles, BookOpen, Brain,
  Target, Compass, Star, CheckCircle,
  ChevronRight, ChevronLeft,
} from 'lucide-react';

export const NAVIGATION_ICONS = {
  dashboard: Home,
  profile: User,
  results: Brain,
};

export const UI_ICONS = {
  srdcovka: Heart,      // Favorite button
  sparkles: Sparkles,
  star: Star,
  check: CheckCircle,
};

export const SETTINGS_ICONS = {
  settings: Settings,
  logout: LogOut,
};
```

---

## 🚀 Implementační Fáze

### **FÁZE 1: Setup & Dependencies** (1 den)

**Co udělat:**
1. ✅ Aktualizovat `package.json` - přidat MUI, odstranit Tailwind
2. ✅ Vytvořit `lib/theme/muiTheme.ts` s CoachPro barvami
3. ✅ Upravit `src/app/layout.tsx` - přidat ThemeProvider
4. ✅ Vytvořit `shared/constants/icons.ts` s Lucide icons
5. ✅ Vytvořit `supabase-seed.sql` s daty z PDF

**Výstupy:**
- ✅ Funkční MUI theme
- ✅ Všechny dependencies nainstalovány
- ✅ Databáze naplněna základním obsahem

---

### **FÁZE 2: Shared Moduly** (2 dny)

**Co udělat:**
1. ✅ Zkontrolovat všechny shared komponenty (24 souborů)
2. ✅ Upravit importy pro Next.js (pokud potřeba)
3. ✅ Vytvořit barrel exports (`shared/index.ts`)
4. ✅ Test každého shared modulu v isolaci

**Komponenty k ověření:**
- ✅ FlipCard.jsx (hotové, používá MUI + Framer Motion)
- ✅ useSoundFeedback.js (hotové, Web Audio API)
- ✅ czechGrammar.js (hotové)
- ⏳ Zbytek (22 souborů)

---

### **FÁZE 3: Authentication** (2 dny)

**Co udělat:**
1. ✅ Vytvořit `shared/context/LifeAuthContext.tsx`
2. ✅ Implementovat Google OAuth (použít GoogleSignInButton)
3. ✅ Implementovat Email/Password (použít RegisterForm)
4. ✅ Auth pages: `/login`, `/register`, `/auth-callback`
5. ✅ Middleware pro protected routes

**Použité shared komponenty:**
- GoogleSignInButton.jsx
- RegisterForm.jsx
- WelcomeScreen.jsx

---

### **FÁZE 4: User Dashboard** (3 dny)

**Co udělat:**
1. ✅ User layout s NavigationFloatingMenu
2. ✅ Dashboard - přehled kategorií jako FlipCards
3. ✅ Progress tracking (kolik % dokončeno)
4. ✅ ProfileScreen (použít z CoachPro)

**Použité shared komponenty:**
- NavigationFloatingMenu.jsx
- FlipCard.jsx (pro kategorie)
- ProfileScreen.jsx
- PhotoUpload.jsx
- AnimatedGradient.jsx (pozadí)

**Design:**
```tsx
// Dashboard s FlipCards pro kategorie
<Grid container spacing={3}>
  {categories.map(category => (
    <Grid item xs={12} sm={6} md={4} key={category.id}>
      <FlipCard
        frontContent={
          <DimensionCard
            icon={category.icon}
            title={category.title}
            progress={category.progress}
          />
        }
        backContent={
          <CategoryDetails category={category} />
        }
        onFlip={(isFlipped) => playFlip()}
      />
    </Grid>
  ))}
</Grid>
```

---

### **FÁZE 5: Questionnaire** (4 dny)

**Co udělat:**
1. ✅ Dynamické načítání otázek z DB
2. ✅ QuestionForm komponenta (různé typy otázek)
3. ✅ Srdcovka systém (favorite marking)
4. ✅ Real-time ukládání odpovědí
5. ✅ Progress bar
6. ✅ Sound feedback při každé akci

**Použité shared komponenty:**
- useSoundFeedback (playClick, playSuccess)
- useResponsive (mobile/desktop layout)
- NotificationContext (success/error messages)

**Typy otázek** (z PDF a schema):
- text, textarea
- checkbox, radio, select, multiselect
- slider, rating
- date
- mindmap (custom)

**UX Flow:**
```
1. User vybere kategorii (např. "JSEM")
2. Zobrazí se sekce (Role, Sebepojetí, Priority)
3. User vyplňuje otázky postupně
4. Může označit "srdcovky" (max 3 per sekce)
5. Auto-save každých 5 sec
6. Sound feedback při každé akci
7. Progress se aktualizuje real-time
```

---

### **FÁZE 6: Admin Interface** (3 dny)

**Co udělat:**
1. ✅ Admin layout
2. ✅ Categories CRUD
3. ✅ Sections CRUD
4. ✅ Questions CRUD
5. ✅ Question Options CRUD (quick add)
6. ✅ Statistiky (kolik uživatelů, completion rate)

**Design:**
- Použít MUI DataGrid nebo vlastní tabulky
- Drag & drop pro order (react-beautiful-dnd nebo @dnd-kit)
- Quick add pro options (napsat + Enter)

---

### **FÁZE 7: AI Analysis** (2 dny)

**Co udělat:**
1. ✅ Vytvořit `lib/ai/analyzer.ts`
2. ✅ Pattern detection v odpovědích
3. ✅ Claude API integrace
4. ✅ Generování "Vašeho poslání"
5. ✅ Doporučení dalších kroků

**AI Prompt Structure:**
```typescript
const analyzeUserResponses = async (userId: string) => {
  // 1. Fetch all user responses
  const responses = await fetchResponses(userId);

  // 2. Group by categories & sentiments
  const grouped = groupBySentiment(responses);

  // 3. Generate prompt for Claude
  const prompt = `
    Analyzuj odpovědi uživatele a nalezni jeho životní poslání:

    POZITIVNÍ (co má rád):
    ${grouped.positive.join(', ')}

    NEGATIVNÍ (co nesnáší):
    ${grouped.negative.join(', ')}

    DOVEDNOSTI:
    ${grouped.skills.join(', ')}

    ZNALOSTI:
    ${grouped.knowledge.join(', ')}

    Vrať JSON s:
    - title: "Vaše poslání" (1 věta)
    - key_strengths: [top 5 silných stránek]
    - ideal_activities: [ideální činnosti]
    - recommended_fields: [obory/profese]
    - next_steps: [konkrétní akční kroky]
  `;

  // 4. Call Claude API
  const analysis = await callClaudeAPI(prompt);

  // 5. Save to DB
  await saveAnalysis(userId, analysis);

  return analysis;
};
```

---

### **FÁZE 8: Results & Export** (2 dny)

**Co udělat:**
1. ✅ Results page - zobrazení AI analýzy
2. ✅ Word Cloud z nejčastějších slov
3. ✅ Bar charts (sentiment analysis)
4. ✅ PDF export (react-pdf nebo jsPDF)
5. ✅ Share results (optional)

**Vizualizace:**
- Word Cloud (react-wordcloud)
- Charts (recharts nebo Chart.js)
- FlipCards pro výsledky
- AnimatedGradient pozadí

---

## ✅ Checklist pro Start

### **1. Příprava**
- [ ] Stáhnout všechny PDF soubory a extrahovat otázky
- [ ] Vytvořit spreadsheet s kategoriemi/sekcemi/otázkami
- [ ] Naplánovat, které otázky jdou do MVP (top 50-100)

### **2. Development Environment**
- [ ] Vytvořit novou větev `feature/hybrid-migration`
- [ ] Backup aktuálního stavu
- [ ] Připravit Supabase projekt

### **3. Dependencies**
- [ ] Aktualizovat package.json
- [ ] npm install
- [ ] Otestovat, že Next.js běží

### **4. Database**
- [ ] Spustit `supabase-schema.sql`
- [ ] Vytvořit a spustit `supabase-seed.sql`
- [ ] Ověřit data v Supabase Dashboard

### **5. First Component**
- [ ] Vytvořit MUI theme
- [ ] Otestovat FlipCard v Next.js
- [ ] Vytvořit první page s MUI komponenty

---

## 🎯 MVP Scope (3-4 týdny)

### **Co MUSÍ být v MVP:**
✅ Auth (Google + Email)
✅ User dashboard s progress
✅ 4 kategorie (JSEM, VÍM, UMÍM, MÁM RÁD/A)
✅ Top 50-100 otázek
✅ Srdcovka systém
✅ Basic AI analýza
✅ Results page
✅ Admin pro přidávání otázek

### **Co NENÍ v MVP (v2):**
⏳ PDF export
⏳ Mindmap vizualizace
⏳ Advanced analytics
⏳ Social sharing
⏳ Všech 300-500 otázek

---

## 📚 Dokumentace

### **Pro Vývojáře:**
- `IMPLEMENTATION_PLAN.md` (tento soubor)
- `LIFEPRO_STARTER_PACKAGE.md` (koncept)
- `PROJECT-SUMMARY.md` (aktuální stav)
- `SETUP.md` (quick start guide)

### **Kód Dokumentace:**
- JSDoc komentáře v každém shared modulu
- TypeScript typy pro vše
- README v každé složce

---

## 🚨 Důležité Poznámky

1. **Konzistence s CoachPro:**
   - Vždy používat shared komponenty
   - Dodržovat naming conventions
   - Czech language first
   - Stejné barvy, border radius, animace

2. **Performance:**
   - Lazy loading pro komponenty
   - Image compression (WebP)
   - Sound feedback opt-in
   - Real-time ukládání s debounce (5 sec)

3. **Security:**
   - RLS na všech tabulkách
   - Validace na frontendu i backendu
   - Sanitizace user inputů
   - HTTPS only

4. **Accessibility:**
   - Keyboard navigation
   - ARIA labels
   - Color contrast (WCAG AA)
   - Screen reader support

---

## 🎉 Výsledek

**Po dokončení implementace budeme mít:**

✅ Moderní Next.js aplikace
✅ 100% kompatibilní s CoachPro designem
✅ Flexibilní content management
✅ AI-powered analýza
✅ Škálovatelná architektura
✅ Připraveno pro rozšíření

**A to vše v rámci ekosystému Pro aplikací!** 🚀

---

*Vytvořeno: 16.11.2025*
*Autor: Claude Code*
*Verze: 1.0*
