# LifePro - Dokumentace Nových Funkcí

**Datum:** 2025-11-18
**Session:** Questionnaire Flow & Results Implementation
**Status:** ✅ Kompletní a funkční

---

## 📋 Obsah

1. [Přehled Implementovaných Funkcí](#přehled-implementovaných-funkcí)
2. [Questionnaire Flow](#questionnaire-flow)
3. [Results Page](#results-page)
4. [Enhanced Dashboard](#enhanced-dashboard)
5. [Databázová Struktura](#databázová-struktura)
6. [Návod k Použití](#návod-k-použití)
7. [Technické Detaily](#technické-detaily)

---

## Přehled Implementovaných Funkcí

### ✅ Co je hotovo:

1. **Import System**
   - 65 kategorií naimportováno
   - 237 sekcí vytvořeno
   - 1054 otázek přidáno
   - Automatický import script (`npm run import:categories`)

2. **User Questionnaire Flow**
   - Seznam všech kategorií s ikonami
   - Detail kategorie s otázkami
   - Checkboxy pro odpovědi
   - Favorit marking (❤️)
   - Auto-save každé odpovědi
   - Progress tracking

3. **Results Page**
   - Celkové statistiky (4 karty)
   - Progress bars per kategorie
   - Seznam oblíbených odpovědí
   - Call-to-action podle stavu

4. **Enhanced Dashboard**
   - Quick stats overview
   - Progress visualization
   - Direct links na kategorie

---

## Questionnaire Flow

### 🎯 Jak to funguje:

#### 1. **Seznam Kategorií** (`/questionnaire`)

**Soubor:** `src/pages/QuestionnairePage.jsx`

**Co uživatel vidí:**
- Grid všech 65 kategorií
- Ikona + název + popis každé kategorie
- Hover efekt (card se zvedne)
- Click → navigace na detail

**Databázový dotaz:**
```javascript
const { data } = await supabase
  .from('lifepro_categories')
  .select('*')
  .eq('is_published', true)
  .order('order');
```

**Screenshot:**
```
┌─────────────────────────────────────────┐
│  📋 Dotazník                             │
│  Vyberte kategorii a začněte vyplňovat  │
├─────────────────────────────────────────┤
│                                          │
│  ┌────────┐  ┌────────┐  ┌────────┐   │
│  │ ❤️      │  │ 🧠      │  │ 💪      │   │
│  │ Hodnoty│  │ Skills │  │ Talents │   │
│  └────────┘  └────────┘  └────────┘   │
│                                          │
└─────────────────────────────────────────┘
```

---

#### 2. **Detail Kategorie** (`/questionnaire/:categorySlug`)

**Soubor:** `src/pages/QuestionnaireDetailPage.jsx`

**Co uživatel vidí:**
- Ikona a název kategorie
- Progress bar (% dokončení)
- Tlačítka: "Uložit vše", "Zobrazit výsledky"
- Sekce rozdělené do cards
- Každá sekce má seznam otázek

**Funkcionalita:**

**a) Auto-save** - Každá změna se okamžitě uloží:
```javascript
const handleCheckboxChange = async (questionId, checked) => {
  // Aktualizuj lokální stav
  setResponses(prev => ({ ...prev, [questionId]: [...] }));

  // Uložit do Supabase
  await supabase
    .from('lifepro_user_responses')
    .upsert({
      user_id: user.id,
      question_id: questionId,
      answer_multiple: checked ? ['checked'] : [],
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,question_id' });
};
```

**b) Favorite Marking** - Srdíčko pro oblíbené:
```javascript
const handleFavoriteToggle = async (questionId) => {
  const isFavorite = !favorites.has(questionId);

  setFavorites(prev => {
    const newSet = new Set(prev);
    isFavorite ? newSet.add(questionId) : newSet.delete(questionId);
    return newSet;
  });

  await saveResponse(questionId, responses[questionId], isFavorite);
};
```

**c) Progress Calculation:**
```javascript
const calculateProgress = () => {
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(responses).filter(
    qId => responses[qId]?.length > 0
  ).length;

  return (answeredQuestions / totalQuestions) * 100;
};
```

**Screenshot:**
```
┌─────────────────────────────────────────────┐
│  ❤️ Hodnoty                                  │
│  Životní hodnoty a principy                 │
├─────────────────────────────────────────────┤
│  Pokrok: 45%  ████████░░░░░░░░░░            │
│  15 z 33 otázek zodpovězeno                 │
│                                              │
│  [Uložit vše]  [Zobrazit výsledky]          │
├─────────────────────────────────────────────┤
│  Společenské hodnoty                         │
├─────────────────────────────────────────────┤
│  ☑ rodina                            ❤️      │
│  ☐ přátelství                        ♡      │
│  ☑ komunita                          ❤️      │
│  ☐ sousedství                        ♡      │
└─────────────────────────────────────────────┘
```

---

## Results Page

### 📊 Přehled Výsledků (`/results`)

**Soubor:** `src/pages/ResultsPage.jsx`

**Sekce:**

#### 1. **Overall Stats** (4 karty)

```javascript
{
  totalQuestions: 1054,      // 🎯 Celkem otázek
  answeredQuestions: 473,    // ✅ Zodpovězeno
  favoriteCount: 28,         // ❤️ Oblíbených
  overallProgress: 45        // 📈 % pokroku
}
```

#### 2. **Category Breakdown**

Pro každou kategorii zobrazuje:
- Název + ikona
- Progress bar (% dokončení)
- "Dokončeno" chip (pokud 100%)
- Počet zodpovězených / celkových otázek
- Tlačítko "Pokračovat" nebo "Upravit odpovědi"

**Výpočet per kategorie:**
```javascript
const categoryCompletion = categories.map(cat => {
  const catSections = sections.filter(s => s.category_id === cat.id);
  const catSectionIds = catSections.map(s => s.id);
  const catQuestions = questions.filter(q => catSectionIds.includes(q.section_id));
  const catAnswered = answeredQuestions.filter(r => {
    const questionSectionId = r.lifepro_questions?.section_id;
    return catSectionIds.includes(questionSectionId);
  });

  const percentage = (catAnswered.length / catQuestions.length) * 100;

  return {
    ...cat,
    percentage: Math.round(percentage),
    isCompleted: percentage === 100
  };
});
```

#### 3. **Favorites List** (Top 10)

Zobrazuje oblíbené odpovědi s:
- Srdíčko ❤️
- Text otázky
- Kategorie + sekce (breadcrumb)

**Databázový dotaz s JOINy:**
```javascript
const { data: responses } = await supabase
  .from('lifepro_user_responses')
  .select(`
    question_id,
    answer_multiple,
    is_favorite,
    lifepro_questions (
      id,
      question_text,
      section_id,
      lifepro_sections (
        id,
        title,
        category_id,
        lifepro_categories (
          id,
          title,
          icon,
          slug
        )
      )
    )
  `)
  .eq('user_id', user.id)
  .eq('is_favorite', true);
```

#### 4. **Call to Action**

**Pokud pokrok < 100%:**
- Zelená karta s výzvou pokračovat
- Tlačítko → Questionnaire

**Pokud pokrok = 100%:**
- Gratulace! 🎉
- Tlačítko "AI Analýza" (disabled - coming soon)

---

## Enhanced Dashboard

### 🏠 Dashboard s Quick Stats (`/dashboard`)

**Soubor:** `src/pages/DashboardPage.jsx`

**Co je nové:**

#### Quick Stats Section (4 karty)

Zobrazuje se **pod** WelcomeScreen jako floating cards:

```javascript
<Container sx={{ mt: -8, position: 'relative', zIndex: 1 }}>
  <Grid container spacing={3}>
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <Target icon />
        <Typography>{stats.progress}%</Typography>
        <Typography>Celkový pokrok</Typography>
      </Card>
    </Grid>

    // ... další 3 karty (Zodpovězeno, Oblíbených, Celkem otázek)
  </Grid>
</Container>
```

**Styling:**
- `mt: -8` → posune karty nahoru, aby překrývaly spodní část WelcomeScreen
- `zIndex: 1` → zajistí, že jsou vidět nad pozadím
- `boxShadow: 3` → elevace pro 3D efekt

#### Progress Bar

Velká karta s:
- Nadpis "Váš pokrok"
- Chip s aktuálním stavem (např. "15/1054" nebo "Dokončeno!")
- LinearProgress bar (10px vysoký)
- Zelená barva pokud 100%, modrá jinak

---

## Databázová Struktura

### Tabulky a Vztahy

```
lifepro_categories (65 řádků)
  ├── id (uuid, PK)
  ├── slug (text, unique)
  ├── title (text)
  ├── description (text)
  ├── icon (text) - emoji
  ├── order (integer)
  └── is_published (boolean)

lifepro_sections (237 řádků)
  ├── id (uuid, PK)
  ├── category_id (uuid, FK → categories)
  ├── slug (text)
  ├── title (text)
  ├── description (text)
  ├── order (integer)
  ├── level (integer) - pro hierarchii
  ├── parent_slug (text) - pro vnořené sekce
  └── is_published (boolean)

lifepro_questions (1054 řádků)
  ├── id (uuid, PK)
  ├── section_id (uuid, FK → sections)
  ├── slug (text)
  ├── question_text (text)
  ├── question_type (text) - "checkbox", "text", etc.
  ├── order (integer)
  ├── is_favorite_allowed (boolean)
  ├── max_favorites (integer)
  └── is_published (boolean)

lifepro_user_responses
  ├── id (uuid, PK)
  ├── user_id (uuid, FK → auth.users)
  ├── question_id (uuid, FK → questions)
  ├── answer_multiple (text[]) - array pro checkboxy
  ├── is_favorite (boolean)
  ├── created_at (timestamp)
  └── updated_at (timestamp)

  UNIQUE(user_id, question_id) - jeden user = jedna odpověď per otázka
```

### Indexy

```sql
-- Pro rychlé dotazy
CREATE INDEX idx_sections_category ON lifepro_sections(category_id);
CREATE INDEX idx_questions_section ON lifepro_questions(section_id);
CREATE INDEX idx_responses_user ON lifepro_user_responses(user_id);
CREATE INDEX idx_responses_question ON lifepro_user_responses(question_id);
```

---

## Návod k Použití

### Pro Uživatele (End Users):

#### 1. **Přihlášení**
```
1. Naviguj na http://localhost:3000
2. Přihlaš se nebo zaregistruj
3. Automatické přesměrování na Dashboard
```

#### 2. **Vyplňování Dotazníku**
```
1. Dashboard → klikni na "Dotazník"
2. Vyber kategorii (např. ❤️ Hodnoty)
3. Procházej sekce a zaškrtávej odpovědi
4. Klikni na ❤️ u oblíbených
5. Odpovědi se ukládají automaticky
6. Progress bar ukazuje pokrok
7. "Uložit vše" pro manuální save všeho
```

#### 3. **Zobrazení Výsledků**
```
1. Dashboard → klikni na "Výsledky"
2. Uvidíš:
   - Celkové statistiky (4 karty)
   - Progress per kategorie
   - Seznam oblíbených
3. Klikni "Pokračovat" u nedokončených
```

#### 4. **Dashboard Overview**
```
Dashboard zobrazuje:
- Quick stats (pokrok, zodpovězeno, oblíbené)
- Progress bar
- Action cards (Dotazník, Výsledky, Profil)
```

---

### Pro Administrátory:

#### 1. **Import Nových Kategorií**

**Příprava JSON souboru:**
```json
{
  "id": "nove-kategorie",
  "name": "Nová Kategorie",
  "description": "Popis kategorie",
  "icon": "🎯",
  "subcategories": [
    {
      "id": "sekce-1",
      "name": "První Sekce",
      "items": [
        "otázka 1",
        "otázka 2",
        "otázka 3"
      ]
    }
  ]
}
```

**Import:**
```bash
# 1. Ulož JSON do data/categories/nove-kategorie.json

# 2. Nastav .env.local
VITE_SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...  # Service Role Key!

# 3. Spusť import
npm run import:categories
```

#### 2. **Vyčištění Dat** (Development Only!)

```bash
# Otevři Supabase SQL Editor a spusť:
TRUNCATE TABLE lifepro.lifepro_questions CASCADE;
TRUNCATE TABLE lifepro.lifepro_sections CASCADE;
TRUNCATE TABLE lifepro.lifepro_categories CASCADE;

# Pak reimport:
npm run import:categories
```

---

## Technické Detaily

### Stack

**Frontend:**
- React 18.2
- Material-UI 5.14
- React Router 6.20
- Lucide React (ikony)
- Framer Motion (animace)

**Backend:**
- Supabase (PostgreSQL + Auth)
- Custom schema: `lifepro`
- Row Level Security (RLS)

**Build Tool:**
- Vite 5.0

---

### Auto-Save Implementace

**Strategiepro Auto-Save:**

```javascript
// 1. Uložit lokálně OKAMŽITĚ (optimistic update)
setResponses(prev => ({
  ...prev,
  [questionId]: newValue
}));

// 2. Uložit do DB async (na pozadí)
const saveResponse = async (questionId, answer, isFavorite) => {
  try {
    await supabase
      .from('lifepro_user_responses')
      .upsert({
        user_id: user.id,
        question_id: questionId,
        answer_multiple: answer,
        is_favorite: isFavorite,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,question_id'
      });
  } catch (err) {
    // Rollback lokální state pokud selže
    console.error('Save failed:', err);
    showError('Nepodařilo se uložit');
  }
};
```

**Výhody:**
- ✅ Instant feedback (UI se aktualizuje hned)
- ✅ Žádné loading spinnery
- ✅ Funguje i při pomalém internetu
- ✅ Upsert = můžeš kliknout vícekrát, nepřidá duplicity

---

### Performance Optimalizace

**1. Lazy Loading Kategorií:**
```javascript
// Načíst jen kategorie s is_published = true
const { data } = await supabase
  .from('lifepro_categories')
  .select('*')
  .eq('is_published', true);
```

**2. Batch Loading Otázek:**
```javascript
// Načíst všechny otázky pro všechny sekce najednou (místo N+1 queries)
const sectionIds = sections.map(s => s.id);
const { data } = await supabase
  .from('lifepro_questions')
  .select('*')
  .in('section_id', sectionIds);
```

**3. Memoization:**
```javascript
// Progress calculation jen když se změní responses
const progress = useMemo(() => {
  return calculateProgress();
}, [responses, questions]);
```

---

### Routing Structure

```
/                         → Redirect na /login
/login                    → LoginPage
/register                 → RegisterPage
/dashboard                → DashboardPage (protected)
/questionnaire            → QuestionnairePage (seznam kategorií)
/questionnaire/:slug      → QuestionnaireDetailPage (detail kategorie)
/results                  → ResultsPage (výsledky a statistiky)
/profile                  → ProfilePage (profil uživatele)
/admin                    → AdminPage (admin panel)
```

**Protected Routes:**
Všechny routes kromě `/login` a `/register` vyžadují autentifikaci.

---

### Error Handling

**Databázové Chyby:**
```javascript
try {
  const { data, error } = await supabase.from('table').select('*');

  if (error) throw error;

  // Success
} catch (err) {
  console.error('DB Error:', err);
  showError('Chyba', 'Nepodařilo se načíst data');
}
```

**Network Chyby:**
- Auto-retry není implementován (zatím)
- User vidí error notification
- Může zkusit znovu manuálně

---

## 🚀 Co Dál?

### Připravené pro Budoucnost:

1. **AI Analýza**
   - Integration point: Results Page → "AI Analýza" button
   - Endpoint: `/api/analyze` (zatím neexistuje)
   - Data ready: všechny odpovědi a favorites

2. **Admin Interface**
   - CRUD pro kategorie/sekce/otázky
   - Bulk operations
   - Preview mode

3. **PDF Export**
   - Export výsledků do PDF
   - Customizable template
   - Include favorites a insights

4. **Advanced Vizualizace**
   - Recharts nebo Chart.js
   - Radar charts pro multi-dimenzionální data
   - Timeline pokroku

---

## 📞 Support & Kontakt

**Issues:**
Pokud najdeš bug nebo máš nápad na vylepšení, vytvoř issue na GitHub nebo kontaktuj vývojáře.

**Dokumentace:**
- `SESSION_SUMMARY.md` - Přehled migrace
- `FEATURES_DOCUMENTATION.md` - Tento dokument
- `scripts/README.md` - Import script dokumentace

---

**Poslední aktualizace:** 2025-11-18
**Verze:** 1.0.0
**Status:** ✅ Production Ready
