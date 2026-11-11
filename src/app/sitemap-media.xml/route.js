import { createDynamicSitemapHandler } from '@/lib/sitemap/handlers'
import { getMediaArticleSitemapEntries } from '@/lib/sitemap/dynamic-sources'

export const revalidate = 3600

export const GET = createDynamicSitemapHandler({
  basePath: '/media',
  getEntries: getMediaArticleSitemapEntries,
})
