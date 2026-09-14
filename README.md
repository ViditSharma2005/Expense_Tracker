# 💰 Expense Tracker

A single-page, client-side **Expense Tracker Dashboard** built with plain HTML, CSS, and JavaScript. It lets a user log income/expense transactions, categorize them, set a budget, search/filter their history, and switch between light and dark themes — all persisted in the browser via `localStorage` (no backend or database required).

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [Known Issues & Limitations](#-known-issues--limitations)
- [Suggested Improvements](#-suggested-improvements)
- [License](#-license)

---

## ✨ Features

- **Dashboard overview** — live stat cards for Total Balance, Total Income, Total Expenses, and Monthly Budget.
- **Add transactions** — record a description, amount, type (Income/Expense), and category.
- **Dynamic categories** — the category dropdown repopulates based on whether the transaction is Income (Salary, Pocket Money, Freelance, Business, Investment) or Expense (Food, Travel, Shopping, Bills, Entertainment).
- **Delete transactions** — remove any transaction from the list with one click.
- **Search & filter** — filter the transaction list by description text, type, and category.
- **Budget management** — set a budget and see the remaining amount after expenses.
- **Light / Dark mode** — theme preference is saved and restored on reload.
- **Reset Data** — a single button clears all stored transactions and settings (with a confirmation prompt).
- **Responsive layout** — a hamburger menu and adjusted grid/form layout for mobile and tablet widths.
- **Local persistence** — all data is saved to the browser's `localStorage`, so it survives page reloads without any server.

---

## 🛠 Tech Stack

- **HTML5** — semantic structure (`index.html`)
- **CSS3** — custom properties (CSS variables) for theming, Flexbox/Grid layout, media queries (`style.css`)
- **Vanilla JavaScript (ES6+)** — no frameworks or build tools (`script.js`)
- **Font Awesome 6** (via CDN) — icons
- **Browser `localStorage`** — the only data store; there is no backend, API, or database

---

## 📁 Project Structure

```
Expense_Tracker/
├── index.html      # Page markup: header/nav, dashboard, transaction form, search, budget section
├── style.css       # Theming (CSS variables), layout, and responsive breakpoints
└── script.js       # All app logic: state, rendering, totals, search/filter, theme, reset
```

> This is a static site — there is no `package.json`, build step, or server-side code. It can be opened directly in a browser.

---

## 🚀 Getting Started

No installation or dependencies are required.

1. Clone the repository:
   ```bash
   git clone https://github.com/ShristySingh99/Expense_Tracker.git
   cd Expense_Tracker
   ```
2. Open `index.html` directly in your browser, **or** serve it locally (recommended, so relative paths and any future fetch calls behave consistently):
   ```bash
   # Python 3
   python -m http.server 8000
   # then visit http://localhost:8000
   ```
3. Start adding transactions — your data will be saved automatically in your browser's local storage.

---

## ⚙️ How It Works

- On load, `script.js` reads `transactions`, `monthlyBudget`, and `theme` out of `localStorage` (defaulting to an empty list, `0`, and `'light'` respectively).
- Adding a transaction pushes a new object (`{ id, description, amount, type, category }`) into the in-memory array and re-saves the whole array to `localStorage`.
- Totals (balance, income, expenses, remaining budget) are recalculated by filtering/summing the transactions array every time it changes.
- Search/filter re-renders the transaction list against the current search text, type, and category selections.
- Theme toggling adds/removes a `dark-theme` class on `<body>`, which swaps a set of CSS custom properties.

---

## 🐞 Known Issues & Limitations

This section documents real issues found while reviewing the current code, so they're visible rather than silently shipped.

### Functional bugs
- **Nav links don't actually switch sections.** `script.js` toggles an `active-section` class on the Dashboard/Transactions/Budget sections, but `active-section` is never defined in `style.css`. As a result, all sections are always visible at once, regardless of which nav link is clicked.
- **Budget input can silently reject decimal values.** The Amount field has `step="0.01"`, but the Budget field does not — `<input type="number">` defaults to `step="1"`. Typing a value like `5000.50` can fail native browser validation and block the form from submitting, with no visible error message explaining why.
- **"Reset Data" also wipes the saved theme.** The reset handler calls `localStorage.clear()`, which deletes the `theme` key along with transactions and budget — even though the button is only intended to reset expense data. The visible theme doesn't update until the next toggle or reload, so the UI and storage briefly disagree.
- **"Monthly Budget" isn't actually scoped to a month.** Transactions carry no date field (only an internal `Date.now()` ID that isn't shown or used for filtering), so "remaining budget" is really calculated against *all-time* expenses. The budget never resets when a new month starts.

### Security
- **Unescaped user input is inserted via `innerHTML`.** The transaction `description` is rendered directly into `card.innerHTML` in `createTransactionCard()` without sanitization. A description containing HTML/JS (e.g. an `<img onerror=...>` tag) would execute in the page. Low risk in a purely local, single-user app, but bad practice — and a real risk if this app is ever extended with shared/synced data.
- **Inline `onclick` + global function.** Delete buttons use an inline `onclick="deleteTransaction(...)"` bound to a function attached to `window`. It works, but is fragile and would break under a stricter Content Security Policy.

### Data & validation gaps
- **No minimum-value validation.** Nothing stops negative numbers in the Amount or Budget fields, which can silently corrupt the totals (e.g., a "negative expense" would increase the balance).
- **No way to edit a transaction** — only add and delete are supported, so fixing a typo means deleting and re-entering it.
- **No confirmation on single-transaction delete**, even though the global "Reset Data" button does confirm — an accidental click permanently removes a transaction with no undo.
- **No transaction date/timestamp is shown or stored in a usable form**, so there's no way to see *when* something happened or build real reporting by day/week/month.

### Code quality
- **Category lists are duplicated** in two places — the `typeSelect` change handler and `updateCategoryOptions()`. Adding, renaming, or removing a category requires updating both, or the "Filter by Category" dropdown will drift out of sync with the categories actually available on the Add Transaction form.
- **`category.replace('-', ' ')` only replaces the first hyphen** in a slug. This happens to work for current categories (e.g. `pocket-money`) but will silently produce the wrong label if a category with two hyphens is ever added.
- **Naming inconsistency** — the page title/header say "Expense Tracker," but the footer says "Expense Calculator."

### Layout / responsiveness
- **`.row-top input` uses `calc(45vw - 1.5rem)`** for width, which is relative to the full viewport rather than the parent card. Since `<main>` is capped at `max-width: 1200px`, this causes the Description and Amount inputs to overflow their card on wide screens (roughly 1600px+ viewports).
- **No `aria-expanded` state on the hamburger button**, a minor accessibility gap for screen-reader users toggling the mobile nav.

### Architecture / scope
- **Purely client-side storage.** All data lives in one browser's `localStorage` — there's no account system, backend, or sync. Clearing browser data, using a different browser, or using private/incognito mode loses all data.
- **Single hardcoded currency** (₹ / INR) with no setting to change it.
- **No automated tests or build tooling** — plain static files only.

---

## 💡 Suggested Improvements

- Implement real section visibility (add a default "hidden" rule and an `.active-section` rule in CSS) so the nav actually works.
- Add a `date` field to each transaction and use it to make "Monthly Budget" genuinely monthly.
- Add an edit-transaction flow, not just add/delete.
- Escape/sanitize the `description` before inserting it into the DOM, or build the card with DOM APIs (`textContent`) instead of `innerHTML`.
- Add `min="0"` to Amount and Budget inputs, and `step="0.01"` to the Budget input.
- Add a confirmation step (or short-lived "undo") for single-transaction deletion.
- Centralize the category list into one shared array/config used by both the Add Transaction form and the Search filter.
- Add data export/import (e.g., JSON or CSV) so users aren't fully dependent on one browser's storage.
- Add basic unit tests for the totals/filtering logic.

---

## 📄 License

No license file was found in the reviewed source. Add a `LICENSE` file (e.g., MIT) if you intend this project to be reused by others.
