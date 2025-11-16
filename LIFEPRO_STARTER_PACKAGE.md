# LifePro - Starter Package pro Claude Code

**Datum:** 16.11.2025
**Účel:** Vytvořit nový projekt LifePro kompatibilní s ekosystémem Pro aplikací
**Ekosystém:** CoachPro, PaymentsPro, DigiPro, **LifePro** (nový)

---

## 🎯 Co je LifePro?

**LifePro** je aplikace pro **hledání životního poslání a radosti z práce**.

### **Koncept:**
Pomáháme lidem najít, **co mají v životě dělat**, aby je to bavilo, aby svou práci dělali **s radostí a posláním**.

### **Jak to funguje:**
Aplikace systematicky zkoumá **VŠE, co se člověka dotýká:**

**Pozitivní dimenze (co člověk MÁ/UMÍ/CHCE):**
- ✅ Co mě **baví**
- ✅ Co **umím**
- ✅ Co **znám**
- ✅ Co **chci dělat**
- ✅ Co mě **naplňuje**
- ✅ Jaké **činnosti** miluję
- ✅ Jaké **cíle** mám
- ✅ Jaká **přání** mám
- ✅ Které **obory** mě zajímají
- ✅ Jaké **barvy** preferuji
- ✅ Jaké **pocity** vyhledávám
- ✅ S jakými **materiály** rád pracuji
- ✅ V jakém **prostředí** se cítím dobře

**Negativní dimenze (co člověk NEMÁ/NEUMÍ/NECHCE):**
- ❌ Co mě **nebaví**
- ❌ Co **neumím** (ale chci se naučit)
- ❌ Co **neznám** (ale chci poznat)
- ❌ Co **nechci dělat** (nikdy)
- ❌ Co mě **vyčerpává**
- ❌ Které činnosti **nenávidím**
- ❌ Které obory **nejsou pro mě**

**Výstup:**
Na konci procesu **"vyleze něco"** - syntéza, která ukáže směr k životnímu poslání.

---

## 🏗️ Architektura Ekosystému Pro

### **Sdílené principy všech Pro aplikací:**

1. **Modular Design Pattern**
   ```
   Utils (reusable functions)
     ↓
   Shared Components (universal, props-based)
     ↓
   Page Components (specific implementations)
   ```

2. **Folder Structure**
   ```
   src/
   ├── modules/           # Domain-specific modules
   │   ├── [app-name]/   # Např. life, coach, payment
   │   │   ├── pages/
   │   │   ├── components/
   │   │   └── utils/
   │
   └── shared/           # Shared across modules
       ├── components/   # Universal components
       ├── context/      # Global state
       ├── hooks/        # Custom hooks
       ├── utils/        # Helper functions
       ├── styles/       # Design system
       └── constants/    # Icons, colors, etc.
   ```

3. **Tech Stack**
   - **Frontend:** React 18 + Vite
   - **UI:** Material-UI (MUI) + Lucide React icons
   - **Animations:** Framer Motion
   - **Backend:** Supabase (PostgreSQL + Auth + Storage)
   - **Deployment:** Vercel
   - **Language:** JavaScript (Czech UI)

---

## 📂 Kompletní Shared Moduly z CoachPro

### **1. Components (Universal UI)**

```
shared/components/
├── cards/
│   ├── FlipCard.jsx              # 3D flip animation
│   └── BaseCard.jsx              # Foundation card
│
├── effects/
│   └── AnimatedGradient.jsx      # Animated backgrounds
│
├── GoogleSignInButton.jsx        # OAuth button
├── RegisterForm.jsx              # Universal registration
├── WelcomeScreen.jsx             # Universal welcome
├── ProfileScreen.jsx             # Universal profile editor
├── PhotoUpload.jsx               # Photo upload with compression
├── FloatingMenu.jsx              # Settings floating menu
├── NavigationFloatingMenu.jsx    # Navigation menu
├── Breadcrumbs.jsx               # Navigation breadcrumbs
├── Footer.jsx                    # App footer
└── Layout.jsx                    # Page layout wrapper
```

**Klíčové vlastnosti:**
- ✅ Props-driven (universal pro všechny role)
- ✅ Theme-aware (light/dark mode)
- ✅ Responsive (mobile-first)
- ✅ Czech language support

---

### **2. Context (State Management)**

