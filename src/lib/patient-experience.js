import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from './prisma.js'
import { normalizeWhitespace } from './slug.js'
import { normalizeYoutubeUrl } from './press-content-helpers.js'

const CACHE_TAG = 'patient-experience'
const PAGE_SIZE = 20

function revalidateCaches() {
  try {
    revalidateTag(CACHE_TAG)
    revalidatePath('/patient-experience')
  } catch {}
}

function serializePublic(record) {
  return {
    id: record.id,
    patientName: record.patientName,
    categoryId: record.categoryId,
    featureImage: record.featureImage,
    videoUrl: record.videoUrl,
  }
}

export async function listPatientExperiencesPublic({ search = '', categoryId = null, cursor = 0, limit = 3 } = {}) {
  const trimmedSearch = search.trim()
  const take = Math.max(1, Math.min(50, Number(limit) || 3))
  const skip = Math.max(0, Number(cursor) || 0)

  const where = {
    isActive: true,
    category: { isActive: true },
    ...(categoryId ? { categoryId: Number(categoryId) } : {}),
    ...(trimmedSearch ? { patientName: { contains: trimmedSearch, mode: 'insensitive' } } : {}),
  }

  const records = await prisma.patientExperience.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }],
    skip,
    take: take + 1,
  })

  const hasMore = records.length > take
  const items = records.slice(0, take).map(serializePublic)

  return { items, hasMore, nextCursor: skip + items.length }
}

export async function listPatientExperiencesAdmin({ search = '', categoryId = null, page = 1, pageSize = PAGE_SIZE } = {}) {
  const trimmedSearch = search.trim()
  const where = {
    ...(categoryId ? { categoryId: Number(categoryId) } : {}),
    ...(trimmedSearch ? { patientName: { contains: trimmedSearch, mode: 'insensitive' } } : {}),
  }

  const [total, items] = await Promise.all([
    prisma.patientExperience.count({ where }),
    prisma.patientExperience.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: { select: { id: true, name: true } } },
    }),
  ])

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
}

export async function getPatientExperienceByIdAdmin(id) {
  return prisma.patientExperience.findUnique({ where: { id } })
}

function validateInput(input) {
  const errors = []
  if (!normalizeWhitespace(input.patientName)) errors.push('Patient Name is required')
  if (!input.categoryId) errors.push('Category is required')

  const trimmedUrl = normalizeWhitespace(input.videoUrl)
  if (!trimmedUrl) errors.push('Video Embed URL is required')
  else if (!normalizeYoutubeUrl(trimmedUrl)) errors.push('Could not recognize this as a valid YouTube video URL')

  return errors
}

export async function createPatientExperienceAdmin(input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const maxOrder = await prisma.patientExperience.aggregate({ _max: { sortOrder: true } })
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1

  const record = await prisma.patientExperience.create({
    data: {
      patientName: normalizeWhitespace(input.patientName),
      categoryId: Number(input.categoryId),
      featureImage: input.featureImage || null,
      videoUrl: normalizeYoutubeUrl(input.videoUrl) || normalizeWhitespace(input.videoUrl),
      isActive: input.isActive !== false,
      sortOrder,
    },
  })

  revalidateCaches()
  return record
}

export async function updatePatientExperienceAdmin(id, input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const record = await prisma.patientExperience.update({
    where: { id },
    data: {
      patientName: normalizeWhitespace(input.patientName),
      categoryId: Number(input.categoryId),
      ...(input.featureImage !== undefined ? { featureImage: input.featureImage || null } : {}),
      videoUrl: normalizeYoutubeUrl(input.videoUrl) || normalizeWhitespace(input.videoUrl),
      isActive: input.isActive !== false,
    },
  })

  revalidateCaches()
  return record
}

export async function deletePatientExperienceAdmin(id) {
  const deleted = await prisma.patientExperience.delete({ where: { id } })
  revalidateCaches()
  return deleted
}

export async function togglePatientExperienceActive(id, isActive) {
  const record = await prisma.patientExperience.update({ where: { id }, data: { isActive: Boolean(isActive) } })
  revalidateCaches()
  return record
}

export async function importPatientExperiencesFromSource(rows, fallbackCategoryName) {
  const { downloadAndNormalizeImage } = await import('./remote-asset-download.js')
  const { ensurePatientExperienceCategoryExists } = await import('./patient-experience-categories.js')

  const report = { totalRows: rows.length, created: 0, skipped: 0, imageDownloaded: 0, imageFailed: 0, errors: [] }

  const fallbackCategory = await ensurePatientExperienceCategoryExists(fallbackCategoryName)
  let sortOrder = (await prisma.patientExperience.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? -1

  for (const row of rows) {
    try {
      const normalizedVideo = normalizeYoutubeUrl(row.videoUrl) || row.videoUrl
      const existing = await prisma.patientExperience.findFirst({ where: { videoUrl: normalizedVideo } })
      if (existing) {
        report.skipped++
        continue
      }

      const category = row.categoryName
        ? await ensurePatientExperienceCategoryExists(row.categoryName)
        : fallbackCategory

      let featureImage = null
      if (row.imageUrl) {
        try {
          const saved = await downloadAndNormalizeImage(row.imageUrl, 'patient-experience', null)
          featureImage = saved.url
          report.imageDownloaded++
        } catch (error) {
          report.imageFailed++
          report.errors.push(`${row.patientName}: image download failed — ${error.message}`)
        }
      }

      sortOrder++
      await prisma.patientExperience.create({
        data: {
          patientName: row.patientName,
          categoryId: category.id,
          featureImage,
          videoUrl: normalizedVideo,
          isActive: true,
          sortOrder,
        },
      })
      report.created++
    } catch (error) {
      report.skipped++
      report.errors.push(`${row.patientName}: ${error.message}`)
    }
  }

  revalidateCaches()
  return report
}
