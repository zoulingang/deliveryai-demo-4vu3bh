**English** | [简体中文](./README.zh-CN.md)

# Feidian Hotpot Ordering Demo

A mobile ordering demo for a hotpot restaurant: bind a table, order as a group, track dishes, and check out.

> Concept demo, not a production product.

## Features

- Table binding
- Menu browsing by category, with search
- Dish options: spec, spice level, orderer ("super spicy" asks for confirmation)
- Shared cart for group ordering
- Cooking and serving progress
- Service calls: broth, drinks, tableware, bill
- Demo console: simulate sold-out dishes, service replies, order stages
- Simulated checkout and payment
- Chinese / English
- Elderly mode (larger text)
- Light, dark, and system themes
- Six currencies (CNY, USD, EUR, JPY, HKD, TWD), converted from CNY at fixed rates

Theme, currency, and elderly mode are saved in `localStorage`.

## Tech stack

React 18, TypeScript, Vite, Tailwind CSS, Radix UI, i18next, Playwright, Express (demo server).

## Requirements

- Node.js 18+ (CI uses 20)
- npm 9+

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173` (Vite picks another port if it's taken).

## Commands

```bash
npm run dev          # dev server
npm run lint         # lint
npm run build        # type-check and build to dist/
npx playwright test  # e2e tests (starts the dev server)
```

Playwright uses Chromium at `/opt/chromium.org/chromium/chrome`; override with `PLAYWRIGHT_CHROMIUM_PATH`.

## Demo server

`server/` is a minimal Express app with `GET /ping` on port 3001.

```bash
cd server && npm install && npm run dev
```

## Preview mode

Skip to the menu with a bound table and one cart item:

```text
http://localhost:5173/?preview=menu
```

## Deployment

Pushes to `main` build and deploy `dist/` to GitHub Pages via `.github/workflows/deploy-pages.yml`. `base: './'` lets the build run from any subpath.

## Project structure

```text
.
├── .github/workflows/  # GitHub Pages deploy
├── docs/specs/         # Requirement notes
├── e2e/                # Playwright tests
├── openspec/           # OpenSpec proposals and specs
├── server/             # Express demo server
├── src/
│   ├── assets/         # Images
│   ├── components/     # Views and UI components
│   ├── data/           # Menu data
│   ├── hooks/          # Theme, currency, elderly mode
│   ├── lib/            # Utilities, currency formatting
│   ├── state/          # Order state
│   ├── App.tsx         # Root component
│   ├── i18n.ts         # zh / en strings
│   └── index.css       # Global styles
├── index.html
├── playwright.config.ts
├── tailwind.config.js
└── vite.config.ts
```
