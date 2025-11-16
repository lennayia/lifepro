# 🏗️ PRO-APP ECOSYSTEM - MONOREPO MIGRATION PLAN

**Created:** 12. listopadu 2025
**Author:** Claude Code + Lenka Roubalová
**Status:** Strategic Plan - Ready for Implementation

---

## 📋 EXECUTIVE SUMMARY

### Current State
- **5 separate projects:** CoachPro, PaymentsPro, DigiPro, LifePro, ContentPro
- **3 tech stacks:** React+Vite, React+Vite+Express, Next.js
- **3 databases:** Supabase (CoachPro), SQLite (PaymentsPro), SQLite (DigiPro)
- **Duplication:** ~85% code duplication in UI, auth, utils

### Target State
- **1 monorepo:** `pro-app` with 6 apps (ProApp + 5 modules)
- **1 tech stack:** React + Vite + Supabase (unified)
- **1 database:** Shared Supabase PostgreSQL
- **Shared packages:** 73-85% code reduction via `@pro/*` packages

### Benefits
- 💰 **Cost:** $0-160/month → **$25/month** (savings $135/month)
- 🚀 **Development:** Shared components = faster features
- 🔐 **Auth:** Single Sign-On (SSO) across all modules
- 🎨 **Design:** 100% consistent UI via shared design system
- 🛠️ **Maintenance:** Bug fix once = fixed everywhere

---

## 🎯 FINAL ARCHITECTURE

