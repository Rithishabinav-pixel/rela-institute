@AGENTS.md

## Data-fetching and caching architecture

This project fetches data on the server and uses ISR, not client-side `useEffect` fetches,
for public page content. Follow this pattern for all new and existing pages:

- **Public pages** (`/articles`, `/doctors`, and similar): Server Components. Fetch data in
  `page.js` via direct server-side calls (Prisma functions in `src/lib/*.js`, or `fetch()` for
  external sources like the WordPress API in `src/app/articles/wordpress.js`). Pass the data
  down as props. Export `export const revalidate = <seconds>` (a literal, statically
  analyzable number) on the page to enable ISR. For non-`fetch` data sources (Prisma), also
  wrap the query function with `unstable_cache` from `next/cache` so the data itself is
  cached, not just the route — see `listDoctorsPublic`/`getDoctorBySlugPublic` in
  `src/lib/doctors.js` for the pattern (cache key, `tags`, `revalidate`).
- **Client Components**: used only for genuine interactivity (search/filter state, Swiper
  tabs, forms, toggles, resize listeners). They receive their *initial* data as props from
  the Server Component parent and never re-fetch that same data via `useEffect` on mount.
  When a dataset is small enough to fetch entirely upfront (as with the current ~500
  articles / ~160 doctors), filter/search/sort it client-side over the full set rather than
  hitting an API route per keystroke.
- **Admin pages** (`/admin/**`): Server Components that call the admin data-access functions
  directly for their initial render, same as public pages — but never cached. Do not add
  `revalidate` or `unstable_cache` to admin pages or to any admin-only data-access function;
  they must always read live data. Mutations happen via the Route Handlers under
  `src/app/api/admin/**`, protected by `isAuthenticated()`.
- **Revalidation after mutations**: every admin mutation function in `src/lib/doctors.js`
  (`createDoctorAdmin`, `updateDoctorAdmin`, `deleteDoctorAdmin`, `toggleDoctorField`) calls
  `revalidatePath` for the affected public page(s) and `revalidateTag` for the shared
  `'doctors'` cache tag, so public ISR pages pick up admin changes immediately rather than
  waiting for the time-based `revalidate` window. Follow this same pattern (call
  `revalidatePath`/`revalidateTag` inside the data-access mutation function, not in the route
  handler) for any new admin mutation that affects public content.
- Only isolate `"use client"` around the smallest component that actually needs it — not the
  whole page — so the rest of the tree stays a Server Component.
