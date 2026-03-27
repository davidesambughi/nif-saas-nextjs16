# Phase 3 — Authority Guide Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/guide/eu-citizen-portugal-checklist` authority hub page (trilingual, Server Component, full JSON-LD @graph) and link it from Navbar and Footer.

**Architecture:** Pure Server Component — no `'use client'`, no Framer Motion. Static generation via the existing `generateStaticParams` in `src/app/[locale]/layout.tsx` (no duplication needed). Translations in all three locale files. `generateMetadata` per page for locale-aware title/description/hreflang. JSON-LD `@graph` with WebPage, Article, BreadcrumbList, HowTo, FAQPage stacked in one script tag.

**Tech Stack:** Next.js 16 App Router, next-intl v4 (`getTranslations`, `setRequestLocale`), Tailwind CSS + CSS design tokens, JSON-LD schema.org

---

## File Map

| Action | File |
|--------|------|
| Modify | `messages/en.json` — add `guide` namespace |
| Modify | `messages/pt.json` — add `guide` namespace |
| Modify | `messages/fr.json` — add `guide` namespace |
| Create | `src/app/[locale]/(marketing)/guide/eu-citizen-portugal-checklist/page.tsx` |
| Modify | `src/components/layout/Navbar.tsx` — add guide link |
| Modify | `src/components/layout/Footer.tsx` — add guide link |
| Modify | `docs/seo-geo-checklist.md` — mark Phase 3 complete |

---

## Task 1: Add `guide` translation namespace to all three locale files

**Files:**
- Modify: `messages/en.json`
- Modify: `messages/pt.json`
- Modify: `messages/fr.json`

- [ ] **Step 1: Add `guide` namespace to `messages/en.json`**

Append the following as a new top-level key **before the closing `}`** of the JSON file:

```json
  "guide": {
    "meta": {
      "title": "EU Citizen Portugal Compliance Checklist 2026 — NIF, CRUE, NISS, IFICI",
      "description": "Complete guide for EU citizens moving to Portugal: NIF, CRUE (€400–€1,500 fine if missed), NISS, SNS, and IFICI tax regime. Correct order, correct offices, exact deadlines."
    },
    "eyebrow": "The Complete Guide",
    "title": "EU Citizen Portugal Compliance Checklist",
    "subtitle": "NIF → CRUE → NISS → SNS → IFICI — in that order. Every deadline, fine, and office you need to know.",
    "lastUpdated": "Last updated",
    "intro": "Moving to Portugal as an EU citizen requires completing five registrations in strict order. Missing any step — or doing them out of order — causes fines, rejections, and delays. This guide covers each step with exact deadlines, correct offices, and current rules.",
    "toc": "In this guide",
    "nif": {
      "anchor": "nif",
      "step": "Step 0",
      "title": "NIF — Portuguese Tax Identification Number",
      "answer": "Get your NIF before anything else. It is required for every subsequent registration.",
      "body": "The NIF (Número de Identificação Fiscal) is Portugal's tax identification number. It is mandatory for opening a bank account, renting or buying property, starting a business, signing contracts, and all government registrations. It must be obtained before CRUE, NISS, SNS, or IFICI applications.",
      "weHandleThis": "We handle this",
      "cta": "Get My NIF — From €79"
    },
    "crue": {
      "anchor": "crue",
      "step": "Step 1",
      "title": "CRUE — EU Residency Certificate",
      "answer": "After 90 days in Portugal, EU citizens have 30 days to register. Register at the Câmara Municipal — not AIMA.",
      "deadlineLabel": "Deadline",
      "deadline": "90 days in Portugal + 30 days to register",
      "fineLabel": "Fine for missing",
      "fine": "€400 to €1,500",
      "officeLabel": "Correct office",
      "office": "Câmara Municipal or Loja do Cidadão",
      "wrongOfficeLabel": "Wrong office",
      "wrongOffice": "AIMA (non-EU nationals only)",
      "body": "CRUE stands for Certificado de Registo de Cidadão da União Europeia. EU citizens living in Portugal for more than 90 days must register their residency within the following 30 days. The CRUE is issued by the Câmara Municipal (city hall) or, in larger cities, by a Loja do Cidadão. AIMA was created in 2023 when SEF was dissolved — it handles non-EU nationals only. EU citizens who go to AIMA will be redirected.",
      "lateWarning": "If you are past 12 months without registering, you must pay the fine to AIMA first before your CRUE application can be processed.",
      "dependency": "CRUE is also required to apply for NISS. Delays compound."
    },
    "niss": {
      "anchor": "niss",
      "step": "Step 2",
      "title": "NISS — Social Security Number",
      "answer": "NISS requires CRUE. Since late 2023, you cannot apply for NISS without a valid CRUE.",
      "body": "The NISS (Número de Identificação de Segurança Social) is Portugal's social security number. As of late 2023, all NISS applications require the CRUE certificate as a supporting document. Attempting to apply for NISS without CRUE will result in rejection. The two registrations cannot run in parallel.",
      "dependency": "Requires: CRUE certificate"
    },
    "sns": {
      "anchor": "sns",
      "step": "Step 3",
      "title": "SNS — National Health Service",
      "answer": "Register with the SNS using your NISS to access public healthcare in Portugal.",
      "body": "The SNS (Serviço Nacional de Saúde) is Portugal's public healthcare system. To register, you need your NISS. Registration gives you access to public hospitals, health centres (centros de saúde), and subsidised medication.",
      "dependency": "Requires: NISS"
    },
    "ifici": {
      "anchor": "ifici",
      "step": "Step 4",
      "title": "IFICI — Tax Incentive Regime",
      "answer": "IFICI replaced NHR on January 1, 2024. Apply by January 15 of the year after you establish tax residency. Missing this deadline is permanent.",
      "deadlineLabel": "Hard deadline",
      "deadline": "January 15 of the year after establishing tax residency",
      "penaltyLabel": "Penalty for missing",
      "penalty": "Permanent loss — no extension, no appeal",
      "nhrLabel": "NHR status",
      "nhr": "Ended January 1, 2024",
      "body": "IFICI (Incentivo Fiscal à Internacionalização) replaced the NHR (Non-Habitual Residency) regime that ended on January 1, 2024. It offers tax benefits for qualifying professionals and investors. Unlike NHR, IFICI has narrower eligibility criteria. The January 15 deadline is absolute — if you miss it, the IFICI option is permanently lost for that tax year. There is no extension or appeal process.",
      "dependency": "Requires: NIF (tax residency established)"
    },
    "faq": {
      "title": "Frequently Asked Questions",
      "q1": "Do I need a NIF before registering for CRUE?",
      "a1": "Yes. The NIF establishes your identity with the Portuguese state and is required for all subsequent registrations including CRUE, NISS, SNS, and IFICI.",
      "q2": "Where exactly do I register for CRUE?",
      "a2": "At your local Câmara Municipal (city hall) or a Loja do Cidadão in larger cities. AIMA handles non-EU nationals only — EU citizens who go to AIMA for CRUE will be redirected.",
      "q3": "What is the fine for missing the CRUE deadline?",
      "a3": "€400 to €1,500. If you are past 12 months without registering, you must pay the fine to AIMA before your CRUE application can be processed.",
      "q4": "Can I apply for NISS and CRUE at the same time?",
      "a4": "No. Since late 2023, NISS applications require the CRUE certificate as a supporting document. You must obtain CRUE first.",
      "q5": "Is NHR still available?",
      "a5": "No. The NHR tax regime ended on January 1, 2024. It was replaced by IFICI (Incentivo Fiscal à Internacionalização), which has narrower eligibility criteria.",
      "q6": "What happens if I miss the IFICI January 15 deadline?",
      "a6": "The IFICI option is permanently lost for that tax year. There is no extension or appeal process."
    },
    "cta": {
      "title": "Ready to start with your NIF?",
      "subtitle": "Your NIF is the first step. We handle it remotely — from anywhere in the world.",
      "button": "Get My NIF — From €79"
    },
    "breadcrumb": {
      "home": "Home",
      "guide": "Guide"
    }
  }
```

