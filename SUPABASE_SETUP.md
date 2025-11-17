# Supabase Setup pro LifePro

## 📋 Přehled

LifePro používá Supabase jako databázové backendy s následující strukturou:
- **Prefix tabulek**: `lifepro_` (pro sdílení Supabase projektu s CoachPro)
- **10 tabulek**: categories, sections, questions, question_options, user_responses, user_progress, ai_analyses, user_exports, admin_users, audit_logs

---

## 🚀 Krok za krokem setup

### 1️⃣ Vytvoření tabulek

V Supabase SQL Editoru spusťte migrační skript:

```bash
# Otevřete soubor:
supabase/migrations/001_lifepro_initial.sql
```

**Nebo přes Supabase Dashboard:**
1. Přejděte do **SQL Editor**
2. Zkopírujte celý obsah `supabase/migrations/001_lifepro_initial.sql`
3. Klikněte na **Run**

To vytvoří:
- ✅ 10 tabulek s prefixem `lifepro_`
- ✅ Všechny indexy pro výkon
- ✅ Foreign keys a vztahy
- ✅ RLS (Row Level Security) policies
- ✅ Triggery pro `updated_at` sloupce

---

### 2️⃣ Nastavení Environment Variables

V `.env.local` souboru nastavte:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Admin operations (server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic (pro AI analýzu)
ANTHROPIC_API_KEY=sk-ant-xxx
```

**Kde najít klíče:**
1. Supabase Dashboard → Settings → API
2. `URL` - Project URL
3. `anon/public` - Anon key (veřejný)
4. `service_role` - Service role key (TAJNÉ - jen server!)

---

### 3️⃣ Vytvoření Admin Uživatele

Po registraci prvního uživatele v aplikaci, přidejte ho jako admina:

```sql
-- Najděte vaše user_id v auth.users tabulce
SELECT id, email FROM auth.users;

-- Přidejte jako admina
INSERT INTO lifepro_admin_users (user_id, role, permissions)
VALUES (
  'your-user-id-here',
  'super_admin',
  ARRAY['read', 'write', 'delete', 'manage_users']
);
```

---

### 4️⃣ Import Seed Dat

Máte dva způsoby, jak naimportovat 68 JSON souborů kategorií:

#### **Možnost A: Manuální import přes Admin UI** (doporučeno)
1. Přihlaste se jako admin
2. Přejděte na `/admin`
3. Pro každou kategorii v `data/categories/*.json`:
   - Klikněte "Přidat kategorii"
   - Vyplňte formulář
   - Uložte

#### **Možnost B: Automatický seed script** (rychlejší)

```bash
# Spusťte seed script
npm run seed

# Nebo:
node scripts/seed-database.js
```

---

## 🗂️ Struktura databáze

### Hlavní tabulky

| Tabulka | Účel | Počet řádků (cca) |
|---------|------|-------------------|
| `lifepro_categories` | Kategorie dotazníku (JSEM, VÍM, atd.) | 68 |
| `lifepro_sections` | Sekce v kategoriích | ~200 |
| `lifepro_questions` | Otázky v sekcích | ~1000 |
| `lifepro_question_options` | Možnosti odpovědí | ~3000 |
| `lifepro_user_responses` | Odpovědi uživatelů | neomezeno |
| `lifepro_user_progress` | Progress tracking | neomezeno |
| `lifepro_ai_analyses` | AI analýzy | neomezeno |
| `lifepro_user_exports` | Exporty PDF/JSON | neomezeno |
| `lifepro_admin_users` | Admin oprávnění | malý |
| `lifepro_audit_logs` | Audit log změn | neomezeno |

---

## 🔐 Row Level Security (RLS)

Všechny tabulky mají povolené RLS s následujícími pravidly:

### Veřejné data (read-only)
- `lifepro_categories` - published kategorie
- `lifepro_sections` - published sekce
- `lifepro_questions` - published otázky
- `lifepro_question_options` - active možnosti

### Uživatelská data
- `lifepro_user_responses` - uživatel vidí jen své odpovědi
- `lifepro_user_progress` - uživatel vidí jen svůj progress
- `lifepro_ai_analyses` - uživatel vidí jen své analýzy
- `lifepro_user_exports` - uživatel vidí jen své exporty

### Admin data
- `lifepro_admin_users` - jen admini
- `lifepro_audit_logs` - jen admini
- Všechny tabulky - admini mají full access

---

## 🧪 Testování připojení

Po nastavení ověřte, že vše funguje:

```bash
# Spusťte dev server
npm run dev

# Otevřete:
http://localhost:3000

# Zkuste:
1. Registraci uživatele
2. Přihlášení
3. Zobrazení dashboardu (měl by zobrazit kategorie)
4. Admin panel (/admin) - po přidání admin_users záznamu
```

---

## ❓ Troubleshooting

### ❌ "relation lifepro_categories does not exist"
- Spusťte migrační SQL znovu
- Zkontrolujte, že jste ve správném projektu

### ❌ "RLS policy violation"
- Zkontrolujte, že jste přihlášeni
- Pro admin operace - ověřte záznam v `lifepro_admin_users`

### ❌ "Invalid API key"
- Zkontrolujte `.env.local` soubor
- Restartujte dev server po změně env vars

### ❌ Foreign key constraint error při insertu
- Ujistěte se, že vytváříte v pořadí: categories → sections → questions → options

---

## 📚 Další kroky

Po úspěšném setupu:

1. ✅ Naimportujte všech 68 JSON kategorií
2. ✅ Otestujte vyplňování dotazníku
3. ✅ Otestujte AI analýzu (vyžaduje ANTHROPIC_API_KEY)
4. ✅ Implementujte PDF/JSON export
5. ✅ Přidejte mindmap UI pro mindmap questions

---

**Potřebujete pomoc?** Otevřete issue na GitHubu nebo se podívejte do dokumentace Supabase: https://supabase.com/docs
