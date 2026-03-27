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
  async headers() {
    return [
      {
        // Security + crawlability headers for all routes
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Explicitly tell all crawlers (including AI bots) to index marketing pages
        source: "/:locale(en|pt|fr)/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
        ],
      },
      {
        // Guide pages get additional AI-citation-friendly directives
        source: "/:locale(en|pt|fr)/guide/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
        ],
      },
      {
        // Protected app routes — no indexing
        source: "/:locale(en|pt|fr)/(dashboard|order|admin)/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