```
shared/context/
├── NotificationContext.jsx       # Toast notifications
└── ThemeContext.jsx              # Dark/Light mode (if custom)
```

**Pattern:**
```javascript
// NotificationContext.jsx
const { showSuccess, showError, showInfo } = useNotification();

showSuccess('Úspěšně uloženo!');
showError('Chyba při ukládání.');
```

---

### **3. Hooks (Custom React Hooks)**

```
shared/hooks/
├── useSoundFeedback.js           # Web Audio API sounds
├── useModernEffects.js           # Glassmorphism effects
└── useResponsive.js              # Responsive breakpoints
```

**Příklady:**

**Sound Feedback:**
```javascript
const { playClick, playFlip, playSuccess } = useSoundFeedback({ volume: 0.3 });

<Button onClick={() => {
  playClick();
  handleAction();
}}>
```

**Glassmorphism:**
```javascript
const glassCardStyles = useGlassCard('subtle');

<Card sx={{ ...glassCardStyles }}>
  {/* Content with blur effect */}
</Card>
```

**Responsive:**
```javascript
const { isMobile, isTablet, isDesktop } = useResponsive();

{isMobile && <MobileLayout />}
{isDesktop && <DesktopLayout />}
```

---

### **4. Utils (Helper Functions)**

```
shared/utils/
├── imageCompression.js           # WebP compression
├── photoStorage.js               # Supabase Storage operations
├── czechGrammar.js               # getVocative(), getFirstName()
├── validation.js                 # Email, phone, URL validators
├── dateFormatters.js             # Czech date formatting
└── generateCode.js               # Share code generation
```

**Příklady:**

**Image Compression:**
```javascript
const compressedFile = await compressImage(file, {
  maxSizeMB: 1,
  maxWidthOrHeight: 800,
  useWebWorker: true,
  fileType: 'image/webp',
});
```

**Czech Grammar:**
```javascript
const greeting = `Vítejte, ${getVocative('Lenka')}!`; // "Vítejte, Lenko!"
const firstName = getFirstName('Jana Nováková'); // "Jana"
```

**Validation:**
```javascript
const isValid = isValidEmail('test@example.com');
const formatted = formatPhoneNumber('+420123456789');
```

---

### **5. Styles (Design System)**

```
shared/styles/
├── animations.js                 # Framer Motion presets
├── borderRadius.js               # BORDER_RADIUS constants
├── modernEffects.js              # Glassmorphism styles
└── colors.js                     # Theme colors
```

**animations.js:**
```javascript
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

export const glow = {
  boxShadow: [
    '0 0 5px rgba(139, 188, 143, 0.3)',
    '0 0 20px rgba(139, 188, 143, 0.6)',
    '0 0 5px rgba(139, 188, 143, 0.3)',
  ],
  transition: { duration: 2, repeat: Infinity },
};
```

**borderRadius.js:**
```javascript
const BORDER_RADIUS = {
  none: 0,
  compact: '8px',
  card: '12px',
  button: '8px',
  input: '8px',
  modal: '16px',
  pill: '50px',
};
```

**colors.js (Theme Colors):**
```javascript
export const THEME_COLORS = {
  primary: {
    main: '#8FBC8F',       // Soft green
    light: '#B2D8B2',
    dark: '#556B2F',
  },
  secondary: {
    main: '#D4A574',       // Warm beige
    light: '#E6C9A8',
    dark: '#A67C52',
  },
  accent: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
  },
};
```

---

### **6. Constants (Centralized Config)**

```
shared/constants/
└── icons.js                      # Lucide React icons
```

**icons.js:**
```javascript
import { Home, Calendar, FileText, User, Settings, LogOut, Sparkles, Heart, Compass } from 'lucide-react';

export const NAVIGATION_ICONS = {
  dashboard: Home,
  calendar: Calendar,
  materials: FileText,
  profile: User,
};

export const SETTINGS_ICONS = {
  settings: Settings,
  logout: LogOut,
};

export const UI_ICONS = {
  sparkles: Sparkles,
  heart: Heart,
  compass: Compass,
};
```

---

## 🔐 Authentication & Registration Modules

### **Google OAuth + Email/Password + Magic Link**

**Kompletní auth flow z CoachPro:**

```
shared/components/
├── GoogleSignInButton.jsx        # Google OAuth
├── RegisterForm.jsx              # Email/Password registration
└── MagicLinkLogin.jsx            # Passwordless login (if implemented)
```

