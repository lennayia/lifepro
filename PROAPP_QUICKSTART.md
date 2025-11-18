# ProApp - Quick Start Guide

> Rychlý přehled pro Claude Code - co potřebuješ vědět HNED

---

## 🎯 Co je ProApp?

Modulární mono-repository zastřešující všechny Pro aplikace:
- **LifePro** - Osobnostní analýza a nalezení poslání
- **CoachPro** - Koučovací platforma
- **DigiPro** - Digital marketing
- **PaymentsPro** - Fakturace a platby

---

## 📂 Základní Struktura

```
proapp/
├── apps/
│   ├── lifepro/         # Již hotová aplikace
│   ├── coachpro/        # TODO
│   ├── digipro/         # TODO
│   ├── paymentspro/     # TODO
│   └── dashboard/       # Centrální dashboard - TODO
│
├── packages/
│   ├── ui/              # Design system - PRIORITA
│   ├── shared/          # Utility & typy
│   ├── auth/            # Autentizace
│   ├── database/        # Supabase client
│   ├── ai/              # Claude AI
│   ├── payments/        # Stripe/GoPay
│   └── notifications/   # Email/Push
│
└── supabase/
    └── migrations/      # SQL migrace
```

---

## 🚀 První Kroky

### 1. Setup Mono-repo

```bash
# V root adresáři
pnpm init
pnpm add -D turbo typescript

# Vytvořit turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {}
  }
}
```

### 2. Přesunout LifePro

```bash
mkdir -p apps/lifepro
mv src apps/lifepro/
mv package.json apps/lifepro/
```

### 3. Vytvořit Design System

```bash
mkdir -p packages/ui/src/components
cd packages/ui
pnpm init
```

---

## 🎨 Design System Priority

Komponenty k vytvoření JAKO PRVNÍ:

### Atoms (základní)
1. `Button` - 4 varianty (primary, secondary, ghost, danger)
2. `Input` - text, textarea, number, email
3. `Card` - základní kontejner
4. `Badge` - status štítky
5. `Avatar` - uživatelské avatary
6. `Icon` - wrapper pro Lucide icons

### Molecules (složené)
1. `FormField` - input + label + error
2. `Modal` / `Dialog` - modální okna
3. `Dropdown` - select menu
4. `Tabs` - záložky
5. `Alert` / `Toast` - notifikace

### Organisms (komplexní)
1. `Navbar` - hlavní navigace s app switcherem
2. `DataTable` - univerzální tabulka
3. `AppSwitcher` - přepínač mezi aplikacemi
4. `UserMenu` - user dropdown

---

## 🗄️ Databáze - Klíčové Tabulky

### Shared (všechny moduly)

```sql
-- Základní
profiles                    # Uživatelé
organizations              # Organizace/týmy
organization_members       # Členové týmů
module_access             # Přístup k modulům

-- Billing
subscriptions             # Předplatné
invoices                  # Faktury

-- Ostatní
notifications             # Notifikace
audit_logs               # Audit trail
files                    # Metadata souborů
```

### Moduly (schémata)

```sql
-- LifePro
lifepro.categories        # HOTOVO
lifepro.sections          # HOTOVO
lifepro.questions         # HOTOVO
lifepro.user_responses    # HOTOVO
lifepro.ai_analyses       # HOTOVO

-- CoachPro (TODO)
coachpro.clients
coachpro.sessions
coachpro.tasks
coachpro.programs

-- DigiPro (TODO)
digipro.projects
digipro.campaigns
digipro.content_items
digipro.analytics_snapshots

-- PaymentsPro (TODO)
paymentspro.customers
paymentspro.user_invoices
paymentspro.invoice_items
paymentspro.payments
```

---

## 🔌 API Patterns

### Standardní REST Endpoints

```typescript
// Všechny moduly mají stejnou strukturu

// List
GET /api/{module}/{resource}
GET /api/coachpro/clients

// Detail
GET /api/{module}/{resource}/:id
GET /api/coachpro/clients/123

// Create
POST /api/{module}/{resource}
POST /api/coachpro/clients

// Update
PATCH /api/{module}/{resource}/:id
PATCH /api/coachpro/clients/123

// Delete
DELETE /api/{module}/{resource}/:id
DELETE /api/coachpro/clients/123
```

### Speciální Akce

```typescript
// Akce s postfixem
POST /api/{module}/{resource}/:id/{action}
POST /api/coachpro/sessions/123/complete
POST /api/digipro/content/456/publish
POST /api/paymentspro/invoices/789/send
```

---

## 🎯 Prioritní Úkoly

### Fáze 1: Foundation (TEĎ)

- [ ] Setup turbo monorepo
- [ ] Vytvořit packages/ui s design systemem
- [ ] Vytvořit packages/shared (types, utils)
- [ ] Vytvořit packages/auth
- [ ] Přesunout LifePro do apps/lifepro
- [ ] Vytvořit společné DB migrace (00_shared_tables.sql)

### Fáze 2: Dashboard (PŘÍŠTĚ)

- [ ] Vytvořit apps/dashboard
- [ ] Auth flow (login, register)
- [ ] App switcher
- [ ] User settings
- [ ] Billing & subscriptions

### Fáze 3: První Modul (CoachPro)

