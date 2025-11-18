# Import kategorií do Supabase

## 📋 Co tento script dělá?

Import script `import-categories.js` načte všech 66 JSON souborů z `data/categories/` a naimportuje je do Supabase databáze.

**Transformace:**
- JSON kategorie → `lifepro_categories`
- Subcategories → `lifepro_sections`
- Items → `lifepro_questions` (type: checkbox)

## 🔑 Před spuštěním

### 1. Získej Service Role Key ze Supabase

1. Otevři Supabase dashboard: https://supabase.com/dashboard
2. Vyber projekt LifePro
3. Naviguj: **Settings** → **API**
4. Najdi **Service Role Key** (⚠️ TAJNÝ klíč!)
5. Zkopíruj ho

### 2. Nastav .env.local

V kořenovém adresáři projektu vytvoř (nebo uprav) `.env.local`:

```bash
# Frontend klíče (už máš)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhb...

# Service key (POUZE pro import script!)
SUPABASE_SERVICE_KEY=eyJhb...  # 👈 Vlož sem Service Role Key
```

**⚠️ DŮLEŽITÉ:**
- Service Role Key má **admin práva** - může dělat cokoliv!
- NIKDY ho nesdílej, nepublikuj na GitHubu
- `.env.local` je v `.gitignore` - necommitne se

## 🚀 Spuštění

### Jednoduchá cesta (doporučuji)

```bash
npm run import:categories
```

### Ruční cesta

```bash
node scripts/import-categories.js
```

## 📊 Co se stane?

Script projde všech 66 JSON souborů a:

1. **Vytvoří kategorie** (např. "Hodnoty", "Dovednosti", "Profese")
2. **Vytvoří sekce** (např. "Společenské hodnoty", "Pracovní hodnoty")
3. **Vytvoří otázky** z jednotlivých items jako checkbox questions

**Příklad transformace:**

```json
// data/categories/hodnoty.json
{
  "id": "hodnoty",
  "name": "Hodnoty",
  "subcategories": [
    {
      "id": "spolecenske",
      "name": "Společenské hodnoty",
      "items": ["rodina", "přátelství", "komunita"]
    }
  ]
}
```

→ Vytvoří:
- ✅ Kategorie: "Hodnoty" (slug: hodnoty)
- ✅ Sekce: "Společenské hodnoty" (slug: spolecenske)
- ✅ 3 otázky: "rodina", "přátelství", "komunita" (type: checkbox)

## 🎯 Po importu

Script vypíše statistiky:

```
🎉 IMPORT DOKONČEN!
==================================================
📊 Kategorie: 66
📁 Sekce: 150+
❓ Otázky: 500+
==================================================
```

Pak můžeš:

1. **Zkontrolovat v Supabase:**
   - Otevři Table Editor
   - Podívej se do `lifepro_categories`, `lifepro_sections`, `lifepro_questions`

2. **Otestovat v aplikaci:**
   ```bash
   npm run dev
   ```
   - Naviguj na `/questionnaire`
   - Měly by se zobrazit všechny kategorie

## 🔄 Znovuspuštění

Script používá `upsert` s konfliktní strategií, takže:
- ✅ Můžeš ho spustit vícekrát
- ✅ Aktualizuje existující záznamy
- ✅ Přidá nové, které chybí

**Bezpečné znovuspuštění:**
```bash
npm run import:categories
```

## ❌ Řešení problémů

### Chyba: "Chybí environment variables"
→ Zkontroluj, že máš v `.env.local` tyto klíče:
  - `VITE_SUPABASE_URL`
  - `SUPABASE_SERVICE_KEY`

### Chyba: "Permission denied" nebo "RLS policy violation"
→ Service Role Key obchází RLS, takže by to nemělo nastat.
→ Zkontroluj, že používáš správný klíč (Service Role, ne Anon)

### Chyba: "The schema must be one of the following: public"
→ Zapni schema 'lifepro' v Supabase:
  1. Settings → API → Exposed schemas
  2. Přidej: `lifepro`
  3. Save

## 🧪 Testování jen s jedním souborem

Pokud chceš otestovat jen jednu kategorii, uprav script:

```javascript
// V import-categories.js najdi řádek:
const jsonFiles = files.filter(f => f.endsWith('.json')).sort();

// Změň na:
const jsonFiles = files.filter(f => f === 'hodnoty.json');
```

Pak spusť:
```bash
npm run import:categories
```

## 📝 Poznámky

- Import trvá cca **10-30 sekund** (záleží na rychlosti připojení)
- Script používá Supabase Service Key s plnými právy
- Všechny záznamy mají `is_published = true`
- Question type je defaultně `checkbox` (můžeš upravit později v adminu)

---

**Vytvořeno:** 2025-11-18
**Autor:** Claude + Lenka
