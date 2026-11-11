import { MAX_URLS_PER_SITEMAP } from './config'

export function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toIsoLastmod(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

// entries: [{ loc, lastmod?, changeFrequency?, priority? }]
export function buildUrlsetXml(entries) {
  const deduped = [...new Map(entries.filter((entry) => entry?.loc).map((entry) => [entry.loc, entry])).values()]
  const limited = deduped.slice(0, MAX_URLS_PER_SITEMAP)

  const urlTags = limited
    .map((entry) => {
      const lastmod = toIsoLastmod(entry.lastmod)
      return [
        '  <url>',
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        entry.changeFrequency ? `    <changefreq>${escapeXml(entry.changeFrequency)}</changefreq>` : null,
        entry.priority != null ? `    <priority>${entry.priority}</priority>` : null,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlTags}\n</urlset>\n`
}

// sitemaps: [{ loc, lastmod? }]
export function buildSitemapIndexXml(sitemaps) {
  const tags = sitemaps
    .map((entry) => {
      const lastmod = toIsoLastmod(entry.lastmod)
      return [
        '  <sitemap>',
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        '  </sitemap>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${tags}\n</sitemapindex>\n`
}

export function xmlResponse(xml) {
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
