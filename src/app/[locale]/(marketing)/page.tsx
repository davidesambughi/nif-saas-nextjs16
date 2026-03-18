import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import TrustSignals from "@/components/home/TrustSignals";
import FAQ from "@/components/home/FAQ";
import CTABanner from "@/components/home/CTABanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Your Portuguese NIF Remotely — From €49",
};

/**
 * Homepage — Server Component.
 * Statically rendered (use cache + PPR via next.config.ts ppr:true).
 * Child components that need interactivity are marked 'use client'.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Pricing />
      <TrustSignals />
      <FAQ />
      <CTABanner />
    </>
  );
}
