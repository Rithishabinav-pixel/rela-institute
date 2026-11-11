import { createDynamicSitemapHandler } from '@/lib/sitemap/handlers'
import { getEventSitemapEntries } from '@/lib/sitemap/dynamic-sources'

export const revalidate = 3600

export const GET = createDynamicSitemapHandler({
  basePath: '/events',
  getEntries: getEventSitemapEntries,
})