**Google OAuth:**
```javascript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    scopes: 'email profile',
    queryParams: { access_type: 'offline' },
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

**Email Registration:**
```javascript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/confirm`,
  },
});
```

---

## 🎨 Design System Complete

### **Theme System (Light/Dark Mode)**

**MUI Theme Configuration:**
```javascript
import { createTheme } from '@mui/material/styles';
import { THEME_COLORS, BORDER_RADIUS } from '@shared/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode, // 'light' or 'dark'
    primary: {
      main: THEME_COLORS.primary.main,
    },
    background: {
      default: mode === 'dark' ? '#0a0f0a' : '#f5f5f0',
      paper: mode === 'dark' ? '#1a2410' : '#ffffff',
    },
  },
  shape: {
    borderRadius: parseInt(BORDER_RADIUS.card),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

**Toggle Dark Mode:**
```javascript
const [darkMode, setDarkMode] = useState(false);
const theme = getTheme(darkMode ? 'dark' : 'light');

<ThemeProvider theme={theme}>
  <CssBaseline />
  <App />
</ThemeProvider>
```

---

## 🎯 LifePro Specifika - Datový Model

### **Kategorie pro analýzu:**

```javascript
const LIFE_DIMENSIONS = {
  activities: {
    label: 'Činnosti',
    questions: [
      'Co rád dělám?',
      'Co mě baví?',
      'Při čem ztrácím pojem o čase?',
      'Co mě vyčerpává?',
      'Co dělám nerad?',
    ],
  },

  skills: {
    label: 'Dovednosti',
    questions: [
      'Co umím?',
      'V čem jsem dobrý?',
      'Co neumím, ale chci se naučit?',
      'Kde mám talent?',
    ],
  },

  knowledge: {
    label: 'Znalosti',
    questions: [
      'Co znám?',
      'O čem vím hodně?',
      'Co mě zajímá?',
      'Co neznám, ale chci poznat?',
    ],
  },

  fields: {
    label: 'Obory',
    questions: [
      'Které obory mě zajímají?',
      'V jakém oboru bych chtěl pracovat?',
      'Které obory nejsou pro mě?',
    ],
  },

  materials: {
    label: 'Materiály',
    questions: [
      'S jakými materiály rád pracuji?',
      'Dřevo, kov, papír, textil, digitální?',
      'Co mě odpuzuje?',
    ],
  },

  colors: {
    label: 'Barvy',
    questions: [
      'Jaké barvy preferuji?',
      'Jaké barvy mě naplňují energií?',
      'Jaké barvy mě uklidňují?',
    ],
  },

  feelings: {
    label: 'Pocity',
    questions: [
      'Jaké pocity vyhledávám v práci?',
      'Co mě naplňuje?',
      'Co chci cítit?',
      'Co se chci vyhnout?',
    ],
  },

  environment: {
    label: 'Prostředí',
    questions: [
      'Kde se cítím dobře?',
      'Kancelář, venku, doma, v dílně?',
      'S lidmi nebo sám?',
      'Hlučné nebo tiché?',
    ],
  },

  goals: {
    label: 'Cíle',
    questions: [
      'Čeho chci dosáhnout?',
      'Jaký je můj velký sen?',
      'Co chci zanechat po sobě?',
    ],
  },

  wishes: {
    label: 'Přání',
    questions: [
      'Co si přeji?',
      'Jak chci žít?',
      'S kým chci pracovat?',
    ],
  },
};
```

---

### **Database Schema pro LifePro:**

```sql
-- User Profiles
CREATE TABLE lifepro_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  auth_user_id UUID NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  photo_url TEXT,
  current_phase TEXT DEFAULT 'discovery', -- discovery, analysis, synthesis
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Responses (všechny odpovědi na otázky)
CREATE TABLE lifepro_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES lifepro_profiles(id),
  dimension TEXT NOT NULL, -- activities, skills, knowledge, etc.
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  sentiment TEXT, -- positive, negative, neutral
  tags TEXT[], -- array of tags for analysis
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discoveries (věci, které uživatel objevil)
CREATE TABLE lifepro_discoveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES lifepro_profiles(id),
  category TEXT NOT NULL, -- activity, skill, field, etc.
  title TEXT NOT NULL,
  description TEXT,
  sentiment TEXT, -- love, like, neutral, dislike, hate
  importance INTEGER, -- 1-10
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Synthesis Results (výstup z analýzy)
CREATE TABLE lifepro_synthesis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES lifepro_profiles(id),
  title TEXT NOT NULL, -- "Vaše poslání"
  description TEXT,
  key_strengths TEXT[], -- klíčové silné stránky
  ideal_activities TEXT[], -- ideální činnosti
  recommended_fields TEXT[], -- doporučené obory
  next_steps TEXT[], -- konkrétní kroky
  confidence_score INTEGER, -- 0-100
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE lifepro_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own responses"
  ON lifepro_responses FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🚀 MVP Features for LifePro

