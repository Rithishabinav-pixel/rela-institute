import { createDynamicSitemapHandler } from '@/lib/sitemap/handlers'
import { getJobSitemapEntries } from '@/lib/sitemap/dynamic-sources'

export const revalidate = 3600

// Job detail pages are reachable at both /careers/[slug] and
// /careers/detail/[slug], but the careers listing page only links to
// /careers/[slug] — that's the canonical URL, so only it is included here
// to avoid duplicate-content URLs in the sitemap.
export const GET = createDynamicSitemapHandler({
  basePath: '/careers',
  getEntries: getJobSitemapEntries,
})
