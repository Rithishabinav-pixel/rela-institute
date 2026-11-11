import { createDynamicSitemapHandler } from '@/lib/sitemap/handlers'
import { getSuccessStorySitemapEntries } from '@/lib/sitemap/dynamic-sources'

export const revalidate = 3600

export const GET = createDynamicSitemapHandler({
  basePath: '/success-stories',
  getEntries: getSuccessStorySitemapEntries,
})
