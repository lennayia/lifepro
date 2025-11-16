# LifePro - Aplikace pro nalezení životního poslání

Moderní webová aplikace pro mapování osobnosti a objevení práce snů.

## 🎯 Vlastnosti

- ✅ **Kompletní databáze otázek** - flexibilní systém kategorií, sekcí a otázek
- ✅ **Admin rozhraní** - snadná správa obsahu bez programování
- ✅ **Modulární vyplňování** - uživatel si vybírá, co vyplní
- ✅ **AI analýza** - inteligentní vyhodnocení odpovědí
- ✅ **Vizuální výsledky** - přehledné zobrazení osobnostní DNA
- ✅ **Progresivní disclosure** - postupné odhalování bez přetížení
- ✅ **Real-time ukládání** - žádná ztráta dat

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **AI**: Claude API (Anthropic)
- **Deployment**: Vercel

## 📁 Struktura projektu

```
lifepro-app/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (user)/              # User pages (dashboard, questionnaire)
│   ├── (admin)/             # Admin pages (content management)
│   └── api/                 # API routes
├── components/
│   ├── admin/               # Admin komponenty
│   ├── user/                # User komponenty
│   └── ui/                  # Sdílené UI komponenty
├── lib/
│   ├── supabase/            # Supabase client & helpers
│   ├── ai/                  # AI analýza
│   └── utils/               # Utility funkce
├── types/
│   └── database.ts          # TypeScript typy
├── supabase-schema.sql      # Databázové schéma
└── README.md
```

## 🚀 Instalace a setup

### 1. Naklonovat projekt

```bash
cd lifepro-app
npm install
```

### 2. Nastavit Supabase

1. Vytvořte účet na [supabase.com](https://supabase.com)
2. Vytvořte nový projekt
3. V SQL Editoru spusťte obsah souboru `supabase-schema.sql`
4. Zkopírujte API klíče (Settings → API)

### 3. Environment variables

Vytvořte `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Claude AI (optional for MVP)
ANTHROPIC_API_KEY=your-claude-api-key
```

### 4. Vytvořit admin uživatele

Po registraci prvního uživatele, v Supabase SQL Editoru:

```sql
-- Nahraďte YOUR_USER_ID skutečným ID
INSERT INTO admin_users (user_id, role, permissions)
VALUES ('YOUR_USER_ID', 'super_admin', ARRAY['all']);
```

### 5. Spustit development server

```bash
npm run dev
```

Otevřete [http://localhost:3000](http://localhost:3000)

## 📝 Jak používat Admin rozhraní

### Přidání kategorie

1. Přejděte na `/admin/categories`
2. Klikněte na "Nová kategorie"
3. Vyplňte:
   - **Slug**: `ja-jsem` (lowercase, no spaces)
   - **Název**: `Já jsem`
   - **Popis**: `Kdo jsem v současnosti`
   - **Ikona**: `🎭` (emoji)
   - **Období**: `present` / `past` / `future`
   - **Pořadí**: `1`
4. Uložte

### Přidání sekce

1. V kategorii klikněte "Nová sekce"
2. Vyplňte podobně jako kategorii
3. Sekce se automaticky přiřadí ke kategorii

### Přidání otázky

1. V sekci klikněte "Nová otázka"
2. Vyplňte:
   - **Text otázky**: `Momentálně jsem...`
   - **Nápověda**: `Např: na mateřské, OSVČ...`
   - **Typ**: Vyberte z:
     - `text` - krátký text
     - `textarea` - dlouhý text
     - `checkbox` - vícenásobný výběr
     - `radio` - jeden výběr
     - `select` - dropdown
     - `slider` - posuvník 1-10
   - **Povolit srdcovku**: ✓
   - **Max srdcoček**: `3`

### Rychlé přidání možností

Pro otázky typu `checkbox`, `radio`, `select`:

1. Otevřete otázku
2. V sekci "Možnosti" klikněte "+ Přidat"
3. Napište např: `materska` (value) → `na mateřské` (label)
4. Stiskněte Enter pro další

**Tip**: Můžete přidat více možností najednou oddělených čárkou:
```
materska,osvc,zamestnanec,student
```

## 🎨 Jak vypadá user flow

### 1. Registrace / Přihlášení
```
/login → Email + heslo → Dashboard
```

### 2. Dashboard (přehled)
```
┌──────────────────────────────┐
│ Můj profil: 35% dokončeno    │
├──────────────────────────────┤
│ 🎭 Já jsem          ████░░ 80%│
│ 💪 Umím             ██░░░░ 40%│
│ 🎓 Vím              █░░░░░ 20%│
│ ❤️ Mám rád/a       ░░░░░░  0%│
│ 👶 Bavilo mě        ░░░░░░  0%│
│ 🚀 Chci             ░░░░░░  0%│
│                              │
│ [Pokračovat]                 │
│ [Zobrazit výsledky]          │
└──────────────────────────────┘
```

### 3. Vyplňování sekce
```
🎭 Já jsem → Role v životě

Momentálně jsem... ⭐
☑ na mateřské
☐ OSVČ
☑ student/ka
☐ zaměstnanec

[3/15 otázek] ████░░░░░░░░░░░░
```

### 4. Výsledky
```
🎯 TVOJE DNA
┌────────────────────────┐
│ Hlavní hodnoty:        │
│ • Pomoc druhým         │
│ • Kreativita           │
│ • Svoboda              │
└────────────────────────┘

💡 TOP 3 SMĚRY
1. Life Coach
   ✓ Empatie + komunikace
   ! Potřebuješ: certifikaci

2. UX Designer
   ✓ Kreativita + řešení problémů
   ! Potřebuješ: portfolio

3. Social Media Manager
   ✓ Kreativita + práce s lidmi
   ! Potřebuješ: praxe
```

## 🔒 Bezpečnost

- Row Level Security (RLS) zapnuto na všech tabulkách
- Uživatelé vidí jen své vlastní odpovědi
- Admini mají přístup ke správě obsahu
- API klíče v environment variables
- HTTPS only v produkci

## 📊 Databázové schéma

Viz `supabase-schema.sql` pro kompletní schéma.

Hlavní tabulky:
- `categories` - Hlavní kategorie
- `sections` - Podsekce
- `questions` - Otázky
- `question_options` - Možnosti odpovědí
- `user_responses` - Odpovědi uživatelů
- `user_progress` - Progress tracking
- `ai_analyses` - AI analýzy
- `admin_users` - Admin uživatelé

## 🤖 AI Analýza

AI analýza probíhá když uživatel:
1. Vyplní minimálně 30% otázek
2. Klikne na "Analyzovat odpovědi"

AI hledá:
- **Vzorce** v odpovědích (hodnoty, dovednosti, zájmy)
- **Propojení** mezi různými sekcemi
- **Blind spots** (co možná přehlížíte)
- **Doporučení** konkrétních směrů

## 🎯 Roadmap

### MVP (2 měsíce)
- [x] Databázové schéma
- [x] TypeScript typy
- [ ] Auth (Supabase)
- [ ] Admin CRUD operations
- [ ] User questionnaire
- [ ] Basic AI analysis
- [ ] Results visualization

### V2 (budoucnost)
- [ ] Export do PDF
- [ ] Vizuální mindmap
- [ ] Gamifikace (odznaky, progress)
- [ ] Komunitní funkce
- [ ] Propojení s job boardy
- [ ] Matching s mentory

## 📞 Podpora

Pro dotazy a podporu kontaktujte admin aplikace.

## 📜 License

Proprietary - All rights reserved
