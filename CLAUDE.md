# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CashFolio is a React single-page app for tracking expenses and income. Users add, edit, delete, filter, and search transactions, and can export or import their data as a JSON backup. Everything runs in the browser: there is no backend or external API, and all data is saved to `localStorage`.

## Technology Baseline

These versions are authoritative for this repository:

- **Runtime:** React 19.3 and React DOM 19.3 (`createRoot`, `StrictMode`), plain JavaScript/JSX (no TypeScript)
- **Tooling:** Vite 8 with `@vitejs/plugin-react` 6 (`vite.config.js`). ESLint 9 with `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`, configured as a flat config in `eslint.config.js`. Stay on ESLint 9 until `eslint-plugin-react` supports ESLint 10. `package.json` uses `"type": "module"`.
- **State:** React Context + `useReducer`, persisted to `localStorage` (no Redux or other state library)
- **Navigation:** None. `App.jsx` renders a single page, and modals are toggled with local component state (no router). Every modal renders through `Modal.jsx`, a native `<dialog>` opened with `showModal()` (focus is trapped and returns to the opener on close). It handles Escape through the `cancel` event, closes only when a click both starts and ends on the backdrop, and stops click propagation so modals can sit inside clickable elements. Use its `initialFocus` ref prop instead of `autoFocus`, which fires before the dialog opens
- **Styling:** Plain CSS, one file per component, with CSS custom properties for colors in `src/css/index.css`. Shared control styles (like `.segmented`) also live there. Self-hosted Inter font.
- **Testing:** No test framework is configured

Do not upgrade React, Vite, or other packages, or add dependencies, without explicit approval. When unsure how to implement something or whether a pattern is current, check the official documentation for the baseline version (React 19, Vite 8, ESLint 9) rather than relying on recalled knowledge.

## Engineering Authority

When deciding how code should be written, use this order. A higher source wins when sources conflict:

1. Explicit user requirements
2. Security requirements
3. Established patterns in the existing codebase
4. Official documentation for the baseline versions
5. General React best practices

Do not replace an established project pattern with a newer framework pattern (for example, adding a router, a state library, or CSS-in-JS) unless the change is justified and approved.

## Build and Run Commands

```bash
# Install dependencies
npm install

# Run the dev server with hot reload
npm run dev

# Production build (outputs to dist/)
npm run build

# Serve the production build locally
npm run preview

# Lint (warnings count as failures)
npm run lint
```

Vite does not lint during dev or build. Files containing JSX must use the `.jsx` extension. With no automated tests, validate changes by running lint and manually testing the affected flows in `npm run dev`: add, edit, delete, delete all, filtering, search, import/export, and data persisting across a page reload.

## Architecture

### Project Structure

