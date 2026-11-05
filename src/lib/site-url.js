export function getSiteUrl() {
  const raw = process.env.SITE_URL || 'http://localhost:3000'
  return raw.replace(/\/+$/, '')
}

export function buildCanonicalUrl(pathname) {
  const path = `/${String(pathname).replace(/^\/+/, '')}`
  return `${getSiteUrl()}${path}`
}
