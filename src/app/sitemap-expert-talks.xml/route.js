import { createDynamicSitemapHandler } from '@/lib/sitemap/handlers'
import { getExpertTalkSitemapEntries } from '@/lib/sitemap/dynamic-sources'

export const revalidate = 3600

export const GET = createDynamicSitemapHandler({
  basePath: '/expert-talks',
  getEntries: getExpertTalkSitemapEntries,
})
