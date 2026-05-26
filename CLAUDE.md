# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server (after build)
npm run type-check   # TypeScript check (tsc --noEmit)
npm run lint         # ESLint via next lint

npm run db:generate  # Generate Drizzle migrations from schema changes
npm run db:migrate   # Apply pending migrations to the database
npm run db:push      # Push schema directly (dev only, no migration file)
npm run db:studio    # Open Drizzle Studio (database browser)
```

There is no test runner configured.

## Product

**GetNIFPortugal** — SaaS for remotely obtaining Portuguese tax IDs (NIF) for non-residents.

**Pricing (one-time payments):**
- Essential — €79 — NIF only, 7-day delivery
- Standard — €129 — NIF + 1yr fiscal representation (most popular)
- Premium — €199 — NIF + 2yr fiscal rep + 48h express delivery

**Key constraint:** Submission to Finanças (Portuguese tax authority) is irreducibly manual — no public API exists. A licensed fiscal representative must submit manually. Never attempt to automate this step.

**Post-MVP upsells (Sprint 2+):** bank account opening, NISS registration, fiscal rep renewal (€89/yr), tax return filing.

## Architecture

Next.js 16 App Router with full-stack Server Actions.

### Layer model

```
Pages/Components  →  Modules (Server Actions)  →  Repositories (Drizzle)  →  PostgreSQL
                                ↓
                          Services (pure business logic: payments, email)
                          Lib (SDK singletons: supabase, stripe, resend, env)