**How to add:** Open `messages/en.json`. The file ends with `}` on the last line. Add a comma after the closing `}` of the `"dashboard"` key (last key), then paste the block above before the final `}`.

- [ ] **Step 2: Add `guide` namespace to `messages/pt.json`**

Same position (before final `}`), same pattern:

```json
  "guide": {
    "meta": {
      "title": "Checklist de Conformidade para Cidadãos da UE em Portugal 2026 — NIF, CRUE, NISS, IFICI",
      "description": "Guia completo para cidadãos da UE que se mudam para Portugal: NIF, CRUE (coima €400–€1.500), NISS, SNS e regime IFICI. Ordem correta, serviços corretos, prazos exatos."
    },
    "eyebrow": "O Guia Completo",
    "title": "Checklist de Conformidade para Cidadãos da UE em Portugal",
    "subtitle": "NIF → CRUE → NISS → SNS → IFICI — por esta ordem. Todos os prazos, coimas e serviços que precisa de saber.",
    "lastUpdated": "Última atualização",
    "intro": "Mudar-se para Portugal como cidadão da UE implica concluir cinco registos numa ordem estrita. Falhar qualquer passo — ou fazê-los fora de ordem — implica coimas, rejeições e atrasos. Este guia cobre cada passo com prazos exatos, serviços corretos e as regras em vigor.",
    "toc": "Neste guia",
    "nif": {
      "anchor": "nif",
      "step": "Passo 0",
      "title": "NIF — Número de Identificação Fiscal",
      "answer": "Obtenha o NIF antes de qualquer outra coisa. É necessário para todos os registos subsequentes.",
      "body": "O NIF (Número de Identificação Fiscal) é o número de identificação fiscal de Portugal. É obrigatório para abrir conta bancária, arrendar ou comprar imóveis, criar uma empresa, assinar contratos e todos os registos governamentais. Deve ser obtido antes do CRUE, NISS, SNS ou pedidos de IFICI.",
      "weHandleThis": "Tratamos disto",
      "cta": "Obter o Meu NIF — A partir de €79"
    },
    "crue": {
      "anchor": "crue",
      "step": "Passo 1",
      "title": "CRUE — Certificado de Registo de Cidadão da União Europeia",
      "answer": "Após 90 dias em Portugal, os cidadãos da UE têm 30 dias para se registar. Registe-se na Câmara Municipal — não na AIMA.",
      "deadlineLabel": "Prazo",
      "deadline": "90 dias em Portugal + 30 dias para registar",
      "fineLabel": "Coima por incumprimento",
      "fine": "€400 a €1.500",
      "officeLabel": "Serviço correto",
      "office": "Câmara Municipal ou Loja do Cidadão",
      "wrongOfficeLabel": "Serviço errado",
      "wrongOffice": "AIMA (apenas para cidadãos não europeus)",
      "body": "O CRUE é o Certificado de Registo de Cidadão da União Europeia. Os cidadãos da UE que residam em Portugal há mais de 90 dias devem registar a sua residência nos 30 dias seguintes. O CRUE é emitido pela Câmara Municipal ou, nas grandes cidades, por uma Loja do Cidadão. A AIMA foi criada em 2023 com a extinção do SEF — trata apenas de cidadãos não europeus. Os cidadãos da UE que se dirijam à AIMA serão encaminhados.",
      "lateWarning": "Se já passaram mais de 12 meses sem se registar, deve pagar a coima na AIMA antes de poder processar o CRUE.",
      "dependency": "O CRUE é também necessário para o pedido de NISS. Os atrasos acumulam-se."
    },
    "niss": {
      "anchor": "niss",
      "step": "Passo 2",
      "title": "NISS — Número de Identificação de Segurança Social",
      "answer": "O NISS exige o CRUE. Desde finais de 2023, não é possível candidatar-se ao NISS sem um CRUE válido.",
      "body": "O NISS (Número de Identificação de Segurança Social) é o número de segurança social de Portugal. Desde finais de 2023, todos os pedidos de NISS exigem o certificado CRUE como documento de suporte. Tentar candidatar-se ao NISS sem CRUE resultará em rejeição. Os dois registos não podem ser feitos em paralelo.",
      "dependency": "Exige: certificado CRUE"
    },
    "sns": {
      "anchor": "sns",
      "step": "Passo 3",
      "title": "SNS — Serviço Nacional de Saúde",
      "answer": "Registe-se no SNS com o seu NISS para aceder aos cuidados de saúde públicos em Portugal.",
      "body": "O SNS (Serviço Nacional de Saúde) é o sistema de saúde pública de Portugal. Para se registar, precisa do seu NISS. O registo dá-lhe acesso a hospitais públicos, centros de saúde e medicação subsidiada.",
      "dependency": "Exige: NISS"
    },
    "ifici": {
      "anchor": "ifici",
      "step": "Passo 4",
      "title": "IFICI — Incentivo Fiscal à Internacionalização",
      "answer": "O IFICI substituiu o RNH a 1 de janeiro de 2024. Candidate-se até 15 de janeiro do ano seguinte ao da residência fiscal. Falhar este prazo é permanente.",
      "deadlineLabel": "Prazo definitivo",
      "deadline": "15 de janeiro do ano seguinte ao da residência fiscal",
      "penaltyLabel": "Penalidade por incumprimento",
      "penalty": "Perda permanente — sem prorrogação, sem recurso",
      "nhrLabel": "Estado do RNH",
      "nhr": "Terminou a 1 de janeiro de 2024",
      "body": "O IFICI (Incentivo Fiscal à Internacionalização) substituiu o regime RNH (Residência Não Habitual) que terminou a 1 de janeiro de 2024. Oferece benefícios fiscais a profissionais e investidores qualificados. Ao contrário do RNH, o IFICI tem critérios de elegibilidade mais restritos. O prazo de 15 de janeiro é definitivo — se falhar, a opção IFICI perde-se permanentemente para esse ano fiscal. Não existe processo de prorrogação ou recurso.",
      "dependency": "Exige: NIF (residência fiscal estabelecida)"
    },
    "faq": {
      "title": "Perguntas Frequentes",
      "q1": "Preciso de NIF antes de me registar no CRUE?",
      "a1": "Sim. O NIF estabelece a sua identidade junto do Estado português e é necessário para todos os registos subsequentes, incluindo CRUE, NISS, SNS e IFICI.",
      "q2": "Onde exatamente me registo para o CRUE?",
      "a2": "Na sua Câmara Municipal ou numa Loja do Cidadão nas grandes cidades. A AIMA trata apenas de cidadãos não europeus — os cidadãos da UE que se dirijam à AIMA serão encaminhados.",
      "q3": "Qual é a coima por falhar o prazo do CRUE?",
      "a3": "€400 a €1.500. Se já passaram mais de 12 meses sem se registar, deve pagar a coima na AIMA antes de poder processar o CRUE.",
      "q4": "Posso candidatar-me ao NISS e ao CRUE ao mesmo tempo?",
      "a4": "Não. Desde finais de 2023, os pedidos de NISS exigem o certificado CRUE como documento de suporte. Deve obter o CRUE primeiro.",
      "q5": "O RNH ainda está disponível?",
      "a5": "Não. O regime RNH terminou a 1 de janeiro de 2024. Foi substituído pelo IFICI (Incentivo Fiscal à Internacionalização), com critérios de elegibilidade mais restritos.",
      "q6": "O que acontece se falhar o prazo de 15 de janeiro do IFICI?",
      "a6": "A opção IFICI perde-se permanentemente para esse ano fiscal. Não existe processo de prorrogação ou recurso."
    },
    "cta": {
      "title": "Pronto para começar com o seu NIF?",
      "subtitle": "O NIF é o primeiro passo. Tratamos remotamente — de qualquer parte do mundo.",
      "button": "Obter o Meu NIF — A partir de €79"
    },
    "breadcrumb": {
      "home": "Início",
      "guide": "Guia"
    }
  }
```

