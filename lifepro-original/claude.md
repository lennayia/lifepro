# Claude Code - Summary dokumentace
## Období: 13.10.2025 - 21.10.2025

---

## Přehled změn

**Git statistiky:**
- 49 souborů změněno
- +16,100 řádků přidáno
- -3,903 řádků odstraněno
- Poslední commit před tímto obdobím: 9.10.2025
- Nový commit: 21.10.2025

---

## Část 0: Kontext z předchozího summary (13.10.2025)

### Trial Subscription Notifications
- Implementace vizuálního blikání pro trial notifikace
- Backend pole pro renewal notifikace
- Session-based disable funkcionalita pro trial varování

---

## Část 1: Trial Subscription Notifications (13.10.2025)

### Implementované funkce:

1. **Vizuální blikání notifikací**
   - Glassmorphic design s blur efektem
   - Animace fade-in/fade-out
   - Responsive layout

2. **Backend pole pro renewal**
   - `renewal_notification_sent` (boolean)
   - `trial_warning_sent` (boolean)
   - Tracking stavu notifikací

3. **Session-based disable**
   - Dočasné vypnutí varování
   - Ukládání do sessionStorage
   - Reset při nové session

---

## Část 2: UniversalDialog System (14-17.10.2025)

### Mega refaktor dialogového systému

**Problém:** 5,400+ řádků duplikovaného kódu v dialogových komponentách

**Řešení:** Config-driven UniversalDialog systém

### Vytvořené soubory:

#### `frontend/src/components/shared/UniversalDialog/`
- `index.jsx` (447 řádků) - Hlavní dialog komponenta
- `DynamicTab.jsx` (209 řádků) - Rendering karet
- `FieldRenderer.jsx` (371 řádků) - Rendering polí
- `README.md` (793 řádků) - Dokumentace

#### `frontend/src/config/dialogs/`
- `paymentDialogConfig.js` (925 řádků)
- `rezervyDialogConfig.js` (381 řádků)
- `wishlistDialogConfig.js` (429 řádků)
- `lifeproDialogConfig.js` (337 řádků)
- `EXAMPLES.md` (925 řádků)

### Výsledky:
- **PaymentDialog:** 1,486 → 362 řádků (75.6% redukce)
- **Celková redukce:** ~5,400 → ~2,000 sdílených řádků
- **Maintenance:** Centralizovaná logika pro všechny dialogy

### Klíčové problémy a řešení:

#### Problem 1: Boolean hodnoty ukládány jako stringy
**Chyba:** Switch komponenty ukládaly "true" místo true

**Fix:**
```javascript
if (field?.type === 'switch' || field?.type === 'checkbox') {
  value = Boolean(value);
}
```

#### Problem 2: Custom komponenty nedostávaly additionalProps
**Chyba:** CustomPaymentSwitcher neměl přístup k categories

**Fix:**
```javascript
<FieldRenderer
  field={field}
  formData={formData}
  handleInputChange={handleInputChange}
  additionalProps={additionalProps}  // ← Přidáno
/>
```

#### Problem 3: Form se neresetoval při zavření dialogu
**Fix:**
```javascript
React.useEffect(() => {
  if (!open) {
    // Reset form data when dialog closes
    const defaults = {};
    extractAllFields(config.tabs).forEach(field => {
      if (field.name) {
        defaults[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
      }
    });
    setFormData(defaults);
    setCurrentTab(0);
  }
}, [open]);
```

---

## Část 3: Auto-Copy Functionality (15-17.10.2025)

### Automatické kopírování plateb pro další období

**Soubor:** `frontend/src/utils/paymentAutoCopy.js` (206 řádků)

### Klíčové funkce:

```javascript
export const canUseAutoCopy = (payment) => {
  if (!payment.is_paid) return false;
  if (!payment.auto_copy_enabled) return false;
  if (!payment.frequency || payment.frequency === 'once') return false;
  return true;
};

export const executeAutoCopy = async ({ payment, onSubmit, onSuccess, onError }) => {
  // 1. Uložit původní platbu
  await onSubmit(payment);

  // 2. Vytvořit kopii pro další období
  const newPayment = createNextPeriodPayment(payment);

  // 3. Uložit novou platbu
  const result = await onSubmit(newPayment);

  // 4. Callback
  if (onSuccess) onSuccess(result, payment);

  return result;
};
```

