import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/shared/MotionProvider";

/**
 * Marketing layout — public-facing pages (home, pricing).
 * Wraps pages with the site Navbar and Footer.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </MotionProvider>
  );
}
