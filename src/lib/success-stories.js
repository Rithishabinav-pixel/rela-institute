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

const SUCCESS_STORIES_CACHE_TAG = 'success-stories'
const PUBLIC_SUCCESS_STORIES_REVALIDATE_SECONDS = 3600
const SUCCESS_STORIES_CSV_PATH = path.join(process.cwd(), 'rela-success-stories.csv')
const UPLOAD_FOLDER = 'success-stories'

const downloadAndSaveRemoteImage = (sourceUrl) => downloadAndSaveRemoteImageTo(sourceUrl, UPLOAD_FOLDER)

function revalidateSuccessStoryPaths(slugs) {
  revalidateTag(SUCCESS_STORIES_CACHE_TAG)
  revalidatePath('/success-stories')
  for (const slug of new Set((slugs ?? []).filter(Boolean))) {
    revalidatePath(`/success-stories/${slug}`)
  }
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug || 'success-story'
  let suffix = 2

  for (;;) {
    const existing = await prisma.successStory.findUnique({ where: { slug: candidate } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${baseSlug}-${suffix}`
    suffix++
  }
}

function parseSuccessStoryCsv() {
  const csvText = fs.readFileSync(SUCCESS_STORIES_CSV_PATH, 'utf8')
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

export async function importSuccessStoriesFromCsv() {
  const rows = parseSuccessStoryCsv()

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
        ? await prisma.successStory.findUnique({ where: { pageLink: row.pageLink } })
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

      let successStory
      if (existing) {
        successStory = await prisma.$transaction(async (tx) => {
          await tx.successStoryDepartment.deleteMany({ where: { successStoryId: existing.id } })
          await tx.successStoryDoctor.deleteMany({ where: { successStoryId: existing.id } })
          return tx.successStory.update({
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
        successStory = await prisma.successStory.create({
          data: {
            ...data,
            departments: { create: matchedDepartments.map((d) => ({ departmentId: d.id })) },
            doctors: { create: matchedDoctors.map((d) => ({ doctorId: d.id })) },
          },
        })
        report.created++
      }

      if (row.galleryUrls.length > 0) {
        const existingGallery = await prisma.successStoryGalleryImage.findMany({
          where: { successStoryId: successStory.id },
          select: { sourceUrl: true },
        })
        const alreadyDownloaded = new Set(existingGallery.map((g) => g.sourceUrl).filter(Boolean))

        if (alreadyDownloaded.size === 0) {
          let sortOrder = 0
          for (const galleryUrl of row.galleryUrls) {
            try {
              const saved = await downloadAndSaveRemoteImage(galleryUrl)
              await prisma.successStoryGalleryImage.create({
                data: {
                  successStoryId: successStory.id,
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

const successStoryListSelect = {
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

const successStoryDetailSelect = {
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

function serializeSuccessStoryListItem(story) {
  const videoId = story.featureType === 'video' ? extractYoutubeVideoId(story.youtubeUrl) : null

  return {
    id: story.id,
    title: story.title,
    slug: story.slug,
    publishedAt: story.publishedAt,
    featureType: story.featureType,
    featureImage: story.featureImage,
    youtubeUrl: story.youtubeUrl,
    thumbnailUrl: story.featureType === 'video'
      ? (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null)
      : story.featureImage,
    quickSearch: story.quickSearch,
    departments: story.departments.map((link) => link.department),
  }
}

async function listSuccessStoriesPublicUncached(search, departmentId) {
  const trimmedSearch = search.trim()
  const deptId = Number(departmentId) || null

  const stories = await prisma.successStory.findMany({
    where: {
      ...(trimmedSearch ? { title: { contains: trimmedSearch, mode: 'insensitive' } } : {}),
      ...(deptId ? { departments: { some: { department: { departmentId: deptId } } } } : {}),
    },
    orderBy: { publishedAt: 'desc' },
    select: successStoryListSelect,
  })

  return stories.map(serializeSuccessStoryListItem)
}

const cachedListSuccessStoriesPublic = unstable_cache(listSuccessStoriesPublicUncached, ['success-stories-public-list'], {
  tags: [SUCCESS_STORIES_CACHE_TAG],
  revalidate: PUBLIC_SUCCESS_STORIES_REVALIDATE_SECONDS,
})

export async function listSuccessStoriesPublic({ search = '', departmentId = '' } = {}) {
  return cachedListSuccessStoriesPublic(search, departmentId)
}

function serializeSuccessStoryDetail(story) {
  return {
    id: story.id,
    title: story.title,
    slug: story.slug,
    publishedAt: story.publishedAt,
    featureType: story.featureType,
    featureImage: story.featureImage,
    featureImageSourceUrl: story.featureImageSourceUrl,
    youtubeUrl: story.youtubeUrl,
    readMoreUrl: story.readMoreUrl,
    pageLink: story.pageLink,
    content: sanitizeRichHtml(story.content),
    departments: story.departments.map((link) => link.department),
    doctors: story.doctors.map((link) => link.doctor),
    gallery: story.gallery,
  }
}

async function getSuccessStoryBySlugPublicUncached(slug) {
  const story = await prisma.successStory.findUnique({ where: { slug }, select: successStoryDetailSelect })
  if (!story) return null
  return serializeSuccessStoryDetail(story)
}

const cachedGetSuccessStoryBySlugPublic = unstable_cache(
  getSuccessStoryBySlugPublicUncached,
  ['success-story-public-detail'],
  { tags: [SUCCESS_STORIES_CACHE_TAG], revalidate: PUBLIC_SUCCESS_STORIES_REVALIDATE_SECONDS }
)

export async function getSuccessStoryBySlugPublic(slug) {
  return cachedGetSuccessStoryBySlugPublic(slug)
}

async function getRelatedSuccessStoriesUncached(storyId, departmentIds, limit) {
  if (departmentIds.length > 0) {
    const related = await prisma.successStory.findMany({
      where: {
        id: { not: storyId },
        departments: { some: { departmentId: { in: departmentIds } } },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: successStoryListSelect,
    })
    if (related.length > 0) return related.map(serializeSuccessStoryListItem)
  }

  const fallback = await prisma.successStory.findMany({
    where: { id: { not: storyId } },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: successStoryListSelect,
  })

  return fallback.map(serializeSuccessStoryListItem)
}

const cachedGetRelatedSuccessStories = unstable_cache(
  getRelatedSuccessStoriesUncached,
  ['success-story-public-related'],
  { tags: [SUCCESS_STORIES_CACHE_TAG], revalidate: PUBLIC_SUCCESS_STORIES_REVALIDATE_SECONDS }
)

export async function getRelatedSuccessStories(storyId, departmentIds, limit = 5) {
  return cachedGetRelatedSuccessStories(storyId, departmentIds, limit)
}

async function getSuccessStoryDepartmentsUncached(quickSearchOnly) {
  const links = await prisma.successStoryDepartment.findMany({
    where: quickSearchOnly ? { successStory: { quickSearch: true } } : undefined,
    select: { department: { select: { id: true, departmentId: true, name: true } } },
  })

  const byId = new Map()
  for (const link of links) byId.set(link.department.id, link.department)

  return [...byId.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((department) => ({ id: department.departmentId, name: department.name }))
}

const cachedGetSuccessStoryDepartmentsForFilter = unstable_cache(
  () => getSuccessStoryDepartmentsUncached(true),
  ['success-stories-filter-departments'],
  { tags: [SUCCESS_STORIES_CACHE_TAG], revalidate: PUBLIC_SUCCESS_STORIES_REVALIDATE_SECONDS }
)

const cachedGetSuccessStoryDepartmentsForDropdown = unstable_cache(
  () => getSuccessStoryDepartmentsUncached(false),
  ['success-stories-dropdown-departments'],
  { tags: [SUCCESS_STORIES_CACHE_TAG], revalidate: PUBLIC_SUCCESS_STORIES_REVALIDATE_SECONDS }
)

export async function getSuccessStoryDepartmentsForFilter() {
  return cachedGetSuccessStoryDepartmentsForFilter()
}

export async function getSuccessStoryDepartmentsForDropdown() {
  return cachedGetSuccessStoryDepartmentsForDropdown()
}

export async function listSuccessStoriesAdmin({ search = '', page = 1, pageSize = 20 } = {}) {
  const trimmedSearch = search.trim()
  const where = trimmedSearch ? { title: { contains: trimmedSearch, mode: 'insensitive' } } : undefined

  const [total, stories] = await Promise.all([
    prisma.successStory.count({ where }),
    prisma.successStory.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        ...successStoryListSelect,
        createdAt: true,
        updatedAt: true,
        doctors: { select: { doctor: { select: { id: true, name: true } } } },
      },
    }),
  ])

  return {
    stories: stories.map((story) => ({
      id: story.id,
      title: story.title,
      slug: story.slug,
      publishedAt: story.publishedAt,
      featureType: story.featureType,
      featureImage: story.featureImage,
      youtubeUrl: story.youtubeUrl,
      quickSearch: story.quickSearch,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      departments: story.departments.map((link) => link.department),
      doctors: story.doctors.map((link) => link.doctor),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export async function getSuccessStoryByIdAdmin(id) {
  const story = await prisma.successStory.findUnique({ where: { id }, select: successStoryDetailSelect })
  if (!story) return null

  return {
    id: story.id,
    title: story.title,
    slug: story.slug,
    publishedAt: story.publishedAt,
    featureType: story.featureType,
    featureImage: story.featureImage,
    featureImageSourceUrl: story.featureImageSourceUrl,
    youtubeUrl: story.youtubeUrl,
    readMoreUrl: story.readMoreUrl,
    pageLink: story.pageLink,
    content: story.content,
    departments: story.departments.map((link) => link.department),
    doctors: story.doctors.map((link) => link.doctor),
    gallery: story.gallery,
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

function validateSuccessStoryInput(input) {
  const errors = []

  if (!normalizeWhitespace(input.title)) errors.push('Title is required')
  if (!normalizeWhitespace(input.slug)) errors.push('Slug is required')
  if (input.featureType === 'video') {
    const trimmedUrl = normalizeWhitespace(input.youtubeUrl)
    if (!trimmedUrl) errors.push('YouTube URL is required when feature type is Video')
    else if (!normalizeYoutubeUrl(trimmedUrl)) errors.push('Could not recognize this as a valid YouTube URL')
  }

  return errors
}

export async function createSuccessStoryAdmin(input) {
  const errors = validateSuccessStoryInput(input)
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

  const story = await prisma.successStory.create({
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

  revalidateSuccessStoryPaths([story.slug])

  return story
}

export async function updateSuccessStoryAdmin(id, input) {
  const errors = validateSuccessStoryInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const existing = await prisma.successStory.findUnique({ where: { id }, select: { slug: true } })
  if (!existing) throw new Error('Success story not found')

  const internalDepartmentIds = await departmentIdsToInternalIds(input.departmentIds)
  const validDoctorIds = await doctorIdsToValidIds(input.doctorIds)

  let slug = existing.slug
  if (input.slug && slugify(input.slug) !== existing.slug) {
    slug = await ensureUniqueSlug(slugify(input.slug), id)
  }

  const isVideo = input.featureType === 'video'

  await prisma.$transaction([
    prisma.successStoryDepartment.deleteMany({ where: { successStoryId: id } }),
    prisma.successStoryDoctor.deleteMany({ where: { successStoryId: id } }),
    prisma.successStoryGalleryImage.deleteMany({ where: { successStoryId: id } }),
    prisma.successStory.update({
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

  const updated = await prisma.successStory.findUnique({ where: { id } })
  revalidateSuccessStoryPaths([existing.slug, updated.slug])

  return updated
}

export async function deleteSuccessStoryAdmin(id) {
  const deleted = await prisma.successStory.delete({ where: { id } })
  revalidateSuccessStoryPaths([deleted.slug])
  return deleted
}

const TOGGLEABLE_SUCCESS_STORY_FIELDS = new Set(['quickSearch'])

export async function toggleSuccessStoryField(id, field, value) {
  if (!TOGGLEABLE_SUCCESS_STORY_FIELDS.has(field)) {
    throw new Error(`"${field}" is not a toggleable success story field`)
  }

  const story = await prisma.successStory.update({
    where: { id },
    data: { [field]: Boolean(value) },
    select: { id: true, slug: true, quickSearch: true },
  })

  revalidateSuccessStoryPaths([story.slug])

  return story
}