### Workflow:
1. Uživatel označí platbu jako zaplacenou
2. Pokud má `auto_copy_enabled`, zobrazí se confirmation dialog
3. Po potvrzení se vytvoří nová platba pro další období
4. `due_date` se automaticky posune podle `frequency`

### Klíčové problémy a řešení:

#### Problem 1: Auto-copy vytvořil duplikátní splátky
**Chyba:** Splátka uložena 2x po auto-copy

**Příčina:** `_saveInstallmentAfterSubmit` nebyl smazán po prvním uložení

**Fix:**
```javascript
if (formData._saveInstallmentAfterSubmit) {
  // ... save installment ...
  delete formData._saveInstallmentAfterSubmit; // ← PŘIDÁNO
}
```

#### Problem 2: due_date se posouval špatně
**Chyba:** Datum se posunulo o měsíc zpět kvůli DST/timezone bug

**Fix:** Použití date-fns knihovny
```javascript
import { addMonths } from 'date-fns';
const newDate = addMonths(date, 1); // Timezone-safe
```

---

## Část 4: Installments System (16-18.10.2025)

### Kompletní systém sledování splátek

### Backend migrace:

#### `backend/migrations/005_add_commitment_fields.sql`
```sql
ALTER TABLE payments ADD COLUMN has_commitment INTEGER DEFAULT 0;
ALTER TABLE payments ADD COLUMN commitment_months INTEGER;
ALTER TABLE payments ADD COLUMN commitment_start TEXT;
ALTER TABLE payments ADD COLUMN commitment_end TEXT;
ALTER TABLE payments ADD COLUMN paid_amount REAL DEFAULT 0;

CREATE INDEX idx_payments_commitment ON payments(has_commitment);
```

#### `backend/migration_installments.sql`
```sql
CREATE TABLE IF NOT EXISTS payment_installments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payment_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  paid_date TEXT NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);
```

### Backend API endpoints:

```javascript
// POST /api/payments/:id/installments
app.post('/api/payments/:id/installments', authenticateToken, async (req, res) => {
  const { amount, paid_date, notes } = req.body;
  // Insert into payment_installments table
});

// GET /api/payments/:id/installments
app.get('/api/payments/:id/installments', authenticateToken, async (req, res) => {
  // Fetch installment history
});
```

### Frontend komponenty:

#### `frontend/src/components/payments/PaymentInstallments.jsx`
- Seznam historie splátek
- Přidání nové splátky
- Automatický výpočet `paid_amount`
- Automatické posunutí `due_date` při plném zaplacení

### Klíčové problémy a řešení:

#### Problem 1: paid_amount se neaktualizoval správně
**Fix:** Automatický přepočet po každém přidání splátky
```javascript
const totalPaid = installments.reduce((sum, inst) => sum + parseFloat(inst.amount), 0);
await updatePayment({ ...payment, paid_amount: totalPaid });
```

#### Problem 2: Splátky se nenačítaly (401 Unauthorized)
**Chyba:** Chybějící Authorization header

**Fix:**
```javascript
const token = localStorage.getItem('accessToken');
fetch(url, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Část 5: Pie Chart Visualization + Tab Navigation (21.10.2025)

### Dnešní práce - Vizualizace splátek koláčovým grafem

### A. Fix "0" bugu v tabulce

**Problem:** Sloupec installments zobrazoval "0" místo prázdného pole nebo ikony

**Příčina:** Boolean coercion issue
```javascript
// PŘED (vracelo 0):
const hasInstallmentsForActions = (
  (['standing_order', 'recurring'].includes(p.payment_method) || p.has_commitment) &&
  p.total_amount &&
  p.total_amount > 0
);

// PO (vrací boolean):
const hasInstallmentsForActions = !!(
  (['standing_order', 'recurring'].includes(p.payment_method) || p.has_commitment) &&
  p.total_amount &&
  p.total_amount > 0
);
```

**Soubor:** `frontend/src/components/payments/PaymentList.jsx:2850`

### B. Odstranění progress baru ze sloupce měny

**Před:** Currency sloupec obsahoval progress bar (78 řádků)
**Po:** Pouze formátovaná částka (17 řádků)

```javascript
case 'currency':
  return (
    <Typography
      fontWeight="600"
      sx={{
        fontSize: screenWidth < 800 ? '0.7rem' : '0.8rem',
        whiteSpace: 'nowrap',
        textAlign: 'right',
        width: '100%'
      }}
    >
      {formatCurrency(p.amount, p.currency)}
    </Typography>
  );
