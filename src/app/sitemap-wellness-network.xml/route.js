import { createDynamicSitemapHandler } from '@/lib/sitemap/handlers'
import { getWellnessNetworkSitemapEntries } from '@/lib/sitemap/dynamic-sources'

export const revalidate = 3600

export const GET = createDynamicSitemapHandler({
  basePath: '/wellness-network',
  getEntries: getWellnessNetworkSitemapEntries,
})
