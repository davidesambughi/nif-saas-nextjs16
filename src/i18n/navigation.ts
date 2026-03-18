import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation helpers.
 * Use these instead of next/navigation in all components that need locale support.
 */
export const { Link, useRouter, usePathname, redirect } =
  createNavigation(routing);