```

**Soubor:** `frontend/src/components/payments/PaymentList.jsx:2435-2451`

### C. Přidání DonutSmall ikony

**Problem:** Červený ❓ v headeru sloupce installments

**Fix:**
```javascript
import { DonutSmall as DonutSmallIcon } from '@mui/icons-material';

const columnIcons = useMemo(() => ({
  installments: DonutSmallIcon,
  // ... ostatní ikony
}), []);
```

**Soubor:** `frontend/src/components/payments/PaymentList.jsx:23, 1271`

### D. SVG Pie Chart implementace

**Vizuální design:**
- Velikost: 28x28px
- Radius: 11px
- Stroke width: 3px
- Background (nezaplaceno): secondary barva
- Progress (zaplaceno): primary barva
- Ikona uprostřed: DonutSmallIcon v primary barvě

**Matematika:**
- Circumference: 2πr = 2π × 11 = 69.115
- Progress calculation: `(percentage / 100) × 69.115`

**Kód:**
```javascript
case 'installments': {
  const hasInstallments = !!(
    (['standing_order', 'recurring'].includes(p.payment_method) || p.has_commitment) &&
    p.total_amount && p.total_amount > 0
  );

  if (!hasInstallments) {
    return <Box sx={{ display: 'flex', justifyContent: 'center' }}>—</Box>;
  }

  const paidAmount = parseFloat(p.paid_amount || 0);
  const totalAmount = parseFloat(p.total_amount || 0);
  const progressPercentage = totalAmount > 0
    ? Math.min((paidAmount / totalAmount) * 100, 100)
    : 0;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Tooltip title={`Zaplaceno: ${formatCurrency(paidAmount, p.currency)} z ${formatCurrency(totalAmount, p.currency)} (${Math.round(progressPercentage)}%)`}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(p, 1); // Opens "Platba" tab (index 1)
          }}
        >
          <Box sx={{ position: 'relative', width: 28, height: 28 }}>
            <svg width="28" height="28" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background circle - secondary color */}
              <circle cx="14" cy="14" r="11" fill="none" stroke={colors.secondary} strokeWidth="3" />

              {/* Progress circle - primary color */}
              <circle
                cx="14" cy="14" r="11"
                fill="none"
                stroke={colors.primary}
                strokeWidth="3"
                strokeDasharray={`${(progressPercentage / 100) * 69.115} 69.115`}
                strokeLinecap="round"
              />
            </svg>

            {/* Icon overlay */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DonutSmallIcon sx={{ fontSize: '0.9rem', color: colors.primary }} />
            </Box>
          </Box>
        </IconButton>
      </Tooltip>
    </Box>
  );
}
```

**Soubor:** `frontend/src/components/payments/PaymentList.jsx:2756-2852`

### E. Přesunutí sloupce installments na 2. pozici

**Před:** installments byl na 8. pozici
**Po:** installments na 2. pozici (hned za title)

```javascript
const [columnOrder, setColumnOrder] = useState([
  'select', 'title', 'company', 'type', 'categoryName',
  'currency', 'installments', // ← PŘESUNUTO na 2. pozici (bylo 8.)
  'frequency', 'paymentMethod', 'isPaid', // ...
]);
```

**Soubor:** `frontend/src/components/payments/PaymentViewSwitcher.jsx:320-324`

### F. Responsive design - Progressive column disclosure

**Přidáno breakpoint pro installments:**

```javascript
export const getProgressiveColumns = (width = window.innerWidth) => {
  const columns = { /* base columns */ };

  // Progressively add columns
  if (width >= 400) columns.dueDate = true;
  // ... more breakpoints ...
  if (width >= 1250) columns.installments = true; // ← PŘIDÁNO
  // ...

  return columns;
};
```

**Soubor:** `frontend/src/config/responsive.js:369`

### G. Odstranění expandable installments sekce

**Odstraněno:** 103 řádků expandable sekce z tabulky
**Důvod:** Historie splátek nyní pouze v detailu platby

**Soubor:** `frontend/src/components/payments/PaymentList.jsx:3244-3347` (smazáno)

### H. Tab Navigation - Otevření karty "Platba" při kliknutí

**Implementace přes 3 komponenty:**

#### 1. UniversalDialog (base)
```javascript
function UniversalDialog({
  open,
  onClose,
  onSubmit,
  config,
  initialData = null,
  title,
  additionalProps = {},
  initialTab = 0  // ← PŘIDÁNO
}) {
  const [currentTab, setCurrentTab] = useState(initialTab);

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaults = {};
      extractAllFields(config.tabs).forEach(field => {
        if (field.name) {
          defaults[field.name] = field.defaultValue !== undefined ? field.defaultValue : '';
        }
      });
      setFormData(defaults);
    }
    setCurrentTab(initialTab); // ← Reset to initialTab
  }, [initialData, open, initialTab]);
}
```

**Soubor:** `frontend/src/components/shared/UniversalDialog/index.jsx:46, 50, 92-110`

#### 2. PaymentDialog (wrapper)
```javascript
function PaymentDialog({
  open,
  onClose,
  onSubmit,
  payment = null,
  categories = [],
  refreshTrigger,
  onNewPaymentCreated,
  initialTab = 0  // ← PŘIDÁNO
}) {
  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      config={paymentDialogConfig}
      initialData={initialData}
      additionalProps={additionalProps}
      initialTab={initialTab}  // ← PŘEDÁNO
    />
  );
}
```

**Soubor:** `frontend/src/components/payments/PaymentDialog.jsx:33, 345`

#### 3. PaymentsModule (state management)
```javascript
// State pro initialTab
const [initialTab, setInitialTab] = useState(0);

