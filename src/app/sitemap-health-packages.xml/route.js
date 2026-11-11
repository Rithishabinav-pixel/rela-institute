import { createDynamicSitemapHandler } from '@/lib/sitemap/handlers'
import { getHealthPackageSitemapEntries } from '@/lib/sitemap/dynamic-sources'

export const revalidate = 3600

export const GET = createDynamicSitemapHandler({
  basePath: '/health-packages',
  getEntries: getHealthPackageSitemapEntries,
})
