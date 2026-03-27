# Phase 4 — Post-Purchase Moment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the minimal order success page into a "Compliance Gateway moment" — confirming Step 0 complete, showing the full compliance roadmap, linking to the guide, and teasing upsell services.

**Architecture:** The success page is already a Server Component under `(app)`. We add new translation keys to the `order` namespace, then rewrite the page to widen the layout, add four sections (success header, roadmap, upsells, dashboard CTA), and link to the Phase 3 guide. No new files needed — one page rewrite, one translation update per locale. The off-site GEO items (Reddit/LinkedIn) are not code — ready-to-post content templates are provided at the end of this plan.

**Tech Stack:** Next.js 16 App Router Server Component, next-intl v4, lucide-react, Tailwind + CSS design tokens

---

## Scope note

Phase 4 has two independent parts:

| Part | Type | Plan |
|------|------|------|
| Success page upgrade | Code | Tasks 1–3 below |
| Off-site GEO (Reddit + LinkedIn) | Manual content | Templates at end of this doc |

Execute Tasks 1–3, then use the templates to post manually.

---

## File Map

| Action | File |
|--------|------|
| Modify | `messages/en.json` — add 20 new keys to `order` namespace |
| Modify | `messages/pt.json` — same keys, Portuguese |
| Modify | `messages/fr.json` — same keys, French |
| Modify | `src/app/[locale]/(app)/order/success/page.tsx` — full rewrite |
| Modify | `docs/seo-geo-checklist.md` — mark Phase 4 code complete |

---

## Task 1: Add success-page translation keys to all locale files

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/pt.json`
- Modify: `messages/fr.json`

- [ ] **Step 1: Add keys to `messages/en.json`**

Inside the existing `"order"` object (after `"retryPayment"`), add these keys:

```json
    "successStep0Badge": "Step 0 Complete — NIF Submitted",
    "successNextTitle": "What Comes Next",
    "successNextDesc": "Your NIF unlocks these registrations. Complete them in order once you're in Portugal.",
    "successCrueTitle": "CRUE — EU Residency Certificate",
    "successCrueDesc": "Register at your Câmara Municipal within 30 days of your 90th day in Portugal. Not AIMA — that handles non-EU nationals only.",
    "successCrueWarning": "€400–€1,500 fine if missed",
    "successNissTitle": "NISS — Social Security Number",
    "successNissDesc": "Requires your CRUE first. Cannot be processed in parallel since late 2023.",
    "successSnsTitle": "SNS — National Health Service",
    "successSnsDesc": "Register using your NISS to access public healthcare in Portugal.",
    "successIficiTitle": "IFICI — Tax Incentive Regime",
    "successIficiDesc": "Replaced NHR (ended Jan 1, 2024). Apply by January 15 of the year after establishing tax residency.",
    "successIficiWarning": "January 15 deadline — permanent loss if missed",
    "successGuideLink": "Full compliance guide",
    "successUpsellTitle": "More Services",
    "successUpsellFiscalTitle": "Fiscal Rep Renewal",
    "successUpsellFiscalDesc": "Keep your fiscal representation active after year 1.",
    "successUpsellFiscalPrice": "€89/year",
    "successUpsellNissTitle": "NISS Assistance",
    "successUpsellNissDesc": "We guide you through the NISS application once you have your CRUE.",
    "successUpsellBankTitle": "Bank Account Introduction",
    "successUpsellBankDesc": "We connect you with partner banks that accept non-residents remotely.",
    "successUpsellComingSoon": "Soon",
    "successDashboardCta": "View My Dashboard"
