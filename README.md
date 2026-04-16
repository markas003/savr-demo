# SAVR Demo

Presentation-ready SAVR prototype built with Next.js App Router, React, TypeScript, and Tailwind CSS. The browser page stays clean and minimal while the full product demo runs inside a centered premium phone frame.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Local typed mock data only

## Run locally

1. Install Node.js 18.18+ or Node.js 20+.
2. Install dependencies:

```bash
npm install
```

3. Start the dev server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push this folder to a Git repository.
2. Create a new Vercel project from the repo.
3. Framework preset: `Next.js`.
4. Build command: `npm run build`.
5. Output setting: default Next.js output.
6. Deploy.

## Project structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  action-modal.tsx
  balance-card.tsx
  bottom-tab-bar.tsx
  budget-card.tsx
  charts.tsx
  goal-card.tsx
  mobile-screen.tsx
  offer-card.tsx
  offer-detail-modal.tsx
  phone-frame.tsx
  recurring-card.tsx
  savr-demo.tsx
  segmented-control.tsx
  transaction-row.tsx
  ui.tsx
data/
  mock-data.ts
types/
  index.ts
next.config.ts
postcss.config.js
tailwind.config.ts
tsconfig.json
```

## Where to edit demo content

- Update balances, offers, budgets, recurring payments, and goals in [data/mock-data.ts](/Users/markaleksandersarman/Documents/Playground/daily-flow-generator/data/mock-data.ts).
- Adjust app-wide labels, screen flow, and modal interactions in [components/savr-demo.tsx](/Users/markaleksandersarman/Documents/Playground/daily-flow-generator/components/savr-demo.tsx).

## Where to swap branding

- Outer presentation page and metadata: [app/page.tsx](/Users/markaleksandersarman/Documents/Playground/daily-flow-generator/app/page.tsx) and [app/layout.tsx](/Users/markaleksandersarman/Documents/Playground/daily-flow-generator/app/layout.tsx).
- Colors, shadows, motion, and design tokens: [tailwind.config.ts](/Users/markaleksandersarman/Documents/Playground/daily-flow-generator/tailwind.config.ts) and [app/globals.css](/Users/markaleksandersarman/Documents/Playground/daily-flow-generator/app/globals.css).
- Reusable card and shell styling: [components/ui.tsx](/Users/markaleksandersarman/Documents/Playground/daily-flow-generator/components/ui.tsx) and [components/phone-frame.tsx](/Users/markaleksandersarman/Documents/Playground/daily-flow-generator/components/phone-frame.tsx).

## Notes

- The prototype has no backend, authentication, database, or network API calls.
- All interactions are local UI state for demo purposes.
- The app is designed for desktop presentation first, while remaining usable on smaller screens.
