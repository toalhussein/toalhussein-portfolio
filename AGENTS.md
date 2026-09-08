# AGENTS.md

Bilingual (Arabic/English) portfolio site for a mobile-app developer. Next.js 16 App Router + React 19 + TypeScript, Tailwind CSS v4, framer-motion, lucide-react, Supabase.

## Commands

- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint (only lint; there is **no** typecheck/test script)
- `npx tsc --noEmit` — typecheck

There is no test framework configured.

## Critical gotchas

- **This is Next.js 16: the root request middleware lives in `proxy.ts`, not `middleware.ts`.** `lib/supabase/middleware.ts` is only the Supabase session helper imported by `proxy.ts`. Don't create a root `middleware.ts`.
- **Both `package-lock.json` and `pnpm-lock.yaml` are committed** (plus `pnpm-workspace.yaml`). Keep whichever you use consistent; don't introduce a third lockfile.
- `.env*` is gitignored. Copy `.env.local.example` to `.env.local`. Required vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (admin ops), `NEXT_PUBLIC_SITE_URL`.
- Home page data is fetched server-side in `app/(public)/[locale]/page.tsx`; it will render empty sections if Supabase is unreachable.

## Architecture

- **Path alias**: `@/*` maps to repo root.
- **i18n**: locales `['ar', 'en']`, `defaultLocale = 'ar'`. Root `<html lang="ar" dir="rtl">`. URL is locale-prefixed; `proxy.ts` redirects missing locale and guards `/admin`. Dictionaries in `lib/i18n/dictionaries/{ar,en}.ts`; resolve with `getDictionary(locale)`.
- **Bilingual strings**: many props/objects are `{ ar, en }`; components select via `locale` and use `locale === 'ar'` / `isRTL` for direction-aware spacing.
- **Sections**: public sections in `components/sections/`, exported from `components/sections/index.ts`. Reusable UI primitives in `components/ui/` (exported from `components/ui/index.ts`). Admin components in `components/admin/`.
- **Data layer (Supabase)**:
  - `lib/supabase/client.ts` — browser client
  - `lib/supabase/server.ts` — RSC client + `createAdminClient()` (service role, use sparingly)
  - `lib/supabase/middleware.ts` — session refresh
  - Server actions in `lib/actions/*.ts` (each file starts with `'use server'`); contact form posts to `app/api/contact/route.ts`.
- **DB schema & migrations**: `supabase/schema.sql`, `supabase/cv_storage.sql`, `supabase/add_features_migration.sql` — apply in Supabase SQL Editor. RLS: public read on published `works`/`projects`; admin writes gated by `public.is_admin()` (`profiles.role = 'admin'`). Public images come from Supabase storage (see `next.config.ts` remote patterns).

## Design system

Tailwind v4 tokens are defined in `app/globals.css` via `@theme inline`. Use these instead of raw Tailwind colors:
- `bg-surface`, `bg-surface-light`, `text-foreground`, `text-foreground-secondary`, `border-border`, `border-primary`, `from-primary`, `to-accent`
- Shadows: `shadow-glow`, `shadow-glow-sm`, `shadow-glow-lg`
- Custom utility classes: `.eyebrow`, `.gradient-text`, `.animate-gradient`, `.animate-glow-pulse`, `.surface-grid`, `.container` (overridden to 1240px)
- RTL-aware: use `start-*`/`end-*` and logical props (`ps-*`, `pe-*`, `ms-*`, `me-*`) rather than `left`/`right`.
- Merge classes with the `cn()` helper from `@/lib/utils`.

## Style conventions

- Components using framer-motion or hooks must start with `'use client'`.
- Named exports (e.g. `export function AboutSection`) rather than default exports.
