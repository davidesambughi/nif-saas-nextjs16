# TODO

## Re-enable PPR (`cacheComponents: true`)

**Status:** disabled in `next.config.ts`
**Blocked by:** `next-intl` incompatibility with Next.js 16 Partial Pre-Rendering

### Problem
`getMessages()` in `src/app/[locale]/layout.tsx` reads request headers to resolve the locale.
PPR treats this as uncached dynamic data outside a `<Suspense>` boundary → build fails.

### What to do when re-enabling
1. Check `next-intl` release notes for PPR / Cache Components support.
2. Uncomment `cacheComponents: true` in `next.config.ts`.
3. Run `npm run build` — if it fails, the locale layout needs restructuring:
   - Either wrap `<NextIntlClientProvider>` in `<Suspense>` and move `getMessages()` inside it,
   - or follow the official next-intl PPR migration guide.
4. All `useSearchParams()` calls already have `<Suspense>` wrappers (`LoginForm`, `SignupForm`, `OrderContent`) — those are fine.

---

## Auth

### Email già in uso — gestione errore
**Status:** da fare
`signUp` con email esistente → Supabase ritorna HTTP 200 con `user_repeated_signup` senza messaggio d'errore → l'utente non capisce perché non riceve la mail.
- Rilevare il caso (utente già esistente ma non confermato vs già confermato) e mostrare un messaggio chiaro.
- Distinguere: "email già registrata e confermata → vai al login" vs "email già registrata ma non confermata → ti abbiamo rimandato la mail".

### Password dimenticata
**Status:** da fare
Non esiste nessun flusso di reset password.
- Aggiungere link "Forgot password?" nella `LoginForm`.
- Implementare pagina `/[locale]/reset-password` che chiama `supabase.auth.resetPasswordForEmail()`.
- Aggiungere pagina `/[locale]/update-password` per la callback del link di reset.

---

## i18n — Sistema traduzioni da verificare
**Status:** non funziona correttamente
Controllare che le traduzioni cambino effettivamente switching lingua (EN/PT/FR) su tutte le pagine.
Verificare: navbar, homepage, form ordine, dashboard, email templates.

---

## UX — "Get Started" senza login
**Status:** bug
Il pulsante "Get Started" in navbar permette di compilare il form ordine senza essere autenticati.
Il flusso si blocca alla fine (probabilmente perché `createOrderAction` richiede sessione).
- Decidere il flusso corretto: redirect a signup prima di iniziare il form, oppure raccogliere dati e poi richiedere login/signup step intermedio.
- Implementare e testare end-to-end.

---

## UI/UX — Da completare
**Status:** in corso
- Rifinire animazioni e micro-interazioni homepage.
- Verificare responsiveness mobile su tutte le pagine.
- Empty states, loading states, error states mancanti o incompleti.
- Controllare Lighthouse score dopo ogni batch di modifiche.

---

## Pagamenti — Verificare flusso Stripe
**Status:** da testare
- Testare l'intero flusso: selezione piano → Checkout Session → webhook `checkout.session.completed` → aggiornamento stato ordine → email conferma.
- Verificare che i Price IDs in `.env.local` corrispondano ai prodotti Stripe Dashboard.
- Testare con Stripe CLI (`stripe listen`) in locale.

---

## Backend & Automazione n8n
**Status:** da fare
- Completare i workflow n8n per la gestione manuale delle pratiche (notifica nuovo ordine, aggiornamento stato, emissione NIF).
- Collegare i webhook n8n agli status update dell'app.
- Documentare i workflow.

---

## Pagine Admin e Lawyers
**Status:** da fare
- `/admin` — dashboard operativa per gestire ordini, cambiare stati, caricare documenti, vedere storico.
- `/lawyers` (o `/representatives`) — area riservata ai rappresentanti fiscali per vedere le pratiche assegnate.
- Entrambe protette da login con ruoli separati (Supabase RLS + ruolo nel DB).

---

## SEO & Geo
**Status:** da fare
- Metadata dinamici per ogni pagina (`generateMetadata`).
- `sitemap.xml` e `robots.txt`.
- Struttura URL localizzata già presente (`/en/`, `/pt/`, `/fr/`) — verificare hreflang.
- Schema markup (JSON-LD) per servizi locali.
- Ottimizzare per ricerche geo-targeted (es. "NIF Portugal non residenti").
