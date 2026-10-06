**English** | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](#espanol)

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

---

<a id="espanol"></a>

## Español: Demo de pedidos de Feidian Hotpot

Demo de pedidos móviles para un restaurante de hotpot: vincular una mesa, pedir en grupo, seguir los platos y pagar.

> Demo conceptual, no es un producto en producción.

### Funcionalidades

- Vinculación de mesa
- Menú por categorías, con búsqueda
- Opciones del plato: tamaño, nivel de picante, quién lo pide ("súper picante" pide confirmación)
- Carrito compartido para pedidos en grupo
- Progreso de cocina y servicio
- Llamadas al servicio: caldo, bebidas, cubiertos, cuenta
- Consola de demo: simula platos agotados, respuestas del servicio y estados del pedido
- Pago simulado
- Chino / inglés
- Modo para mayores (texto más grande)
- Temas claro, oscuro y del sistema
- Seis monedas (CNY, USD, EUR, JPY, HKD, TWD), convertidas desde CNY con tipos fijos

El tema, la moneda y el modo para mayores se guardan en `localStorage`.

### Tecnologías

React 18, TypeScript, Vite, Tailwind CSS, Radix UI, i18next, Playwright, Express (servidor de demo).

### Requisitos

- Node.js 18+ (la CI usa 20)
- npm 9+

### Primeros pasos

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173` (si el puerto está ocupado, Vite elige otro).

### Comandos

```bash
npm run dev          # servidor de desarrollo
npm run lint         # lint
npm run build        # comprobación de tipos y build en dist/
npx playwright test  # tests e2e (arranca el servidor de desarrollo)
```

Playwright usa Chromium en `/opt/chromium.org/chromium/chrome`; cámbialo con `PLAYWRIGHT_CHROMIUM_PATH`.

### Servidor de demo

`server/` es una app Express mínima con `GET /ping` en el puerto 3001.

```bash
cd server && npm install && npm run dev
```

### Modo vista previa

Ir directamente al menú con una mesa vinculada y un plato en el carrito:

```text
http://localhost:5173/?preview=menu
```

### Despliegue

Cada push a `main` compila y despliega `dist/` en GitHub Pages mediante `.github/workflows/deploy-pages.yml`. Gracias a `base: './'`, el build funciona en cualquier subruta.

### Estructura del proyecto

```text
.
├── .github/workflows/  # Despliegue en GitHub Pages
├── docs/specs/         # Notas de requisitos
├── e2e/                # Tests de Playwright
├── openspec/           # Propuestas y especificaciones OpenSpec
├── server/             # Servidor de demo Express
├── src/
│   ├── assets/         # Imágenes
│   ├── components/     # Vistas y componentes de UI
│   ├── data/           # Datos del menú
│   ├── hooks/          # Tema, moneda, modo para mayores
│   ├── lib/            # Utilidades, formato de moneda
│   ├── state/          # Estado del pedido
│   ├── App.tsx         # Componente raíz
│   ├── i18n.ts         # Textos zh / en
│   └── index.css       # Estilos globales
├── index.html
├── playwright.config.ts
├── tailwind.config.js
└── vite.config.ts
```