// Handler přijímá initialTab parametr
const handleEditPayment = (payment, initialTab = 0) => {
  setEditingPayment(payment);
  setInitialTab(initialTab); // ← Set tab for opening
  setDialogOpen(true);
};

// Reset při zavření
const handleDialogClose = () => {
  setDialogOpen(false);
  setEditingPayment(null);
  setInitialTab(0); // ← Reset to first tab
};

// Předání do PaymentDialog
<PaymentDialog
  open={dialogOpen}
  payment={editingPayment}
  categories={categories}
  onSubmit={handleDialogSubmit}
  onClose={handleDialogClose}
  initialTab={initialTab}  // ← PŘEDÁNO
  onNewPaymentCreated={...}
  refreshTrigger={categoryRefreshTrigger}
/>
```

**Soubor:** `frontend/src/modules/PaymentsModule.jsx:72, 407-411, 457-461, 836`

### I. Color Scheme - User Feedback Iteration

**První pokus (WRONG):**
- 100% zaplaceno = primary
- <100% zaplaceno = secondary

**User feedback:** "zadrž. Vrať to zpět."

**Finální řešení (CORRECT):**
- Ikona uprostřed: VŽDY primary
- Progress arc (zaplaceno): primary
- Background arc (nezaplaceno): secondary

---

## Část 6: PaymentsModule Extraction (18-19.10.2025)

### Modularizace App.jsx

**Před:** App.jsx měl 1,501 řádků
**Po:** App.jsx ~300 řádků (80% redukce)

### Vytvořené moduly:

#### `frontend/src/modules/PaymentsModule.jsx`
- Kompletní state management pro platby
- Dialog handling
- Category management
- Filter logic
- Export handlers

### Klíčové problémy a řešení:

#### Problem: Context loss po modularizaci
**Chyba:** `useBusinessPersonal() must be used within provider`

**Příčina:** Provider byl uvnitř Routeru, moduly byly venku

**Fix:** Přesun providerů výš v component tree
```javascript
<BusinessPersonalProvider>
  <Router>
    <Routes>
      <Route path="/payments" element={<PaymentsModule />} />
    </Routes>
  </Router>
