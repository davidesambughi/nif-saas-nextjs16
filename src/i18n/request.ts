import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

/**
 * next-intl server configuration.
 * Loads the correct message file based on the request locale.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;

  // Use next-intl's hasLocale helper instead of manual type casting
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