```
pro-app/                              # Turborepo monorepo
│
├── apps/
│   │
│   ├── proapp/                       # 🏰 CENTRAL AUTH HUB (NEW!)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Login.jsx        # Google OAuth + Email/Password
│   │   │   │   ├── Dashboard.jsx    # Module switcher (cards)
│   │   │   │   ├── Subscription.jsx # Stripe checkout
│   │   │   │   └── Admin.jsx        # User + module management
│   │   │   ├── components/
│   │   │   │   ├── ModuleSwitcher/  # Card grid (CoachPro, PaymentsPro, etc.)
│   │   │   │   ├── SubscriptionCard/
│   │   │   │   └── AccessControl/   # Check module access
│   │   │   └── App.jsx
│   │   └── package.json
│   │
│   ├── coachpro/                     # MODULE 1 (existing)
│   │   ├── src/                      # React + Vite
│   │   │   ├── pages/
│   │   │   │   ├── CoachDashboard/
│   │   │   │   ├── MaterialsLibrary/
│   │   │   │   ├── Programs/
│   │   │   │   └── CoachingCards/
│   │   │   └── App.jsx
│   │   └── package.json
│   │
│   ├── paymentspro/                  # MODULE 2 (migrate from Express)
│   │   ├── src/                      # React + Vite (REMOVE backend folder!)
│   │   │   ├── pages/
│   │   │   │   ├── PaymentsList/
│   │   │   │   ├── Categories/
│   │   │   │   └── Rezervy/
│   │   │   └── App.jsx
│   │   └── package.json
│   │
│   ├── digipro/                      # MODULE 3 (migrate from Express)
│   │   ├── src/                      # React + Vite (REMOVE backend folder!)
│   │   │   ├── pages/
│   │   │   │   ├── Products/
│   │   │   │   ├── Customers/
│   │   │   │   └── Funnels/
│   │   │   └── App.jsx
│   │   └── package.json
│   │
│   ├── lifepro/                      # MODULE 4 (change from Next.js)
│   │   ├── src/                      # React + Vite (NOT Next.js!)
│   │   │   ├── pages/
│   │   │   │   ├── Questionnaire/
│   │   │   │   ├── Results/
│   │   │   │   └── AIAnalysis/
│   │   │   └── App.jsx
│   │   └── package.json
│   │
│   └── contentpro/                   # MODULE 5 (NEW! - Social Media Management)
│       ├── src/                      # React + Vite
│       │   ├── pages/
│       │   │   ├── ContentCalendar/  # Visual calendar for scheduled posts
│       │   │   ├── PostComposer/     # Multi-platform post editor
│       │   │   ├── Analytics/        # Social media insights
│       │   │   └── MediaLibrary/     # Asset management
│       │   └── App.jsx
│       └── package.json
│
├── packages/                         # SHARED CODE (extract from apps)
│   │
│   ├── @pro/ui/                      # ⭐ Design System
│   │   ├── themes/
│   │   │   ├── nature.js            # From CoachPro
│   │   │   ├── unifiedColors.js     # From PaymentsPro (4 color schemes)
│   │   │   └── index.js
│   │   ├── components/
│   │   │   ├── UniversalDialog/     # From PaymentsPro (-63% code!)
│   │   │   ├── BaseCard/            # From CoachPro
│   │   │   ├── FloatingMenu/        # From both (merge)
│   │   │   ├── PhotoUpload/         # From CoachPro
│   │   │   └── SessionCard/         # From CoachPro
│   │   ├── constants/
│   │   │   ├── icons.js             # From CoachPro (centralized)
│   │   │   └── borderRadius.js      # From CoachPro (5-tier)
│   │   ├── styles/
│   │   │   ├── glassmorphism.js     # Merge both versions
│   │   │   ├── modernEffects.js     # From both
│   │   │   └── animations.js        # Framer Motion
│   │   └── hooks/
│   │       ├── useModernEffects.js  # From PaymentsPro
│   │       ├── useResponsive.js     # From CoachPro
│   │       ├── useAsync.js          # From CoachPro
│   │       └── useModal.js          # From CoachPro
│   │
│   ├── @pro/auth/                    # ⭐ Authentication (from CoachPro)
│   │   ├── GenericAuthContext.jsx   # Factory pattern (-73% code!)
│   │   ├── GenericAuthGuard.jsx     # Route protection
│   │   ├── GoogleSignInButton.jsx   # OAuth
│   │   ├── RootRedirect.jsx         # Universal OAuth entry
│   │   └── useAuth.js               # Hook
│   │
│   ├── @pro/database/                # ⭐ Supabase Utils
│   │   ├── client.js                # Supabase client factory
│   │   ├── sessions.js              # From CoachPro (402 lines, Czech locale)
│   │   ├── photoStorage.js          # From CoachPro (upload/delete)
│   │   ├── imageCompression.js      # From CoachPro (WebP)
│   │   └── queries/
│   │       ├── payments.js          # From PaymentsPro (migrate SQL → Supabase)
│   │       ├── products.js          # From DigiPro
│   │       └── questionnaires.js    # For LifePro
│   │
│   ├── @pro/integrations/            # External APIs (from DigiPro)
│   │   ├── email/
│   │   │   ├── smartemailing.js
│   │   │   ├── mailchimp.js
│   │   │   └── mailerlite.js
│   │   ├── payments/
│   │   │   └── stripe.js            # From PaymentsPro + ProApp subscriptions
│   │   ├── courses/
│   │   │   └── kajabi.js
│   │   ├── social/                  # ⭐ NEW - For ContentPro
│   │   │   ├── meta.js              # Facebook + Instagram Graph API
│   │   │   ├── linkedin.js          # LinkedIn API
│   │   │   ├── twitter.js           # X (Twitter) API
│   │   │   └── youtube.js           # YouTube Data API
│   │   └── ai/
│   │       └── claude.js            # For LifePro AI analysis + ContentPro text generation
│   │
│   ├── @pro/notifications/           # Toast + Email
│   │   ├── NotificationContext.jsx  # From CoachPro (toast)
│   │   └── email-templates/         # Shared templates
│   │
│   └── @pro/utils/                   # Helpers
│       ├── czechGrammar.js          # From CoachPro (vocative case)
│       ├── banking.js               # SPAYD QR codes (from PaymentsPro)
│       ├── date.js                  # Czech locale (date-fns)
│       └── validation.js            # Zod schemas
│
├── supabase/                         # ⭐ SINGLE SHARED SUPABASE
│   ├── config.toml
│   ├── migrations/
│   │   ├── 001_auth_core.sql       # ProApp auth tables
│   │   ├── 002_coachpro.sql        # CoachPro tables (existing)
│   │   ├── 003_paymentspro.sql     # PaymentsPro (migrate from SQLite)
│   │   ├── 004_digipro.sql         # DigiPro (migrate from SQLite)
│   │   ├── 005_lifepro.sql         # LifePro tables
│   │   └── 006_contentpro.sql      # ContentPro tables (NEW!)
│   ├── functions/                   # Edge Functions (serverless!)
│   │   ├── claude-analysis/        # LifePro AI (Claude API)
│   │   ├── pdf-export/             # LifePro PDF generation
│   │   ├── stripe-webhook/         # ProApp subscription webhooks
│   │   ├── social-post-scheduler/  # ContentPro scheduling (NEW!)
│   │   └── ai-content-generator/   # ContentPro AI text generation (NEW!)
│   └── seed/
│       ├── test_users.sql
│       └── demo_data.sql
│
├── scripts/                          # Migration scripts
│   ├── migrate-paymentspro-sqlite.js
│   ├── migrate-digipro-sqlite.js
│   └── setup-monorepo.sh
│
├── .github/
│   └── workflows/
│       ├── deploy-proapp.yml
│       ├── deploy-coachpro.yml
│       ├── deploy-paymentspro.yml
│       ├── deploy-digipro.yml
│       ├── deploy-lifepro.yml
│       └── test.yml
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── MONOREPO_MIGRATION_PLAN.md  # This file!
│   └── modules/
│       ├── proapp/
│       ├── coachpro/
│       ├── paymentspro/
│       ├── digipro/
│       └── lifepro/
│
├── package.json                      # Root package.json (Turborepo)
├── turbo.json                        # Turborepo config
├── pnpm-workspace.yaml               # PNPM workspaces
└── README.md
```

---

## 🗄️ DATABASE SCHEMA (Supabase)

### **Core Auth Tables (ProApp)**

```sql
-- Users (central auth)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  auth_provider text, -- 'google', 'apple', 'email'
  full_name text,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan text NOT NULL, -- 'free', 'basic', 'premium', 'business'
  status text NOT NULL, -- 'active', 'trial', 'cancelled', 'expired'
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now()
);

-- Module Access Control
CREATE TABLE module_access (
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  module_name text NOT NULL, -- 'coachpro', 'paymentspro', 'digipro', 'lifepro', 'contentpro'
  has_access boolean DEFAULT false,
  granted_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, module_name)
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_access ENABLE ROW LEVEL SECURITY;

-- Users can view/edit own data
CREATE POLICY "Users view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users edit own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Module access policy (example for CoachPro)
CREATE POLICY "Users with CoachPro access" ON coachpro_materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM module_access
      WHERE user_id = auth.uid()
      AND module_name = 'coachpro'
      AND has_access = true
    )
  );
```

### **Module Tables**

