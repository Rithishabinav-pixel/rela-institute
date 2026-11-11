// Update sitemap


// Every publicly indexable STATIC route in the app (no [slug]/[id] segments).
// Route-group folders like (content) don't add a URL segment, so their
// listing pages (/media, /success-stories, ...) are static paths here; only
// their [slug] detail pages are dynamic and live in dynamic-sources.js.
//
// To add a new static page: add its path below. Nothing else to touch.
export const STATIC_PAGES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about-us', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about-us/awards-honors', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about-us/from-the-desk-of-prof-mohamed-rela', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/academics', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/leadership-team', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/infrastructure', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/patient-care', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/international-patients', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact-us', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/terms-and-conditions', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cancellation-refund-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/locations', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/locations/adyar', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/locations/kumaran', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/locations/nanganallur', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/locations/pallikaranai', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/locations/red-hills', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/doctors', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/department', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/health-packages', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/careers', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/articles', priority: 0.7, changeFrequency: 'daily' },
  { path: '/newsletters', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/resources', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/patient-experience', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/testimonials-and-reviews', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/media', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/success-stories', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/expert-talks', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/events', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/wellness-network', priority: 0.6, changeFrequency: 'weekly' },
]