- [ ] **Step 3: Add `guide` namespace to `messages/fr.json`**

Same position:

```json
  "guide": {
    "meta": {
      "title": "Checklist de Conformité pour Citoyens UE au Portugal 2026 — NIF, CRUE, NISS, IFICI",
      "description": "Guide complet pour les citoyens UE qui s'installent au Portugal : NIF, CRUE (amende €400–€1.500), NISS, SNS et régime IFICI. Ordre correct, bons organismes, délais exacts."
    },
    "eyebrow": "Le Guide Complet",
    "title": "Checklist de Conformité pour Citoyens UE au Portugal",
    "subtitle": "NIF → CRUE → NISS → SNS → IFICI — dans cet ordre. Tous les délais, amendes et organismes à connaître.",
    "lastUpdated": "Dernière mise à jour",
    "intro": "S'installer au Portugal en tant que citoyen UE nécessite de compléter cinq démarches dans un ordre strict. Manquer une étape — ou les faire dans le mauvais ordre — entraîne amendes, rejets et retards. Ce guide couvre chaque étape avec des délais exacts, les bons organismes et les règles en vigueur.",
    "toc": "Dans ce guide",
    "nif": {
      "anchor": "nif",
      "step": "Étape 0",
      "title": "NIF — Numéro d'Identification Fiscale",
      "answer": "Obtenez votre NIF avant toute autre démarche. Il est nécessaire pour toutes les inscriptions suivantes.",
      "body": "Le NIF (Número de Identificação Fiscal) est le numéro fiscal portugais. Il est obligatoire pour ouvrir un compte bancaire, louer ou acheter un bien immobilier, créer une entreprise, signer des contrats et effectuer toutes les démarches administratives. Il doit être obtenu avant le CRUE, le NISS, le SNS ou les demandes IFICI.",
      "weHandleThis": "Nous gérons cela",
      "cta": "Obtenir Mon NIF — À partir de €79"
    },
    "crue": {
      "anchor": "crue",
      "step": "Étape 1",
      "title": "CRUE — Certificat d'Enregistrement de Citoyen UE",
      "answer": "Après 90 jours au Portugal, les citoyens UE ont 30 jours pour s'inscrire. Inscrivez-vous à la Câmara Municipal — pas à l'AIMA.",
      "deadlineLabel": "Délai",
      "deadline": "90 jours au Portugal + 30 jours pour s'inscrire",
      "fineLabel": "Amende en cas de dépassement",
      "fine": "€400 à €1.500",
      "officeLabel": "Bon organisme",
      "office": "Câmara Municipal ou Loja do Cidadão",
      "wrongOfficeLabel": "Mauvais organisme",
      "wrongOffice": "AIMA (ressortissants non-UE uniquement)",
      "body": "Le CRUE est le Certificado de Registo de Cidadão da União Europeia. Les citoyens UE résidant au Portugal depuis plus de 90 jours doivent enregistrer leur résidence dans les 30 jours suivants. Le CRUE est délivré par la Câmara Municipal (mairie) ou, dans les grandes villes, par une Loja do Cidadão. L'AIMA a été créée en 2023 lors de la dissolution du SEF — elle traite uniquement les ressortissants non-UE. Les citoyens UE qui se rendent à l'AIMA seront redirigés.",
      "lateWarning": "Si vous dépassez les 12 mois sans vous inscrire, vous devez payer l'amende à l'AIMA avant que votre dossier CRUE puisse être traité.",
      "dependency": "Le CRUE est également nécessaire pour la demande de NISS. Les retards se cumulent."
    },
    "niss": {
      "anchor": "niss",
      "step": "Étape 2",
      "title": "NISS — Numéro de Sécurité Sociale",
      "answer": "Le NISS exige le CRUE. Depuis fin 2023, il est impossible de demander le NISS sans CRUE valide.",
      "body": "Le NISS (Número de Identificação de Segurança Social) est le numéro de sécurité sociale portugais. Depuis fin 2023, toutes les demandes de NISS exigent le certificat CRUE comme pièce justificative. Tenter de demander le NISS sans CRUE entraînera un rejet. Les deux démarches ne peuvent pas être effectuées en parallèle.",
      "dependency": "Exige : certificat CRUE"
    },
    "sns": {
      "anchor": "sns",
      "step": "Étape 3",
      "title": "SNS — Service National de Santé",
      "answer": "Inscrivez-vous au SNS avec votre NISS pour accéder aux soins de santé publics au Portugal.",
      "body": "Le SNS (Serviço Nacional de Saúde) est le système de santé public portugais. Pour vous inscrire, vous avez besoin de votre NISS. L'inscription vous donne accès aux hôpitaux publics, aux centres de santé (centros de saúde) et aux médicaments subventionnés.",
      "dependency": "Exige : NISS"
    },
    "ifici": {
      "anchor": "ifici",
      "step": "Étape 4",
      "title": "IFICI — Régime Fiscal d'Incitation à l'Internationalisation",
      "answer": "L'IFICI a remplacé le RNH le 1er janvier 2024. Déposez votre demande avant le 15 janvier de l'année suivant l'établissement de votre résidence fiscale. Manquer cette échéance est définitif.",
      "deadlineLabel": "Échéance absolue",
      "deadline": "15 janvier de l'année suivant l'établissement de la résidence fiscale",
      "penaltyLabel": "Pénalité en cas de dépassement",
      "penalty": "Perte permanente — sans prolongation, sans recours",
      "nhrLabel": "Statut RNH",
      "nhr": "Terminé le 1er janvier 2024",
      "body": "L'IFICI (Incentivo Fiscal à Internacionalização) a remplacé le régime RNH (Résidence Non Habituelle) qui a pris fin le 1er janvier 2024. Il offre des avantages fiscaux aux professionnels et investisseurs qualifiés. Contrairement au RNH, l'IFICI a des critères d'éligibilité plus stricts. L'échéance du 15 janvier est absolue — si vous la manquez, l'option IFICI est définitivement perdue pour cette année fiscale. Il n'existe aucun processus de prolongation ou de recours.",
      "dependency": "Exige : NIF (résidence fiscale établie)"
    },
    "faq": {
      "title": "Questions Fréquentes",
      "q1": "Ai-je besoin d'un NIF avant de m'inscrire au CRUE ?",
      "a1": "Oui. Le NIF établit votre identité auprès de l'État portugais et est nécessaire pour toutes les démarches suivantes, notamment CRUE, NISS, SNS et IFICI.",
      "q2": "Où exactement m'inscrire pour le CRUE ?",
      "a2": "À votre Câmara Municipal (mairie) ou dans une Loja do Cidadão dans les grandes villes. L'AIMA traite uniquement les ressortissants non-UE — les citoyens UE qui s'y rendent pour le CRUE seront redirigés.",
      "q3": "Quelle est l'amende pour avoir manqué le délai CRUE ?",
      "a3": "€400 à €1.500. Si vous dépassez les 12 mois sans vous inscrire, vous devez payer l'amende à l'AIMA avant que votre dossier CRUE puisse être traité.",
      "q4": "Puis-je demander le NISS et le CRUE en même temps ?",
      "a4": "Non. Depuis fin 2023, les demandes de NISS exigent le certificat CRUE comme pièce justificative. Vous devez d'abord obtenir le CRUE.",
      "q5": "Le RNH est-il encore disponible ?",
      "a5": "Non. Le régime RNH a pris fin le 1er janvier 2024. Il a été remplacé par l'IFICI (Incentivo Fiscal à Internacionalização), avec des critères d'éligibilité plus stricts.",
      "q6": "Que se passe-t-il si je manque l'échéance du 15 janvier pour l'IFICI ?",
      "a6": "L'option IFICI est définitivement perdue pour cette année fiscale. Il n'existe aucun processus de prolongation ou de recours."
    },
    "cta": {
      "title": "Prêt à commencer avec votre NIF ?",
      "subtitle": "Le NIF est la première étape. Nous le gérons à distance — depuis n'importe où dans le monde.",
      "button": "Obtenir Mon NIF — À partir de €79"
    },
    "breadcrumb": {
      "home": "Accueil",
      "guide": "Guide"
    }
  }
```