- [ ] Vytvořit apps/coachpro
- [ ] DB schéma (coachpro.*)
- [ ] Základní CRUD pro klienty
- [ ] Plánování sezení
- [ ] Poznámky

---

## 🔐 Environment Variables

```bash
# Sdílené pro všechny moduly
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# Každý modul má svůj port v dev mode
# Dashboard: 3000
# LifePro: 3001
# CoachPro: 3002
# DigiPro: 3003
# PaymentsPro: 3004
```

---

## 🎨 Barvy Modulů

```typescript
const MODULE_COLORS = {
  lifepro: '#6366f1',      // Indigo
  coachpro: '#10b981',     // Emerald
  digipro: '#f59e0b',      // Amber
  paymentspro: '#3b82f6',  // Blue
}
```

---

## 📋 Checklist pro Nový Modul

Když vytvářím nový modul (např. CoachPro):

1. **Struktura**
   - [ ] Vytvořit apps/{module}
   - [ ] Setup package.json
   - [ ] Setup tsconfig.json
   - [ ] Vytvořit src/app struktura

2. **Databáze**
   - [ ] Vytvořit SQL schéma (supabase/migrations/XX_{module}.sql)
   - [ ] Vytvořit TypeScript typy
   - [ ] Setup RLS policies

3. **UI**
   - [ ] Použít komponenty z packages/ui
   - [ ] Vytvořit layout s navigací
   - [ ] Implementovat základní stránky

4. **API**
   - [ ] Vytvořit API routes
   - [ ] Implementovat CRUD operace
   - [ ] Přidat validace (Zod)

5. **Auth**
   - [ ] Implementovat middleware
   - [ ] Kontrola module_access
   - [ ] RLS policies

---

## 🛠️ Užitečné Příkazy

```bash
# Development
pnpm dev                          # Všechny moduly
pnpm dev --filter dashboard       # Jen dashboard
pnpm dev --filter lifepro         # Jen LifePro

# Build
pnpm build                        # Build všech modulů
pnpm build --filter coachpro      # Build jen CoachPro

# Type checking
pnpm type-check                   # Všude
pnpm type-check --filter digipro  # Jen DigiPro

# Databáze
cd supabase
supabase db push                  # Aplikovat migrace
supabase db reset                 # Reset + seed
```

---

## 🎓 Příklady Kódu

### Použití Design System Komponenty

```typescript
// apps/coachpro/src/app/clients/page.tsx
import { Button, Card, DataTable } from '@proapp/ui'
import { useClients } from '@/hooks/useClients'

export default function ClientsPage() {
  const { clients } = useClients()

  return (
    <div>
      <Card>
        <DataTable
          columns={clientColumns}
          data={clients}
        />
      </Card>

      <Button variant="primary" onClick={() => router.push('/clients/new')}>
        Nový klient
      </Button>
    </div>
  )
}
```

### Kontrola Přístupu k Modulu

```typescript
// apps/coachpro/src/middleware.ts
import { createServerClient } from '@proapp/auth'
import { checkModuleAccess } from '@proapp/shared'

export async function middleware(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect('/login')
  }

  const hasAccess = await checkModuleAccess(user.id, 'coachpro')
  if (!hasAccess) {
    return NextResponse.redirect('/dashboard?error=no-access')
  }

  return NextResponse.next()
}
```

### API Route Pattern

```typescript
// apps/coachpro/src/app/api/clients/route.ts
import { createServerClient } from '@proapp/database'
import { clientSchema } from '@proapp/shared/validators'

export async function GET(request: Request) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('coachpro.clients')
    .select('*')
    .eq('coach_id', user.id)

  return Response.json({ data, error })
}

export async function POST(request: Request) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const body = await request.json()
  const validated = clientSchema.parse(body)

  const { data, error } = await supabase
    .from('coachpro.clients')
    .insert({
      ...validated,
      coach_id: user.id,
    })
    .select()
    .single()

  return Response.json({ data, error })
}
```

---

## 🎯 Co Dělat Když...

### ...vytvářím novou komponentu?
1. Zjistit, jestli už není v packages/ui
2. Pokud je specifická pro modul → `apps/{module}/src/components`
3. Pokud je sdílená → `packages/ui/src/components`

### ...potřebuji přidat utility funkci?
1. Zjistit, jestli už není v packages/shared/utils
2. Pokud je specifická → `apps/{module}/src/lib/utils`
3. Pokud je sdílená → `packages/shared/src/utils`

### ...přidávám novou DB tabulku?
1. Určit, jestli je sdílená nebo specifická pro modul
2. Sdílená → `supabase/migrations/XX_shared.sql`
3. Specifická → `supabase/migrations/XX_{module}.sql`
4. Vždy přidat RLS policies!

### ...potřebuji AI funkci?
1. Použít `packages/ai/src/claude`
2. Prompty dát do `packages/ai/src/prompts`
3. Logovat usage do `ai_usage` tabulky

---

## 📚 Další Dokumentace

- **Detailní kontext**: `PROAPP_CONTEXT.md`
- **LifePro specifics**: `README.md`
- **API dokumentace**: `docs/api/`
- **Databázové schéma**: `supabase/migrations/`

---

**Vytvořeno**: 17.11.2025
**Pro**: Claude Code
**Účel**: Rychlá orientace v ProApp projektu