```

- **`src/modules/`** — Feature folders with `actions.ts` (Server Actions) that orchestrate validation → repository calls → side effects. Components live here too when feature-specific (e.g. `RealtimeDashboard.tsx`).
- **`src/repositories/`** — All Drizzle queries. Never imported by components directly. Key files: `order.repository.ts`, `document.repository.ts`, `user.repository.ts`, `webhook-events.repository.ts`.
- **`src/services/`** — Pure business logic with no Next.js imports (payment.service, email.service). Callable from Server Actions and the Stripe webhook handler.
- **`src/lib/`** — Singleton SDK clients (`stripe.ts`, `resend.ts`, `supabase/server.ts`, `supabase/client.ts`) and type-safe env validation (`env.ts` via @t3-oss/env-nextjs).
- **`src/components/`** — Shared, non-feature-specific components. Organized as `home/` (homepage sections), `layout/` (Navbar, Footer, AppHeader), `shared/` (LocaleSwitcher, MotionProvider, CountUp). Feature-specific components (e.g. `RealtimeDashboard`, `DocumentUploadSection`) live in their module folder instead (`src/modules/{feature}/components/`).
- **`src/lib/constants/`** — Shared constants (e.g. `assets.ts` for SVG data URIs used across multiple components).

### Database (Drizzle ORM + Supabase PostgreSQL)

Schema is in `src/db/schema/`. Key tables:

- **`orders`** — Core NIF applications. `serviceTier` enum: `essential | standard | premium`. Status enum: `pending_payment → payment_received → documents_required → documents_under_review → nif_processing → nif_issued | cancelled`. Also stores `locale` (persisted at checkout for locale-correct emails/links) and `deadlineAt` (document upload deadline, set for the `documents_required` path only).
- **`statusUpdates`** — Immutable audit log of status transitions. Supabase Realtime listens to INSERT events on this table to push live updates to the dashboard. Key columns: `status`, `note` (optional customer-visible message set by admin), `isAdminAction` (boolean), and a denormalized `userId` column — Supabase Realtime RLS cannot evaluate cross-table subqueries, so `userId` must be a direct column to filter events per user.
- **`orderDocuments`** — Supabase Storage file references (passport, proof_of_address, other). Each row also carries `aiReviewStatus` (`pending | approved | flagged | error`) and `aiReviewNotes` (JSON string of Gemini's findings). Status defaults to `pending` on INSERT; updated async after upload via `analyzeUploadedDocumentAction`.
- **`users`** — Mirrors `auth.users`; populated by a Supabase trigger on signup.
- **`processedWebhookEvents`** — Idempotency table. `claimWebhookEvent()` does an atomic `INSERT ... ON CONFLICT DO NOTHING` to guarantee exactly-once processing of Stripe events across concurrent Vercel workers.

### Routing & i18n

All user-facing routes are under `src/app/[locale]/` with three route groups:

- `(marketing)` — public homepage and SEO content pages (e.g. `/guide/eu-citizen-portugal-checklist`). Also contains `/design-preview` — a dev-only visual sandbox, not a real production page.
- `(auth)` — `/login`, `/signup`, `/forgot-password`, `/reset-password`
- `(app)` — protected: `/dashboard`, `/order`, `/admin`, `/admin/orders/[orderId]`

**Admin panel:** `/admin` lists all orders; `/admin/orders/[orderId]` shows order detail with document signed URLs and a status update form. Protected by `requireAdmin()` in `src/modules/admin/actions.ts`, which compares the authenticated user's email to `ADMIN_EMAIL`.

Locales: `en`, `pt`, `fr` (always prefixed in URL). Config: `src/i18n/routing.ts`. Server config: `src/i18n/request.ts`. Translation strings live in `/messages/{locale}.json`.

**Root `/` routing:** `proxy.ts` intercepts every request to `/` via `intlMiddleware(request)` (next-intl's `createMiddleware(routing)`), which reads `Accept-Language` and redirects to the correct locale before any page renders. The `redirect("/en")` in `src/app/page.tsx` is dead code — it only fires if the middleware is somehow bypassed. To add a locale or change the default, edit `src/i18n/routing.ts` only.

**Navigation:** always import `Link`, `useRouter`, `usePathname`, `redirect` from `@/i18n/navigation` (not from `next/navigation`) — these are locale-aware wrappers generated by `createNavigation(routing)`.

### Auth & proxy

`proxy.ts` (project root, not in `src/`) — Next.js 16 network proxy, replaces `middleware.ts`. Export must be named `proxy`, not `middleware`. Cannot use `@/` path aliases; imports from `src/` use relative `./src/` paths. Runs on every request:

1. Applies next-intl locale routing
2. Refreshes Supabase session cookie (calls `getUser()`, not `getSession()`, to validate server-side)
3. Guards `/dashboard`, `/order`, and `/admin` — redirects unauthenticated users to `/login`
4. Redirects authenticated users away from `/login` and `/signup` only — `/forgot-password` and `/reset-password` stay accessible for all users

When redirecting unauthenticated users to `/login`, the proxy appends `?redirectTo=<original-path>`. `LoginForm` reads this param and redirects back after successful login. `SignupForm` also forwards it via `?redirectTo=` so the flow survives account creation.

### Payment flow

1. `createOrderAction` → creates `orders` row with status `pending_payment`
2. `createCheckoutSessionAction` → Stripe Checkout Session with `orderId`, `userId`, `serviceTier` in metadata → redirect
3. `POST /api/webhooks/stripe` receives `checkout.session.completed`:
   - Layer 1 idempotency: `claimWebhookEvent()` atomic INSERT
   - Layer 2 guard: order must still be in `pending_payment`
   - Amount validation against `EXPECTED_AMOUNT_CENTS` map (halts if mismatch)
   - Transitions to `payment_received`, sends confirmation email
   - **Document branch**: queries `order_documents` to check if docs were already uploaded
     - All docs present → `documents_under_review` + `sendDocumentsUnderReview`
     - Missing docs → `documents_required` + sets `deadlineAt` (3 days for premium, 7 days otherwise) + `sendDocumentsRequired` with specific missing doc list
4. `charge.refunded` → transitions eligible orders to `cancelled` (skips `nif_issued`, `cancelled`, `pending_payment`)
5. `payment_intent.payment_failed` → sends `PaymentFailedEmail`; order stays `pending_payment` so customer can retry

### Realtime dashboard

Dashboard Server Component fetches initial data via `getUserOrdersAction()`. `RealtimeDashboard` (Client Component) subscribes to Supabase Realtime on `status_updates` INSERT events and merges updates without a page refresh.

**Critical invariant:** `updateOrderStatus()` in `order.repository.ts` runs a single transaction that atomically updates `orders.status` AND inserts into `statusUpdates`. Every status change MUST go through this function — skipping it will update the order without triggering the Realtime subscription.

**Dashboard filter:** `getOrdersByUserId()` excludes `pending_payment` orders (`ne(orders.status, "pending_payment")`). Users never see an order in their dashboard until payment succeeds.

### Document Uploads & AI Review

Uploaded via signed URLs (Supabase Storage).
- **Bucket:** `documents`
- **Path convention:** `orders/{orderId}/{timestamp}_{filename}`
- **Permissions:** Restricted; only server-side signed URL creation via `getSignedUploadUrl()`.
- **Cleanup:** `saveDocumentRecord()` records the path in `order_documents` table for future deletion or retrieval.

After each upload, the client calls `analyzeUploadedDocumentAction(docId, orderId)` which runs `src/services/document-ai.service.ts`:
1. Generates a 120-second signed URL via the admin Supabase client (bypasses RLS)
2. Downloads the file bytes server-side (Gemini cannot reach private Supabase URLs)
3. Calls `gemini-2.5-flash` via `@ai-sdk/google` with `Output.object()` for structured JSON
4. Returns `{ status: "approved" | "flagged" | "error", notes: string }` — notes is a JSON string
5. Result is saved to `order_documents.aiReviewStatus` / `aiReviewNotes`

The service is soft-failure: any error (missing key, network, schema validation) returns `status: "error"` rather than throwing. `GOOGLE_GENERATIVE_API_KEY` is optional — if absent, every review returns `"error"` and admin reviews manually.

### Validation

`src/lib/validators/order.ts` holds Zod schemas used as the single source of truth for both React Hook Form (client) and Server Actions (server). All Server Actions return `ActionResult<T>` (discriminated union) from `src/types/api.types.ts`:

```ts
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string; fieldErrors?: Record<string, string[]> }
```

Never throw to the client from a Server Action — always return `ActionResult`.

### Email templates

`emails/` (project root, not inside `src/`) contains React Email components rendered and sent via Resend from `src/services/email.service.ts`:

| Template | Trigger |
|----------|---------|
| `OrderConfirmation.tsx` | Payment confirmed (`checkout.session.completed`) |
| `DocumentsRequired.tsx` | Docs missing after payment — includes deadline + list of missing docs |
| `DocumentsUnderReview.tsx` | All docs already present at checkout |
| `NIFIssued.tsx` | NIF number ready (admin action) |
| `NIFProcessing.tsx` | Admin transitions order to `nif_processing` — confirms submission to Finanças with delivery estimate |
| `OrderCancelled.tsx` | `charge.refunded` webhook — confirms cancellation and refund |
| `PaymentFailed.tsx` | `payment_intent.payment_failed` webhook |

All templates accept a `locale` prop (passed from `order.locale`) to construct locale-correct dashboard deep-links.

**i18n translation strings** live in `messages/` at project root (`messages/en.json`, `messages/pt.json`, `messages/fr.json`) — also not inside `src/`.

### Order form draft

`OrderContent.tsx` auto-saves form state to `localStorage` under the key `nif_order_draft_{userId}`. On mount, draft takes priority over the last-order pre-fill. The draft is cleared on successful checkout redirect. To reset a stuck draft during development, clear `nif_order_draft_*` from localStorage.

## Styling & Design System

**Tailwind v4** — no `tailwind.config.ts`. All design tokens are defined as an `@theme` block inside `src/app/globals.css` and exposed as CSS custom properties.

### Fonts (loaded via `next/font/google` in root layout)
- `--font-display` → **Fraunces** (serif, headings)
- `--font-sans` → **Instrument Sans** (body text)
- `--font-mono` → **JetBrains Mono**

### Design tokens (OKLCH CSS custom properties)
All colors follow a semantic naming pattern: `--color-{role}-{variant}`. Key tokens:
- Brand: `--color-green`, `--color-gold`, `--color-amber`, `--color-red`, `--color-blue`
- Surfaces: `--color-bg`, `--color-surface`, `--color-surface-elevated`
- Ink: `--color-ink`, `--color-ink-muted`, `--color-ink-subtle`
- Alpha tints: `--color-green-alpha-{N}`, `--color-gold-alpha-{N}`, etc.
- Dark surfaces (footer/trust cards): `--color-surface-dark`, `--color-ink-deep`

Always reference tokens by their CSS variable — never hardcode OKLCH values inline.

### Component utility classes (defined in `globals.css`)
These classes exist for all shared UI — use them instead of raw Tailwind utilities:

| Class | Purpose |
|-------|---------|
| `.btn` | Base button styles |
| `.btn-primary` / `.btn-secondary` / `.btn-ivory` | Button variants |
| `.btn-sm` / `.btn-lg` | Button size modifiers |
| `.input` | Text input (with focus/error states via `.error`) |
| `.label` | Form label |
| `.error-text` | Inline validation error |
| `.card` | Elevated surface card |
| `.glass-card` | Frosted glass card (backdrop-filter) |
| `.badge` | Base pill/badge |
| `.badge-green` / `-amber` / `-blue` / `-gray` / `-red` / `-purple` | Badge color variants |
| `.container-site` | Max-width 1440px centered layout wrapper |
| `.container-full` | Full-width with responsive padding |
| `.section-pad` | Responsive vertical section padding |
| `.text-display` / `.text-heading-xl` / `.text-heading-lg` | Fluid type scale using Fraunces |
| `.gradient-brand` / `.text-gradient-brand` | Green brand gradient |
| `.animate-fade-up` / `.animate-float` | CSS animations |

## Coding conventions

### Environment variables
Always access env vars through `env` from `@/lib/env.ts` — not `process.env` directly:
```ts
import { env } from "@/lib/env.ts";
const key = env.STRIPE_SECRET_KEY; // typed, validated at build time
```
**Exception:** `proxy.ts` cannot import from `src/` (it runs before the app bundle), so it uses `process.env` with `!` assertions directly.

### Supabase clients
- **Server Components, Server Actions, Route Handlers:** `createClient()` from `@/lib/supabase/server`
- **Client Components:** `createBrowserClient()` from `@/lib/supabase/client`
- **Admin operations (bypasses RLS):** `createAdminClient()` from `@/lib/supabase/server` — uses `SUPABASE_SECRET_KEY`. Required for Storage signed URL generation in admin order detail and AI document review.

### Server Actions
`'use server'` goes at the **top of the file**, not per-function. Every actions file begins with this directive.

### Schema changes
After modifying any file in `src/db/schema/`, always run `npm run db:generate` to create a migration, then `npm run db:migrate` to apply it. Never edit migration files manually. `db:push` is for throwaway dev environments only — it skips the migration file entirely.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (Session Pooler, port 5432) |
| `SUPABASE_SECRET_KEY` | Server-only Supabase admin key (`sb_secret_...`) |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature verification |
| `STRIPE_PRICE_ID_ESSENTIAL` / `_STANDARD` / `_PREMIUM` | Stripe Price IDs (must be `price_xxx`, not `prod_xxx`) |
| `RESEND_API_KEY` | Resend service key |
| `RESEND_FROM_EMAIL` | From email address (e.g. `support@getnifportugal.com`) |
| `RESEND_FROM_NAME` | Display name (e.g. `GetNIFPortugal Support`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase browser key (`sb_publishable_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe browser key |
| `NEXT_PUBLIC_APP_URL` | Base URL (used in emails and redirects) |
| `NEXT_PUBLIC_APP_NAME` | Display name for UI/emails |
| `ADMIN_EMAIL` | Email address of the admin user (checked by `requireAdmin()` in admin actions) |
| `GOOGLE_GENERATIVE_API_KEY` | Google Gemini API key for AI document review (optional — get free at aistudio.google.com) |
| `SKIP_ENV_VALIDATION` | Set to any truthy value to skip env validation at build time (CI/preview environments) |