### **Phase 1: Discovery (Objevování)**

**Features:**
- [ ] Onboarding wizard s vysvětlením konceptu
- [ ] Průvodce dimenzemi (activities, skills, knowledge, atd.)
- [ ] Formuláře s otázkami pro každou dimenzi
- [ ] Tagging systém (rychlé označení odpovědí)
- [ ] Progress tracking (kolik dimenzí dokončeno)

**UI:**
- [ ] Dashboard s přehledem průběhu
- [ ] Flipcards pro jednotlivé dimenze
- [ ] Form wizard s krokovým postupem
- [ ] Visual progress bar

---

### **Phase 2: Analysis (Analýza)**

**Features:**
- [ ] Automatic sentiment analysis (pozitivní/negativní)
- [ ] Tag clustering (seskupení podobných odpovědí)
- [ ] Pattern recognition (opakující se témata)
- [ ] Visual data representation (grafy, word clouds)

**UI:**
- [ ] Dashboard s vizualizacemi
- [ ] Word cloud nejčastějších slov
- [ ] Bar charts pozitivních/negativních dimenzí
- [ ] Tag explorer

---

### **Phase 3: Synthesis (Syntéza)**

**Features:**
- [ ] AI-powered synthesis (nebo rule-based)
- [ ] Generování "Vašeho poslání"
- [ ] Doporučené obory/činnosti
- [ ] Konkrétní akční kroky
- [ ] Exportovatelný report (PDF)

**UI:**
- [ ] Results page s výsledky
- [ ] Downloadable PDF
- [ ] Share results (optional)
- [ ] Re-run analysis možnost

---

## 📁 Recommended File Structure for LifePro

