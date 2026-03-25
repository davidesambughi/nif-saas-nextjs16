Ottimo. Ho esplorato l'intera codebase. Ecco la mia analisi critica.  
 --- Audit Complessivo — GetNIFPortugal Backend
--- 1. Audit Flusso Pagamenti Cosa funziona bene - Idempotency basilare: il webhook controlla status !== "pending_payment" prima di processare — impedisce il doppio addebito se Stripe ritenta.

- Firma verificata correttamente con stripe.webhooks.constructEvent.
- Transazione atomica in updateOrderStatus (aggiorna orders + inserisce status_updates in un singolo tx).
- Gestione separata dell'errore email — il webhook non crasha se Resend è giù.

Gap critici identificati

[CRITICO] Idempotency superficiale — nessun lock su Stripe Event ID
Il controllo attuale è: "se l'ordine non è pending_payment, ignora". Questo funziona finché Stripe ritenta con lo stesso  
 event. Ma in scenari di race condition (due worker che processano lo stesso webhook in parallelo prima che il primo commit
scriva su DB), entrambi passerebbero il check e processerebbero l'evento due volte. La soluzione corretta è salvare  
 stripeEventId in una tabella processed_events con un constraint UNIQUE, e fare un INSERT-or-skip atomico.

[CRITICO] Nessuna validazione dell'importo pagato
Il webhook registra session.amount_total così com'è, senza verificare che corrisponda al prezzo del tier selezionato. Se  
 qualcuno manomette la sessione (scenario teorico con bug Stripe o test), un ordine Premium potrebbe risultare pagato con  
 €79. Serve una PRICE_MAP che mappi serviceTier → expected_amount_cents e un controllo esplicito.

[ALTO] Email con locale hardcoded a /en/
OrderConfirmation.tsx e NIFIssued.tsx generano link ${APP_URL}/en/dashboard. Un utente francese riceve un link che lo  
 porta nella UI inglese. L'email non conosce il locale dell'utente perché il webhook non lo persiste — il locale esiste  
 nella Server Action ma non viene salvato nell'ordine.

[ALTO] sendNIFIssued() esiste ma non è mai chiamata
Il metodo è implementato in email.service.ts ma non c'è nessuna action admin che lo invochi. Quando il NIF viene emesso  
 (status → nif_issued), il cliente non riceve nessuna notifica automatica. Questo è probabilmente il gap di UX più doloroso
del prodotto.

[MEDIO] Nessun retry/log per email fallite
Se Resend è irraggiungibile, l'errore viene loggato in console e ignorato. In produzione, su Vercel, quei log spariscono.
Non c'è modo di sapere quante email di conferma sono state perse, né di ritentarle.

[MEDIO] Nessun handling per payment_intent.payment_failed
L'unico evento gestito è checkout.session.completed. Se il pagamento fallisce (carta rifiutata, fraud check), Stripe invia
payment_intent.payment_failed — attualmente ignorato silenziosamente. L'ordine rimane in pending_payment indefinitamente,
senza che il cliente sappia cosa fare.

[BASSO] Nessuna gestione dei rimborsi
charge.refunded non è gestito. Se si emette un rimborso da Stripe Dashboard, lo stato dell'ordine non si aggiorna —  
 potrebbe arrivare a nif_issued anche dopo il rimborso.

---

2. Architettura Post-Login — Flusso Onboarding e Gestione Documenti

Il flusso attuale si ferma a payment_received. Dopodiché non esiste un percorso strutturato.

Problemi strutturali

Nessun meccanismo di richiesta documenti
La transizione payment_received → documents_required è manuale (nessuna action la implementa). Non c'è UI per il cliente  
 che mostri "ora devi caricare questi documenti" né notifica proattiva. Il cliente paga e poi... aspetta in silenzio.

Document upload incompleto
getSignedUploadUrl e saveDocumentRecord esistono, ma non c'è logica che controlli:

- Se tutti i documenti richiesti sono stati caricati (passport + proof_of_address sono obbligatori, ma non c'è validazione
  di completezza)
- Se i documenti sono stati approvati o rifiutati (nessun campo status su order_documents)
- Chi ha accesso a vedere i documenti (nessun pannello admin esiste)

Nessuna comunicazione con l'avvocato/fiscal representative
Tutto il flusso dopo il pagamento è gestito manualmente fuori dall'applicazione. Non c'è:

- Un pannello admin per vedere gli ordini in coda
- Un meccanismo per che l'operatore aggiorni lo stato
- Notifiche verso l'operatore quando arriva un nuovo ordine

Nessun deadline/SLA tracking
Essential = 7 giorni, Premium = 48h. Queste promesse commerciali non hanno nessun enforcement applicativo. Nessun campo  
 deadline_at, nessun alert quando si avvicina la scadenza.

---

3. Valutazione Ibrida: Codice Custom vs n8n

Questa è la domanda più interessante. Risposta onesta: dipende da quale parte della logica.

Casi dove n8n ha senso per questo progetto

