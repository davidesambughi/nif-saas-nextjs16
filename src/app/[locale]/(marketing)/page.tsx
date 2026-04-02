import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import HowItWorks from "@/components/home/HowItWorks";
import ComplianceRoadmap from "@/components/home/ComplianceRoadmap";
import Pricing from "@/components/home/Pricing";
import TrustSignals from "@/components/home/TrustSignals";
import { FAQ_KEYS } from "@/components/home/FAQ";
import FAQ from "@/components/home/FAQ";
import CTABanner from "@/components/home/CTABanner";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Your Portuguese NIF Remotely — From €79",
  description:
    "Get your Portuguese NIF (tax number) from anywhere in the world. 100% remote service, no travel required. Starting from €79.",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("faq");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://getnifportugal.com";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}#organization`,
        name: "GetNIFPortugal",
        description:
          "Remote Portuguese NIF registration and compliance guidance for EU citizens and non-residents worldwide.",
        url: baseUrl,
        areaServed: "Worldwide",
        priceRange: "€79 - €199",
      },
      {
        "@type": "LegalService",
        "@id": `${baseUrl}#service`,
        name: "Portuguese NIF Registration & Fiscal Representation",
        description:
          "End-to-end remote NIF registration and fiscal representation for non-residents and EU citizens relocating to Portugal.",
        provider: { "@id": `${baseUrl}#organization` },
        areaServed: "Worldwide",
        serviceType: ["NIF Registration", "Fiscal Representation", "Tax Compliance"],
        offers: [
          { "@type": "Offer", name: "Essential", price: "79", priceCurrency: "EUR" },
          { "@type": "Offer", name: "Standard", price: "129", priceCurrency: "EUR" },
          { "@type": "Offer", name: "Premium", price: "199", priceCurrency: "EUR" },
        ],
      },
      {
        "@type": "HowTo",
        "@id": `${baseUrl}#compliance-roadmap`,
        name: "EU Citizen Portugal Compliance Checklist",
        description:
          "The correct order for EU citizens to complete all required registrations in Portugal. NIF must be obtained first.",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Get Your NIF (Portuguese Tax Number)",
            text: "Obtain your NIF before any other registration. Required by banks, landlords, employers, and the Portuguese tax authority. Establishes your identity and tax residency.",
            url: `${baseUrl}#compliance-roadmap`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Register CRUE (EU Residency Certificate)",
            text: "After 90 days in Portugal, EU citizens have 30 days to register at their Câmara Municipal (city hall) — not AIMA. AIMA handles non-EU nationals only. Fine for missing this window: €400 to €1,500. If past 12 months, pay the fine to AIMA before CRUE can be processed.",
            url: `${baseUrl}#compliance-roadmap`,
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Apply for NISS (Social Security Number)",
            text: "Requires CRUE as a supporting document since late 2023. Cannot be processed in parallel with CRUE — CRUE must be obtained first.",
            url: `${baseUrl}#compliance-roadmap`,
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Enroll in SNS (National Health Service)",
            text: "Register with the Portuguese National Health Service using your NISS to access public healthcare.",
            url: `${baseUrl}#compliance-roadmap`,
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Apply for IFICI Tax Regime",
            text: "IFICI replaced NHR (Non-Habitual Residency), which ended January 1, 2024. Apply by January 15 of the year after establishing tax residency in Portugal. Missing this deadline is permanent — no extension or appeal.",
            url: `${baseUrl}#compliance-roadmap`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_KEYS.map((key, i) => ({
          "@type": "Question",
          name: t(key as "q1"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t(`a${i + 1}` as "a1"),
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <ComplianceRoadmap />
      <Pricing />
      <TrustSignals />
      <Suspense>
        <FAQ />
      </Suspense>
      <CTABanner />
    </>
  );
}
