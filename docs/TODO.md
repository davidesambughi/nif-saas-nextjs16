# TODO — GetNIFPortugal Roadmap

Ultimo aggiornamento: 07/04/2026
Sprint 1 ✅ Sprint 2 ✅ completati e testati.

---

## PRIORITÀ ALTA — Da fare prima del lancio

- [ ] **Receipt Stripe** — abilitare da Dashboard: Settings → Emails → Successful payments → ON
      (invoice_creation già abilitato nel codice — zero codice richiesto)

**Completati:**
- [x] Validazione dati Zod (nome, passaporto, data nascita, indirizzo)
- [x] Dropdown nazionalità con datalist (190+ paesi)
- [x] Bozza automatica localStorage + pre-fill dall'ultimo ordine
- [x] "Get Started" senza login → /login?redirectTo=/order con banner contestuale
- [x] Logo navbar → dashboard se loggato (comportamento accettato)
- [x] Email già in uso al signup → "Sign in instead" link
- [x] Troppi tentativi login → messaggi user-friendly in LoginForm
- [x] Password dimenticata (Sprint 2)

---

## PRIORITÀ MEDIA — Sprint 3

- [ ] **Spinner infinito dopo upload documenti** — mostrare stato successo invece di loading
      mentre Realtime aggiorna lo stato (fix in DocumentUploadSection.tsx)
- [ ] **Redesign dashboard** — progress step visuale, documenti caricati, prossimi step compliance,
      link rapidi. Eventualmente integrare la compliance roadmap (è auth-gated, nessun impatto SEO).
- [ ] **"Retry Payment" link** — per ordini in pending_payment con pagamento fallito
- [ ] **Riprendere / cancellare un ordine esistente** — bottone nella dashboard per tornare al
      checkout (pending_payment) o cancellare esplicitamente. Attualmente non c'è nessun controllo visibile.
- [ ] **Cancellazione ordine** — bottone "Request cancellation" per ordini in
      payment_received / documents_required / documents_under_review.
      Invia email al team, NON cancella automaticamente — richiede conferma admin.
- [ ] **Skeleton loading** — per RealtimeDashboard durante il caricamento iniziale
- [ ] **"Contact us"** — link mailto o widget chat (Crisp/Tawk.to free tier)
- [ ] **Audit UI/UX dell'intero sito** — homepage, order flow, dashboard, success page.
      Coerenza visiva, micro-interazioni, responsive mobile, accessibilità (contrasti, focus states).

**Completati:**
- [x] Ordini pending_payment nascosti in dashboard
- [x] Email nif_processing (NIFProcessing.tsx cablato in adminUpdateOrderStatusAction)
- [x] Email cancellazione (OrderCancelled.tsx cablato nel webhook charge.refunded)
- [x] Metodo pagamento Stripe → solo card (Link disabilitato)

---

## PRIORITÀ BASSA — Sprint 4 / Post-lancio

### UX

- [ ] **Etichette status dashboard** — progress bar mostra solo numeri, aggiungere label testuali localizzate (en/pt/fr)
- [ ] **"Redirecting to Stripe" UI** — migliorare schermata di redirect durante submit ordine
- [ ] **Hover card homepage** — aggiungere animazione hover alle card
- [ ] **Hover FAQ** — aggiungere stile hover alle FAQ

### SEO & GEO

- [ ] **JSON-LD schema** — aggiungere "Service" e "Review" per citazioni LLM
- [ ] **Landing page copy** — ottimizzare per query natural language ("How do I get a NIF remotely?")
- [ ] **generateMetadata** — meta dinamici per /dashboard e /order
- [ ] **Mobile first audit** — verifica Lighthouse score mobile
- [ ] **Off-site GEO — Reddit** — rispondere a thread esistenti su r/portugal e r/expats
      (NON creare post nuovi). Query: "CRUE" / "EU citizen registration Portugal" → Top → Past Year.
      **Prerequisito: account Reddit con qualche karma.**
- [ ] **Off-site GEO — LinkedIn** — articolo "EU Citizen Portugal Compliance Checklist 2026",
      mirror della guide page con link al sito.

### Infrastructure

- [ ] **n8n integration** — webhook trigger per checkout.session.completed, download documenti, notifiche Slack/Email al team
- [ ] **Admin/Lawyer API** — endpoint protetto /api/orders/update-status per n8n
- [ ] **email_log table** — tracciare ogni email inviata con status per retry

### Code quality

- [ ] **Server Components + Client Islands** — audit componenti, push 'use client' il più in basso possibile
- [ ] **PPR** — rivalutare cacheComponents: true quando next-intl supporta Next.js 16 PPR

---

## UPSELL post-MVP (Sprint 5+)

- [ ] Bank account opening assistance
- [ ] NISS (social security number) registration
- [ ] Annual fiscal representation renewal (€89/year)
- [ ] Tax return filing
