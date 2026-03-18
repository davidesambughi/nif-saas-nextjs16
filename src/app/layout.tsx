import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "GetNIFPortugal — Get Your Portuguese NIF Remotely",
    template: "%s | GetNIFPortugal",
  },
  description:
    "Get your Portuguese NIF (tax number) from anywhere in the world. 100% remote service. Standard from €49.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    siteName: "GetNIFPortugal",
    type: "website",
  },
};

/**
 * Root layout — minimal HTML shell.
 * All locale-specific content is in [locale]/layout.tsx.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
