import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import TrustSignals from "@/components/home/TrustSignals";
import FAQ from "@/components/home/FAQ";
import CTABanner from "@/components/home/CTABanner";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4, 5].map((n) => ({
      "@type": "Question",
      name: t(`q${n}` as "q1"),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`a${n}` as "a1"),
      },
    })),
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GetNIFPortugal",
    description:
      "Remote Portuguese NIF registration service for non-residents worldwide.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://getnifportugal.com",
    areaServed: "Worldwide",
    serviceType: "Tax Registration",
    priceRange: "€79 - €199",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Pricing />
      <TrustSignals />
      <FAQ />
      <CTABanner />
    </>
  );
}
