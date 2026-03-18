import { defineRouting } from "next-intl/routing";

/**
 * next-intl routing configuration.
 * This is the single source of truth for locale settings.
 * Imported by proxy.ts (middleware) and the navigation helpers.
 */
export const routing = defineRouting({
  locales: ["en", "pt", "fr"],
  defaultLocale: "en",
  localePrefix: "always", // Always show /en/, /pt/ etc. in URL
});

export type Locale = (typeof routing.locales)[number];
