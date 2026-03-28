# GetNIFPortugal

A production SaaS that lets non-residents obtain a Portuguese tax ID (NIF) remotely. Customers submit their details, pay, upload documents, and receive their NIF — all without visiting Portugal.

**Live:** [getnifportugal.com](https://getnifportugal.com)

---

## What it does

| Step          | What happens                                                         |
| ------------- | -------------------------------------------------------------------- |
| 1. Order      | Customer fills in personal details and selects a service tier        |
| 2. Payment    | Stripe Checkout collects payment                                     |
| 3. Documents  | Customer uploads passport + proof of address via signed URLs         |
| 4. Processing | Admin submits to Finanças (Portuguese tax authority) manually        |
| 5. Delivery   | NIF issued via admin panel → customer receives email with NIF number |

**Service tiers:** Essential (€79, NIF only) · Standard (€129, NIF + 1yr fiscal rep) · Premium (€199, NIF + 2yr fiscal rep + 48h express)

---

## Tech stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| Framework    | Next.js 16 App Router (React 19, TypeScript) |
| Database     | Supabase PostgreSQL via Drizzle ORM          |
| Auth         | Supabase Auth (email/password)               |
| File storage | Supabase Storage (signed URLs)               |
| Realtime     | Supabase Realtime (Postgres CDC)             |
| Payments     | Stripe Checkout + Webhooks                   |
| Email        | Resend + React Email                         |
| i18n         | next-intl (EN / PT / FR)                     |
| Styling      | Tailwind CSS v4 + Framer Motion              |
| Deployment   | Vercel                                       |

---

## Architecture

```
Pages/Components  →  Modules (Server Actions)  →  Repositories (Drizzle)  →  PostgreSQL
                               ↓
                         Services (pure business logic: payments, email)
                         Lib (SDK singletons: supabase, stripe, resend, env)
```

- **Modules** (`src/modules/`) — feature folders with `actions.ts` (Server Actions) that orchestrate validation → repository → side effects. Feature-specific components live here too.
- **Repositories** (`src/repositories/`) — all Drizzle queries, never imported by components directly.
- **Services** (`src/services/`) — pure business logic, no Next.js imports. Callable from Server Actions and the Stripe webhook handler.
- **Lib** (`src/lib/`) — singleton SDK clients and type-safe env validation via `@t3-oss/env-nextjs`.

---

## Engineering highlights

### Webhook idempotency (two layers)

Stripe can deliver the same webhook event more than once. The handler uses two independent guards:

1. **Atomic claim** — `INSERT INTO processed_webhook_events ... ON CONFLICT DO NOTHING` returns 0 rows if already processed; the handler exits immediately.
2. **Status guard** — the order must still be in `pending_payment` before any state transition. A duplicate that slips past the first guard is caught here.

This prevents double-charges and double-emails even under concurrent Vercel worker invocations.

### Realtime order dashboard

The dashboard Server Component fetches the initial order list. A `RealtimeDashboard` Client Component then subscribes to Supabase Realtime on `INSERT` events on the `status_updates` table. When an admin advances an order, the customer's dashboard updates live without a page refresh — no polling, no websocket management.

### Document branch after payment

After `checkout.session.completed`, the webhook handler queries whether documents were already uploaded (customers can upload before paying). This drives two paths:

- **Docs present** → status jumps directly to `documents_under_review`, skipping the upload nudge
- **Docs missing** → status set to `documents_required`, deadline calculated (3 days Premium / 7 days otherwise), email sent with the specific list of missing documents

### Locale-persisted emails

The customer's UI locale (`en` / `pt` / `fr`) is stored on the `orders` row at checkout. Every transactional email is generated using that locale, so a French-speaking customer receives French emails with French dashboard links even if the email is triggered days later by a background webhook.

### Proxy layer (Next.js 16)

`proxy.ts` replaces `middleware.ts` (Next.js 16 rename). It chains three concerns in a single pass: next-intl locale routing → Supabase session refresh (`getUser()`, not `getSession()`, to validate the JWT server-side) → route guarding. All `/api/*` routes are excluded from the matcher so webhook callbacks are never locale-rewritten.

### Type-safe environment

All environment variables are declared in `src/lib/env.ts` using `@t3-oss/env-nextjs`. The build fails fast if a required variable is missing or malformed — no runtime surprises in production.

---

## Order status machine

```
pending_payment
    └─► payment_received
            ├─► documents_required      (docs missing at checkout)
            │       └─► documents_under_review
            └─► documents_under_review  (docs already present)
                    └─► nif_processing
                            └─► nif_issued
cancelled  (charge.refunded webhook, or admin action)
```

---

## Local development

```bash
# Install dependencies
npm install

# Copy env template and fill in values
cp .env.local.example .env.local

# Apply database migrations
npm run db:migrate

# Start dev server (Turbopack)
npm run dev
```

```bash
npm run type-check   # TypeScript check
npm run lint         # ESLint
npm run db:studio    # Drizzle Studio (database browser)
npm run db:generate  # Generate migration after schema change
```

---

## Project structure

```
src/
├── app/[locale]/
│   ├── (marketing)/     # Public pages + SEO content
│   ├── (auth)/          # Login, signup, password reset
│   └── (app)/           # Protected: dashboard, order flow, admin
├── modules/             # Feature modules (actions + components)
│   ├── orders/
│   ├── payments/
│   ├── documents/
│   ├── auth/
│   └── admin/
├── repositories/        # Drizzle queries
├── services/            # Pure business logic
├── db/schema/           # Drizzle schema definitions
├── lib/                 # SDK singletons, validators, env
└── components/          # Shared UI (layout, home sections)
emails/                  # React Email templates
messages/                # i18n JSON (en, pt, fr)
```
