import { SITE_URL } from './config'
import { buildUrlsetXml, xmlResponse } from './xml'

// Factory for a dynamic child sitemap's GET handler.
// basePath: the route's URL prefix, e.g. '/doctors' for '/doctors/[slug]'.
// getEntries: async () => [{ slug, lastmod }]
export function createDynamicSitemapHandler({ basePath, getEntries }) {
  return async function GET() {
    const entries = await getEntries()

    const urlEntries = entries
      .filter((entry) => entry?.slug)
      .map((entry) => ({
        loc: `${SITE_URL}${basePath}/${entry.slug}`,
        lastmod: entry.lastmod,
      }))

    return xmlResponse(buildUrlsetXml(urlEntries))
  }
}
