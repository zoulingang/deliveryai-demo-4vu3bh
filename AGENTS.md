**English** | [简体中文](./AGENTS.zh-CN.md)

# AGENTS.md

Working guide for AI coding agents. Human readers should start with [README.md](./README.md).

## Project overview

Feidian Hotpot Ordering Demo (`hdl-order-demo`): a frontend-only mobile ordering prototype covering table binding, group ordering, cooking progress, service calls and simulated checkout. **There is no real backend, payment or account system**; all data is local mock data.

## Tech stack

Versions are whatever `package.json` / `server/package.json` declare.

| Area | Choice | Notes |
| --- | --- | --- |
| Language | TypeScript ~5.6 | Strict mode in `tsconfig.app.json`; `npm run build` runs `tsc -b` first |
| UI framework | React 18.3 | Function components + hooks; global state via `useReducer` (`src/state/orderReducer.ts`), no Redux or other state library |
| Build | Vite 6 + `@vitejs/plugin-react` | `@` alias points to `src/`; `base: './'` supports the Pages subpath |
| Styling | Tailwind CSS 3 + PostCSS + Autoprefixer | `darkMode: 'class'`; brand colors extended in `tailwind.config.js` |
| Component primitives | Radix UI Dialog (`@radix-ui/react-tabs` is installed but currently unused), shadcn-style wrappers | Base components live in `src/components/ui/`; variants use `class-variance-authority` |
| Class names | `clsx` + `tailwind-merge` | Always through `cn()` (`src/lib/utils.ts`) |
| Icons | `lucide-react` | Don't add another icon library |
| i18n | i18next + react-i18next | `zh` / `en` only; all strings in `src/i18n.ts` |
| Linting | ESLint 9 (flat config) + typescript-eslint + react-hooks + react-refresh | `--max-warnings 0` |
| Testing | Playwright 1.6x | E2E only; no unit test framework |
| Demo server | Express 4 + `tsx` (`server/`) | Separate package, `GET /ping` on port 3001; the frontend doesn't call it yet |
| CI / deploy | GitHub Actions → GitHub Pages | `.github/workflows/deploy-pages.yml`, Node 20, triggered by pushes to `main` |

Before adding a dependency, check that nothing in the current stack already does the job. Don't introduce a second UI library, state library or CSS approach.

## Environment and commands

Use **npm** (CI runs `npm ci`; `package-lock.json` is the source of truth). `pnpm-lock.yaml` / `pnpm-workspace.yaml` are not used by CI, so never update only the pnpm lockfile when changing dependencies.

```bash
npm install          # install dependencies (Node 18+, CI uses 20)
npm run dev          # dev server at http://localhost:5173
npm run lint         # ESLint, --max-warnings 0: any warning fails
npm run build        # tsc -b type-check + vite build to dist/
npx playwright test  # E2E, starts the dev server automatically
```

- Playwright uses `/opt/chromium.org/chromium/chrome` by default; set `PLAYWRIGHT_CHROMIUM_PATH` if yours is elsewhere. **Don't** run `playwright install`.
- Run a single spec: `npx playwright test e2e/multi-currency.spec.ts`.
- To debug the menu page, open `http://localhost:5173/?preview=menu` (table A08 bound, one item in the cart).
- `server/` has its own `package.json`: `cd server && npm install && npm run dev`; type-check with `npm run typecheck`.

## Required before committing

1. `npm run lint` (zero warnings)
2. `npm run build` (the only step CI runs; if it fails, the deploy fails)
3. When a change affects UI or interaction, run the relevant `npx playwright test e2e/<spec>`; new features need new E2E cases

If you changed `server/`, also run `cd server && npm run typecheck`.

## Directory layout

```text
src/
├── App.tsx              # root component: view switching, sheets, top/bottom bars; ?preview=menu state
├── main.tsx             # entry point, mounts CurrencyProvider
├── types.ts             # all domain types and the AppAction union
├── state/orderReducer.ts# the single global state reducer (useReducer)
├── data/menu.ts         # mock dishes, categories, tables
├── i18n.ts              # all zh / en strings + i18next setup
├── hooks/               # theme, currency, elderly mode
├── lib/utils.ts         # cn(), currency type, rates, money() formatting
├── components/          # views (*View.tsx) and sheets
│   └── ui/              # shadcn-style primitives (button, dialog)
└── index.css            # global styles, elderly-mode overrides
e2e/                     # Playwright tests
openspec/                # OpenSpec change proposals (spec-driven)
docs/specs/              # requirement clarification notes
```

