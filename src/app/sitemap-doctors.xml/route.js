import { createDynamicSitemapHandler } from '@/lib/sitemap/handlers'
import { getDoctorSitemapEntries } from '@/lib/sitemap/dynamic-sources'

export const revalidate = 3600

export const GET = createDynamicSitemapHandler({
  basePath: '/doctors',
  getEntries: getDoctorSitemapEntries,
})