Each module keeps its existing tables with added RLS:
- **CoachPro:** `coachpro_*` (already exists)
- **PaymentsPro:** `paymentspro_*` (migrate from SQLite)
- **DigiPro:** `digipro_*` (migrate from SQLite)
- **LifePro:** `lifepro_*` (new)

---

## 💰 COST ANALYSIS

### **Current (Separate Apps)**

| Item | Cost/Month |
|------|-----------|
| CoachPro (Supabase Free) | $0 |
| CoachPro (Vercel) | $0 |
| PaymentsPro (Local + SQLite) | $0 (not deployed) |
| DigiPro (Local + SQLite) | $0 (not deployed) |
| LifePro (TBD) | $0 (not started) |
| **TOTAL** | **$0** (but not production-ready) |

**For Production (separate):**
| Item | Cost/Month |
|------|-----------|
| Supabase (4 separate projects × $25) | $100 |
| Vercel (4 apps on Hobby) | $0 |
| OR Railway (3 backends × $5) | $15 |
| **TOTAL** | **$100-115/month** |

---

### **Monorepo (Unified)**

| Item | Cost/Month | Notes |
|------|-----------|-------|
| **Supabase Pro** (1 shared project) | **$25** | 8GB DB, 100GB storage, all 5 apps |
| Vercel Hobby (5 frontends) | $0 | ProApp + 4 modules |
| Stripe | 2.9% + 30¢ | Per transaction only |
| **TOTAL** | **$25/month** | 🎉 |

**Savings:** $75-90/month ($900-1080/year)

---

## 🚀 4-PHASE MIGRATION PLAN

### **PHASE 1: Setup Monorepo Foundation** (Week 1)

**Duration:** 5-7 days
**Goal:** Create monorepo structure + shared Supabase

#### Tasks:

**1.1 Create Monorepo** (Day 1)
```bash
# On your local machine
mkdir pro-app
cd pro-app

# Initialize PNPM workspace
pnpm init
echo 'packages:\n  - "apps/*"\n  - "packages/*"' > pnpm-workspace.yaml

# Install Turborepo
pnpm add -D turbo

# Create folder structure
mkdir -p apps/proapp apps/coachpro apps/paymentspro apps/digipro apps/lifepro
mkdir -p packages/@pro/ui packages/@pro/auth packages/@pro/database
mkdir -p packages/@pro/integrations packages/@pro/notifications packages/@pro/utils
mkdir -p supabase/migrations supabase/functions
mkdir -p scripts docs
```

**1.2 Setup Supabase Project** (Day 1)
```bash
# Create new Supabase project at supabase.com
# Project name: pro-app-ecosystem
# Region: Central EU (Frankfurt)
# Plan: Free (upgrade to Pro later)

# Get credentials
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Install Supabase CLI
pnpm add -D supabase

# Link project
supabase link --project-ref xxxxx
```

**1.3 Run Core Auth Migration** (Day 2)
```bash
# Create and run first migration
supabase migration new auth_core

# Copy SQL from section above (users, subscriptions, module_access)
# Then apply
supabase db push
```

**1.4 Extract Shared Packages** (Days 3-5)

**From CoachPro:**
- Copy `src/shared/context/GenericAuthContext.jsx` → `packages/@pro/auth/`
- Copy `src/shared/components/BaseCard.jsx` → `packages/@pro/ui/components/`
- Copy `src/shared/utils/sessions.js` → `packages/@pro/database/`
- Copy `src/shared/utils/photoStorage.js` → `packages/@pro/database/`
- Copy `src/shared/utils/imageCompression.js` → `packages/@pro/database/`
- Copy `src/shared/constants/icons.js` → `packages/@pro/ui/constants/`
- Copy `src/styles/borderRadius.js` → `packages/@pro/ui/constants/`
- Copy `src/shared/styles/modernEffects.js` → `packages/@pro/ui/styles/`

**From PaymentsPro:**
- Copy `UniversalDialog` → `packages/@pro/ui/components/`
- Copy `UnifiedColorContext` → `packages/@pro/ui/themes/`
- Copy `useModernEffects` hook → `packages/@pro/ui/hooks/`

**From DigiPro:**
- Copy `integrations/` folder → `packages/@pro/integrations/`

**1.5 Setup Turborepo Config** (Day 5)
```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false
    },
    "lint": {},
    "test": {}
  }
}
```

**Deliverables:**
- ✅ Monorepo structure created
- ✅ Supabase project setup
- ✅ Core auth tables migrated
- ✅ Shared packages extracted
- ✅ Turborepo configured

---

### **PHASE 2: Create ProApp (Central Auth Hub)** (Week 2)

**Duration:** 5-7 days
**Goal:** Build central auth + module switcher

#### Tasks:

**2.1 ProApp Frontend Setup** (Day 1)
```bash
cd apps/proapp
pnpm create vite . --template react
pnpm add @mui/material @emotion/react @emotion/styled
pnpm add react-router-dom @supabase/supabase-js
pnpm add @pro/ui @pro/auth @pro/database
```

**2.2 Auth Pages** (Days 2-3)

**Login.jsx:**
```jsx
import { GoogleSignInButton } from '@pro/auth';
import { supabase } from '@pro/database';

export default function Login() {
  const handleEmailLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    // Redirect to /dashboard
  };

  return (
    <Box>
      <Typography variant="h4">Welcome to Pro App</Typography>

      {/* Email/Password form */}
      <TextField label="Email" />
      <TextField label="Password" type="password" />
      <Button onClick={handleEmailLogin}>Sign In</Button>

      {/* Google OAuth */}
      <GoogleSignInButton redirectTo="/dashboard" />

      <Link to="/register">Create Account</Link>
    </Box>
  );
}
```