## Coding conventions

### General

- Import modules under `src/` with the `@/` alias (e.g. `@/lib/utils`), not relative paths that climb directories.
- Use `import type` for type-only imports.
- Match the existing style: 2-space indent, single quotes, no semicolons. There is no Prettier, so keep it consistent by hand.
- Code comments are written in Chinese and explain why; match the density of the surrounding file.
- `react-refresh/only-export-components` emits warnings and lint tolerates none, so a `.tsx` file exports only components. Put shared contexts, constants and hooks in separate `.ts` files (see the split across `hooks/currency-context.ts`, `hooks/use-currency.ts` and `hooks/useCurrency.tsx`).

### State

- Global app state goes only through `orderReducer`. To add behavior, add a case to `AppAction` in `types.ts` first, then implement it in the reducer with immutable updates.
- User-facing notices from the reducer go in `lastMessage`, using `i18next.t(...)`, never hard-coded text.
- Preferences such as theme, currency and elderly mode are standalone hooks and stay out of the reducer.

### Internationalization

- All user-visible text (including `aria-label` and `document.title`) goes through i18n; no hard-coded Chinese or English.
- When adding a key, **add it to both `zh` and `en`** with the same structure. Both the default language and the fallback are `zh`.
- Dish names, descriptions and options in `data/menu.ts` are i18n keys, translated with `t()` at render time.

### Prices and currency

- All prices in data and state are **CNY base prices**; convert only for display with `money(value, currency)`.
- Totals are summed in CNY first and converted once; don't convert each item and then add.
- Rates are fixed values in `lib/utils.ts`; don't wire up live rates. JPY / TWD show whole numbers, the rest two decimals.
- Adding a currency means updating the `Currency` type, `CURRENCIES`, `rates`, `currencySymbol`, `currencyFormatter`, and the i18n `common.currency.*` keys.

### Styling and themes

- Use Tailwind utility classes and merge class names with `cn()`. Prefer the brand colors from `tailwind.config.js` (`rice`, `chili`, `amber`, `charcoal`).
- Dark mode is `darkMode: 'class'` (`<html class="dark">`). Any new or changed UI needs `dark:` variants too, as every existing component has.
- Elderly mode enlarges text via a root `.elderly` class; necessary overrides go in `index.css`.

### Local storage

- Wrap every `localStorage` read and write in `try/catch` and fall back to in-memory state without throwing or blocking (see `useTheme.ts`).
- Existing keys: `theme`, `currency`, `elderly-mode`, `i18nextLng`. Renaming one drops existing users' preferences and affects E2E (`playwright.config.ts` presets `theme=light`).

## E2E test conventions

- Files go in `e2e/`, named `<feature>.spec.ts`; test names carry an ID prefix such as `CUR-001: ...` or `DARK-003: ...`.
- Prefer `getByRole` with a name regex that matches both languages: `/切换主题|Toggle theme/`.
- Reach the menu with `page.goto('/?preview=menu')`, or by the real flow: tap table A08, then "进入点餐" (Enter).
- The config is serial (`workers: 1`) with no retries; don't add `retries` or `test.skip` to get green.
- The test baseline is the light theme; switch themes explicitly inside a test when needed.

## Specs and requirements

- For larger features, first write `proposal.md`, `design.md`, `tasks.md` and `specs/` under `openspec/changes/<change-name>/`, following `cart-recommendations`. Tick `[x]` in `tasks.md` as each task is done, and give every task a way to verify it.
- When a requirement is ambiguous, check `docs/specs/` first; if it's still unclear, ask a human instead of inventing business rules.

## Commits and PRs

- Commit messages follow Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, etc.; the description can be Chinese or English.
- One PR does one thing; don't refactor unrelated code along the way.
- Don't commit `node_modules/`, `dist/`, `e2e-report/`, `test-results/` or `.vefaas/`.
- When changing a README, keep `README.md`, `README.zh-CN.md` and `README.ja.md` in sync; when changing this file, keep `AGENTS.md` (English) and `AGENTS.zh-CN.md` in sync.

## Don't

- Don't add real payments, accounts, live exchange rates or external API calls. This is a concept demo, and the "概念演示 / 非官方" (concept demo / unofficial) label on the page must stay.
- Don't change `base: './'` in `vite.config.ts`; GitHub Pages subpath deployment depends on it.
- Don't bypass lint (`eslint-disable`) or type checking (`any`, `@ts-ignore`) to pass CI.
- Don't hand-edit `package-lock.json`; generate dependency changes with `npm install <pkg>`.