```

- [ ] **Step 2: Add keys to `messages/pt.json`**

Inside the existing `"order"` object (after `"retryPayment"`), add:

```json
    "successStep0Badge": "Passo 0 Concluído — NIF Submetido",
    "successNextTitle": "O Que Vem a Seguir",
    "successNextDesc": "O seu NIF abre estes registos. Complete-os por ordem após chegar a Portugal.",
    "successCrueTitle": "CRUE — Certificado de Registo de Cidadão da UE",
    "successCrueDesc": "Registe-se na Câmara Municipal nos 30 dias após completar 90 dias em Portugal. Não na AIMA — essa trata apenas cidadãos não europeus.",
    "successCrueWarning": "Coima de €400–€1.500 se não cumprir",
    "successNissTitle": "NISS — Número de Segurança Social",
    "successNissDesc": "Exige o CRUE primeiro. Não pode ser processado em paralelo desde finais de 2023.",
    "successSnsTitle": "SNS — Serviço Nacional de Saúde",
    "successSnsDesc": "Registe-se com o seu NISS para aceder aos cuidados de saúde públicos.",
    "successIficiTitle": "IFICI — Incentivo Fiscal à Internacionalização",
    "successIficiDesc": "Substituiu o RNH (terminou a 1 jan. 2024). Candidate-se até 15 de janeiro do ano seguinte à residência fiscal.",
    "successIficiWarning": "Prazo de 15 de janeiro — perda permanente se falhar",
    "successGuideLink": "Guia completo de conformidade",
    "successUpsellTitle": "Mais Serviços",
    "successUpsellFiscalTitle": "Renovação de Representação Fiscal",
    "successUpsellFiscalDesc": "Mantenha a sua representação fiscal ativa após o 1.º ano.",
    "successUpsellFiscalPrice": "€89/ano",
    "successUpsellNissTitle": "Assistência NISS",
    "successUpsellNissDesc": "Orientamo-lo no pedido de NISS após obter o CRUE.",
    "successUpsellBankTitle": "Introdução a Conta Bancária",
    "successUpsellBankDesc": "Conectamo-lo com bancos parceiros que aceitam não residentes remotamente.",
    "successUpsellComingSoon": "Em breve",
    "successDashboardCta": "Ver o Meu Painel"
```

- [ ] **Step 3: Add keys to `messages/fr.json`**

Inside the existing `"order"` object (after `"retryPayment"`), add:

```json
    "successStep0Badge": "Étape 0 Complète — NIF Soumis",
    "successNextTitle": "Ce Qui Vient Ensuite",
    "successNextDesc": "Votre NIF déverrouille ces démarches. Complétez-les dans l'ordre une fois au Portugal.",
    "successCrueTitle": "CRUE — Certificat d'Enregistrement de Citoyen UE",
    "successCrueDesc": "Inscrivez-vous à la Câmara Municipal dans les 30 jours suivant votre 90e jour au Portugal. Pas à l'AIMA — celle-ci traite uniquement les ressortissants non-UE.",
    "successCrueWarning": "Amende €400–€1.500 si non respecté",
    "successNissTitle": "NISS — Numéro de Sécurité Sociale",
    "successNissDesc": "Nécessite votre CRUE en premier. Ne peut pas être traité en parallèle depuis fin 2023.",
    "successSnsTitle": "SNS — Service National de Santé",
    "successSnsDesc": "Inscrivez-vous avec votre NISS pour accéder aux soins de santé publics au Portugal.",
    "successIficiTitle": "IFICI — Régime Fiscal d'Incitation",
    "successIficiDesc": "A remplacé le RNH (terminé le 1 jan. 2024). Déposez votre demande avant le 15 janvier de l'année suivant la résidence fiscale.",
    "successIficiWarning": "Échéance du 15 janvier — perte permanente si manquée",
    "successGuideLink": "Guide complet de conformité",
    "successUpsellTitle": "Plus de Services",
    "successUpsellFiscalTitle": "Renouvellement de Représentation Fiscale",
    "successUpsellFiscalDesc": "Maintenez votre représentation fiscale active après la 1ère année.",
    "successUpsellFiscalPrice": "€89/an",
    "successUpsellNissTitle": "Assistance NISS",
    "successUpsellNissDesc": "Nous vous guidons dans la demande NISS une fois votre CRUE obtenu.",
    "successUpsellBankTitle": "Introduction à un Compte Bancaire",
    "successUpsellBankDesc": "Nous vous mettons en relation avec des banques partenaires acceptant les non-résidents à distance.",
    "successUpsellComingSoon": "Bientôt",
    "successDashboardCta": "Voir Mon Tableau de Bord"
