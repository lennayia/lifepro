# LifePro - Kompletní přehled vytvořené struktury

**Vygenerováno:** 2025-11-18
**Větev:** `claude/restore-conversation-context-01Q3odK1SZ9FGXrLTALvoVrx`

---

## 📊 Obsah

1. [Datová struktura (68 kategorií)](#datová-struktura)
2. [Next.js aplikace](#nextjs-aplikace)
3. [API Endpointy](#api-endpointy)
4. [Sdílené komponenty](#sdílené-komponenty)
5. [Integrace](#integrace)
6. [Soubory pro migraci](#soubory-pro-migraci)

---

## 1. Datová struktura (68 kategorií)

### Umístění: `./data/categories/*.json`

Všechny kategorie v JSON formátu s otázkami a možnostmi. Obsahuje psychologické profily, hodnoty, dovednosti, zájmy atd.

**Seznam kategorií:**
- avatar-zakaznika.json
- charakter.json
- chovani.json
- co-na-sebe.json
- delam.json
- digitalni-kompetence.json
- dovednosti.json
- flow-radost.json
- harmonogram.json
- hodnoty.json
- idealni-zivot.json
- inteligence-typy.json
- jidlo.json
- jsem-pritomnost.json
- kognitivni-styly.json
- kreativita.json
- kreativni-prumysly.json
- kvarterni-sektor.json
- kvinterni-sektor.json
- lide-nechteji.json
- lidske-potreby.json
- mam-rada.json
- material.json
- mise-poslani.json
- moje-cesta.json
- moje-tema.json
- motivace.json
- moznosti.json
- nechci.json
- nezive.json
- osobnost.json
- osobnostni-typy-rozsireni.json
- pece-o-zdravi.json
- penize.json
- pocasi-obdobi.json
- pocitky.json
- podnikani.json
- pohyb-sport.json
- poradek.json
- postoje-hodnoty.json
- potrebuju.json
- pozitivni-emoce.json
- predsudky.json
- priority.json
- prodej.json
- produkt.json
- profese.json
- projevy-vyzarovani.json
- prostredi.json
- rysy.json
- schopnosti.json
- sebepojetí.json
- sekundarni-sektor.json
- sny-minulost.json
- socialni-dovednosti.json
- styl.json
- terciarni-sektor.json
- umim-resit.json
- uspechy-zdroje.json
- v-tv-sleduji.json
- vlastnosti-velka-petka.json
- vse-zive.json
- vsimam-si.json
- vykonove-vlastnosti.json
- zajima-me.json
- zivotni-zkusenosti.json

---

## 2. Next.js aplikace

### Struktura složek:

```
src/
├── app/
│   ├── (admin)/          # Admin rozhraní
│   │   ├── admin/
│   │   │   ├── page.tsx             # Dashboard s statistikami
│   │   │   ├── categories/page.tsx  # Správa kategorií
│   │   │   ├── questions/page.tsx   # Správa otázek
│   │   │   └── sections/page.tsx    # Správa sekcí
│   │   └── layout.tsx               # Layout s ochranou admin přístupu
│   │
│   ├── (auth)/           # Autentizace
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── auth-callback/route.ts
│   │   └── layout.tsx
│   │
│   ├── (user)/           # Uživatelské rozhraní
│   │   ├── dashboard/page.tsx       # Hlavní dashboard uživatele
│   │   ├── profile/page.tsx         # Profil uživatele
│   │   ├── results/page.tsx         # Výsledky dotazníku
│   │   ├── questionnaire/[category]/page.tsx  # Dynamický dotazník
│   │   └── layout.tsx               # Layout s ochranou přístupu
│   │
│   ├── api/              # API routes
│   ├── demo/page.tsx     # Demo stránka
│   ├── page.tsx          # Hlavní stránka
│   └── layout.tsx        # Root layout
│
├── lib/
│   ├── supabase/         # Supabase integrace
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── theme/
│   │   └── muiTheme.ts   # Material-UI téma
│   └── utils/
│       └── pdfGenerator.ts  # PDF export
│
├── shared/
│   ├── components/       # Sdílené komponenty
│   ├── constants/        # Konstanty (ikony)
│   ├── context/          # React kontexty
│   └── index.ts
│
└── types/
    └── database.ts       # TypeScript typy pro Supabase
```

---

## 3. API Endpointy

### `/api/admin/stats/route.ts`
- **Metoda:** GET
- **Funkce:** Vrací admin statistiky (počet uživatelů, kategorií, odpovědí atd.)
- **Ochrana:** Vyžaduje admin práva

### `/api/ai/analyze/route.ts`
- **Metoda:** POST
- **Funkce:** AI analýza uživatelských odpovědí
- **Vstup:** Odpovědi uživatele
- **Výstup:** Analýza osobnosti, doporučení

### `/api/export/pdf/route.ts`
- **Metoda:** POST
- **Funkce:** Export výsledků do PDF
- **Vstup:** Uživatelská data
- **Výstup:** PDF dokument

### `/api/export/json/route.ts`
- **Metoda:** GET/POST
- **Funkce:** Export dat do JSON
- **Výstup:** JSON soubor

---

## 4. Sdílené komponenty

### `src/shared/components/`

1. **AnimatedGradient.tsx**
   - Animovaný gradient pozadí
   - Použití: dekorativní prvek

2. **GoogleSignInButton.tsx**
   - Tlačítko pro přihlášení přes Google
   - Integrace s Supabase Auth

3. **MindmapQuestion.tsx**
   - Interaktivní vizualizace otázek ve stylu mindmapy
   - Drag & drop funkcionalita

4. **NavigationFloatingMenu.tsx**
   - Plovoucí navigační menu
   - Responsivní design

5. **ProfileScreen.tsx**
   - Obrazovka profilu uživatele
   - Zobrazení osobních informací a výsledků

### `src/shared/context/`

1. **LifeAuthContext.tsx**
   - React Context pro autentizaci
   - Správa stavu přihlášeného uživatele

2. **ThemeContext.tsx**
   - React Context pro téma (dark/light mode)
   - Persistence do localStorage

---

## 5. Integrace

### Supabase
- **Database:** PostgreSQL s prefixem `lifepro_`
- **Tabulky:**
  - `lifepro_users` - uživatelé
  - `lifepro_categories` - kategorie
  - `lifepro_questions` - otázky
  - `lifepro_answers` - odpovědi
  - `lifepro_sections` - sekce

- **Auth:** Google OAuth, Email/Password
- **Row Level Security (RLS):** Aktivní pro všechny tabulky

### Material-UI
- Custom téma v `src/lib/theme/muiTheme.ts`
- Paleta barev, typografie, komponenty

### PDF Export
- Knihovna: `pdfkit`
- Generování přehledných PDF reportů

---

## 6. Soubory pro migraci do ProApp

### Klíčové soubory k přenosu:

#### Datové soubory:
- [ ] `data/categories/*.json` (68 souborů)

#### Komponenty:
- [ ] `src/shared/components/AnimatedGradient.tsx`
- [ ] `src/shared/components/GoogleSignInButton.tsx`
- [ ] `src/shared/components/MindmapQuestion.tsx`
- [ ] `src/shared/components/NavigationFloatingMenu.tsx`
- [ ] `src/shared/components/ProfileScreen.tsx`

#### Context:
- [ ] `src/shared/context/LifeAuthContext.tsx`
- [ ] `src/shared/context/ThemeContext.tsx`

#### API Routes:
- [ ] `src/app/api/admin/stats/route.ts`
- [ ] `src/app/api/ai/analyze/route.ts`
- [ ] `src/app/api/export/pdf/route.ts`
- [ ] `src/app/api/export/json/route.ts`

#### Stránky - Admin:
- [ ] `src/app/(admin)/admin/page.tsx`
- [ ] `src/app/(admin)/admin/categories/page.tsx`
- [ ] `src/app/(admin)/admin/questions/page.tsx`
- [ ] `src/app/(admin)/admin/sections/page.tsx`
- [ ] `src/app/(admin)/layout.tsx`

#### Stránky - User:
- [ ] `src/app/(user)/dashboard/page.tsx`
- [ ] `src/app/(user)/profile/page.tsx`
- [ ] `src/app/(user)/results/page.tsx`
- [ ] `src/app/(user)/questionnaire/[category]/page.tsx`
- [ ] `src/app/(user)/layout.tsx`

#### Stránky - Auth:
- [ ] `src/app/(auth)/login/page.tsx`
- [ ] `src/app/(auth)/register/page.tsx`
- [ ] `src/app/(auth)/auth-callback/route.ts`
- [ ] `src/app/(auth)/layout.tsx`

#### Utility & Lib:
- [ ] `src/lib/supabase/client.ts`
- [ ] `src/lib/supabase/server.ts`
- [ ] `src/lib/supabase/middleware.ts`
- [ ] `src/lib/theme/muiTheme.ts`
- [ ] `src/lib/utils/pdfGenerator.ts`

#### Types:
- [ ] `types/database.ts`

#### Config:
- [ ] `middleware.ts`
- [ ] `tsconfig.json`
- [ ] `package.json` (dependencies)

---

## 7. Databázová struktura (Supabase SQL)

### Tabulky:

```sql
-- Users table
CREATE TABLE lifepro_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE lifepro_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE lifepro_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES lifepro_categories(id),
  text TEXT NOT NULL,
  type TEXT NOT NULL, -- 'single', 'multiple', 'scale', etc.
  options JSONB,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Answers table
CREATE TABLE lifepro_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES lifepro_users(id),
  question_id UUID REFERENCES lifepro_questions(id),
  answer JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sections table
CREATE TABLE lifepro_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 8. Závislosti (package.json highlights)

```json
{
  "dependencies": {
    "@mui/material": "^5.x",
    "@supabase/supabase-js": "^2.x",
    "next": "14.x",
    "react": "^18.x",
    "pdfkit": "^0.x"
  }
}
```

---

## 9. Doporučený postup integrace do ProApp

### Varianta A: Kompletní přenos
1. Zkopírovat všechny soubory do ProApp struktury
2. Přizpůsobit cesty importů
3. Sloučit `package.json` dependencies
4. Provést testování

### Varianta B: Selektivní integrace
1. Identifikovat, které funkce už ProApp má
2. Přenést pouze chybějící komponenty/featury
3. Sjednotit API endpointy
4. Zajistit kompatibilitu databázových schémat

### Varianta C: Modulární přístup
1. Vytvořit LifePro jako modul/feature v ProApp
2. Izolovat funkcionalitu
3. Postupně integrovat

---

## 10. Poznámky

- Všechny komponenty jsou TypeScript
- Použit Next.js 14 App Router
- Material-UI pro UI komponenty
- Supabase pro backend
- PDF export pomocí pdfkit
- AI analýza integrována

---

**Kontakt pro dotazy:** Tento dokument byl automaticky vygenerován.