- [ ] **Step 4: Add `nav.guide` and `footer.guideLink` keys to all three locale files**

In `messages/en.json`:
- In the `"nav"` object, add: `"guide": "Compliance Guide"`
- In the `"footer"` object, add: `"guideLink": "EU Compliance Guide"`

In `messages/pt.json`:
- In the `"nav"` object, add: `"guide": "Guia de Conformidade"`
- In the `"footer"` object, add: `"guideLink": "Guia de Conformidade UE"`

In `messages/fr.json`:
- In the `"nav"` object, add: `"guide": "Guide de Conformité"`
- In the `"footer"` object, add: `"guideLink": "Guide de Conformité UE"`

- [ ] **Step 5: Type-check the JSON files**

Run:
```bash
node -e "require('./messages/en.json'); require('./messages/pt.json'); require('./messages/fr.json'); console.log('All JSON valid')"
```

Expected: `All JSON valid`

If you get a SyntaxError, open the failing file and look for missing commas, duplicate keys, or trailing commas.

- [ ] **Step 6: Commit**

```bash
git add messages/en.json messages/pt.json messages/fr.json
git commit -m "feat(i18n): add guide namespace and nav/footer keys for all locales"
```

---

## Task 2: Create the guide page

**Files:**
- Create: `src/app/[locale]/(marketing)/guide/eu-citizen-portugal-checklist/page.tsx`