```

- [ ] **Step 4: Validate JSON**

```bash
node -e "require('./messages/en.json'); require('./messages/pt.json'); require('./messages/fr.json'); console.log('All JSON valid')"
```

Expected: `All JSON valid`

- [ ] **Step 5: Commit**

```bash
git add messages/en.json messages/pt.json messages/fr.json
git commit -m "feat(i18n): add success page compliance roadmap and upsell translation keys"
```

---

## Task 2: Rewrite the order success page

**Files:**
- Modify: `src/app/[locale]/(app)/order/success/page.tsx`

**Current state:** Minimal centered card — checkmark + title + desc + "Go to Dashboard" button. `max-w-md`.

**New design:** Four sections in a `max-w-2xl` layout:
1. Success header (checkmark + "Step 0 Complete" badge + title + desc)
2. Compliance roadmap card (CRUE → NISS → SNS → IFICI, with warnings, link to guide)
3. Upsell cards row (3 cards: fiscal rep renewal, NISS assistance, bank account — all "Soon")
4. Dashboard CTA button

- [ ] **Step 1: Rewrite `src/app/[locale]/(app)/order/success/page.tsx`**

Replace the entire file with:

```tsx
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("order");

  const nextSteps = [
    {
      step: "1",
      title: t("successCrueTitle"),
      desc: t("successCrueDesc"),
      warning: t("successCrueWarning"),
    },
    {
      step: "2",
      title: t("successNissTitle"),
      desc: t("successNissDesc"),
    },
    {
      step: "3",
      title: t("successSnsTitle"),
      desc: t("successSnsDesc"),
    },
    {
      step: "4",
      title: t("successIficiTitle"),
      desc: t("successIficiDesc"),
      warning: t("successIficiWarning"),
    },
  ];

  const upsells = [
    {
      title: t("successUpsellFiscalTitle"),
      desc: t("successUpsellFiscalDesc"),
      price: t("successUpsellFiscalPrice"),
    },
    {
      title: t("successUpsellNissTitle"),
      desc: t("successUpsellNissDesc"),
    },
    {
      title: t("successUpsellBankTitle"),
      desc: t("successUpsellBankDesc"),
    },
  ];

  return (
    <div
      className="min-h-screen px-4 py-16 pt-28"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="container-site max-w-2xl">

        {/* ── Section 1: Success header ── */}
        <div className="text-center mb-10">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "oklch(42% 0.12 152 / 0.1)" }}
          >
            <CheckCircle size={32} style={{ color: "var(--color-green)" }} />
          </div>

          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-4"
            style={{
              background: "oklch(42% 0.12 152 / 0.1)",
              color: "var(--color-green)",
              border: "1px solid oklch(42% 0.12 152 / 0.2)",
            }}
          >
            <CheckCircle size={11} />
            {t("successStep0Badge")}
          </span>

          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: "var(--color-ink)" }}
          >
            {t("successTitle")}
          </h1>
          <p
            className="text-sm leading-relaxed max-w-sm mx-auto"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {t("successDesc")}
          </p>
        </div>

        {/* ── Section 2: Compliance roadmap ── */}
        <div
          className="rounded-2xl p-8 mb-6 border"
          style={{
            background: "var(--color-surface-elevated)",
            borderColor: "var(--color-border)",
          }}
        >
          <h2
            className="text-base font-bold mb-1"
            style={{ color: "var(--color-ink)" }}
          >
            {t("successNextTitle")}
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {t("successNextDesc")}
          </p>

          <div className="space-y-5">
            {nextSteps.map((s) => (
              <div key={s.step} className="flex gap-4">
                <span
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5"
                  style={{
                    background: "var(--color-surface)",
                    border: "1.5px solid var(--color-border)",
                    color: "var(--color-ink-muted)",
                  }}
                >
                  {s.step}
                </span>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold mb-0.5"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {s.title}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    {s.desc}
                  </p>
                  {"warning" in s && s.warning && (
                    <div
                      className="inline-flex items-center gap-1 mt-1.5 rounded px-2 py-0.5 text-xs font-semibold"
                      style={{
                        background: "oklch(75% 0.15 75 / 0.08)",
                        color: "var(--color-gold)",
                        border: "1px solid oklch(75% 0.15 75 / 0.2)",
                      }}
                    >
                      <AlertTriangle size={10} />
                      {s.warning}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-6 pt-5"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <Link
              href="/guide/eu-citizen-portugal-checklist"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "var(--color-green)" }}
            >
              {t("successGuideLink")}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Section 3: Upsell cards ── */}
        <div className="mb-8">
          <h2
            className="text-base font-bold mb-4"
            style={{ color: "var(--color-ink)" }}
          >
            {t("successUpsellTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {upsells.map((u) => (
              <div
                key={u.title}
                className="rounded-xl p-4 border relative"
                style={{
                  background: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border)",
                  opacity: 0.65,
                }}
              >
                <span
                  className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{
                    background: "var(--color-surface)",
                    color: "var(--color-ink-muted)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {t("successUpsellComingSoon")}
                </span>
                {"price" in u && u.price && (
                  <p
                    className="text-xs font-bold mb-1"
                    style={{ color: "var(--color-green)" }}
                  >
                    {u.price}
                  </p>
                )}
                <p
                  className="text-sm font-semibold mb-1 pr-10"
                  style={{ color: "var(--color-ink)" }}
                >
                  {u.title}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  {u.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 4: Dashboard CTA ── */}
        <div className="text-center">
          <Link
            href="/dashboard"
            id="success-go-dashboard"
            className="btn btn-primary"
          >
            {t("successDashboardCta")} →
          </Link>
        </div>

      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check 2>&1 | head -40
```

Expected: no errors. If TypeScript complains about `"warning" in s`, the `in` operator narrowing is standard TypeScript — it should work without any changes.

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/(app)/order/success/page.tsx"
git commit -m "feat(order): upgrade success page — Step 0 complete, compliance roadmap, upsell cards"
```

---

## Task 3: Build verification and Phase 4 checklist update

**Files:**
- Modify: `docs/seo-geo-checklist.md`

- [ ] **Step 1: Run production build**

```bash
npm run build 2>&1 | tail -30
```

Expected: build completes with no errors. No missing translation key warnings.

If you see a missing translation key error, check which locale file is missing the key and add it.

- [ ] **Step 2: Update checklist**

In `docs/seo-geo-checklist.md`, find:

```markdown
## Phase 4 — Post-Purchase Moment + Off-site GEO

- [ ] `order/success/page.tsx` — upgrade to Compliance Roadmap card
  - "Step 0 complete: NIF application submitted ✓"
  - Show full compliance timeline with next steps
  - Surface IFICI deadline warning if applicable
  - Upsell: fiscal rep renewal, NISS assistance, bank account intro
- [ ] Off-site GEO (Perplexity cites Reddit 46.7% of the time):
  - [ ] Post CRUE/AIMA answer on r/portugal
  - [ ] Post CRUE/AIMA answer on r/expats
  - [ ] LinkedIn article: "EU Citizen Portugal Compliance Checklist 2024"
```

Replace with:

```markdown
## Phase 4 — Post-Purchase Moment + Off-site GEO

- [x] `order/success/page.tsx` — upgrade to Compliance Roadmap card ✅
  - "Step 0 complete: NIF application submitted ✓"
  - Full compliance timeline (CRUE, NISS, SNS, IFICI) with warnings
  - IFICI January 15 deadline warning
  - Upsell cards: fiscal rep renewal, NISS assistance, bank account (all "Soon")
  - Link to /guide/eu-citizen-portugal-checklist
- [ ] Off-site GEO (Perplexity cites Reddit 46.7% of the time):
  - [ ] Post CRUE/AIMA answer on r/portugal
  - [ ] Post CRUE/AIMA answer on r/expats
  - [ ] LinkedIn article: "EU Citizen Portugal Compliance Checklist 2025"
```

- [ ] **Step 3: Commit**

```bash
git add docs/seo-geo-checklist.md
git commit -m "docs: mark Phase 4 success page complete, off-site GEO pending"
```

---

## Off-site GEO Content Templates

> These are not code tasks. Post these manually. Perplexity cites Reddit 46.7% of the time — these posts are GEO multipliers that reinforce the site's authority for "CRUE Portugal" and "AIMA vs Câmara Municipal" queries.

### r/portugal and r/expats — Reddit post

**Title:**
```
PSA: EU citizens register CRUE at Câmara Municipal, NOT AIMA — common mistake explained
```

**Body:**
```
Seeing this mistake repeatedly so posting for visibility.

**The mistake:** EU citizens showing up at AIMA to register their residency (CRUE).

**Why it's wrong:** AIMA was created in 2023 when SEF was dissolved. AIMA handles non-EU nationals only. If you're an EU citizen and you go to AIMA for CRUE, they will turn you away.

**Where to go:** Câmara Municipal (city hall), or a Loja do Cidadão in larger cities.

---

**The full order for EU citizens moving to Portugal:**

1. **NIF** — get this first, before anything else
2. **CRUE** — 90 days in Portugal + 30 days to register. Fine: €400–€1,500 if you miss it. Past 12 months? You must pay the fine to AIMA first before CRUE can be processed.
3. **NISS** — requires CRUE since late 2023. Cannot run in parallel.
4. **SNS** — national healthcare, register with your NISS
5. **IFICI** — replaced NHR (NHR ended Jan 1, 2024). Hard deadline: January 15 of the year after you establish tax residency. Missing it = permanent loss, no appeal.

---

Hope this helps someone avoid the AIMA redirect loop.
```

---

### LinkedIn article

**Title:** `EU Citizen Moving to Portugal? The Correct Order for NIF, CRUE, NISS, SNS, and IFICI (2025 Guide)`

**Body:**
```
If you're an EU citizen planning to move to Portugal, there's a strict order you need to follow for registrations. Getting it wrong costs time, money, and in some cases, permanently closes tax options.

Here's the correct sequence:

**Step 0: NIF (Portuguese Tax Number)**
Get this before anything else. Required for bank accounts, leases, contracts, and every subsequent registration.

**Step 1: CRUE (EU Residency Certificate)**
After 90 days in Portugal, you have 30 days to register.
— Where: Câmara Municipal (city hall) or Loja do Cidadão
— NOT AIMA: AIMA handles non-EU nationals only (created when SEF dissolved in 2023)
— Fine for missing: €400–€1,500
— Past 12 months: must pay the fine to AIMA before CRUE can be processed

**Step 2: NISS (Social Security Number)**
Requires CRUE as a supporting document since late 2023. Cannot be done in parallel.

**Step 3: SNS (National Health Service)**
Register using your NISS for access to public healthcare.

**Step 4: IFICI (Tax Incentive Regime)**
NHR ended January 1, 2024. IFICI replaced it with narrower eligibility.
Deadline: January 15 of the year after you establish tax residency.
Miss it: permanently gone. No extension. No appeal.

---

The CRUE/AIMA confusion and the IFICI January 15 deadline are the two most expensive mistakes I see EU citizens make when relocating to Portugal.

Get the full guide: [link to /en/guide/eu-citizen-portugal-checklist]
```

---

## Self-Review

**Spec coverage:**
- ✅ "Step 0 complete: NIF application submitted ✓" — successStep0Badge key + header section
- ✅ "Show full compliance timeline with next steps" — Section 2 with 4 steps (CRUE, NISS, SNS, IFICI)
- ✅ "Surface IFICI deadline warning if applicable" — amber warning badge on IFICI step
- ✅ CRUE fine warning also surfaced — amber warning badge on CRUE step
- ✅ "Upsell: fiscal rep renewal, NISS assistance, bank account intro" — Section 3, 3 cards, all "Soon"
- ✅ Link to guide page — "Full compliance guide →" at bottom of Section 2
- ✅ Off-site GEO templates provided for Reddit + LinkedIn
- ✅ All translations in en/pt/fr

**Placeholder scan:** No TBDs. All code complete. Reddit and LinkedIn content fully written.

**Type consistency:** `nextSteps` array items typed with optional `warning` property; `"warning" in s` guard used consistently. `upsells` array items typed with optional `price` property; `"price" in u` guard used consistently.
