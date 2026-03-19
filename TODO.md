# TODO

## Re-enable PPR (`cacheComponents: true`)

**Status:** disabled in `next.config.ts`
**Blocked by:** `next-intl` incompatibility with Next.js 16 Partial Pre-Rendering

### Problem
`getMessages()` in `src/app/[locale]/layout.tsx` reads request headers to resolve the locale.
PPR treats this as uncached dynamic data outside a `<Suspense>` boundary → build fails.

### What to do when re-enabling
1. Check `next-intl` release notes for PPR / Cache Components support.
2. Uncomment `cacheComponents: true` in `next.config.ts`.
3. Run `npm run build` — if it fails, the locale layout needs restructuring:
   - Either wrap `<NextIntlClientProvider>` in `<Suspense>` and move `getMessages()` inside it,
   - or follow the official next-intl PPR migration guide.
4. All `useSearchParams()` calls already have `<Suspense>` wrappers (`LoginForm`, `SignupForm`, `OrderContent`) — those are fine.
