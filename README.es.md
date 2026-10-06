[English](./README.md) | [简体中文](./README.zh-CN.md) | [日本語](./README.ja.md) | **Español**

# Demo de pedidos de Feidian Hotpot

Demo de pedidos móviles para un restaurante de hotpot: vincular una mesa, pedir en grupo, seguir los platos y pagar.

> Demo conceptual, no es un producto en producción.

## Funcionalidades

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

## Tecnologías

React 18, TypeScript, Vite, Tailwind CSS, Radix UI, i18next, Playwright, Express (servidor de demo).

## Requisitos

- Node.js 18+ (la CI usa 20)
- npm 9+

## Primeros pasos

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173` (si el puerto está ocupado, Vite elige otro).

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run lint         # lint
npm run build        # comprobación de tipos y build en dist/
npx playwright test  # tests e2e (arranca el servidor de desarrollo)
```

Playwright usa Chromium en `/opt/chromium.org/chromium/chrome`; cámbialo con `PLAYWRIGHT_CHROMIUM_PATH`.

## Servidor de demo

`server/` es una app Express mínima con `GET /ping` en el puerto 3001.

```bash
cd server && npm install && npm run dev
```

## Modo vista previa

Ir directamente al menú con una mesa vinculada y un plato en el carrito:

```text
http://localhost:5173/?preview=menu
```

## Despliegue

Cada push a `main` compila y despliega `dist/` en GitHub Pages mediante `.github/workflows/deploy-pages.yml`. Gracias a `base: './'`, el build funciona en cualquier subruta.

## Estructura del proyecto

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
