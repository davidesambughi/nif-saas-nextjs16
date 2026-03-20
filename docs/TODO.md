# TODO - GetNIFPortugal Roadmap

## 1. Automation & Infrastructure (High Priority)
- [ ] **n8n Integration:**
  - Create webhook trigger in n8n for `checkout.session.completed`.
  - Update `src/app/api/webhooks/stripe/route.ts` to call the n8n webhook.
  - Automate document download and team notifications (Slack/Email).
- [ ] **Admin/Lawyer API:**
  - Build protected API endpoint (`/api/orders/update-status`) for n8n to update NIF numbers and statuses back to the app.

## 2. UX & Bug Fixes (Medium Priority)
- [ ] **Dashboard Cleanup:**
  - Filter out or hide orders with `pending_payment` status from previous failed attempts.
  - Add "Retry Payment" link for legitimate pending orders.
- [ ] **Loading States:**
  - Implement Skeletons for `RealtimeDashboard` while fetching initial data.
  - Improve "Redirecting to Stripe" UI during order submission.
- [ ] **Auth Edge Cases:**
  - Handle "Email already in use" during signup (currently silent).
  - Implement "Forgot Password" flow.

## 3. SEO & GEO (Strategic)
- [ ] **Generative Engine Optimization (GEO):**
  - Add JSON-LD schema for "Service" and "Review" to help LLMs cite the project.
  - Optimize landing page copy for "Natural Language Queries" (e.g., "How do I get a NIF remotely?").
- [ ] **SEO Meta:**
  - Implement dynamic `generateMetadata` for `/dashboard` and `/order`.

## 4. Code Quality
- [ ] **Error Handling:** Centralize error messages for Zod validation in `PersonalInfoInput`.
- [ ] **Type Safety:** Review all `any` or `unknown` casts in Server Actions.
- [ ] **PPR:** Re-evaluate `cacheComponents: true` once `next-intl` supports Next.js 16 PPR natively.
