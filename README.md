# Aurelius — Personal Finance Tracker

A production-ready personal finance web application with a premium banking aesthetic.
Single-file architecture (HTML + CSS + JS), deployable to Vercel, Netlify, or GitHub Pages in seconds.

---

## 🚀 Quick Deploy

### Vercel
```bash
npx vercel --prod
```

### Netlify
Drag and drop the `index.html` file into https://app.netlify.com/drop

### GitHub Pages
1. Push to a GitHub repository
2. Settings → Pages → Deploy from branch (main / root)

---

## 🔐 Security & Credentials

### ⚠️ IMPORTANT — Changing Credentials Safely

**DO NOT** hardcode credentials in `index.html` if making this repo public.

#### Option A — Netlify / Vercel Environment Variables (Recommended)
1. In your hosting dashboard, set environment variables:
   - `APP_USERNAME=your_username`
   - `APP_PASSWORD=your_password`
2. Use a build plugin or serverless function to inject them at build time.
3. For a pure static site, create a **separate `auth.config.js`** file:

```js
// auth.config.js  ← ADD TO .gitignore
window.__AUTH__ = {
  username: "your_username",
  password: "your_password"
};
```

Then in `index.html`, replace the `AUTH_CONFIG` object with:
```js
const AUTH_CONFIG = window.__AUTH__ || { username: "", password: "" };
```

And add `<script src="auth.config.js"></script>` before the main script.
The `.gitignore` already excludes `auth.config.js`.

#### Option B — Backend Authentication (Production-grade)
Replace the `handleLogin()` function body with a `fetch()` call to your own auth API:

```js
async function handleLogin() {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: u, password: p })
  });
  const { ok, token } = await res.json();
  if (ok) {
    sessionStorage.setItem("aurelius_token", token);
    showApp();
  } else {
    showError();
  }
}
```

---

## 🗄️ Upgrading to Firebase or Supabase

The `DB` object in the JavaScript is the **only thing you need to replace**.
It currently uses `localStorage`. To swap:

### Firebase Realtime Database
```js
import { getDatabase, ref, set, get } from "firebase/database";
const db = getDatabase(app);

// Replace DB.saveLedger:
async saveLedger(year, month, data) {
  await set(ref(db, `users/${uid}/ledger/${year}-${month}`), data);
}
```

### Supabase
```js
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async saveLedger(year, month, data) {
  await supabase.from("ledger").upsert({ key: `${year}-${month}`, ...data });
}
```

---

## 📦 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Vanilla HTML5 / CSS3 / JavaScript   |
| Charts      | Chart.js 4.4 (CDN)                  |
| Fonts       | Cormorant Garamond + DM Sans (Google Fonts) |
| Storage     | localStorage (Firebase/Supabase-ready) |
| Auth        | Session-based (sessionStorage)      |
| Deploy      | Vercel / Netlify / GitHub Pages     |

---

## 📁 File Structure

```
/
├── index.html        ← Complete application
├── auth.config.js    ← YOUR CREDENTIALS (gitignored, create locally)
├── .gitignore        ← Excludes secrets
└── README.md         ← This file
```

---

## 💡 Features

- **Login Screen** with credential validation
- **Monthly Ledger** — income, expenses, real-time balance
- **Financial Traffic Light** — Green/Yellow/Red health indicator
- **Automated Financial Feedback** — tailored monthly advice
- **Investment Tracker** — ROI calculator (% and monetary)
- **Annual Dashboard** — Chart.js charts (bar, doughnut)
- **Strategic Consulting** — annual projections and advice
- **Responsive** — mobile-friendly layout
- **Persistent** — all data saved via localStorage

---

Default credentials (change before deploying publicly):
- Username: `michellpf`
- Password: `3360076`
