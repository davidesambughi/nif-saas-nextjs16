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


## NOTE MIE  (DA RISCRIVERE MEGLIO)
1. IL LOGO NELLA NAVBAR NON RICARICA LA PAGINA E NON RIPORTA NELLA HOME PAGE
2. NATIONALITY OPTION NEL FROM DOVREBBE ESSERE UN DROPDOWN MENU 
3. GET STARTED NELLA HOME PAGE PORTA AL FORM + UPLOAD DOCUMENTI , ANCHE SENZA AVER FATTO IL LOGIN ( ERRORE)
4. I COMPONENTI DEVONO ESSERE SERVER COMPONENTS + CLIENT ISLAND PER MANTENERE INTERATTIVITA E DINAMICITA MA PRESERVANDO PERFORMANCE E LIGHTHOUSE SCORE 
4,5. migliora seo e geo : MOBILE FIRST + fai ricerca ONLINE 
5. DARE LA POSSIBILITA ALL USER DI MODIFICARE LA PASSWORD RICHIEDENDO NUOVA NUOVA EMAIL SE L UTENTE NON RICORDA LA PASSWORD
5.5 GESTISCI IL CASO DI EMAIL GIA USATA OPPURE TROPPI TENTATIVI DI INSERIMENTO PASSWORD O EMAIL SBAGLIATI
6. CARD DELLA HOME PAGE NON SI MUOVONO ALL HOVER , MODIFCARE
6. LE FAQ NON SI EVIDENZIANO ( CAMBIANO COLORE ) ALL HOVER, MODIFICARE
