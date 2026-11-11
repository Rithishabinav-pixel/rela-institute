import { SITE_URL } from '@/lib/sitemap/config'
import { buildUrlsetXml, xmlResponse } from '@/lib/sitemap/xml'
import { STATIC_PAGES } from '@/lib/sitemap/static-pages'

export const revalidate = 3600

export async function GET() {
  const entries = STATIC_PAGES.map((page) => ({
    loc: `${SITE_URL}${page.path}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  return xmlResponse(buildUrlsetXml(entries))
}