- **src/main.jsx** - Mounts `App` in `StrictMode` and imports global styles
- **src/App.jsx** - App shell: wraps `AppHeader`, `TransactionList`, and `Footer` in `SaveDataProvider`
- **src/components/** - One `.jsx` file per UI component
- **src/context/** - `SaveDataContext.js` (the context and `initialData`), `SaveDataProvider.jsx` (provider and action helpers), and `SaveDataReducer.js`. The context lives in its own file so Fast Refresh works on the provider.
- **src/css/** - One stylesheet per component, plus `index.css` for global styles, color variables, and `@font-face` rules
- **src/utils/** - Plain JS helpers shared across components (`formatAmount.js`, `formatDate.js`)
- **src/assets/** - SVG images and the Inter font files
- **public/** - Static files served as-is (`robots.txt`)

### Key Architectural Patterns

**Save Data:**
- `SaveDataProvider` holds a single `data` object in a `useReducer` and writes it to `localStorage['data']` on every change: `{ transactions: [], darkMode: false, currency: '$', dateFormat: 'mm/dd' }`.
- On load, saved data replaces `initialData` entirely (unreadable saved data falls back to `initialData`). Unlike a backfill, keys added to `initialData` later will be missing for users who already have saved data, so any new key needs a fallback where it is read (or a backfill added to the provider).
- Action helpers from the context: `addTransaction` (prepends), `updateTransaction` (merges by `id`), `deleteTransaction` (by `id`), and `saveData(partial)`, which shallow-merges into `data`.

**Transactions:**
- Shape: `{ id: crypto.randomUUID(), type: 'income' | 'expense', name, desc, category, date: 'YYYY-MM-DD', amount }`. `amount` is always stored as a positive number, and its sign comes from `type`.
- Dates are stored as `YYYY-MM-DD` strings. Month and year filtering match prefixes like `` `${year}-${month}` ``. When parsing, the code replaces `-` with `/` so `new Date()` treats the date as local time rather than UTC.
- `AddTransaction.jsx` handles both creating and editing. Passing a `transaction` switches it to edit mode. The form is uncontrolled (`defaultValue`) and submits through a React form action that reads `FormData`, so every field needs a `name` attribute. The date input allows 2024-01-01 through today.
- `DeleteAllTransactions.jsx` asks for confirmation, then clears the list with `saveData({ transactions: [] })`.

**Transaction List:**
- `TransactionList.jsx` owns all view logic: the type segmented control (all, income, expense), month and year dropdowns, search across name, description, and category, the income/expense/net totals, whether the add modal is open, and the undo toast for single deletes. Filter state is local and not persisted.
- The month dropdown always lists all 12 months. The year dropdown lists years that have transactions, plus the current year and the selected year. It defaults to the current year.
- The filtered list is computed once per render into `periodTransactions` (month, year, search) and `visibleTransactions` (plus type). Totals use `periodTransactions`, so they ignore the type filter. Sorting is done on a filtered copy, never on reducer state.
- Single deletes go through `removeTransaction`, which keeps the deleted transaction for 5 seconds so it can be restored with `addTransaction`.

**Import/Export:**
- `AppHeader.jsx` exports the full `data` object as `cashfolio-backup.json`. Import only accepts backups in the current format: a `currency` string, a `dateFormat` of `mm/dd` or `dd/mm`, plus a `transactions` array where every transaction matches the current shape (string `id`, valid `type`, string `name`/`desc`/`category`, `YYYY-MM-DD` date, positive number `amount`). Any invalid entry rejects the whole file. Only `transactions`, `currency`, and `dateFormat` are merged into state with `saveData`, replacing the current transactions (it asks for confirmation first when there are existing transactions).

**Display Settings:**
- `TransactionList.jsx` groups rows under sticky date headers that show the day's net. Headers use `formatDate` with `dateFormat` (`mm/dd` shows "Sat, Oct 18", `dd/mm` shows "Sat, 18 Oct", with "Today" and "Yesterday" for recent dates). Rows themselves show no date. A label under the total names the period and any active search.
- Amounts are displayed through `formatAmount` (thousands separators, optional +/- sign).
- The app is always dark: colors are semantic tokens in `src/css/index.css` (`--bg`, `--surface`, `--surface-raised`, `--text`, `--text-muted`, `--border`, etc.) with `color-scheme: dark`. Use the tokens rather than raw colors. `arrow-down.svg` is a CSS background, so its fill is hardcoded to match `--text`.
- The gear button in `AppHeader.jsx` opens `Settings.jsx`, a modal with a currency dropdown and a date format toggle. Changes save immediately through `saveData`. A currency that isn't in the list (for example from an import) is added as a "Custom" option so the dropdown is never blank. Import, export, and Delete All intentionally stay outside Settings.
- `darkMode` is stored but nothing uses it (there is no theme toggle).

## Collaboration Rules

- **Always propose changes and get explicit user approval before making any edits to files.** Present the full plan (what files will change and how), then wait for confirmation before calling any agent or editing any file.
- Use subagents for isolated or parallel work (security passes, audits, research spanning several areas). Handle small, focused edits directly.
- When spawning agents, delegate research/planning separately from implementation, and only invoke an implementation agent after the user has approved the plan.
- Approval is gated by the main session only. A subagent given an approved task implements it directly without asking for its own confirmation. If it finds necessary work outside that scope (new dependencies, changes to the save data shape, new architectural patterns), it stops and reports back instead of doing it.
- Keep explanations clear and concise. Lead with the answer, use plain language, and skip preamble and restatements of the request.
- Do not use em dashes in responses, code comments, commit messages, or documentation. Use a hyphen (-), comma, colon, parentheses, or a separate sentence instead.

## Code Conventions

- Function components written as arrow functions (`const Name = ({ props }) => { ... }`) with `export default Name;` at the bottom of the file
- Component files use `.jsx` and `PascalCase` names; each imports its own stylesheet from `src/css/` with the same name
- 4-space indentation, semicolons, single quotes in JS
- CSS class names in `kebab-case`
- Read state with `useContext(SaveDataContext)` and destructure the needed fields from `data`
- Commit messages: brief, capitalized past-tense summary (`Added import/export options`, `Fixed issue with initial year selected`). Keep commits focused and do not commit `dist/` or `node_modules/`.
- Comments: use for non-obvious logic (hidden constraints, subtle invariants, workarounds, or behavior that would surprise a reader). Don't explain what the code does; well-named identifiers do that.
- No vertical alignment: do not pad spaces to align `=`, `:`, object keys, or anything else across lines.

## Data and Persistence

- All persisted state goes through `SaveDataContext`. Do not read or write `localStorage` directly from components.
- Renaming or removing a key in the save data, or changing the transaction shape, affects existing users' saved data and their exported backups. Treat these changes as needing approval. Import does not support older backup formats. Instead, `SaveDataProvider` upgrades saved data on load (currently: numeric transaction ids get a UUID) so exports always match the current format.
- The footer warns users not to enter sensitive information. Data never leaves the browser except through a user-initiated export, so do not add network requests, analytics, or third-party scripts without approval.

## Simplicity and Efficiency

- Before adding a helper, check whether an existing component already has the logic (for example, `formatDate` and `formatAmount` in `src/utils/`) and reuse or extract it instead of duplicating it.
- When the same multi-line logic appears in two components, extract it into a shared helper. Don't extract one-liners.
- Avoid recomputing the same filtered list several times in one render when a single computed value would do.
