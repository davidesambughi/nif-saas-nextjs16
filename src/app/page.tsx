import { redirect } from "next/navigation";

/**
 * Root page — immediately redirects to the default locale.
 * The proxy.ts handles locale-aware redirects on all subsequent navigations.
 */
export default function RootPage() {
  redirect("/en");
}
