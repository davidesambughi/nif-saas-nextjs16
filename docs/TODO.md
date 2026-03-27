# TODO — GetNIFPortugal Roadmap

Ultimo aggiornamento: 25/03/2026
Sprint 1 ✅ e Sprint 2 ✅ completati e testati.

---

## PRIORITÀ ALTA — Da fare prima del lancio

### Form ordine

- [ ] **Validazione dati** ✅ FATTO — Zod rafforzato (nome, passaporto, data nascita, indirizzo)
- [ ] **Dropdown nazionalità** ✅ FATTO — datalist con lista completa paesi
- [ ] **Bozza automatica** ✅ FATTO — localStorage salva progresso, pre-fill dall'ultimo ordine
- [ ] **Receipt Stripe** — abilitare da Dashboard: Settings → Emails → Successful payments → ON
      (invoice_creation già abilitato nel codice)
- [x] **"Get Started" senza login** — done: link → /login?redirectTo=/order con banner contestuale "create account to continue"
- [x] **Logo navbar non ricarica homepage** — utente loggato → dashboard (comportamento accettato)

### Auth

- [x] **Email già in uso al signup** — done: screen "check email" ora include link "Sign in instead"
- [x] **Troppi tentativi login** — done: mapper errori Supabase → messaggi user-friendly in LoginForm
- [ ] **Password dimenticata** ✅ FATTO (Sprint 2)

---

## PRIORITÀ MEDIA — Sprint 3

### Dashboard utente

- [ ] **Redesign dashboard** — la dashboard attuale è minimale. Migliorare con: stato ordine chiaro
      (progress step visuale), documenti caricati, prossimi step compliance, link rapidi.
      Eventualmente integrare la compliance roadmap (senza impatti SEO — è auth-gated).
- [ ] **Audit UI/UX dell'intero sito** — passare in rassegna homepage, order flow, dashboard e
      success page. Verificare coerenza visiva, micro-interazioni, responsive mobile, accessibilità
      di base (contrasti, focus states).

- [ ] **Ordini pending_payment nascosti** — filtrare o raggruppare ordini con pagamento fallito
- [ ] **"Retry Payment" link** — per ordini legittimamente in attesa di pagamento
- [ ] **Riprendere / cancellare un ordine esistente** — nella dashboard, permettere all'utente di
      riprendere un processo già iniziato (es. tornare al checkout per un ordine pending_payment)
      oppure cancellarlo esplicitamente. Attualmente non c'è nessun pulsante visibile per farlo.
- [ ] **Skeleton loading** — per RealtimeDashboard durante il caricamento iniziale
- [ ] **Spinner infinito dopo upload documenti** — mostrare stato successo invece di loading
      mentre Realtime aggiorna lo stato (fix in DocumentUploadSection.tsx)

### Comunicazione utente

- [ ] **Cancellazione ordine** — bottone "Request cancellation" nella dashboard per ordini
      in stato payment_received / documents_required / documents_under_review.
      Invia email al team, NON cancella automaticamente — richiede conferma admin.
- [ ] **"Contact us"** — link mailto o widget chat (Crisp/Tawk.to free tier)

### Email mancanti

- [ ] **Email nif_processing** — notifica al cliente quando NIF è inviato a Finanças.
      Creare template NIFProcessing.tsx + sendNIFProcessing() + collegare in adminUpdateOrderStatusAction
- [ ] **Email cancellazione** — notifica al cliente quando ordine viene cancellato per rimborso
      (charge.refunded → cancelled)

### Checkout Stripe

- [x] **Metodo pagamento predefinito** — done: aggiunto payment_method_types: ["card"] per disabilitare Link

---

## PRIORITÀ BASSA — Sprint 4 / Post-lancio

### UX

- [ ] **Etichette status dashboard** — progress bar mostra solo numeri, aggiungere label testuali
      localizzate (en/pt/fr)
- [ ] **Hover card homepage** — card non si muovono all'hover → aggiungere animazione
- [ ] **Hover FAQ** — le FAQ non cambiano colore all'hover → aggiungere stile
- [ ] **"Redirecting to Stripe" UI** — migliorare schermata di redirect durante submit ordine

### SEO & GEO

- [ ] **Off-site GEO — Reddit** (non bloccante, ma alto ROI per citazioni AI)
      Obiettivo: rispondere a thread esistenti su r/portugal e r/expats con info CRUE/AIMA answer-first.
      NON creare post nuovi — cercare thread già con upvotes e rispondere lì.
      Query: "CRUE" / "EU citizen registration Portugal" → filtrare Top → Past Year.
      Copy pronta da generare con AI quando si è pronti.
      **Prerequisito: account Reddit con qualche karma (non usare account nuovo da zero).**

- [ ] **Off-site GEO — LinkedIn** (non bloccante)
      Articolo: "EU Citizen Portugal Compliance Checklist 2026" — mirror della guide page.
      Link al sito. Indicizzato da Google → aumenta domain authority.
      Copy + struttura pronta da generare con AI quando si è pronti.

- [ ] **JSON-LD schema** — aggiungere "Service" e "Review" per citazioni LLM
- [ ] **Landing page copy** — ottimizzare per query natural language ("How do I get a NIF remotely?")
- [ ] **generateMetadata** — meta dinamici per /dashboard e /order
- [ ] **Mobile first audit** — verifica Lighthouse score mobile

### Infrastructure

- [ ] **n8n integration** — webhook trigger per checkout.session.completed, download documenti,
      notifiche Slack/Email al team
- [ ] **Admin/Lawyer API** — endpoint protetto /api/orders/update-status per n8n
- [ ] **email_log table** — tracciare ogni email inviata con status per retry (deferred da Sprint 2)

### Code quality

- [ ] **Server Components + Client Islands** — audit componenti, push 'use client' il più in basso possibile
- [ ] **PPR** — rivalutare cacheComponents: true quando next-intl supporta Next.js 16 PPR

---

## UPSELL post-MVP (Sprint 5+)

- [ ] Bank account opening assistance
- [ ] NISS (social security number) registration
- [ ] Annual fiscal representation renewal (€89/year)
- [ ] Tax return filing
