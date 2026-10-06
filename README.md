**English** | [简体中文](./README.zh-CN.md)

# Feidian Hotpot Ordering Demo

A mobile ordering and fulfillment demo built around a hotpot restaurant. It walks through the full guest experience: binding a table, ordering together with friends, tracking the order as it is cooked and served, and checking out.

> This is a concept demo, not a production product.

## Features

- Bind a table and enter the ordering flow
- Browse dishes by category, search, and pick items
- Configure specs, spice level, and who ordered each dish (the "super spicy" broth asks for confirmation first)
- Shared multi-person ordering and cart management
- Track cooking and serving progress for each order
- Call for extra broth, drinks, tableware, or the bill
- Demo console to simulate sold-out dishes, service responses, and fulfillment stages
- Simulated checkout and payment success
- Chinese / English interface
- Elderly mode with larger text
- Light, dark, and follow-system themes
- Six display currencies (CNY, USD, EUR, JPY, HKD, TWD) converted from CNY base prices with fixed rates

Theme, currency, and elderly mode choices are saved in `localStorage`.

## Tech stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- i18next
- Playwright
- Express (demo server)

## Requirements

- Node.js 18 or later (CI uses Node.js 20)
- npm 9 or later

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173` by default. If that port is taken, Vite picks another free port; check the startup log for the actual address.

## Common commands

```bash
# Start the dev server
npm run dev

# Lint
npm run lint

# Type-check and build for production
npm run build

# Run the Playwright end-to-end tests (starts the dev server automatically)
npx playwright test
```

The production build is written to `dist/`.

The Playwright config launches Chromium from `/opt/chromium.org/chromium/chrome` by default. Set `PLAYWRIGHT_CHROMIUM_PATH` to point it at a different browser binary.

## Demo server

`server/` contains a minimal Express server with a single `GET /ping` health-check endpoint on port `3001`.

```bash
cd server
npm install
npm run dev
```

## Preview mode

Open this URL to jump straight to the menu with a table already bound and an item in the cart:

```text
http://localhost:5173/?preview=menu
```

Use the port shown in the Vite startup log.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which builds the app and deploys `dist/` to GitHub Pages. Vite is configured with `base: './'`, so the build works from any subpath.

## Project structure

```text
.
├── .github/workflows/      # GitHub Pages deployment
├── docs/specs/             # Requirement clarification docs
├── e2e/                    # Playwright end-to-end tests
├── openspec/               # OpenSpec change proposals and specs
├── server/                 # Demo server (Express)
├── src/
│   ├── assets/             # Images
│   ├── components/         # Views and shared UI components
│   ├── data/               # Demo menu data
│   ├── hooks/              # React hooks (theme, currency, elderly mode)
│   ├── lib/                # Utilities, currency conversion and formatting
│   ├── state/              # Order state management
│   ├── App.tsx             # Root component
│   ├── i18n.ts             # Chinese and English strings
│   └── index.css           # Global styles
├── index.html
├── playwright.config.ts
├── tailwind.config.js
└── vite.config.ts
```
