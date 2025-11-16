# LifePro - Quick Setup Guide

Tento průvodce vás provede nastavením aplikace krok za krokem.

## ⏱ Celkový čas: ~15-20 minut

---

## 🎯 KROK 1: Supabase Project (5 min)

### 1.1 Vytvořit účet a projekt
1. Jděte na [supabase.com](https://supabase.com)
2. Klikněte na "Start your project"
3. Přihlaste se (GitHub nebo email)
4. Klikněte "New project"
5. Vyplňte:
   - **Name**: `lifepro`
   - **Database Password**: (vygenerujte silné heslo a ULOŽTE SI HO!)
   - **Region**: `Central EU` (nebo nejbližší)
6. Klikněte "Create new project"
7. ⏳ Počkejte 2 minuty na inicializaci

### 1.2 Spustit databázové schéma
1. V Supabase dashboardu klikněte na **SQL Editor** (levý panel)
2. Klikněte **New query**
3. Otevřete soubor `supabase-schema.sql` z projektu
4. Zkopírujte **celý obsah** souboru
5. Vložte do SQL Editoru
6. Klikněte **Run** (nebo Ctrl/Cmd + Enter)
7. ✅ Měli byste vidět "Success. No rows returned"

### 1.3 Získat API klíče
1. Klikněte na **Settings** (ikona ozubeného kola dole vlevo)
2. Klikněte na **API**
3. Zkopírujte:
   - **Project URL** → uložte si ho
   - **anon public** klíč → uložte si ho
   - **service_role** klíč → uložte si ho (⚠️ tento klíč NIKDY nesdílejte!)

---

## 💻 KROK 2: Lokální setup (5 min)

### 2.1 Nainstalovat dependencies
```bash
cd lifepro-app
npm install
```

### 2.2 Nastavit environment variables
1. Zkopírujte `.env.example` → `.env.local`
```bash
cp .env.example .env.local
```

2. Otevřete `.env.local` a vyplňte:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...váš-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...váš-service-role-key

# Claude AI (zatím nechat prázdné, přidáme později)
ANTHROPIC_API_KEY=

# Vaš email pro admin přístup
ADMIN_EMAIL=vas-email@example.com
```

3. Uložte soubor

---

## 🚀 KROK 3: První spuštění (3 min)

### 3.1 Spustit development server
```bash
npm run dev
```

### 3.2 Otevřít v prohlížeči
Otevřete [http://localhost:3000](http://localhost:3000)

### 3.3 Zaregistrovat se
1. Klikněte "Registrace"
2. Vyplňte email (ideálně ten z `ADMIN_EMAIL`)
3. Vyplňte heslo (min. 8 znaků)
4. Klikněte "Zaregistrovat se"
5. ✉️ Zkontrolujte email a potvrďte registraci

---

## 👑 KROK 4: Nastavit admin přístup (2 min)

### 4.1 Získat své User ID
1. V Supabase dashboardu klikněte **Authentication** → **Users**
2. Najděte svého uživatele
3. Zkopírujte **ID** (dlouhý string jako `a1b2c3...`)

### 4.2 Vytvořit admin záznam
1. Jděte do **SQL Editor**
2. Spusťte tento dotaz (nahraďte `YOUR_USER_ID`):
```sql
INSERT INTO admin_users (user_id, role, permissions)
VALUES ('YOUR_USER_ID', 'super_admin', ARRAY['all']);
```
3. ✅ Success!

### 4.3 Ověřit admin přístup
1. Vraťte se do aplikace
2. Odhlaste se a přihlaste znovu
3. Měli byste vidět odkaz "Admin" v menu
4. Klikněte na něj a měli byste vidět admin dashboard

---

## 🎨 KROK 5: Přidat první obsah (5 min)

Už máte hotové! V databázi už jsou ukázkové data:
- ✅ 8 kategorií (Já jsem, Umím, Vím, Mám rád/a, Bavilo mě, Chtěl/a jsem, Chci, Můžu)
- ✅ 1 sekce (Role v životě)
- ✅ 1 otázka (Momentálně jsem...)
- ✅ 6 možností (na mateřské, OSVČ, student, ...)

### Přidat další otázku:
1. V admin rozhraní jděte na **Kategorie**
2. Klikněte na **Já jsem** → **Role v životě**
3. Klikněte **+ Nová otázka**
4. Vyplňte:
   - **Text**: `Co tě baví nejvíc?`
   - **Typ**: `checkbox`
   - **Povolit srdcovku**: ✓
5. Klikněte **Uložit**
6. Přidejte možnosti:
   - `sport` → `Sport`
   - `cteni` → `Čtení`
   - `cestovani` → `Cestování`
   - atd.

---

## ✅ Hotovo!

Gratulujeme! Máte funkční aplikaci LifePro.

### Co dál?

1. **Přidat více otázek** - Postupně převést všechny otázky z vašich PDF
2. **Testovat** - Vyplnit dotazník jako běžný uživatel
3. **Upravit design** - Přizpůsobit barvy a fonty v `tailwind.config.js`
4. **Nastavit Claude AI** - Přidat API klíč pro AI analýzu

---

## 🆘 Něco nefunguje?

### Problém: "Supabase connection failed"
- ✅ Zkontrolujte, že máte správné URL a klíče v `.env.local`
- ✅ Zkontrolujte, že Supabase projekt běží

### Problém: "User not authorized" v adminu
- ✅ Zkontrolujte, že jste správně vložili záznam do `admin_users`
- ✅ Zkontrolujte, že `user_id` odpovídá vašemu ID z Authentication
- ✅ Zkuste se odhlásit a přihlásit znovu

### Problém: "Module not found"
- ✅ Spusťte `npm install` znovu
- ✅ Smažte `node_modules` a `.next` složku a spusťte `npm install` znovu

### Problém: TypeScript chyby
- ✅ Zkontrolujte, že máte všechny soubory v `types/` složce
- ✅ Restartujte VS Code
- ✅ Spusťte `npm run type-check`

---

## 📞 Podpora

Pokud potřebujete pomoct, napište mi!
