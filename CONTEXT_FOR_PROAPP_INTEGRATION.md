# 🎯 KONTEXT PRO INTEGRACI LIFEPRO → PROAPP

**Datum:** 2025-11-18
**Účel:** Kontext pro novou konverzaci s Claude Code v ProApp repozitáři
**Projekt:** Integrace LifePro aplikace do ProApp zastřešující platformy

---

## 📋 CO SE STALO V PŘEDCHOZÍ KONVERZACI

### Repozitář: `lifepro`
### Větev: `claude/restore-conversation-context-01Q3odK1SZ9FGXrLTALvoVrx`

V této konverzaci jsme vytvořili **kompletní LifePro aplikaci** s následující strukturou:

---

## 🗂️ CO BYLO VYTVOŘENO

### 1. **Datové soubory** (68 kategorií)
📁 Lokace: `data/categories/*.json`

Všechny kategorie dotazníku v JSON formátu včetně:
- Osobnost, hodnoty, dovednosti
- Životní směřování, mise, poslání
- Profesní profil, podnikání
- Psychologické aspekty (motivace, emoce, potřeby)
- Kreativní profil, digitální kompetence
- atd. (celkem 68 kategorií)

### 2. **Next.js Aplikace** (App Router)

#### Admin rozhraní (`src/app/(admin)/admin/`)
- `/admin/page.tsx` - Dashboard se statistikami
- `/admin/categories/page.tsx` - Správa kategorií
- `/admin/questions/page.tsx` - Správa otázek
- `/admin/sections/page.tsx` - Správa sekcí
- `layout.tsx` - Layout s ochranou admin přístupu

#### Autentizace (`src/app/(auth)/`)
- `/login/page.tsx` - Přihlášení
- `/register/page.tsx` - Registrace
- `/auth-callback/route.ts` - OAuth callback
- `layout.tsx` - Auth layout

#### Uživatelské rozhraní (`src/app/(user)/`)
- `/dashboard/page.tsx` - Hlavní dashboard uživatele
- `/profile/page.tsx` - Profil
- `/results/page.tsx` - Výsledky dotazníku + AI analýza
- `/questionnaire/[category]/page.tsx` - Dynamický dotazník
- `layout.tsx` - User layout s ochranou

### 3. **API Endpointy** (`src/app/api/`)

```typescript
// Admin statistiky
GET /api/admin/stats
// Vrací: počty uživatelů, kategorií, odpovědí

// AI analýza (Claude API)
POST /api/ai/analyze
// Vstup: user responses
// Výstup: AI analýza osobnosti, doporučení, blind spots

// Export PDF
POST /api/export/pdf
// Vstup: user data
// Výstup: PDF dokument

// Export JSON
GET/POST /api/export/json
// Výstup: JSON soubor s daty
```

### 4. **Sdílené komponenty** (`src/shared/components/`)

- `AnimatedGradient.tsx` - Animovaný gradient pozadí
- `GoogleSignInButton.tsx` - Google OAuth button
- `MindmapQuestion.tsx` - Interaktivní mindmap vizualizace
- `NavigationFloatingMenu.tsx` - Plovoucí navigace
- `ProfileScreen.tsx` - Profil uživatele
- `FlipCard.jsx` - Flip card komponenta

### 5. **Context a Hooks** (`src/shared/`)

```typescript
// Context
context/LifeAuthContext.tsx    // Auth management
context/ThemeContext.tsx        // Dark/light mode

// Hooks
hooks/useModernEffects.js      // Modern UI effects
hooks/useResponsive.js         // Responsive utilities
hooks/useSoundFeedback.js      // Audio feedback
```

### 6. **Supabase Integrace**

```typescript
// Supabase clients
src/lib/supabase/client.ts      // Client-side Supabase
src/lib/supabase/server.ts      // Server-side Supabase
src/lib/supabase/middleware.ts  // Auth middleware

// Migrace
supabase/migrations/001_lifepro_initial.sql
```

**Tabulky:**
- `lifepro_users` - Uživatelé
- `lifepro_categories` - Kategorie dotazníku
- `lifepro_sections` - Sekce v kategoriích
- `lifepro_questions` - Otázky
- `lifepro_user_responses` - Odpovědi uživatelů
- `lifepro_ai_analyses` - AI analýzy

### 7. **Utility a Utils**

```typescript
src/lib/theme/muiTheme.ts          // Material-UI téma
src/lib/utils/pdfGenerator.ts      // PDF export logic
src/shared/styles/animations.js    // Framer Motion animace
src/shared/styles/modernEffects.js // Glassmorphism, shadows
src/shared/styles/borderRadius.js  // Border radius konstanty
src/shared/constants/icons.ts      // Ikony (200+ emoji)
```

### 8. **Dokumentace vytvořená v této konverzaci**

