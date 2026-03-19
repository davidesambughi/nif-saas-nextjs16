import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Turbopack is default in Next.js 16
  // cacheComponents: true — disabled: incompatible with next-intl (getMessages() accesses
  // request headers at layout level, which PPR treats as uncached data outside Suspense).
  // Re-enable once next-intl has native PPR support. See TODO.md.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