**Register.jsx:**
```jsx
const handleRegister = async (email, password, fullName) => {
  // 1. Create auth user
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });

  // 2. Create user record
  await supabase.from('users').insert({
    id: authData.user.id,
    email,
    full_name: fullName,
    auth_provider: 'email'
  });

  // 3. Grant free tier access to all modules
  const modules = ['coachpro', 'paymentspro', 'digipro', 'lifepro'];
  await supabase.from('module_access').insert(
    modules.map(module => ({
      user_id: authData.user.id,
      module_name: module,
      has_access: true // Free tier = all access for now
    }))
  );

  // Redirect to /dashboard
};
```

**2.3 Dashboard (Module Switcher)** (Days 4-5)
```jsx
import { useAuth } from '@pro/auth';
import { BaseCard } from '@pro/ui';

export default function Dashboard() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    // Fetch user's module access
    const fetchModules = async () => {
      const { data } = await supabase
        .from('module_access')
        .select('module_name, has_access')
        .eq('user_id', user.id);
      setModules(data);
    };
    fetchModules();
  }, [user]);

  const moduleCards = [
    {
      name: 'coachpro',
      title: 'CoachPro',
      description: 'Coaching materials & programs',
      icon: '🌿',
      url: 'https://coachpro-weld.vercel.app'
    },
    {
      name: 'paymentspro',
      title: 'PaymentsPro',
      description: 'Invoice management',
      icon: '💰',
      url: 'https://paymentspro.vercel.app'
    },
    {
      name: 'digipro',
      title: 'DigiPro',
      description: 'Digital products & funnels',
      icon: '📦',
      url: 'https://digipro.vercel.app'
    },
    {
      name: 'lifepro',
      title: 'LifePro',
      description: 'Life purpose discovery',
      icon: '🎯',
      url: 'https://lifepro.vercel.app'
    },
    {
      name: 'contentpro',
      title: 'ContentPro',
      description: 'Social media management',
      icon: '📱',
      url: 'https://contentpro.vercel.app'
    }
  ];

  return (
    <Container>
      <Typography variant="h4">Your Modules</Typography>
      <Grid container spacing={3}>
        {moduleCards.map(module => {
          const access = modules.find(m => m.module_name === module.name);
          return (
            <Grid item xs={12} sm={6} md={4} key={module.name}>
              <BaseCard
                title={module.title}
                description={module.description}
                icon={module.icon}
                locked={!access?.has_access}
                onClick={() => {
                  if (access?.has_access) {
                    window.location.href = module.url;
                  } else {
                    navigate('/subscription');
                  }
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
```

**2.4 Subscription Page** (Days 6-7)
```jsx
import { loadStripe } from '@stripe/stripe-js';

export default function Subscription() {
  const plans = [
    { name: 'Free', price: 0, modules: ['coachpro'] },
    { name: 'Basic', price: 9, modules: ['coachpro', 'paymentspro'] },
    { name: 'Premium', price: 29, modules: ['coachpro', 'paymentspro', 'digipro', 'lifepro'] },
  ];

  const handleCheckout = async (plan) => {
    // Call Stripe Checkout
    const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
    const { data } = await supabase.functions.invoke('stripe-checkout', {
      body: { planName: plan.name }
    });
    await stripe.redirectToCheckout({ sessionId: data.sessionId });
  };

  return (
    <Grid container spacing={3}>
      {plans.map(plan => (
        <Grid item xs={12} md={4} key={plan.name}>
          <Card>
            <CardContent>
              <Typography variant="h5">{plan.name}</Typography>
              <Typography variant="h3">${plan.price}/mo</Typography>
              <Button onClick={() => handleCheckout(plan)}>
                Subscribe
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
```

**2.5 Deploy ProApp** (Day 7)
```bash
# Connect to Vercel
vercel

# Set env vars in Vercel dashboard
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# Deploy
vercel --prod
```

**Deliverables:**
- ✅ ProApp deployed at `https://proapp.vercel.app`
- ✅ Google OAuth + Email login working
- ✅ Module switcher dashboard working
- ✅ Subscription page created (Stripe TBD)

---

### **PHASE 3: Migrate PaymentsPro & DigiPro** (Weeks 3-4)

**Duration:** 10-14 days
**Goal:** Migrate SQLite → Supabase, remove Express backends

#### **3.1 PaymentsPro Migration** (Days 1-7)

**Step 1: Export SQLite Data** (Day 1)
```bash
cd ~/my-paymentspro-app/backend
node scripts/export-sqlite.js
# Outputs: paymentspro_export.json
```

**Step 2: Create Supabase Schema** (Day 2)
```sql
-- supabase/migrations/003_paymentspro.sql
CREATE TABLE paymentspro_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  description text,
  payment_date date NOT NULL,
  category_id uuid REFERENCES paymentspro_categories(id),
  is_paid boolean DEFAULT false,
  -- ... all 49 columns from SQLite
  created_at timestamptz DEFAULT now()
);

CREATE TABLE paymentspro_categories (...);
CREATE TABLE paymentspro_rezervy (...);
-- ... etc

-- RLS Policies
ALTER TABLE paymentspro_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own payments" ON paymentspro_payments
  FOR SELECT USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM module_access
      WHERE user_id = auth.uid()
      AND module_name = 'paymentspro'
      AND has_access = true
    )
  );

-- Apply migration
-- supabase db push
```

