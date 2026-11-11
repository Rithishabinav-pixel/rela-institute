import { createDynamicSitemapHandler } from '@/lib/sitemap/handlers'
import { getArticleSitemapEntries } from '@/lib/sitemap/dynamic-sources'

export const revalidate = 3600

export const GET = createDynamicSitemapHandler({
  basePath: '/articles',
  getEntries: getArticleSitemapEntries,
})
