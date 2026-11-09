import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from './prisma.js'
import { normalizeWhitespace } from './slug.js'

const CACHE_TAG = 'newsletters'
const PAGE_SIZE = 20

function revalidateNewsletterCaches() {
  try {
    revalidateTag(CACHE_TAG)
    revalidatePath('/newsletters')
  } catch {}
}

function serializePublic(record) {
  return {
    id: record.id,
    title: record.title,
    publishedAt: record.publishedAt,
    featureImage: record.featureImage,
    pdfUrl: record.pdfUrl,
  }
}

function sortClause(sort) {
  if (sort === 'oldest') return { publishedAt: 'asc' }
  if (sort === 'az') return { title: 'asc' }
  return { publishedAt: 'desc' }
}

export async function listNewslettersPublic({ search = '', sort = 'newest', cursor = 0, limit = 3 } = {}) {
  const trimmedSearch = search.trim()
  const take = Math.max(1, Math.min(50, Number(limit) || 3))
  const skip = Math.max(0, Number(cursor) || 0)

  const where = {
    isActive: true,
    ...(trimmedSearch ? { title: { contains: trimmedSearch, mode: 'insensitive' } } : {}),
  }

  const records = await prisma.newsletter.findMany({
    where,
    orderBy: [sortClause(sort), { id: 'desc' }],
    skip,
    take: take + 1,
  })

  const hasMore = records.length > take
  const items = records.slice(0, take).map(serializePublic)

  return { items, hasMore, nextCursor: skip + items.length }
}

export async function listNewslettersAdmin({ search = '', sort = 'newest', page = 1, pageSize = PAGE_SIZE } = {}) {
  const trimmedSearch = search.trim()
  const where = trimmedSearch ? { title: { contains: trimmedSearch, mode: 'insensitive' } } : undefined

  const [total, items] = await Promise.all([
    prisma.newsletter.count({ where }),
    prisma.newsletter.findMany({
      where,
      orderBy: [sortClause(sort), { id: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ])

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
}

export async function getNewsletterByIdAdmin(id) {
  return prisma.newsletter.findUnique({ where: { id } })
}

function validateInput(input) {
  const errors = []
  if (!normalizeWhitespace(input.title)) errors.push('Newsletter Title is required')
  return errors
}

export async function createNewsletterAdmin(input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const maxOrder = await prisma.newsletter.aggregate({ _max: { sortOrder: true } })
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1

  const record = await prisma.newsletter.create({
    data: {
      title: normalizeWhitespace(input.title),
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      featureImage: input.featureImage || null,
      pdfUrl: input.pdfUrl || null,
      isActive: input.isActive !== false,
      sortOrder,
    },
  })

  revalidateNewsletterCaches()
  return record
}

export async function updateNewsletterAdmin(id, input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const record = await prisma.newsletter.update({
    where: { id },
    data: {
      title: normalizeWhitespace(input.title),
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
      ...(input.featureImage !== undefined ? { featureImage: input.featureImage || null } : {}),
      ...(input.pdfUrl !== undefined ? { pdfUrl: input.pdfUrl || null } : {}),
      isActive: input.isActive !== false,
    },
  })

  revalidateNewsletterCaches()
  return record
}

export async function deleteNewsletterAdmin(id) {
  const deleted = await prisma.newsletter.delete({ where: { id } })
  revalidateNewsletterCaches()
  return deleted
}

export async function toggleNewsletterActive(id, isActive) {
  const record = await prisma.newsletter.update({ where: { id }, data: { isActive: Boolean(isActive) } })
  revalidateNewsletterCaches()
  return record
}

export async function importNewslettersFromSource(rows) {
  const report = { totalRows: rows.length, created: 0, skipped: 0, imageDownloaded: 0, imageFailed: 0, pdfDownloaded: 0, pdfFailed: 0, errors: [] }

  const { downloadAndNormalizeImage, downloadAndSavePdf } = await import('./remote-asset-download.js')

  let sortOrder = (await prisma.newsletter.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? -1

  for (const row of rows) {
    try {
      const existing = await prisma.newsletter.findFirst({ where: { title: row.title } })
      if (existing) {
        report.skipped++
        continue
      }

      let featureImage = null
      if (row.imageUrl) {
        try {
          const saved = await downloadAndNormalizeImage(row.imageUrl, 'newsletters', { width: 360, height: 202 })
          featureImage = saved.url
          report.imageDownloaded++
        } catch (error) {
          report.imageFailed++
          report.errors.push(`${row.title}: image download failed — ${error.message}`)
        }
      }

      let pdfUrl = null
      if (row.pdfUrl) {
        try {
          const saved = await downloadAndSavePdf(row.pdfUrl, 'newsletters')
          pdfUrl = saved.url
          report.pdfDownloaded++
        } catch (error) {
          report.pdfFailed++
          report.errors.push(`${row.title}: PDF download failed — ${error.message}`)
        }
      }

      sortOrder++
      await prisma.newsletter.create({
        data: {
          title: row.title,
          publishedAt: row.publishedAt ? new Date(row.publishedAt) : null,
          featureImage,
          pdfUrl,
          isActive: true,
          sortOrder,
        },
      })
      report.created++
    } catch (error) {
      report.skipped++
      report.errors.push(`${row.title}: ${error.message}`)
    }
  }

  return report
}