**Step 3: Import Data to Supabase** (Day 3)
```javascript
// scripts/import-paymentspro.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const data = JSON.parse(fs.readFileSync('paymentspro_export.json'));

// Import payments
for (const payment of data.payments) {
  await supabase.from('paymentspro_payments').insert({
    ...payment,
    id: undefined, // Generate new UUID
    user_id: YOUR_USER_ID // Map to new user system
  });
}

console.log('Import complete!');
```

**Step 4: Refactor Frontend** (Days 4-6)

**Before (Express API calls):**
```javascript
// Old PaymentsPro
const response = await axios.get('http://localhost:4000/api/payments');
const payments = response.data;
```

**After (Direct Supabase):**
```javascript
// New PaymentsPro
import { supabase } from '@pro/database';

const { data: payments } = await supabase
  .from('paymentspro_payments')
  .select('*')
  .eq('user_id', user.id)
  .order('payment_date', { ascending: false });
```

**Replace ALL axios calls:**
- `/api/payments` → `supabase.from('paymentspro_payments')`
- `/api/categories` → `supabase.from('paymentspro_categories')`
- `/api/rezervy` → `supabase.from('paymentspro_rezervy')`

**Step 5: Update Imports to Use Shared Packages** (Day 6)
```javascript
// Replace local components with @pro packages
import { UniversalDialog } from '@pro/ui';
import { useAuth } from '@pro/auth';
import { supabase } from '@pro/database';
```

**Step 6: Test & Deploy** (Day 7)
```bash
cd apps/paymentspro
pnpm install
pnpm dev # Test locally
pnpm build
vercel --prod # Deploy
```

---

#### **3.2 DigiPro Migration** (Days 8-14)

**Same process as PaymentsPro:**
1. Export SQLite data
2. Create Supabase schema (`004_digipro.sql`)
3. Import data
4. Refactor frontend (remove axios, use Supabase)
5. Update imports to `@pro/*` packages
6. Test & deploy

**Key tables:**
- `digipro_products`
- `digipro_customers`
- `digipro_funnels`
- `digipro_integrations`

**Deliverables:**
- ✅ PaymentsPro frontend → Supabase (backend removed!)
- ✅ DigiPro frontend → Supabase (backend removed!)
- ✅ All data migrated successfully
- ✅ Both apps deployed on Vercel

---

### **PHASE 4: Finalize CoachPro & Create LifePro** (Week 5-6)

**Duration:** 10-14 days
**Goal:** Integrate CoachPro into monorepo, build LifePro from scratch

#### **4.1 CoachPro Integration** (Days 1-3)

**Step 1: Move CoachPro to Monorepo** (Day 1)
```bash
# Copy CoachPro to monorepo
cp -r ~/coachpro/src ~/pro-app/apps/coachpro/
cp ~/coachpro/package.json ~/pro-app/apps/coachpro/

cd ~/pro-app/apps/coachpro
pnpm install
```

**Step 2: Update Imports** (Day 2)
```javascript
// Replace local shared code with @pro packages
// Before:
import { GenericAuthContext } from '../shared/context/GenericAuthContext';
import { BaseCard } from '../shared/components/cards/BaseCard';

// After:
import { GenericAuthContext } from '@pro/auth';
import { BaseCard } from '@pro/ui';
```

**Step 3: Add ProApp Integration** (Day 3)
```javascript
// In CoachPro App.jsx, check module access
import { useAuth } from '@pro/auth';

function App() {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const { data } = await supabase
        .from('module_access')
        .select('has_access')
        .eq('user_id', user.id)
        .eq('module_name', 'coachpro')
        .single();

      if (!data?.has_access) {
        window.location.href = 'https://proapp.vercel.app/subscription';
      }
      setHasAccess(true);
    };
    checkAccess();
  }, [user]);

  if (!hasAccess) return <LoadingScreen />;
  return <Router>...</Router>;
}
```

---

#### **4.2 LifePro Creation** (Days 4-14)

**Step 1: Setup Frontend** (Day 4)
```bash
cd apps/lifepro
pnpm create vite . --template react
pnpm add @mui/material @emotion/react @emotion/styled
pnpm add @pro/ui @pro/auth @pro/database
```

**Step 2: Create Supabase Schema** (Day 5)
```sql
-- supabase/migrations/005_lifepro.sql
CREATE TABLE lifepro_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  order_index int
);

CREATE TABLE lifepro_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES lifepro_categories(id),
  title text NOT NULL,
  description text,
  order_index int
);

CREATE TABLE lifepro_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES lifepro_sections(id),
  question_text text NOT NULL,
  question_type text NOT NULL, -- 'text', 'textarea', 'radio', 'checkbox', 'slider', 'rating', 'date'
  options jsonb, -- For radio/checkbox/select
  order_index int
);

CREATE TABLE lifepro_user_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  question_id uuid REFERENCES lifepro_questions(id),
  response_value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE lifepro_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  analysis_text text NOT NULL, -- Claude API output
  patterns jsonb,
  values jsonb,
  blind_spots jsonb,
  created_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE lifepro_user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifepro_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own responses" ON lifepro_user_responses
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users view own analyses" ON lifepro_analyses
  FOR ALL USING (user_id = auth.uid());
```

**Step 3: Build Questionnaire UI** (Days 6-10)