Orchestrazione delle notifiche condizionali — ogni transizione di stato genera email diverse, a soggetti diversi (cliente,
operatore), con template diversi. Oggi questo è hardcoded in email.service.ts. Con n8n puoi visualizzare e modificare  
 questo grafo senza deploy. Se domani vuoi aggiungere un SMS via Twilio quando lo stato cambia a nif_processing, sono 5  
 minuti in n8n vs modifiche a email.service.ts + payment.service.ts + testing + deploy.

Gestione scadenze (SLA monitoring) — un workflow n8n con un timer che ogni giorno controlla gli ordini con deadline_at <  
 now() e manda alert all'operatore è più manutenibile di un cron Vercel che deve essere deployato, monitorato e debuggato.

Validazione documenti con AI — un agente che controlla se il documento caricato è effettivamente un passaporto valido (e  
 non una foto di un gatto) si presta perfettamente a un workflow n8n con nodo AI, con retry automatico, log visibile, e  
 possibilità di escalation manuale se il modello non è sicuro.

Integrazione con Finanças (futuro) — anche se la sottomissione è manuale, n8n può fare da "task manager" che prepara i  
 dati formattati per l'operatore, li manda via email in un formato specifico, e traccia cosa è stato fatto.

Casi dove il codice custom rimane superiore

Logica di business core — le regole di validazione dell'ordine (orderSchema), la creazione atomica dell'ordine + audit  
 log, la verifica della firma Stripe: queste appartengono al codice. Sono testate, tipizzate, versionate, e non devono  
 essere visibili a nessun operatore.

Sicurezza e auth — proxy.ts, session management Supabase, firma webhook Stripe: mai in n8n.

Performance critica — la Server Action che crea la sessione Stripe viene chiamata su click dell'utente. Non puoi
permetterti latenza aggiuntiva da una chiamata HTTP a n8n.

Il vero trade-off per questo progetto specifico

Questo è un SaaS operativamente intensivo con un team molto piccolo (probabilmente solo tu + un operatore/avvocato). Il  
 collo di bottiglia non è la velocità di sviluppo delle feature, è la visibilità e controllabilità dei processi manuali.  
 n8n risolve esattamente questo problema.

Il rischio principale del codice custom puro: ogni nuova notifica, ogni nuovo trigger, ogni integrazione con un nuovo  
 servizio richiede un developer. Per un'operazione dove l'avvocato deve avere visibilità su cosa succede e quando, il  
 codice è opaco per definizione.

Il rischio di n8n puro: se metti logica di business critica (validazione pagamento, gestione documenti) in n8n, perdi type
safety, test automatici, e versionamento coerente con il resto del codice.

Raccomandazione: architettura ibrida con responsabilità chiare — il codice Next.js gestisce tutto ciò che è sincrono,  
 sicuro, tipizzato; n8n gestisce tutti i workflow asincroni post-pagamento che richiedono orchestrazione multi-step, delay,
e visibilità operativa.

---

Implementation Plan

Priorità 1 — Rendere il pagamento a prova di errore (Sprint attuale)

1. Aggiungere tabella processed_webhook_events(stripe_event_id PK, processed_at) e lock idempotent nel webhook handler
2. Aggiungere validazione amount_total vs PRICE_MAP[serviceTier] nel webhook
3. Persistere locale nell'ordine al momento della creazione → usarlo nelle email
4. Gestire payment_intent.payment_failed → notifica cliente + log
5. Gestire charge.refunded → transizione automatica a cancelled

Priorità 2 — Completare il flusso post-pagamento (Sprint 2)

1. Automatizzare trigger documents_required → email cliente con lista documenti necessari
2. Aggiungere campo deadline_at agli ordini (calcolato da serviceTier al momento del pagamento)
3. Implementare pannello admin minimo: lista ordini, update status, visualizza documenti
4. Collegare updateOrderStatus(nif_issued) a sendNIFIssued()

Priorità 3 — Infrastruttura n8n (Sprint 3)

1. Deployare istanza n8n (Render o Railway, ~$7/mese) con webhook endpoint esposto
2. Definire contratto API interno: Next.js chiama n8n via webhook su ogni transizione di stato
3. Migrare le notifiche condizionali multi-step da email.service.ts a n8n
4. Implementare SLA monitor come workflow schedulato n8n
5. (Opzionale) Workflow validazione AI documenti con nodo GPT-4 Vision

Priorità 4 — Reliability (Sprint 3+)

1. Integrare Sentry per error tracking (sia Next.js che n8n)
2. Aggiungere tabella email_log per tracciare ogni email inviata + status
3. Implementare retry per email fallite (cron ogni 15min che riprova status = failed)

---

Vuoi che proceda con l'implementazione della Priorità 1 (webhook a prova di errore) o preferisci prima definire nel  
 dettaglio uno dei punti specifici?

● Semplicemente incolla questo all'inizio della prossima sessione:

---

Riprendi il progetto GetNIFPortugal. Leggi i file di memoria in
C:\Users\sambu\.claude\projects\C--Users-sambu-nif-project2\memory\ prima di procedere.

Primo task: fix del signup — stesso bug del reset password (PKCE). Il fix da applicare è già documentato in
project_bugs.md. Poi procedi con Sprint 2 punto 3 (pannello admin).

---

L'agente leggerà i 4 file di memoria, avrà tutto il contesto e partirà direttamente dal fix signup senza che tu debba  
 rispiegare nulla.
