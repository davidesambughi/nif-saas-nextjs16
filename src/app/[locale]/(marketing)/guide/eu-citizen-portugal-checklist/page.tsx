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
      isOurs: true as const,
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
          {/* Intro paragraph */}
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
                      "isOurs" in s
                        ? { background: "var(--color-green)", color: "white" }
                        : {
                            background: "var(--color-surface-elevated)",
                            border: "1.5px solid var(--color-border)",
                            color: "var(--color-ink-muted)",
                          }
                    }
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "isOurs" in s ? "var(--color-green)" : "var(--color-ink-muted)" }}
                  >
                    {s.step}
                    {"isOurs" in s && (
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
                  <div
                    className="rounded-xl overflow-hidden border mb-5"
                    style={{ borderColor: "var(--color-border)" }}
                  >
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
                            color: fact.danger
                              ? "var(--color-gold)"
                              : "var(--color-ink)",
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
                  <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
                    <span
                      className="font-semibold"
                      style={{ color: "var(--color-ink)" }}
                    >
                      →
                    </span>{" "}
                    {s.dependency}
                  </p>
                )}

                {/* CTA (NIF step only) */}
                {"isOurs" in s && s.cta && (
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
            <Link href="/login?redirectTo=/order" className="btn btn-primary">
              {t("cta.button")}
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