```jsx
// pages/Questionnaire.jsx
import { useState, useEffect } from 'react';
import { supabase } from '@pro/database';
import { BaseCard } from '@pro/ui';

export default function Questionnaire() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    // Load categories
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('lifepro_categories')
        .select('*')
        .order('order_index');
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const loadQuestions = async (categoryId) => {
    const { data } = await supabase
      .from('lifepro_questions')
      .select('*, section:lifepro_sections(*)')
      .eq('section.category_id', categoryId)
      .order('order_index');
    setQuestions(data);
  };

  const saveResponse = async (questionId, value) => {
    await supabase.from('lifepro_user_responses').upsert({
      user_id: user.id,
      question_id: questionId,
      response_value: value
    });
    setResponses({ ...responses, [questionId]: value });
  };

  return (
    <Container>
      <Typography variant="h4">Life Purpose Discovery</Typography>

      {/* Category selector */}
      <Grid container spacing={2}>
        {categories.map(cat => (
          <Grid item xs={12} sm={6} md={4} key={cat.id}>
            <BaseCard
              title={cat.name}
              icon={cat.icon}
              onClick={() => {
                setSelectedCategory(cat);
                loadQuestions(cat.id);
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Questions */}
      {selectedCategory && (
        <Box mt={4}>
          {questions.map(q => (
            <QuestionRenderer
              key={q.id}
              question={q}
              value={responses[q.id]}
              onChange={(value) => saveResponse(q.id, value)}
            />
          ))}
        </Box>
      )}

      <Button onClick={generateAnalysis}>Generate AI Analysis</Button>
    </Container>
  );
}
```

**Step 4: Create Edge Function for AI Analysis** (Days 11-12)

```typescript
// supabase/functions/claude-analysis/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Anthropic from '@anthropic-ai/sdk';

serve(async (req) => {
  const { userId } = await req.json();

  // 1. Fetch user responses
  const { data: responses } = await supabase
    .from('lifepro_user_responses')
    .select('*, question:lifepro_questions(*)')
    .eq('user_id', userId);

  // 2. Format for Claude
  const prompt = `
Analyze these life purpose questionnaire responses:

${responses.map(r => `Q: ${r.question.question_text}\nA: ${r.response_value}`).join('\n\n')}

