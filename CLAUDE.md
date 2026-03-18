# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run type-check   # TypeScript check (tsc --noEmit)
npm run lint         # ESLint via next lint

npm run db:generate  # Generate Drizzle migrations from schema changes
npm run db:migrate   # Apply pending migrations to the database
npm run db:push      # Push schema directly (dev only, no migration file)
npm run db:studio    # Open Drizzle Studio (database browser)
```

There is no test runner configured.

## Architecture

**GetNIFPortugal** — a SaaS app for remotely obtaining Portuguese tax IDs (NIF). Next.js 16 App Router with full-stack Server Actions.

### Layer model

```
Pages/Components  →  Modules (Server Actions)  →  Repositories (Drizzle)  →  PostgreSQL
                                ↓
                          Services (pure business logic: payments, email)
                          Lib (SDK singletons: supabase, stripe, resend, env)
```

- **`src/modules/`** — Feature folders with `actions.ts` (Server Actions) that orchestrate validation → repository calls → side effects. Components live here too when feature-specific (e.g. `RealtimeDashboard.tsx`).
- **`src/repositories/`** — All Drizzle queries. Never imported by components directly.
- **`src/services/`** — Pure business logic with no Next.js imports (payment.service, email.service). Callable from Server Actions and the Stripe webhook handler.
- **`src/lib/`** — Singleton SDK clients (`stripe.ts`, `resend.ts`, `supabase/server.ts`, `supabase/client.ts`) and type-safe env validation (`env.ts` via @t3-oss/env-nextjs).

### Database (Drizzle ORM + Supabase PostgreSQL)

Schema is in `src/db/schema/`. Key tables:

- **`orders`** — Core NIF applications. Status enum: `pending_payment → payment_received → documents_required → documents_under_review → nif_processing → nif_issued | cancelled`
- **`statusUpdates`** — Immutable audit log of status transitions. Supabase Realtime listens to INSERT events on this table to push live updates to the dashboard.
- **`orderDocuments`** — Supabase Storage file references (passport, proof_of_address, other).
- **`users`** — Mirrors `auth.users`; populated by a Supabase trigger on signup.

### Routing & i18n

All user-facing routes are under `src/app/[locale]/` with three route groups:
- `(marketing)` — public homepage
- `(auth)` — `/login`, `/signup`
- `(app)` — protected: `/dashboard`, `/order`

Locales: `en`, `pt`, `fr` (always prefixed in URL). Config: `src/i18n/routing.ts`. Server config (message loading): `src/i18n/request.ts`.

### Auth & proxy

`proxy.ts` (Next.js 16 network proxy, replaces `middleware.ts`) runs on every request:
1. Refreshes Supabase session cookie
2. Guards `/dashboard` and `/order` — redirects unauthenticated users to `/login`
3. Redirects authenticated users away from auth pages
4. Applies next-intl locale routing

### Payment flow

1. `createOrderAction` → creates `orders` row with status `pending_payment`
2. `createCheckoutSessionAction` → Stripe Checkout Session with `orderId` in metadata → redirect
3. `POST /api/webhooks/stripe` receives `checkout.session.completed` → updates order status → sends confirmation email via Resend

### Realtime dashboard

Dashboard Server Component fetches initial data. `RealtimeDashboard` (Client Component) subscribes to Supabase Realtime on `status_updates` INSERT events and merges updates without a page refresh.

### Validation

`src/lib/validators/order.ts` holds Zod schemas used as the single source of truth for both React Hook Form (client) and Server Actions (server). All Server Actions return `ActionResult<T>` (discriminated union) from `src/types/api.types.ts`.

### Email templates

`emails/` contains React Email components (`OrderConfirmation.tsx`, `NIFIssued.tsx`) rendered and sent via Resend from `src/services/email.service.ts`.

## Environment variables

Copy `.env.local.example` to `.env.local`. Required keys:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase admin key |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification |
| `STRIPE_PRICE_ID_STANDARD` / `_EXPRESS` | Stripe Price IDs |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Email sending |
| `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | Supabase browser client |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe browser key |
| `NEXT_PUBLIC_APP_URL` | Base URL (used in emails and redirects) |
