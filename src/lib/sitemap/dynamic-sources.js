// Minimal, read-only (slug + lastmod only) data sources for dynamic sitemap
// entries. These are deliberately separate from the existing public list/get
// functions in src/lib/*.js: those already apply the correct
// published/active filtering for their own pages, but their serialized
// shapes don't expose `updatedAt` (and changing them to do so would mean
// touching existing, unrelated API behavior). Each function here mirrors the
// exact same filter its page's existing public function uses, so the set of
// slugs returned matches what is actually live on the site.
import { prisma } from '../prisma.js'
import { listArticlesForDoctorLinking } from '../articles.js'

export async function getDoctorSitemapEntries() {
  const rows = await prisma.doctor.findMany({ select: { slug: true, updatedAt: true } })
  return rows.map((row) => ({ slug: row.slug, lastmod: row.updatedAt }))
}

export async function getHealthPackageSitemapEntries() {
  // Mirrors the `isActive: true` filter used by listHealthPackagesPublic / getHealthPackageBySlugPublic.
  const rows = await prisma.healthPackage.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })
  return rows.map((row) => ({ slug: row.slug, lastmod: row.updatedAt }))
}

export async function getJobSitemapEntries() {
  const rows = await prisma.job.findMany({ select: { slug: true, updatedAt: true } })
  return rows.map((row) => ({ slug: row.slug, lastmod: row.updatedAt }))
}

export async function getMediaArticleSitemapEntries() {
  const rows = await prisma.mediaArticle.findMany({ select: { slug: true, updatedAt: true } })
  return rows.map((row) => ({ slug: row.slug, lastmod: row.updatedAt }))
}

export async function getSuccessStorySitemapEntries() {
  const rows = await prisma.successStory.findMany({ select: { slug: true, updatedAt: true } })
  return rows.map((row) => ({ slug: row.slug, lastmod: row.updatedAt }))
}

export async function getExpertTalkSitemapEntries() {
  const rows = await prisma.expertTalk.findMany({ select: { slug: true, updatedAt: true } })
  return rows.map((row) => ({ slug: row.slug, lastmod: row.updatedAt }))
}

export async function getEventSitemapEntries() {
  const rows = await prisma.event.findMany({ select: { slug: true, updatedAt: true } })
  return rows.map((row) => ({ slug: row.slug, lastmod: row.updatedAt }))
}

export async function getWellnessNetworkSitemapEntries() {
  const rows = await prisma.wellnessNetwork.findMany({ select: { slug: true, updatedAt: true } })
  return rows.map((row) => ({ slug: row.slug, lastmod: row.updatedAt }))
}

// WordPress-sourced: reuses the existing listArticlesForDoctorLinking()
// (already a minimal slug/date/title/link projection) instead of a new query.
export async function getArticleSitemapEntries() {
  const articles = await listArticlesForDoctorLinking()
  return articles.map((article) => ({ slug: article.slug, lastmod: article.date || null }))
}
