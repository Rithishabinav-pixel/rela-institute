import { SITE_URL, CHILD_SITEMAPS } from '@/lib/sitemap/config'
import { buildSitemapIndexXml, xmlResponse } from '@/lib/sitemap/xml'

export const revalidate = 3600

export async function GET() {
  const sitemaps = CHILD_SITEMAPS.map((name) => ({
    loc: `${SITE_URL}/sitemap-${name}.xml`,
  }))

  return xmlResponse(buildSitemapIndexXml(sitemaps))
}
