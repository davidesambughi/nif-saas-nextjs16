# SEO & GEO Compliance Gateway — Implementation Checklist

Strategy: Transform GetNIFPortugal from a 'NIF tool' into a 'Compliance Gateway'
for EU citizens relocating to Portugal. Optimized for traditional SEO + GEO (AI citation).

Last updated: 2026-03-27

---

## Phase 1 — Technical Foundation
> Do first. Unlocks everything else.

- [x] Create `public/robots.txt` — explicit allow rules for AI retrieval crawlers ✅
- [x] Update `next.config.ts` — SEO/GEO headers (X-Robots-Tag, security headers) ✅
- [x] Verify `proxy.ts` matcher — confirm `/guide/` and marketing routes are open to crawlers ✅

---

## Phase 2 — Homepage (low effort, immediate lift) ✅ COMPLETE

- [x] `Hero.tsx` — add NIF-as-prerequisite note below subheadline ✅
- [x] `FAQ.tsx` — expanded from 5 to 11 Q&As with answer-first formatting ✅
  - Add: CRUE registration question (deadline + fine)
  - Add: AIMA vs Câmara Municipal (the common mistake)
  - Add: NISS requires CRUE — cannot run in parallel
  - Add: NHR ended Jan 1 2024, IFICI replaced it
  - Add: IFICI January 15 hard deadline (permanent loss)
  - Add: What happens if you miss the CRUE deadline (€400–€1,500 fine, 12-month escalation)
- [x] `FAQ.tsx` — JSON-LD FAQPage schema updated to 11 Q&As ✅
- [x] New `ComplianceRoadmap` section — timeline component between HowItWorks and Pricing ✅
  - Step 0: NIF (We handle this ✓)
  - Step 1: CRUE — 90+30 day rule, Câmara Municipal NOT AIMA, €400–€1,500 fine
  - Step 2: NISS — requires CRUE, cannot run in parallel
  - Step 3: SNS — healthcare registration
  - Step 4: IFICI — January 15 deadline, permanent loss if missed, NHR is dead
- [x] Homepage JSON-LD — upgraded to `@graph` with `Organization`, `LegalService`, `HowTo`, `FAQPage` ✅

---

## Phase 3 — Authority Hub (primary GEO asset) ✅ COMPLETE

- [x] New route: `src/app/[locale]/(marketing)/guide/eu-citizen-portugal-checklist/page.tsx` ✅
  - Server Component only (no 'use client' — fully crawlable)
  - Answer-first structure: key facts in first 30% of text
  - Anchored sections: `#nif`, `#crue`, `#niss`, `#sns`, `#ifici`
  - Visible "Last updated" date stamp
- [x] Full `@graph` JSON-LD stack on guide page: ✅
  - `WebPage`
  - `Article` (with `datePublished` + `dateModified`)
  - `BreadcrumbList`
  - `HowTo` (5 steps: NIF → CRUE → NISS → SNS → IFICI)
  - `FAQPage` (6+ compliance Q&As)
- [x] Add guide link to Navbar and Footer ✅
- [x] Translations for guide page (en, pt, fr) ✅

---

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

---

## Content Freshness Schedule
> Citation decay starts at ~14 days without freshness signals.

- Review guide page every 2 weeks (update `dateModified` at minimum)
- Annual trigger: IFICI January 15 deadline — update year references
- Monitor if fine amounts change (€400–€1,500 currently accurate)

---

## Key GEO Facts to Preserve in All Content
> These are citation anchors — always include specific numbers.

| Fact | Value |
|---|---|
| CRUE deadline | 90 days in Portugal + 30 days to register |
| CRUE fine | €400–€1,500 |
| CRUE fine escalation | Past 12 months → pay fine to AIMA first |
| CRUE right office | Câmara Municipal or Loja do Cidadão |
| CRUE wrong office | AIMA (handles non-EU only) |
| NISS dependency | Requires CRUE — cannot run in parallel (changed late 2023) |
| NHR status | Dead — ended January 1, 2024 |
| IFICI replacement | Replaced NHR with narrower eligibility |
| IFICI deadline | January 15 of the year after establishing tax residency |
| IFICI miss penalty | Permanent — option gone forever |

---

## GEO Optimization Rules
> Apply to all content created under this strategy.

1. **Answer-first**: open every section with the answer, not context
2. **Front-load**: key facts must appear in first 30% of text
3. **Specifics**: always use exact fine amounts, exact office names, exact deadlines
4. **Schema stacking**: use `@graph` with `@id` cross-references, not isolated blocks
5. **Freshness**: visible `dateModified` on all guide content
6. **Robots**: allow all AI retrieval crawlers (ChatGPT-User, PerplexityBot, Claude-Web)
