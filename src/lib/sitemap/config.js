// Single place to control the sitemap's production domain and the registry
// of child sitemaps referenced by the parent sitemap index at /sitemap.xml.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.relainstitute.com').replace(/\/$/, '')

// Google's limit is 50,000 URLs (or 50MB uncompressed) per sitemap file.
export const MAX_URLS_PER_SITEMAP = 50000

// Every entry here must have a matching `app/sitemap-<name>.xml/route.js`.
// To add a new module's sitemap: create that route file (see an existing
// one, e.g. app/sitemap-doctors.xml/route.js, as the template), then add its
// name here so the parent index picks it up.
export const CHILD_SITEMAPS = [
  'pages',
  'doctors',
  'health-packages',
  'careers',
  'articles',
  'media',
  'success-stories',
  'expert-talks',
  'events',
  'wellness-network',
]