- `LIFEPRO_OVERVIEW.md` - **HLAVNÍ DOKUMENT** - Kompletní přehled LifePro
- `PROAPP_CONTEXT.md` - Kontext ProApp ekosystému
- `PROAPP_QUICKSTART.md` - Quickstart guide
- `IMPLEMENTATION_PLAN.md` - Implementační plán
- `SUPABASE_SETUP.md` - Supabase setup
- `CONTEXT_PRO_DALSI_KONVERZACI.md` - Další kroky

---

## 🎯 NYNÍ POTŘEBUJEME: Integrovat LifePro do ProApp

### ProApp = Zastřešující platforma

ProApp je monorepo s 5 moduly:
1. **CoachPro** - Koučovací materiály
2. **PaymentsPro** - Správa faktur
3. **DigiPro** - Digitální produkty
4. **LifePro** - Tento projekt! (životní směřování)
5. **ContentPro** - Social media management

### Architektura ProApp (z dokumentace)

```
pro-app/
├── apps/
│   ├── proapp/           # Centrální auth hub
│   ├── coachpro/         # Modul 1
│   ├── paymentspro/      # Modul 2
│   ├── digipro/          # Modul 3
│   ├── lifepro/          # Modul 4 ← TOTO INTEGRUJEME
│   └── contentpro/       # Modul 5
│
├── packages/             # Sdílený kód
│   ├── @pro/ui/          # Design system
│   ├── @pro/auth/        # Auth utils
│   ├── @pro/database/    # Supabase utils
│   └── ...
│
└── supabase/             # Sdílená databáze
    ├── migrations/
    └── functions/
```

---

## 📦 CO PŘENÉST DO PROAPP

### Priorita 1: Datové soubory
- [ ] `data/categories/*.json` (68 souborů)
  - Zkopírovat do `apps/lifepro/data/categories/`

### Priorita 2: Stránky (Next.js → React+Vite)
⚠️ **POZOR:** ProApp používá **React + Vite**, ne Next.js!

Bude potřeba **konvertovat**:
- App Router pages → React Router pages
- `src/app/(user)/dashboard/page.tsx` → `apps/lifepro/src/pages/Dashboard.jsx`
- `src/app/(user)/questionnaire/[category]/page.tsx` → `apps/lifepro/src/pages/Questionnaire.jsx`
- API routes → Supabase Edge Functions nebo client-side logic

### Priorita 3: Komponenty (lze použít přímo)
- [ ] `src/shared/components/` → `apps/lifepro/src/components/`
  - Nebo lépe: `packages/@pro/ui/components/` (sdílené)

### Priorita 4: Supabase migrace
- [ ] `supabase/migrations/001_lifepro_initial.sql`
  - Přidat do `pro-app/supabase/migrations/005_lifepro.sql`
  - Prefix tabulek: `lifepro_*`

### Priorita 5: API logika
- [ ] `src/app/api/ai/analyze/route.ts` → Supabase Edge Function
- [ ] `src/app/api/export/pdf/route.ts` → Edge Function
- [ ] `src/app/api/admin/stats/route.ts` → Supabase queries

---

## 🚀 POSTUP INTEGRACE

### Krok 1: Analýza ProApp struktury
Claude musí nejdřív prozkoumat ProApp repo:
- Jaká je aktuální struktura?
- Které moduly už jsou hotové?
- Jak vypadá shared packages (`@pro/*`)?
- Jak funguje auth systém?

### Krok 2: Rozhodnout o strategii

**Varianta A: Úplná integrace**
- Přesunout vše z lifepro do `apps/lifepro/`
- Konvertovat Next.js → Vite
- Sloučit Supabase schema

**Varianta B: Postupná integrace**
- Začít s daty (kategorie JSON)
- Pak komponenty
- Pak logika

**Varianta C: Jako samostatný modul**
- Ponechat Next.js strukturu
- Propojit jen přes ProApp auth

### Krok 3: Implementace
- Zkopírovat soubory
- Přizpůsobit importy
- Testovat funkčnost
- Commit & push

---

## 📋 CHECKLIST PRO CLAUDE V PROAPP REPOZITÁŘI

Když začneš pracovat v ProApp, udělej následující:

### 1. Orientace
```bash
# Prozkoumat strukturu
ls -la
cat README.md
cat MONOREPO_MIGRATION_PLAN.md

# Zkontrolovat, které moduly jsou hotové
ls apps/

# Podívat se na shared packages
ls packages/@pro/
```

### 2. Zjistit tech stack
- [ ] Je to Turborepo monorepo?
- [ ] Používá PNPM nebo NPM?
- [ ] Které moduly už běží na Vite?
- [ ] Je Supabase už nastaven?

### 3. Najít dokumentaci
- [ ] Existuje `ARCHITECTURE.md`?
- [ ] Jak vypadá `apps/coachpro/` (jako referenční modul)?
- [ ] Jsou tam migrační skripty?

