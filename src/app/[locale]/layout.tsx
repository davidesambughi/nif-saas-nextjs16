import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`])
      ),
    },
    other: { "content-language": locale },
  };
}

/**
 * Locale root layout.
 * Wraps all locale-specific pages with NextIntlClientProvider.
 *
 * setRequestLocale(locale) MUST be called before getMessages() so that
 * next-intl can propagate the correct locale to all Server Components in
 * the subtree without prop-drilling.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Register the locale for all Server Components in this subtree.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
