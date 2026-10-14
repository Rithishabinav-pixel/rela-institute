import fs from 'node:fs'
import path from 'node:path'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { prisma } from './prisma.js'
import { parseCsvSafe } from './csv.js'
import { sanitizeRichHtml } from './sanitize-html.js'
import { normalizeWhitespace, slugify } from './slug.js'
import {
  splitNames,
  resolveDepartmentsByName,
  resolveDoctorsByName,
  normalizeYoutubeUrl,
  extractYoutubeVideoId,
  parseCsvDate,
  downloadAndSaveRemoteImage as downloadAndSaveRemoteImageTo,
} from './press-content-helpers.js'

const MEDIA_ARTICLES_CACHE_TAG = 'media-articles'
const PUBLIC_MEDIA_ARTICLES_REVALIDATE_SECONDS = 3600
const MEDIA_ARTICLES_CSV_PATH = path.join(process.cwd(), 'rela-media.csv')
const UPLOAD_FOLDER = 'media-articles'

const downloadAndSaveRemoteImage = (sourceUrl) => downloadAndSaveRemoteImageTo(sourceUrl, UPLOAD_FOLDER)

function revalidateMediaArticlePaths(slugs) {
  revalidateTag(MEDIA_ARTICLES_CACHE_TAG)
  revalidatePath('/media')
  for (const slug of new Set((slugs ?? []).filter(Boolean))) {
    revalidatePath(`/media/${slug}`)
  }
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug || 'media-article'
  let suffix = 2

  for (;;) {
    const existing = await prisma.mediaArticle.findUnique({ where: { slug: candidate } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${baseSlug}-${suffix}`
    suffix++
  }
}

function parseMediaArticleCsv() {
  const csvText = fs.readFileSync(MEDIA_ARTICLES_CSV_PATH, 'utf8')
  const { header, rows } = parseCsvSafe(csvText)
  const idx = (name) => header.indexOf(name)

  const col = {
    title: idx('title'),
    date: idx('date'),
    featureImage: idx('feature_image'),
    link: idx('link'),
    department: idx('department'),
    doctor: idx('doctor'),
    content: idx('content'),
    gallery: idx('gallery'),
    pageLink: idx('page_link'),
  }

  return rows
    .map((row) => ({
      title: normalizeWhitespace(row[col.title]),
      publishedAt: parseCsvDate(row[col.date]),
      featureImageUrl: normalizeWhitespace(row[col.featureImage]),
      readMoreUrl: normalizeWhitespace(row[col.link]),
      departmentNames: splitNames(row[col.department]),
      doctorNames: splitNames(row[col.doctor]),
      content: (row[col.content] ?? '').trim(),
      galleryUrls: splitNames(row[col.gallery]),
      pageLink: normalizeWhitespace(row[col.pageLink]),
    }))
    .filter((r) => r.title)
}

export async function importMediaArticlesFromCsv() {
  const rows = parseMediaArticleCsv()

  const report = {
    totalRows: rows.length,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    unmatchedDepartments: new Set(),
    unmatchedDoctors: new Set(),
    featureImageDownloaded: 0,
    featureImageFailed: 0,
    galleryImageDownloaded: 0,
    galleryImageFailed: 0,
    unresolvedRelationships: [],
  }

  for (const row of rows) {
    try {
      const { matched: matchedDepartments, unmatched: unmatchedDeptNames } = await resolveDepartmentsByName(
        row.departmentNames
      )
      const { matched: matchedDoctors, unmatched: unmatchedDocNames } = await resolveDoctorsByName(row.doctorNames)

      unmatchedDeptNames.forEach((n) => report.unmatchedDepartments.add(n))
      unmatchedDocNames.forEach((n) => report.unmatchedDoctors.add(n))
      if (unmatchedDeptNames.length > 0 || unmatchedDocNames.length > 0) {
        report.unresolvedRelationships.push({
          title: row.title,
          unmatchedDepartments: unmatchedDeptNames,
          unmatchedDoctors: unmatchedDocNames,
        })
      }

      const existing = row.pageLink
        ? await prisma.mediaArticle.findUnique({ where: { pageLink: row.pageLink } })
        : null

      const isVideo = /youtube\.com|youtu\.be/i.test(row.featureImageUrl)
      let featureType = 'image'
      let featureImage = existing?.featureImage ?? null
      let featureImageSourceUrl = existing?.featureImageSourceUrl ?? null
      let youtubeUrl = existing?.youtubeUrl ?? null

      if (isVideo) {
        featureType = 'video'
        youtubeUrl = normalizeYoutubeUrl(row.featureImageUrl) || row.featureImageUrl
        featureImage = null
        featureImageSourceUrl = null
      } else if (row.featureImageUrl) {
        if (!existing || existing.featureImageSourceUrl !== row.featureImageUrl || !existing.featureImage) {
          try {
            const saved = await downloadAndSaveRemoteImage(row.featureImageUrl)
            featureImage = saved.url
            featureImageSourceUrl = row.featureImageUrl
            report.featureImageDownloaded++
          } catch (error) {
            report.featureImageFailed++
            report.errors.push(`${row.title}: feature image download failed — ${error.message}`)
          }
        }
      } else {
        featureImage = null
        featureImageSourceUrl = null
      }

      const baseSlug = slugify(row.title)
      const slug = existing ? existing.slug : await ensureUniqueSlug(baseSlug)

      const sanitizedContent = sanitizeRichHtml(row.content)

      const data = {
        title: row.title,
        slug,
        publishedAt: row.publishedAt,
        featureType,
        featureImage,
        featureImageSourceUrl,
        youtubeUrl,
        readMoreUrl: row.readMoreUrl || null,
        pageLink: row.pageLink || null,
        content: sanitizedContent,
      }

      let mediaArticle
      if (existing) {
        mediaArticle = await prisma.$transaction(async (tx) => {
          await tx.mediaArticleDepartment.deleteMany({ where: { mediaArticleId: existing.id } })
          await tx.mediaArticleDoctor.deleteMany({ where: { mediaArticleId: existing.id } })
          return tx.mediaArticle.update({
            where: { id: existing.id },
            data: {
              ...data,
              departments: { create: matchedDepartments.map((d) => ({ departmentId: d.id })) },
              doctors: { create: matchedDoctors.map((d) => ({ doctorId: d.id })) },
            },
          })
        })
        report.updated++
      } else {
        mediaArticle = await prisma.mediaArticle.create({
          data: {
            ...data,
            departments: { create: matchedDepartments.map((d) => ({ departmentId: d.id })) },
            doctors: { create: matchedDoctors.map((d) => ({ doctorId: d.id })) },
          },
        })
        report.created++
      }

      if (row.galleryUrls.length > 0) {
        const existingGallery = await prisma.mediaArticleGalleryImage.findMany({
          where: { mediaArticleId: mediaArticle.id },
          select: { sourceUrl: true },
        })
        const alreadyDownloaded = new Set(existingGallery.map((g) => g.sourceUrl).filter(Boolean))

        if (alreadyDownloaded.size === 0) {
          let sortOrder = 0
          for (const galleryUrl of row.galleryUrls) {
            try {
              const saved = await downloadAndSaveRemoteImage(galleryUrl)
              await prisma.mediaArticleGalleryImage.create({
                data: {
                  mediaArticleId: mediaArticle.id,
                  imagePath: saved.url,
                  sourceUrl: galleryUrl,
                  sortOrder: sortOrder++,
                },
              })
              report.galleryImageDownloaded++
            } catch (error) {
              report.galleryImageFailed++
              report.errors.push(`${row.title}: gallery image download failed (${galleryUrl}) — ${error.message}`)
            }
          }
        }
      }
    } catch (error) {
      report.skipped++
      report.errors.push(`${row.title || '(untitled row)'}: ${error.message}`)
    }
  }

  return {
    ...report,
    unmatchedDepartments: [...report.unmatchedDepartments],
    unmatchedDoctors: [...report.unmatchedDoctors],
  }
}

const mediaArticleListSelect = {
  id: true,
  title: true,
  slug: true,
  publishedAt: true,
  featureType: true,
  featureImage: true,
  youtubeUrl: true,
  quickSearch: true,
  departments: { select: { department: { select: { id: true, departmentId: true, name: true } } } },
}

const mediaArticleDetailSelect = {
  id: true,
  title: true,
  slug: true,
  publishedAt: true,
  featureType: true,
  featureImage: true,
  featureImageSourceUrl: true,
  youtubeUrl: true,
  readMoreUrl: true,
  pageLink: true,
  content: true,
  departments: {
    select: {
      department: {
        select: {
          id: true,
          departmentId: true,
          name: true,
          icon: true,
          slug: true,
          symptoms: { select: { name: true }, orderBy: { sortOrder: 'asc' } },
        },
      },
    },
  },
  doctors: {
    select: {
      doctor: {
        select: {
          id: true,
          slug: true,
          name: true,
          image: true,
          position: true,
          speciality: { select: { id: true, departmentId: true, name: true } },
        },
      },
    },
  },
  gallery: { orderBy: { sortOrder: 'asc' }, select: { id: true, imagePath: true, altText: true, sortOrder: true } },
}

function serializeMediaArticleListItem(article) {
  const videoId = article.featureType === 'video' ? extractYoutubeVideoId(article.youtubeUrl) : null

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    publishedAt: article.publishedAt,
    featureType: article.featureType,
    featureImage: article.featureImage,
    youtubeUrl: article.youtubeUrl,
    thumbnailUrl:
      article.featureType === 'video'
        ? videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : null
        : article.featureImage,
    quickSearch: article.quickSearch,
    departments: article.departments.map((link) => link.department),
  }
}

async function listMediaArticlesPublicUncached(search, departmentId) {
  const trimmedSearch = search.trim()
  const deptId = Number(departmentId) || null

  const articles = await prisma.mediaArticle.findMany({
    where: {
      ...(trimmedSearch ? { title: { contains: trimmedSearch, mode: 'insensitive' } } : {}),
      ...(deptId ? { departments: { some: { department: { departmentId: deptId } } } } : {}),
    },
    orderBy: { publishedAt: 'desc' },
    select: mediaArticleListSelect,
  })

  return articles.map(serializeMediaArticleListItem)
}

const cachedListMediaArticlesPublic = unstable_cache(listMediaArticlesPublicUncached, ['media-articles-public-list'], {
  tags: [MEDIA_ARTICLES_CACHE_TAG],
  revalidate: PUBLIC_MEDIA_ARTICLES_REVALIDATE_SECONDS,
})

export async function listMediaArticlesPublic({ search = '', departmentId = '' } = {}) {
  return cachedListMediaArticlesPublic(search, departmentId)
}

function serializeMediaArticleDetail(article) {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    publishedAt: article.publishedAt,
    featureType: article.featureType,
    featureImage: article.featureImage,
    featureImageSourceUrl: article.featureImageSourceUrl,
    youtubeUrl: article.youtubeUrl,
    readMoreUrl: article.readMoreUrl,
    pageLink: article.pageLink,
    content: sanitizeRichHtml(article.content),
    departments: article.departments.map((link) => link.department),
    doctors: article.doctors.map((link) => link.doctor),
    gallery: article.gallery,
  }
}

async function getMediaArticleBySlugPublicUncached(slug) {
  const article = await prisma.mediaArticle.findUnique({ where: { slug }, select: mediaArticleDetailSelect })
  if (!article) return null
  return serializeMediaArticleDetail(article)
}

const cachedGetMediaArticleBySlugPublic = unstable_cache(
  getMediaArticleBySlugPublicUncached,
  ['media-article-public-detail'],
  { tags: [MEDIA_ARTICLES_CACHE_TAG], revalidate: PUBLIC_MEDIA_ARTICLES_REVALIDATE_SECONDS }
)

export async function getMediaArticleBySlugPublic(slug) {
  return cachedGetMediaArticleBySlugPublic(slug)
}

async function getRelatedMediaArticlesUncached(articleId, departmentIds, limit) {
  if (departmentIds.length > 0) {
    const related = await prisma.mediaArticle.findMany({
      where: {
        id: { not: articleId },
        departments: { some: { departmentId: { in: departmentIds } } },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: mediaArticleListSelect,
    })
    if (related.length > 0) return related.map(serializeMediaArticleListItem)
  }

  const fallback = await prisma.mediaArticle.findMany({
    where: { id: { not: articleId } },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: mediaArticleListSelect,
  })

  return fallback.map(serializeMediaArticleListItem)
}

const cachedGetRelatedMediaArticles = unstable_cache(
  getRelatedMediaArticlesUncached,
  ['media-article-public-related'],
  { tags: [MEDIA_ARTICLES_CACHE_TAG], revalidate: PUBLIC_MEDIA_ARTICLES_REVALIDATE_SECONDS }
)

export async function getRelatedMediaArticles(articleId, departmentIds, limit = 5) {
  return cachedGetRelatedMediaArticles(articleId, departmentIds, limit)
}

async function getMediaArticleDepartmentsUncached(quickSearchOnly) {
  const links = await prisma.mediaArticleDepartment.findMany({
    where: quickSearchOnly ? { mediaArticle: { quickSearch: true } } : undefined,
    select: { department: { select: { id: true, departmentId: true, name: true } } },
  })

  const byId = new Map()
  for (const link of links) byId.set(link.department.id, link.department)

  return [...byId.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((department) => ({ id: department.departmentId, name: department.name }))
}

const cachedGetMediaArticleDepartmentsForFilter = unstable_cache(
  () => getMediaArticleDepartmentsUncached(true),
  ['media-articles-filter-departments'],
  { tags: [MEDIA_ARTICLES_CACHE_TAG], revalidate: PUBLIC_MEDIA_ARTICLES_REVALIDATE_SECONDS }
)

const cachedGetMediaArticleDepartmentsForDropdown = unstable_cache(
  () => getMediaArticleDepartmentsUncached(false),
  ['media-articles-dropdown-departments'],
  { tags: [MEDIA_ARTICLES_CACHE_TAG], revalidate: PUBLIC_MEDIA_ARTICLES_REVALIDATE_SECONDS }
)

export async function getMediaArticleDepartmentsForFilter() {
  return cachedGetMediaArticleDepartmentsForFilter()
}

export async function getMediaArticleDepartmentsForDropdown() {
  return cachedGetMediaArticleDepartmentsForDropdown()
}

export async function listMediaArticlesAdmin({ search = '', page = 1, pageSize = 20 } = {}) {
  const trimmedSearch = search.trim()
  const where = trimmedSearch ? { title: { contains: trimmedSearch, mode: 'insensitive' } } : undefined

  const [total, articles] = await Promise.all([
    prisma.mediaArticle.count({ where }),
    prisma.mediaArticle.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        ...mediaArticleListSelect,
        createdAt: true,
        updatedAt: true,
        doctors: { select: { doctor: { select: { id: true, name: true } } } },
      },
    }),
  ])

  return {
    articles: articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      publishedAt: article.publishedAt,
      featureType: article.featureType,
      featureImage: article.featureImage,
      youtubeUrl: article.youtubeUrl,
      quickSearch: article.quickSearch,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      departments: article.departments.map((link) => link.department),
      doctors: article.doctors.map((link) => link.doctor),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export async function getMediaArticleByIdAdmin(id) {
  const article = await prisma.mediaArticle.findUnique({ where: { id }, select: mediaArticleDetailSelect })
  if (!article) return null

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    publishedAt: article.publishedAt,
    featureType: article.featureType,
    featureImage: article.featureImage,
    featureImageSourceUrl: article.featureImageSourceUrl,
    youtubeUrl: article.youtubeUrl,
    readMoreUrl: article.readMoreUrl,
    pageLink: article.pageLink,
    content: article.content,
    departments: article.departments.map((link) => link.department),
    doctors: article.doctors.map((link) => link.doctor),
    gallery: article.gallery,
  }
}

async function departmentIdsToInternalIds(departmentIds) {
  if (!Array.isArray(departmentIds) || departmentIds.length === 0) return []
  const departments = await prisma.department.findMany({
    where: { departmentId: { in: departmentIds.map(Number) } },
    select: { id: true },
  })
  return departments.map((d) => d.id)
}

async function doctorIdsToValidIds(doctorIds) {
  if (!Array.isArray(doctorIds) || doctorIds.length === 0) return []
  const doctors = await prisma.doctor.findMany({
    where: { id: { in: doctorIds.map(Number) } },
    select: { id: true },
  })
  return doctors.map((d) => d.id)
}

function validateMediaArticleInput(input) {
  const errors = []

  if (!normalizeWhitespace(input.title)) errors.push('Title is required')
  if (!normalizeWhitespace(input.slug)) errors.push('Slug is required')
  if (input.featureType === 'video' && !normalizeWhitespace(input.youtubeUrl)) {
    errors.push('YouTube URL is required when feature type is Video')
  }

  return errors
}

export async function createMediaArticleAdmin(input) {
  const errors = validateMediaArticleInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const internalDepartmentIds = await departmentIdsToInternalIds(input.departmentIds)
  const validDoctorIds = await doctorIdsToValidIds(input.doctorIds)

  const baseSlug = slugify(input.slug || input.title)
  const slug = await ensureUniqueSlug(baseSlug)

  const isVideo = input.featureType === 'video'

  const article = await prisma.mediaArticle.create({
    data: {
      title: normalizeWhitespace(input.title),
      slug,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      featureType: isVideo ? 'video' : 'image',
      featureImage: isVideo ? null : input.featureImage || null,
      featureImageSourceUrl: isVideo ? null : input.featureImageSourceUrl || null,
      youtubeUrl: isVideo ? normalizeYoutubeUrl(input.youtubeUrl) || normalizeWhitespace(input.youtubeUrl) : null,
      readMoreUrl: normalizeWhitespace(input.readMoreUrl) || null,
      pageLink: normalizeWhitespace(input.pageLink) || null,
      content: sanitizeRichHtml(input.content),
      departments: { create: internalDepartmentIds.map((id) => ({ departmentId: id })) },
      doctors: { create: validDoctorIds.map((id) => ({ doctorId: id })) },
      gallery: {
        create: (input.gallery ?? []).map((image, index) => ({
          imagePath: image.imagePath,
          altText: image.altText || null,
          sortOrder: index,
        })),
      },
    },
  })

  revalidateMediaArticlePaths([article.slug])

  return article
}

export async function updateMediaArticleAdmin(id, input) {
  const errors = validateMediaArticleInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const existing = await prisma.mediaArticle.findUnique({ where: { id }, select: { slug: true } })
  if (!existing) throw new Error('Media article not found')

  const internalDepartmentIds = await departmentIdsToInternalIds(input.departmentIds)
  const validDoctorIds = await doctorIdsToValidIds(input.doctorIds)

  let slug = existing.slug
  if (input.slug && slugify(input.slug) !== existing.slug) {
    slug = await ensureUniqueSlug(slugify(input.slug), id)
  }

  const isVideo = input.featureType === 'video'

  await prisma.$transaction([
    prisma.mediaArticleDepartment.deleteMany({ where: { mediaArticleId: id } }),
    prisma.mediaArticleDoctor.deleteMany({ where: { mediaArticleId: id } }),
    prisma.mediaArticleGalleryImage.deleteMany({ where: { mediaArticleId: id } }),
    prisma.mediaArticle.update({
      where: { id },
      data: {
        slug,
        title: normalizeWhitespace(input.title),
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        featureType: isVideo ? 'video' : 'image',
        featureImage: isVideo ? null : input.featureImage || null,
        featureImageSourceUrl: isVideo ? null : input.featureImageSourceUrl || null,
        youtubeUrl: isVideo ? normalizeYoutubeUrl(input.youtubeUrl) || normalizeWhitespace(input.youtubeUrl) : null,
        readMoreUrl: normalizeWhitespace(input.readMoreUrl) || null,
        pageLink: normalizeWhitespace(input.pageLink) || null,
        content: sanitizeRichHtml(input.content),
        departments: { create: internalDepartmentIds.map((depId) => ({ departmentId: depId })) },
        doctors: { create: validDoctorIds.map((docId) => ({ doctorId: docId })) },
        gallery: {
          create: (input.gallery ?? []).map((image, index) => ({
            imagePath: image.imagePath,
            altText: image.altText || null,
            sortOrder: index,
          })),
        },
      },
    }),
  ])

  const updated = await prisma.mediaArticle.findUnique({ where: { id } })
  revalidateMediaArticlePaths([existing.slug, updated.slug])

  return updated
}

export async function deleteMediaArticleAdmin(id) {
  const deleted = await prisma.mediaArticle.delete({ where: { id } })
  revalidateMediaArticlePaths([deleted.slug])
  return deleted
}

const TOGGLEABLE_MEDIA_ARTICLE_FIELDS = new Set(['quickSearch'])

export async function toggleMediaArticleField(id, field, value) {
  if (!TOGGLEABLE_MEDIA_ARTICLE_FIELDS.has(field)) {
    throw new Error(`"${field}" is not a toggleable media article field`)
  }

  const article = await prisma.mediaArticle.update({
    where: { id },
    data: { [field]: Boolean(value) },
    select: { id: true, slug: true, quickSearch: true },
  })

  revalidateMediaArticlePaths([article.slug])

  return article
}