### 4. Připravit integraci LifePro
- [ ] Vytvořit `apps/lifepro/` složku
- [ ] Setup package.json
- [ ] Připravit Vite config
- [ ] Přidat do Turborepo config

### 5. Přenést data
- [ ] Zkopírovat `data/categories/*.json`
- [ ] Ověřit integrity

### 6. Konvertovat stránky
- [ ] Dashboard
- [ ] Questionnaire
- [ ] Results
- [ ] Profile

### 7. Integrovat s shared packages
- [ ] Použít `@pro/auth` místo LifeAuthContext
- [ ] Použít `@pro/ui` komponenty
- [ ] Použít `@pro/database` pro Supabase

### 8. Migrace databáze
- [ ] Přidat `005_lifepro.sql` migraci
- [ ] Spustit `supabase db push`
- [ ] Seed data (kategorie, sekce, otázky)

### 9. Testování
- [ ] Build passes
- [ ] Auth funguje
- [ ] Dotazník je funkční
- [ ] Export PDF/JSON funguje

### 10. Deploy
- [ ] Vercel/Railway setup
- [ ] Environment variables
- [ ] Test produkce

---

## 🔑 KLÍČOVÉ INFORMACE PRO CLAUDE

### Z LifePro máme:
✅ 68 kategorií dotazníku v JSON
✅ Kompletní Next.js aplikaci (auth, admin, user, AI)
✅ Supabase schéma s RLS policies
✅ Material-UI komponenty
✅ PDF/JSON export
✅ AI analýzu (Claude API)

### Co ProApp očekává:
🎯 React + Vite aplikace (NE Next.js)
🎯 Použití sdílených `@pro/*` packages
🎯 Jeden sdílený Supabase projekt
🎯 Module access control přes `module_access` tabulku
🎯 SSO (Single Sign-On) přes ProApp auth hub

### Hlavní výzvy:
⚠️ Konverze Next.js App Router → React Router
⚠️ API routes → Supabase Edge Functions
⚠️ Server components → Client components
⚠️ Middleware → Supabase RLS

---

## 📚 DOKUMENTY K PŘEČTENÍ V PROAPP

Až budeš v ProApp repozitáři, přečti si:

1. **MONOREPO_MIGRATION_PLAN.md** - Celková architektura
2. **ARCHITECTURE.md** (pokud existuje) - Tech stack
3. **apps/coachpro/** - Referenční implementace modulu
4. **packages/@pro/** - Dostupné sdílené packages
5. **supabase/migrations/** - Existující DB schéma

---

## 💬 OTÁZKY PRO LENKU (ZODPOVĚDĚT V NOVÉ KONVERZACI)

Až otevřeš ProApp repo, Claude se zeptá:

1. **Který modul z ProApp už je hotový?**
   - Můžeme se podle něj řídit při struktuře LifePro?

2. **Preferuješ úplnou konverzi Next.js → Vite?**
   - Nebo raději ponechat Next.js jako samostatnou app?

3. **Máš už hotový Supabase projekt pro ProApp?**
   - Pokud ano, můžeme hned migrovat schema

4. **Chceš integrovat LifePro postupně nebo najednou?**
   - Postupně = snazší debugging
   - Najednou = rychlejší výsledek

---

## 🎯 CÍL DALŠÍ KONVERZACE

**Input:** ProApp GitHub repozitář
**Output:** Funkční `apps/lifepro/` modul integrovaný do ProApp ekosystému

**Success kritéria:**
- ✅ LifePro běží jako samostatný modul v ProApp
- ✅ Používá sdílené `@pro/*` packages
- ✅ Auth přes ProApp centrální hub
- ✅ Data v sdíleném Supabase
- ✅ Build & deploy funguje

---

## 📂 SOUBORY K NAHRÁNÍ DO PROAPP

Až zkopíruješ `main` větev z `lifepro` do ProApp:

**Z lifepro main branch vezmi:**
- `data/categories/*.json` - všech 68 kategorií
- `src/app/` - jako referenci pro konverzi
- `src/shared/` - komponenty, hooks, utils
- `supabase/migrations/001_lifepro_initial.sql` - DB schema
- `LIFEPRO_OVERVIEW.md` - dokumentace

**Co NEPŘENÁŠET:**
- `node_modules/`
- `.next/`
- `.env.local`
- `package-lock.json` (ProApp může používat pnpm)

---

## ✅ READY!

**Tato konverzace je hotová.**
**V ProApp repozitáři:**
1. Otevři novou konverzaci
2. Dej Claude přístup k ProApp repo
3. Vlož tento dokument jako kontext
4. Řekni: "Integrejme LifePro do ProApp podle CONTEXT_FOR_PROAPP_INTEGRATION.md"

---

**Good luck! 🚀**
**Vytvořeno:** 2025-11-18 v `lifepro` repozitáři