</BusinessPersonalProvider>
```

---

## Část 7: Help Systems (19-20.10.2025)

### UniversalFilterBarHelp a UniversalToggleBarHelp

**Vytvořené komponenty:**
- `frontend/src/components/shared/UniversalFilterBarHelp.jsx`
- `frontend/src/components/shared/UniversalToggleBarHelp.jsx`

**Funkce:**
- Kontextová nápověda pro filtrovací lišty
- Tooltip s detailními vysvětleními
- Responsive design
- Ikona s primary barvou

---

## Katalog všech chyb a řešení

### 1. "0" zobrazeno v tabulce
- **Příčina:** Boolean coercion issue
- **Fix:** `!!` operator
- **Soubor:** PaymentList.jsx:2850

### 2. Červený otazník v headeru
- **Příčina:** Chybějící icon mapping
- **Fix:** Přidán DonutSmallIcon
- **Soubor:** PaymentList.jsx:1271

### 3. Špatné barevné schéma
- **Příčina:** Nepochopení požadavku
- **Fix:** Ikona vždy primary, progress primary/secondary
- **Soubor:** PaymentList.jsx:2756-2852

### 4. Cannot access displayPayments before initialization
- **Příčina:** React hoisting doesn't work
- **Fix:** Přesunutí handler definice za displayPayments
- **Soubor:** PaymentList.jsx

### 5. Boolean hodnoty ukládány jako stringy
- **Příčina:** MUI Switch event handling
- **Fix:** Type-aware input handling
- **Soubor:** UniversalDialog/index.jsx

### 6. Auto-copy vytvořil duplikátní splátky
- **Příčina:** `_saveInstallmentAfterSubmit` nebyl smazán
- **Fix:** Delete flag po uložení
- **Soubor:** PaymentDialog.jsx

### 7. due_date se posouval špatně
- **Příčina:** JavaScript Date timezone bug
- **Fix:** Použití date-fns
- **Soubor:** paymentAutoCopy.js

### 8. Splátky se nenačítaly (401)
- **Příčina:** Chybějící Authorization header
- **Fix:** Include token v requestu
- **Soubor:** PaymentInstallments.jsx

### 9. Context loss po modularizaci
- **Příčina:** Provider špatně umístěn
- **Fix:** Přesun providerů výš
- **Soubor:** App.jsx

---

## Vyřešené problémy - Souhrn

1. ✅ Boolean Coercion - `!!` operator pattern project-wide
2. ✅ Code Duplication - 5,400 → 2,000 řádků
3. ✅ Module Extraction - App.jsx 1,501 → 300 řádků (80%)
4. ✅ Auto-Copy Workflow - seamless s user confirmation
5. ✅ Installment Tracking - kompletní historie
6. ✅ Visual Progress - SVG pie chart s matematickou přesností
7. ✅ Tab Navigation - dynamický initial tab přes 3 vrstvy
8. ✅ Responsive Design - progressive disclosure na 1250px

---

## Známé problémy pro budoucnost

1. **Bank code** - oboustranná logika přestala fungovat (regrese po refaktoru)
2. **Performance** - potřeba React.memo, virtualizace
3. **E2E testy** - pro auto-copy workflow
4. **PWA support** - offline mode

---

## Lessons Learned

### 1. Boolean Coercion v JavaScriptu
- `&&` operator nevrací vždy boolean
- Použití `!!` pro explicitní boolean conversion
- Důležité pro conditional rendering v React

### 2. Config-Driven Development
- Drastická redukce duplikace kódu
- Lepší maintainability
- Centralizovaná logika

### 3. Date Handling v JavaScriptu
- Native Date API má timezone/DST problémy
- date-fns je spolehlivější
- Vždy testovat hranové případy (konec měsíce, etc.)

### 4. React Context Placement
- Providers musí být výš než komponenty, které je používají
- Router placement je kritický
- Context composition matters

### 5. SVG Circle Math
- `strokeDasharray` pro progress arcs
- Circumference = 2πr
- `transform: rotate(-90deg)` pro start na 12 o'clock

### 6. Prop Drilling vs Context
- Pro 2-3 úrovně je prop drilling OK
- Context pro deeply nested components
- Jasně pojmenované props (initialTab, ne jen tab)

---

## Statistiky

### Redukce kódu:
- **UniversalDialog refactor:** 5,400 → 2,000 řádků (-63%)
- **PaymentDialog:** 1,486 → 362 řádků (-75.6%)
- **App.jsx modularization:** 1,501 → 300 řádků (-80%)
- **Currency column simplification:** 78 → 17 řádků (-78%)

### Nové soubory:
- UniversalDialog system: 4 soubory
- Dialog configs: 5 souborů
- Utils: 1 soubor (paymentAutoCopy.js)
- Modules: 1 soubor (PaymentsModule.jsx)
- Help components: 2 soubory

### Backend:
- 2 nové migrace
- 2 nové API endpoints
- 1 nová tabulka (payment_installments)
- 5 nových sloupců v payments

### Celkem za období 13.10 - 21.10.2025:
- **49 souborů změněno**
- **+16,100 řádků**
- **-3,903 řádků**
- **Netto: +12,197 řádků**

---

*Vygenerováno: 21.10.2025*
*Claude Code Session Summary*