```
lifepro/
├── public/
│   └── logo.svg
│
├── src/
│   ├── modules/
│   │   └── life/
│   │       ├── pages/
│   │       │   ├── Dashboard.jsx           # Main dashboard
│   │       │   ├── Onboarding.jsx          # Welcome wizard
│   │       │   ├── Discovery.jsx           # Dimension explorer
│   │       │   ├── DimensionForm.jsx       # Questions for dimension
│   │       │   ├── Analysis.jsx            # Data analysis view
│   │       │   ├── Synthesis.jsx           # Results & purpose
│   │       │   └── Profile.jsx             # User profile
│   │       │
│   │       ├── components/
│   │       │   ├── DimensionCard.jsx       # FlipCard for dimensions
│   │       │   ├── QuestionForm.jsx        # Question input
│   │       │   ├── TagSelector.jsx         # Tag selection
│   │       │   ├── ProgressRing.jsx        # Circular progress
│   │       │   ├── WordCloud.jsx           # Visual word cloud
│   │       │   ├── SentimentChart.jsx      # Sentiment visualization
│   │       │   └── SynthesisCard.jsx       # Results display
│   │       │
│   │       └── utils/
│   │           ├── storage.js              # Supabase queries
│   │           ├── analysis.js             # Data analysis logic
│   │           └── synthesis.js            # Purpose generation
│   │
│   └── shared/                 # COPY VŠECHNO FROM COACHPRO
│       ├── components/
│       │   ├── cards/
│       │   │   ├── FlipCard.jsx
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
│       │   ├── LifeAuthContext.jsx
│       │   └── NotificationContext.jsx
│       │
│       ├── hooks/
│       │   ├── useSoundFeedback.js
│       │   ├── useModernEffects.js
│       │   └── useResponsive.js
│       │
│       ├── utils/
│       │   ├── imageCompression.js
│       │   ├── photoStorage.js
│       │   ├── czechGrammar.js
│       │   ├── validation.js
│       │   ├── dateFormatters.js
│       │   └── generateCode.js
│       │
│       ├── styles/
│       │   ├── animations.js
│       │   ├── borderRadius.js
│       │   ├── modernEffects.js
│       │   └── colors.js
│       │
│       └── constants/
│           └── icons.js
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎯 Key Principles for LifePro

1. **Modularity First** - Celá shared složka kopírovaná z CoachPro
2. **Czech UI** - Všechny texty v češtině, vocative pro oslovení
3. **Dark Mode Support** - Všechny komponenty theme-aware
4. **Performance** - Web Audio API, WebP, lazy loading
5. **Mobile-First** - Responsive od začátku
6. **Security** - RLS na všech tabulkách
7. **Consistency** - Stejné design patterns jako CoachPro
8. **Deep Exploration** - Systematické prozkoumání VŠECH životních dimenzí
9. **Actionable Output** - Konkrétní výstup, ne jen data
10. **Privacy** - Citlivá data, maximální bezpečnost

---

## 📦 Co Claude Code potřebuje vědět

### **Kontext:**
"Vytváříme nový projekt LifePro - aplikaci pro hledání životního poslání. Uživatelé systematicky prozkoumají VŠE, co se jich v životě dotýká (činnosti, dovednosti, barvy, materiály, pocity, cíle, přání, atd.) a na konci dostanou syntézu ukazující směr k jejich poslání.

LifePro je součástí ekosystému Pro aplikací (CoachPro, PaymentsPro, DigiPro). Musíme použít VŠECHNY shared moduly z CoachPro - komponenty, hooks, utils, styles, constants. Architektura a design system musí být 100% kompatibilní."

### **Cíl MVP:**
"Vytvořit funkční MVP s třemi fázemi:
1. Discovery - Průzkum dimenzí života (activities, skills, knowledge, fields, materials, colors, feelings, environment, goals, wishes)
2. Analysis - Vizualizace a analýza dat
3. Synthesis - Generování 'vašeho poslání' s konkrétními kroky

Všechno v češtině, s dark mode, glassmorphism efekty, FlipCards, animacemi - stejně jako CoachPro."

### **Tech Stack:**
"React 18 + Vite + MUI + Framer Motion + Supabase + Vercel (identicky jako CoachPro)"

### **Důležité:**
"CELÁ shared složka z CoachPro - zkopírovat všechny moduly (components, hooks, utils, styles, constants). Dodržuj modular design pattern. Czech language first. Theme-aware všude."

---

## 🔗 Které soubory z CoachPro sdílet

### **KOMPLETNÍ shared složka:**

```
shared/
├── components/        # VŠECHNY .jsx soubory
├── context/           # NotificationContext.jsx
├── hooks/             # useSoundFeedback.js, useModernEffects.js, useResponsive.js
├── utils/             # VŠECHNY .js soubory
├── styles/            # animations.js, borderRadius.js, modernEffects.js, colors.js
└── constants/         # icons.js
```

### **Configuration:**
- `vite.config.js`
- `package.json` (dependencies)
- `.env.example`

### **Tento soubor:**
- `LIFEPRO_STARTER_PACKAGE.md`

---

## ✅ Checklist pro start projektu

### **Setup:**
- [ ] Vytvořit nový Supabase projekt "lifepro"
- [ ] Nastavit Google OAuth v Supabase Auth
- [ ] Vytvořit databázové tabulky (profiles, responses, discoveries, synthesis)
- [ ] Nastavit RLS policies
- [ ] Vytvořit Vite projekt `npm create vite@latest lifepro -- --template react`
- [ ] Zkopírovat **CELOU** shared složku z CoachPro
- [ ] Nainstalovat dependencies z CoachPro package.json

### **Phase 1 Implementation:**
- [ ] Vytvořit LifeAuthContext (based on TesterAuthContext)
- [ ] Implementovat Google Sign-In + Email registration
- [ ] Vytvořit Onboarding wizard
- [ ] Vytvořit Dashboard s dimension cards (FlipCards)
- [ ] Implementovat DimensionForm s otázkami
- [ ] Tagging system
- [ ] Progress tracking

### **Deployment:**
- [ ] Deploy na Vercel
- [ ] Testovat Google OAuth flow
- [ ] Testovat responsive na mobile

---

**Připraveno pro Claude Code! 🚀**

*Vytvořeno: 16.11.2025*
*Based on: CoachPro complete architecture with ALL shared modules*
*Purpose: Life purpose discovery application*