## Configuration & Known Issues

- **Security headers:** `next.config.ts` applies `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` to all routes, plus `X-Robots-Tag: noindex` on `/(dashboard|order|admin)/*` and `X-Robots-Tag: index, follow` (with extended AI-crawler directives) on `/(en|pt|fr)/guide/*`. Don't add conflicting `robots` meta tags on those routes.
- **cacheComponents (disabled):** `nextConfig.cacheComponents` is disabled due to incompatibility with `next-intl`.
- **API Routes & Proxy:** All routes starting with `/api/` are explicitly excluded from `proxy.ts` matcher to prevent `next-intl` from interfering with technical callbacks (Supabase Auth callback, Stripe webhook).
- **Stripe Metadata:** Every checkout session MUST include `orderId` in metadata for the webhook to function.
- **Supabase Users Trigger:** A database trigger MUST exist on `auth.users` to sync new signups to `public.users`. Without this, `createOrderAction` will fail with a foreign key error (23503).
- **Document Storage:** The bucket name is strictly `documents` (not `order-documents`). Policies must allow `authenticated` users to `INSERT` and `SELECT` their own files.
- **Environment Files:** `.env.local` must be UTF-8 (no BOM) and avoid special characters (like long dashes `—`) in comments to prevent parsing errors during build.
