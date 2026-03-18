import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * next-intl server configuration.
 * Loads the correct message file based on the request locale.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is one we support
  if (!locale || !routing.locales.includes(locale as "en" | "pt" | "fr")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (
      await import(`../../messages/${locale}.json`)
    ).default,
  };
});
