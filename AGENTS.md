# AGENTS.md

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # tsc -b && vite build (typecheck then build)
npm run lint       # ESLint on all files
npm run format     # Prettier on all .ts/.tsx files
npm run typecheck  # tsc --noEmit (no emit type check only)
npm run preview    # Vite preview of production build
```

`npm run build` uses `tsc -b` (project references), not `tsc --noEmit`. Both `tsconfig.app.json` and `tsconfig.node.json` are referenced.

## Stack

- React 19, TypeScript ~6, Vite 8
- shadcn/ui with Radix Sera style, Lucide icons
- Tailwind CSS 4 via `@tailwindcss/vite` Vite plugin (no `tailwind.config.ts`)

## Path alias

`@/*` → `./src/*` (configured in `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`)

## shadcn/ui

Add components with:
```bash
npx shadcn@latest add <component>
```

Components land in `src/components/ui/`. The `cn()` utility is at `@/lib/utils`. shadcn CSS is imported via `shadcn/tailwind.css` in `src/index.css`.

## TypeScript quirks

- `verbatimModuleSyntax: true` — type-only imports must use `import type { ... }`
- `erasableSyntaxOnly: true` — enums, namespaces, and parameter properties are forbidden
- `noUnusedLocals: true`, `noUnusedParameters: true` — unused variables will fail `tsc`

## Styling

- Tailwind CSS 4 (import-based, no config file)
- Dark mode uses `.dark` class on `<html>` (`@custom-variant dark (&:is(.dark *))`)
- Theme toggle: press `d` key (no modifier) — stored in `localStorage` under key `"theme"`
- Prettier: no semicolons, double quotes, tabWidth 2, trailing commas es5
- Fonts: Inter Variable (sans, `--font-sans`), Roboto Variable (heading, `--font-heading`)
