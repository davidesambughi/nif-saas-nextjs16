import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "GetNIFPortugal — Get Your Portuguese NIF Remotely",
    template: "%s | GetNIFPortugal",
  },
  description:
    "Get your Portuguese NIF (tax number) from anywhere in the world. 100% remote service. Starting from €79.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    siteName: "GetNIFPortugal",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakartaSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
