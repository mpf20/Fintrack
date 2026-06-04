# Aurelius v2 — Personal Finance Tracker + Google Sheets Sync

A production-ready hybrid personal finance app. Manual entry via the UI *and* real-time
sync from a published Google Sheets CSV — all in a single deployable HTML file.

---

## 🚀 Quick Deploy

### Netlify (drag-and-drop, zero config)
Go to https://app.netlify.com/drop — drag `index.html` in.

### Vercel
```bash
npx vercel --prod
```

### GitHub Pages
Push to repo → Settings → Pages → Deploy from branch (main / root).

---

## 🔐 Security & Credentials

### ⚠️ CRITICAL — Never commit real credentials to a public repository.

The app reads credentials from `window.__AUTH__` if present.
To deploy securely:

**Step 1** — Create `auth.config.js` (already listed in `.gitignore`):
```js
// auth.config.js  ←  GITIGNORED — create locally, never commit
window.__AUTH__ = {
  username: "your_username",
  password: "your_password"
};
```

**Step 2** — Add a `<script>` tag before the main script block in `index.html`:
```html
<script src="auth.config.js"></script>
```

The `AUTH_CONFIG` in the JS automatically picks up `window.__AUTH__` if present,
otherwise falls back to the embedded defaults.

---

## 📊 Google Sheets Sync — Setup Guide

### Publishing your sheet as CSV

1. Open your Google Sheet
2. **File → Share → Publish to web**
3. First dropdown → choose the sheet tab (e.g. "Transactions")
4. Second dropdown → **Comma-separated values (.csv)**
5. Click **Publish** → copy the URL → paste it in the Aurelius sync panel

### Expected column schemas (case-insensitive, Spanish aliases supported)

**Transactions sheet:**
| Date       | Description | Category    | Type    | Amount  |
|------------|-------------|-------------|---------|---------|
| 2025-01-15 | Salary      | Income      | income  | 5000000 |
| 2025-01-20 | Rent        | Housing     | expense | 900000  |

**Investments sheet:**
| Date       | Asset       | Type | Capital | CurrentValue |
|------------|-------------|------|---------|--------------|
| 2025-01-10 | S&P 500 ETF | ETF  | 1000000 | 1120000      |

### Supported date formats
- `YYYY-MM-DD` (ISO — preferred)
- `DD/MM/YYYY` (Colombian convention)
- `MM/DD/YYYY`
- `DD-MM-YY`
- Most standard formats via native Date parse

### Supported column name aliases
- Date: `date`, `fecha`, `day`, `dia`
- Description: `description`, `descripcion`, `concepto`, `detail`, `detalle`, `memo`
- Category: `category`, `categoria`, `cat`, `group`, `grupo`
- Type: `type`, `tipo`, `kind`, `flujo`
- Amount: `amount`, `monto`, `valor`, `importe`, `suma`, `total`
- Capital: `capital`, `invested`, `invertido`, `cost`, `costo`
- Current Value: `currentvalue`, `current value`, `valor actual`, `market value`

### CORS Proxy
The sync uses `api.allorigins.win` as a CORS proxy (free, open-source, no data retention).
For production, replace this with a server-side function (Netlify Function / Vercel Edge):
```js
// In syncWithGoogleSheets(), replace the proxyUrl with:
const proxyUrl = `/api/fetch-sheet?url=${encodeURIComponent(url)}`;
```

---

## 🗄️ Upgrading to Firebase / Supabase

Replace only the four methods in the `DB` object — the rest of the app is unchanged.

```js
// Firebase example
import { getDatabase, ref, set, get } from "firebase/database";
const db = getDatabase(app);

DB.getLedger = async (y, m) => {
  const snap = await get(ref(db, `users/${uid}/ledger/${y}-${m}`));
  return snap.val() || { income: 0, transactions: [] };
};
DB.saveLedger = async (y, m, data) => {
  await set(ref(db, `users/${uid}/ledger/${y}-${m}`), data);
};
```

---

## 📦 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | Vanilla HTML5 / CSS3 / JavaScript (ES2020) |
| Charts    | Chart.js 4.4 (CDN)                      |
| Fonts     | Cormorant Garamond + DM Sans            |
| Sync      | Google Sheets CSV + CORS proxy          |
| Storage   | localStorage (Firebase/Supabase-ready)  |
| Auth      | sessionStorage (tab-scoped)             |
| Deploy    | Vercel / Netlify / GitHub Pages         |

---

## 📁 File Structure

```
/
├── index.html        ← Complete application (all-in-one)
├── auth.config.js    ← YOUR CREDENTIALS (gitignored — create locally)
├── .gitignore        ← Excludes secrets
└── README.md         ← This file
```

---

## ✨ Feature Summary

| Feature | Details |
|---------|---------|
| 🔐 Login Screen | Session-based auth, credential injection pattern |
| 📒 Monthly Ledger | Income entry, daily transactions, real-time balance |
| 🟢 Traffic Light | Green/Yellow/Red health indicator with % display |
| 💡 Financial Advisor | Tailored monthly advice per spending tier |
| 📊 Google Sheets Sync | CSV import, RFC-4180 parser, smart deduplication |
| 🏷️ Source Badges | Sheets-imported entries visually marked |
| 📈 Investment Tracker | ROI = (Net Profit / Capital) × 100, in % and COP |
| 📉 Annual Charts | Bar (income/expenses), bar (savings), doughnut (categories) |
| 🧠 Consulting Panel | Strategic annual projections and actionable advice |
| 📱 Responsive | Mobile-friendly, works on all screen sizes |
| 🔔 Toast Notifications | Non-blocking success/error/info alerts |
| 💾 Persistent | All data in localStorage, survives page reloads |

---

Default credentials (change before deploying publicly):
- Username: `michellpf`  
- Password: `3360076`