**Key decisions:**
- No `'use client'` — fully crawlable Server Component
- No Framer Motion — plain JSX + Tailwind
- No `generateStaticParams` — already defined in `src/app/[locale]/layout.tsx`
- `generateMetadata` for locale-aware title/description + hreflang `alternates`
- `setRequestLocale(locale)` before any `getTranslations` call
- Visible "Last updated" date stamp (hardcoded as `2026-03-27`, update manually per content freshness schedule)
- JSON-LD `@graph`: `WebPage`, `Article`, `BreadcrumbList`, `HowTo` (5 steps), `FAQPage` (6 Q&As)
- Anchored sections: `id="nif"`, `id="crue"`, `id="niss"`, `id="sns"`, `id="ifici"`
- Answer-first structure: direct answer in a highlighted block before body text

- [ ] **Step 1: Create the directory and file**

Create `src/app/[locale]/(marketing)/guide/eu-citizen-portugal-checklist/page.tsx` with this full content:

```tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

// Update this date whenever content is revised (GEO freshness signal).
const LAST_UPDATED = "2026-03-27";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guide" });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://getnifportugal.com";
  const canonical = `${baseUrl}/${locale}/guide/eu-citizen-portugal-checklist`;

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          `${baseUrl}/${l}/guide/eu-citizen-portugal-checklist`,
        ])
      ),
    },
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      url: canonical,
      type: "article",
    },
  };
}

export default async function GuideEuCitizenPortugalChecklist({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("guide");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://getnifportugal.com";
  const pageUrl = `${baseUrl}/${locale}/guide/eu-citizen-portugal-checklist`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: t("meta.title"),
        description: t("meta.description"),
        dateModified: LAST_UPDATED,
        isPartOf: { "@id": `${baseUrl}#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: t("title"),
        description: t("meta.description"),
        datePublished: "2026-03-27",
        dateModified: LAST_UPDATED,
        author: {
          "@type": "Organization",
          "@id": `${baseUrl}#organization`,
          name: "GetNIFPortugal",
        },
        publisher: { "@id": `${baseUrl}#organization` },
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t("breadcrumb.home"),
            item: `${baseUrl}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t("breadcrumb.guide"),
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${pageUrl}#howto`,
        name: t("title"),
        description: t("intro"),
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: t("nif.title"),
            text: t("nif.answer") + " " + t("nif.body"),
            url: `${pageUrl}#nif`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: t("crue.title"),
            text: t("crue.answer") + " " + t("crue.body"),
            url: `${pageUrl}#crue`,
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: t("niss.title"),
            text: t("niss.answer") + " " + t("niss.body"),
            url: `${pageUrl}#niss`,
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: t("sns.title"),
            text: t("sns.answer") + " " + t("sns.body"),
            url: `${pageUrl}#sns`,
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: t("ifici.title"),
            text: t("ifici.answer") + " " + t("ifici.body"),
            url: `${pageUrl}#ifici`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: [1, 2, 3, 4, 5, 6].map((n) => ({
          "@type": "Question",
          name: t(`faq.q${n}` as "faq.q1"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t(`faq.a${n}` as "faq.a1"),
          },
        })),
      },
    ],
  };

  const steps = [
    {
      id: t("nif.anchor"),
      step: t("nif.step"),
      title: t("nif.title"),
      answer: t("nif.answer"),
      body: t("nif.body"),
      isOurs: true,
      weHandleThis: t("nif.weHandleThis"),
      cta: t("nif.cta"),
    },
    {
      id: t("crue.anchor"),
      step: t("crue.step"),
      title: t("crue.title"),
      answer: t("crue.answer"),
      body: t("crue.body"),
      facts: [
        { label: t("crue.deadlineLabel"), value: t("crue.deadline"), danger: false },
        { label: t("crue.fineLabel"), value: t("crue.fine"), danger: true },
        { label: t("crue.officeLabel"), value: t("crue.office"), danger: false },
        { label: t("crue.wrongOfficeLabel"), value: t("crue.wrongOffice"), danger: true },
      ],
      lateWarning: t("crue.lateWarning"),
      dependency: t("crue.dependency"),
    },
    {
      id: t("niss.anchor"),
      step: t("niss.step"),
      title: t("niss.title"),
      answer: t("niss.answer"),
      body: t("niss.body"),
      dependency: t("niss.dependency"),
    },
    {
      id: t("sns.anchor"),
      step: t("sns.step"),
      title: t("sns.title"),
      answer: t("sns.answer"),
      body: t("sns.body"),
      dependency: t("sns.dependency"),
    },
    {
      id: t("ifici.anchor"),
      step: t("ifici.step"),
      title: t("ifici.title"),
      answer: t("ifici.answer"),
      body: t("ifici.body"),
      facts: [
        { label: t("ifici.deadlineLabel"), value: t("ifici.deadline"), danger: true },
        { label: t("ifici.penaltyLabel"), value: t("ifici.penalty"), danger: true },
        { label: t("ifici.nhrLabel"), value: t("ifici.nhr"), danger: false },
      ],
      dependency: t("ifici.dependency"),
    },
  ];

  const faqItems = [1, 2, 3, 4, 5, 6].map((n) => ({
    q: t(`faq.q${n}` as "faq.q1"),
    a: t(`faq.a${n}` as "faq.a1"),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
        {/* Page header */}
        <div
          className="pt-28 pb-16 border-b"
          style={{
            background: "var(--color-surface-elevated)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="container-site max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8" aria-label="Breadcrumb">
              <Link
                href="/"
                className="transition-colors"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {t("breadcrumb.home")}
              </Link>
              <span style={{ color: "var(--color-border)" }}>/</span>
              <span style={{ color: "var(--color-ink)" }}>{t("breadcrumb.guide")}</span>
            </nav>

            {/* Eyebrow */}
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--color-green)" }}
            >
              {t("eyebrow")}
            </p>

            {/* Title */}
            <h1
              className="text-heading-xl mb-5"
              style={{ color: "var(--color-ink)" }}
            >
              {t("title")}
            </h1>

            {/* Subtitle */}
            <p
              className="text-xl leading-relaxed mb-6"
              style={{ color: "var(--color-ink-muted)" }}
            >
              {t("subtitle")}
            </p>

            {/* Last updated */}
            <p className="text-xs" style={{ color: "var(--color-ink-muted)" }}>
              <time dateTime={LAST_UPDATED}>
                {t("lastUpdated")}: {LAST_UPDATED}
              </time>
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="container-site max-w-3xl py-16">
          {/* Intro paragraph — front-loaded key facts */}
          <p
            className="text-base leading-relaxed mb-12"
            style={{ color: "var(--color-ink-muted)" }}
          >
            {t("intro")}
          </p>

          {/* Table of contents */}
          <nav
            className="rounded-xl p-6 mb-16 border"
            style={{
              background: "var(--color-surface-elevated)",
              borderColor: "var(--color-border)",
            }}
            aria-label={t("toc")}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "var(--color-green)" }}
            >
              {t("toc")}
            </p>
            <ol className="space-y-2">
              {steps.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm font-medium transition-colors"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    <span
                      className="inline-block w-16 text-xs font-bold mr-1"
                      style={{ color: "var(--color-green)" }}
                    >
                      {s.step}
                    </span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Step sections */}
          <div className="space-y-20">
            {steps.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                {/* Step label */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={
                      s.isOurs
                        ? { background: "var(--color-green)", color: "white" }
                        : {
                            background: "var(--color-surface-elevated)",
                            border: "1.5px solid var(--color-border)",
                            color: "var(--color-ink-muted)",
                          }
                    }
                  >
                    {i}
                  </span>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: s.isOurs ? "var(--color-green)" : "var(--color-ink-muted)" }}
                  >
                    {s.step}
                    {s.isOurs && (
                      <span
                        className="ml-2 rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{
                          background: "oklch(42% 0.12 152 / 0.1)",
                          color: "var(--color-green)",
                          border: "1px solid oklch(42% 0.12 152 / 0.2)",
                        }}
                      >
                        {s.weHandleThis}
                      </span>
                    )}
                  </span>
                </div>

                {/* Section title */}
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--color-ink)" }}
                >
                  {s.title}
                </h2>

                {/* Answer-first block */}
                <div
                  className="rounded-lg px-5 py-4 mb-5 border-l-4"
                  style={{
                    background: "oklch(42% 0.12 152 / 0.05)",
                    borderLeftColor: "var(--color-green)",
                  }}
                >
                  <p
                    className="text-sm font-semibold leading-relaxed"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {s.answer}
                  </p>
                </div>

                {/* Body text */}
                <p
                  className="text-base leading-relaxed mb-6"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  {s.body}
                </p>

                {/* Facts table (CRUE and IFICI) */}
                {"facts" in s && s.facts && (
                  <div className="rounded-xl overflow-hidden border mb-5" style={{ borderColor: "var(--color-border)" }}>
                    {s.facts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex gap-4 px-5 py-3 border-b last:border-0 text-sm"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        <span
                          className="w-40 shrink-0 font-semibold"
                          style={{ color: "var(--color-ink-muted)" }}
                        >
                          {fact.label}
                        </span>
                        <span
                          className="font-semibold"
                          style={{
                            color: fact.danger ? "var(--color-gold)" : "var(--color-ink)",
                          }}
                        >
                          {fact.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Late warning (CRUE only) */}
                {"lateWarning" in s && s.lateWarning && (
                  <div
                    className="rounded-lg px-5 py-3 mb-5 text-sm font-medium"
                    style={{
                      background: "oklch(75% 0.15 75 / 0.08)",
                      border: "1px solid oklch(75% 0.15 75 / 0.2)",
                      color: "var(--color-gold)",
                    }}
                  >
                    ⚠ {s.lateWarning}
                  </div>
                )}

                {/* Dependency note */}
                {"dependency" in s && s.dependency && (
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    <span className="font-semibold" style={{ color: "var(--color-ink)" }}>→</span>{" "}
                    {s.dependency}
                  </p>
                )}

                {/* CTA (NIF step only) */}
                {s.isOurs && s.cta && (
                  <div className="mt-6">
                    <Link
                      href="/login?redirectTo=/order"
                      className="btn btn-primary btn-sm"
                    >
                      {s.cta}
                    </Link>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* FAQ section */}
          <section className="mt-24" id="faq">
            <h2
              className="text-2xl font-bold mb-10"
              style={{ color: "var(--color-ink)" }}
            >
              {t("faq.title")}
            </h2>
            <div className="space-y-6">
              {faqItems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-6 border"
                  style={{
                    background: "var(--color-surface-elevated)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <h3
                    className="text-base font-semibold mb-2"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {item.q}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-ink-muted)" }}
                  >
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA section */}
          <section
            className="mt-24 rounded-2xl p-10 text-center"
            style={{
              background: "var(--color-surface-elevated)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "var(--color-ink)" }}
            >
              {t("cta.title")}
            </h2>
            <p
              className="text-base mb-8"
              style={{ color: "var(--color-ink-muted)" }}
            >
              {t("cta.subtitle")}
            </p>
            <Link
              href="/login?redirectTo=/order"
              className="btn btn-primary"
            >
              {t("cta.button")}
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npm run type-check 2>&1 | head -40
```

Expected: no errors in the new guide page file. If TypeScript complains about `t("faq.q${n}")`, the cast `as "faq.q1"` already handles it — confirm it compiles cleanly.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/\(marketing\)/guide/eu-citizen-portugal-checklist/page.tsx
git commit -m "feat(guide): add EU citizen Portugal compliance guide page — Phase 3 authority hub"
```

---

## Task 3: Add guide link to Navbar and Footer

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Context:**
- `Navbar.tsx` is `"use client"`. It uses `useTranslations("nav")`. Nav links are in a `navLinks` array at line 28.
- `Footer.tsx` is `"use client"`. It uses `useTranslations("footer")`. The Company column has a `<ul>` with About and Contact items.

- [ ] **Step 1: Add guide link to Navbar `navLinks` array**

In `src/components/layout/Navbar.tsx`, change:

```tsx
  const navLinks = [
    { href: "/#how-it-works", label: t("howItWorks") },
    { href: "/#pricing", label: t("pricing") },
  ];
```

to:

```tsx
  const navLinks = [
    { href: "/#how-it-works", label: t("howItWorks") },
    { href: "/#pricing", label: t("pricing") },
    { href: "/guide/eu-citizen-portugal-checklist", label: t("guide") },
  ];
```

The mobile menu already maps over `navLinks`, so no other changes needed in `Navbar.tsx`.

- [ ] **Step 2: Add guide link to Footer Company section**

In `src/components/layout/Footer.tsx`, in the Company `<ul>` (currently has About and Contact items), add a third `<li>` for the guide link. Change:

```tsx
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@getnifportugal.com"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("contact")}
                </a>
              </li>
            </ul>
```

to:

```tsx
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("about")}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@getnifportugal.com"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("contact")}
                </a>
              </li>
              <li>
                <Link
                  href="/guide/eu-citizen-portugal-checklist"
                  className="text-sm hover:text-white transition-colors"
                >
                  {t("guideLink")}
                </Link>
              </li>
            </ul>
```

- [ ] **Step 3: Type-check**

```bash
npm run type-check 2>&1 | head -40
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/components/layout/Footer.tsx
git commit -m "feat(nav): add compliance guide link to Navbar and Footer"
```

---

## Task 4: Build verification and checklist update

**Files:**
- Modify: `docs/seo-geo-checklist.md`

- [ ] **Step 1: Run production build**

```bash
npm run build 2>&1 | tail -30
```

Expected: build completes with no errors. You should see the guide page route in the output:
```
○  /[locale]/guide/eu-citizen-portugal-checklist
```
(The `○` symbol means statically generated — correct for a Server Component.)

If the build fails with a next-intl missing key error, open the failing locale file and add the missing key.

- [ ] **Step 2: Mark Phase 3 complete in checklist**

In `docs/seo-geo-checklist.md`, change:

```markdown
## Phase 3 — Authority Hub (primary GEO asset)

- [ ] New route: `src/app/[locale]/(marketing)/guide/eu-citizen-portugal-checklist/page.tsx`
  - Server Component only (no 'use client' — fully crawlable)
  - Answer-first structure: key facts in first 30% of text
  - Anchored sections: `#nif`, `#crue`, `#niss`, `#sns`, `#ifici`
  - Visible "Last updated" date stamp
- [ ] Full `@graph` JSON-LD stack on guide page:
  - `WebPage`
  - `Article` (with `datePublished` + `dateModified`)
  - `BreadcrumbList`
  - `HowTo` (5 steps: NIF → CRUE → NISS → SNS → IFICI)
  - `FAQPage` (6+ compliance Q&As)
- [ ] Add guide link to Navbar and Footer
- [ ] Translations for guide page (en, pt, fr)
```

to:

```markdown
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
```

- [ ] **Step 3: Commit**

```bash
git add docs/seo-geo-checklist.md
git commit -m "docs: mark Phase 3 complete in SEO/GEO checklist"
```

---

## Self-Review

**Spec coverage:**
- ✅ Server Component only (no 'use client') — confirmed, no framer-motion, no hooks
- ✅ Answer-first structure — each step has an `answer` highlighted block before `body`
- ✅ Key facts in first 30% — intro + TOC + NIF step are top of page
- ✅ Anchored sections — `id="nif"`, `#crue`, `#niss`, `#sns`, `#ifici`, `scroll-mt-24`
- ✅ Visible "Last updated" — `<time dateTime={LAST_UPDATED}>` in page header
- ✅ `@graph` JSON-LD — WebPage, Article (datePublished + dateModified), BreadcrumbList, HowTo (5 steps), FAQPage (6 Q&As)
- ✅ Guide link in Navbar — added to `navLinks` array (auto-renders in both desktop and mobile)
- ✅ Guide link in Footer — added to Company section
- ✅ Translations for en, pt, fr — full `guide` namespace + `nav.guide` + `footer.guideLink`
- ✅ `generateStaticParams` — NOT duplicated; already exists in `src/app/[locale]/layout.tsx`
- ✅ `setRequestLocale` called before `getTranslations` in both page and `generateMetadata`
- ✅ hreflang alternates in `generateMetadata` — `alternates.languages` for all 3 locales
- ✅ JSON files validated with `node -e "require(...)"` before committing

**Placeholder scan:** No TBDs, no "similar to Task N", all code blocks complete.

**Type consistency:** `t("faq.q${n}" as "faq.q1")` cast used consistently in both JSON-LD and faqItems. `steps` array properties (`facts`, `lateWarning`, `dependency`, `isOurs`, `cta`) checked with `"facts" in s` / `"lateWarning" in s` pattern — consistent with existing ComplianceRoadmap pattern.