Identify:
1. Core patterns in their responses
2. Top 3 values
3. Potential blind spots
4. Career direction suggestions
`;

  // 3. Call Claude API
  const anthropic = new Anthropic({
    apiKey: Deno.env.get('ANTHROPIC_API_KEY')
  });

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });

  const analysisText = message.content[0].text;

  // 4. Save analysis
  await supabase.from('lifepro_analyses').insert({
    user_id: userId,
    analysis_text: analysisText,
    created_at: new Date().toISOString()
  });

  return new Response(JSON.stringify({ analysis: analysisText }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

**Step 5: Deploy Edge Function** (Day 12)
```bash
supabase functions deploy claude-analysis
supabase secrets set ANTHROPIC_API_KEY=sk-xxx
```

**Step 6: Build Results Page** (Day 13)
```jsx
// pages/Results.jsx
export default function Results() {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const { data } = await supabase
        .from('lifepro_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      setAnalysis(data);
    };
    fetchAnalysis();
  }, []);

  return (
    <Container>
      <Typography variant="h4">Your Life Purpose Analysis</Typography>

      {analysis && (
        <Card>
          <CardContent>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {analysis.analysis_text}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Button onClick={exportPDF}>Export to PDF</Button>
    </Container>
  );
}
```

**Step 7: Test & Deploy** (Day 14)
```bash
cd apps/lifepro
pnpm dev # Test locally
pnpm build
vercel --prod
```

**Deliverables:**
- ✅ CoachPro integrated into monorepo
- ✅ LifePro fully built (questionnaire + AI analysis)
- ✅ Edge Functions working (Claude API)
- ✅ All 5 apps deployed

---

## 📅 TIMELINE SUMMARY

| Phase | Tasks | Duration | Cumulative |
|-------|-------|----------|------------|
| **Phase 1** | Setup monorepo + Supabase | 5-7 days | Week 1 |
| **Phase 2** | Build ProApp (auth hub) | 5-7 days | Week 2 |
| **Phase 3** | Migrate PaymentsPro + DigiPro | 10-14 days | Weeks 3-4 |
| **Phase 4** | Integrate CoachPro + Build LifePro | 10-14 days | Weeks 5-6 |
| **Phase 5** | Build ContentPro (social media) | 10-14 days | Weeks 7-9 |
| **TOTAL** | **Complete migration** | **40-56 days** | **8-11 weeks** |

---

## ✅ SUCCESS CRITERIA

### **Phase 1 Complete When:**
- [ ] Monorepo folder structure created
- [ ] Supabase project setup with core auth tables
- [ ] Shared packages extracted (`@pro/ui`, `@pro/auth`, etc.)
- [ ] Turborepo running (`turbo dev` works)

### **Phase 2 Complete When:**
- [ ] ProApp deployed at production URL
- [ ] Google OAuth login working
- [ ] Email/password login working
- [ ] Module switcher dashboard showing 4 module cards
- [ ] Subscription page created (even if Stripe not integrated yet)

### **Phase 3 Complete When:**
- [ ] PaymentsPro: All SQLite data migrated to Supabase
- [ ] PaymentsPro: Frontend using Supabase (no Express backend!)
- [ ] PaymentsPro: Deployed and accessible via ProApp
- [ ] DigiPro: All SQLite data migrated to Supabase
- [ ] DigiPro: Frontend using Supabase (no Express backend!)
- [ ] DigiPro: Deployed and accessible via ProApp

### **Phase 4 Complete When:**
- [ ] CoachPro: Moved to monorepo and using `@pro/*` packages
- [ ] CoachPro: Module access check integrated
- [ ] LifePro: Frontend built with questionnaire UI
- [ ] LifePro: Edge Function for Claude AI working
- [ ] LifePro: Deployed and accessible via ProApp

### **FINAL Success:**
- [ ] All 5 apps (ProApp + 4 modules) deployed on Vercel
- [ ] Single Supabase project with all tables
- [ ] SSO working (login once → access all modules)
- [ ] Module access control working (based on subscription)
- [ ] Cost: $25/month (Supabase Pro only)

---

## 🚨 RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **SQLite data loss during migration** | HIGH | - Backup SQLite files BEFORE export<br>- Test import on development Supabase first<br>- Verify row counts match |
| **Vercel 10s timeout for complex queries** | MEDIUM | - Optimize Supabase queries (indexes)<br>- Use Supabase RLS (server-side filtering)<br>- Monitor query performance |
| **Breaking changes in shared packages** | MEDIUM | - Version shared packages (`@pro/ui@1.0.0`)<br>- Use semantic versioning<br>- Test all apps before deploying |
| **Supabase $25/month not enough** | LOW | - Monitor usage in dashboard<br>- Free tier = 500MB DB, Pro = 8GB<br>- Upgrade to Team ($599/mo) only if needed |
| **Module access bugs (wrong permissions)** | MEDIUM | - Write RLS tests<br>- Manual testing per module<br>- Admin override for debugging |

---

## 📚 DOCUMENTATION TO CREATE

During migration, create these docs:

1. **ARCHITECTURE.md** - System overview, tech stack, folder structure
2. **AUTH.md** - How SSO works, RLS policies, adding new modules
3. **DEPLOYMENT.md** - How to deploy each app, env vars, CI/CD
4. **DEVELOPMENT.md** - Local setup, running all apps, debugging
5. **SHARED_PACKAGES.md** - How to use `@pro/*` packages, adding new ones
6. **DATABASE.md** - Schema design, migrations, RLS policies
7. **TROUBLESHOOTING.md** - Common issues, solutions

---

## 🎯 RECOMMENDATIONS

### **Start with Phase 1 immediately:**
1. Create GitHub repo `pro-app`
2. Setup monorepo structure locally
3. Create Supabase project
4. Extract shared packages from CoachPro

### **Quick Wins (Week 1):**
- Extract `GenericAuthContext` → saves 73% auth code
- Extract `UniversalDialog` → saves 63% dialog code
- Extract `UnifiedColorContext` → saves 85% color duplication

### **Don't overthink:**
- Start with basic ProApp (just login + module cards)
- Add Stripe subscriptions LATER (free tier for now)
- Migrate PaymentsPro first (simpler than DigiPro)

### **Test incrementally:**
- Don't wait for "perfect" - deploy often
- Use Vercel preview deployments for testing
- Keep old apps running until new ones proven

---

## 📞 NEXT STEPS

**Ready to start?**

1. **Create GitHub repo:** `github.com/lennayia/pro-app`
2. **Clone and setup:**
   ```bash
   git clone https://github.com/lennayia/pro-app.git
   cd pro-app
   # Follow Phase 1 setup
   ```
3. **Create Supabase project:** https://supabase.com/dashboard
4. **Start migration!** 🚀

---

## 💬 QUESTIONS? CONTACT

- **Claude Code Session:** Review this plan
- **Phase 1 Help:** Follow tasks step-by-step
- **Stuck?** Open new Claude Code session with specific phase

---

---

## 📱 CONTENTPRO MODULE - DETAILED SPEC

### **Overview**
ContentPro (Social Media Management) - Plan, create, schedule, and analyze content across multiple social platforms.

### **Core Features**

**1. Content Calendar** 📅
- Visual monthly/weekly/daily view
- Drag-and-drop post scheduling
- Multi-platform post previews
- Color-coded by platform (FB=blue, IG=pink, X=black, LinkedIn=blue)
- Timezone support (Czech = Europe/Prague)

**2. Post Composer** ✍️
- Multi-platform editor (single compose → post to all)
- Character limits per platform (X=280, LinkedIn=3000)
- Image/video upload with preview
- Hashtag suggestions
- AI text generation (Claude API): "Přepiš to profesionálně", "Zkrať na tweet"
- Emoji picker
- Link shortening

**3. Media Library** 🖼️
- Upload images/videos
- Organize by folders/tags
- Automatic WebP compression (reuse from CoachPro!)
- Quick insert into posts

**4. Analytics** 📊
- Post performance (likes, shares, comments, reach)
- Best posting times
- Engagement rate trends
- Platform comparison
- Export reports (PDF)

**5. Social Accounts** 🔗
- Connect multiple accounts per platform
- OAuth for FB, IG, LinkedIn, X
- Account switching
- Profile info display

### **Database Schema**

```sql
-- supabase/migrations/006_contentpro.sql

-- Social Accounts
CREATE TABLE contentpro_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  platform text NOT NULL, -- 'facebook', 'instagram', 'linkedin', 'twitter', 'youtube'
  account_name text NOT NULL,
  account_id text NOT NULL, -- Platform's account ID
  access_token text NOT NULL, -- Encrypted!
  refresh_token text,
  token_expires_at timestamptz,
  profile_picture_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Posts
CREATE TABLE contentpro_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  scheduled_at timestamptz NOT NULL,
  status text NOT NULL, -- 'draft', 'scheduled', 'published', 'failed'
  platforms jsonb NOT NULL, -- ['facebook', 'instagram', 'linkedin']
  media_urls jsonb, -- Array of image/video URLs
  hashtags text[],
  link_url text,
  published_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Post Analytics
CREATE TABLE contentpro_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES contentpro_posts(id) ON DELETE CASCADE,
  platform text NOT NULL,
  platform_post_id text, -- ID from platform API
  likes int DEFAULT 0,
  comments int DEFAULT 0,
  shares int DEFAULT 0,
  reach int DEFAULT 0,
  engagement_rate numeric,
  fetched_at timestamptz DEFAULT now()
);

-- Media Library
CREATE TABLE contentpro_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL, -- 'image', 'video'
  file_size bigint,
  width int,
  height int,
  folder text,
  tags text[],
  created_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE contentpro_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contentpro_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contentpro_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE contentpro_media ENABLE ROW LEVEL SECURITY;

-- Users can view/edit own data + check module access
CREATE POLICY "Users with ContentPro access - accounts" ON contentpro_accounts
  FOR ALL USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM module_access
      WHERE user_id = auth.uid()
      AND module_name = 'contentpro'
      AND has_access = true
    )
  );

CREATE POLICY "Users with ContentPro access - posts" ON contentpro_posts
  FOR ALL USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM module_access
      WHERE user_id = auth.uid()
      AND module_name = 'contentpro'
      AND has_access = true
    )
  );

-- Same for analytics and media
```

### **Edge Functions**

**1. social-post-scheduler** (Cron job)
```typescript
// Runs every 5 minutes
// Checks for posts scheduled_at <= NOW and status = 'scheduled'
// Publishes to platforms via APIs

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  // 1. Fetch posts to publish
  const { data: posts } = await supabase
    .from('contentpro_posts')
    .select('*, account:contentpro_accounts(*)')
    .lte('scheduled_at', new Date().toISOString())
    .eq('status', 'scheduled');

  for (const post of posts) {
    for (const platform of post.platforms) {
      try {
        // 2. Publish to platform
        if (platform === 'facebook') {
          await publishToFacebook(post, post.account);
        } else if (platform === 'instagram') {
          await publishToInstagram(post, post.account);
        }
        // ... etc

        // 3. Update status
        await supabase
          .from('contentpro_posts')
          .update({ status: 'published', published_at: new Date() })
          .eq('id', post.id);
      } catch (error) {
        // Mark as failed
        await supabase
          .from('contentpro_posts')
          .update({ status: 'failed', error_message: error.message })
          .eq('id', post.id);
      }
    }
  }

  return new Response('OK');
});
```

**2. ai-content-generator** (On-demand)
```typescript
// Claude API for content suggestions

serve(async (req) => {
  const { prompt, platform, tone } = await req.json();

  const anthropic = new Anthropic({
    apiKey: Deno.env.get('ANTHROPIC_API_KEY')
  });

  const systemPrompt = `You are a social media expert. Generate content for ${platform}.
Tone: ${tone} (professional/casual/funny)
Character limit: ${platform === 'twitter' ? 280 : 3000}
Include 3-5 relevant hashtags.`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
    system: systemPrompt
  });

  return new Response(JSON.stringify({
    content: message.content[0].text
  }));
});
```

### **Social Platform APIs**

**Meta (Facebook + Instagram):**
- OAuth: Facebook Login
- API: Graph API v18.0
- Publish: `POST /{page-id}/feed` (FB), `POST /{ig-user-id}/media` (IG)

**LinkedIn:**
- OAuth: OAuth 2.0
- API: LinkedIn Marketing API
- Publish: `POST /v2/ugcPosts`

**X (Twitter):**
- OAuth: OAuth 2.0
- API: Twitter API v2
- Publish: `POST /2/tweets`

**YouTube:**
- OAuth: Google OAuth
- API: YouTube Data API v3
- Publish: `POST /youtube/v3/videos`

### **UI Components (Reuse from @pro/ui)**

- `<ContentCalendar />` - Full-calendar view (react-big-calendar?)
- `<PostComposer />` - Multi-platform editor
- `<MediaLibrary />` - Grid with upload (reuse PhotoUpload!)
- `<PlatformAccountCard />` - Connect/disconnect accounts
- `<AnalyticsChart />` - Chart.js or Recharts

### **Implementation Timeline**

**Phase 5: ContentPro** (Weeks 7-9)
- **Week 7:** Database schema, account connection (OAuth)
- **Week 8:** Post composer, media library, calendar UI
- **Week 9:** Scheduler Edge Function, analytics, testing

### **Subscription Tiers (Updated)**

| Plan | Price | Modules Included |
|------|-------|------------------|
| **Free** | $0 | CoachPro only |
| **Basic** | $9/mo | CoachPro, PaymentsPro |
| **Premium** | $29/mo | CoachPro, PaymentsPro, DigiPro, LifePro |
| **Business** | $49/mo | **ALL 5 modules** (+ ContentPro!) |

---

**End of Migration Plan**
**Version:** 1.1 (Updated with ContentPro)
**Last Updated:** 12. listopadu 2025

---

**Good luck! Jsi ready? 💪🚀**