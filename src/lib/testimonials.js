import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from './prisma.js'
import { normalizeWhitespace } from './slug.js'

const CACHE_TAG = 'testimonials'
const PAGE_SIZE = 20

function revalidateCaches() {
  try {
    revalidateTag(CACHE_TAG)
    revalidatePath('/')
    revalidatePath('/testimonials-and-reviews')
    revalidatePath('/international-patients')
    for (const slug of ['adyar', 'kumaran', 'nanganallur', 'pallikaranai', 'red-hills']) {
      revalidatePath(`/locations/${slug}`)
    }
  } catch {}
}

function serializePublic(record) {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    userName: record.userName,
    userImage: record.userImage,
    featureImage: record.featureImage,
    categoryId: record.categoryId,
    isInternational: record.isInternational,
    isFeatured: record.isFeatured,
  }
}

function sortClause(sort) {
  if (sort === 'oldest') return { createdAt: 'asc' }
  if (sort === 'az') return { userName: 'asc' }
  return { sortOrder: 'asc' }
}

async function listTestimonials({ search = '', sort = 'newest', categoryId = null, international = null, featured = null, cursor = 0, limit = 3 } = {}) {
  const trimmedSearch = search.trim()
  const take = Math.max(1, Math.min(50, Number(limit) || 3))
  const skip = Math.max(0, Number(cursor) || 0)

  const where = {
    isActive: true,
    category: { isActive: true },
    ...(categoryId ? { categoryId: Number(categoryId) } : {}),
    ...(international !== null ? { isInternational: Boolean(international) } : {}),
    ...(featured !== null ? { isFeatured: Boolean(featured) } : {}),
    ...(trimmedSearch
      ? { OR: [{ title: { contains: trimmedSearch, mode: 'insensitive' } }, { userName: { contains: trimmedSearch, mode: 'insensitive' } }] }
      : {}),
  }

  const records = await prisma.testimonial.findMany({
    where,
    orderBy: [sortClause(sort), { id: 'desc' }],
    skip,
    take: take + 1,
  })

  const hasMore = records.length > take
  const items = records.slice(0, take).map(serializePublic)

  return { items, hasMore, nextCursor: skip + items.length }
}

export async function listAllTestimonialsPublic(params = {}) {
  return listTestimonials(params)
}

export async function listInternationalTestimonialsPublic(params = {}) {
  return listTestimonials({ ...params, international: true })
}

export async function listFeaturedTestimonialsPublic(params = {}) {
  return listTestimonials({ ...params, featured: true })
}

export async function listFeaturedInternationalTestimonialsPublic(params = {}) {
  return listTestimonials({ ...params, featured: true, international: true })
}

export async function listTestimonialsAdmin({ search = '', categoryId = null, international = null, featured = null, page = 1, pageSize = PAGE_SIZE } = {}) {
  const trimmedSearch = search.trim()
  const where = {
    ...(categoryId ? { categoryId: Number(categoryId) } : {}),
    ...(international !== null ? { isInternational: Boolean(international) } : {}),
    ...(featured !== null ? { isFeatured: Boolean(featured) } : {}),
    ...(trimmedSearch
      ? { OR: [{ title: { contains: trimmedSearch, mode: 'insensitive' } }, { userName: { contains: trimmedSearch, mode: 'insensitive' } }] }
      : {}),
  }

  const [total, items] = await Promise.all([
    prisma.testimonial.count({ where }),
    prisma.testimonial.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: { select: { id: true, name: true } } },
    }),
  ])

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
}

export async function getTestimonialByIdAdmin(id) {
  return prisma.testimonial.findUnique({ where: { id } })
}

function validateInput(input) {
  const errors = []
  if (!normalizeWhitespace(input.title)) errors.push('Testimonial Title is required')
  if (!normalizeWhitespace(input.content)) errors.push('Testimonial Content is required')
  if (!normalizeWhitespace(input.userName)) errors.push('User Name is required')
  if (!input.categoryId) errors.push('Category is required')
  return errors
}

export async function createTestimonialAdmin(input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const maxOrder = await prisma.testimonial.aggregate({ _max: { sortOrder: true } })
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1

  const record = await prisma.testimonial.create({
    data: {
      title: normalizeWhitespace(input.title),
      content: normalizeWhitespace(input.content),
      userName: normalizeWhitespace(input.userName),
      userImage: input.userImage || null,
      featureImage: input.featureImage || null,
      categoryId: Number(input.categoryId),
      isInternational: Boolean(input.isInternational),
      isFeatured: Boolean(input.isFeatured),
      isActive: input.isActive !== false,
      sortOrder,
    },
  })

  revalidateCaches()
  return record
}

export async function updateTestimonialAdmin(id, input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const record = await prisma.testimonial.update({
    where: { id },
    data: {
      title: normalizeWhitespace(input.title),
      content: normalizeWhitespace(input.content),
      userName: normalizeWhitespace(input.userName),
      ...(input.userImage !== undefined ? { userImage: input.userImage || null } : {}),
      ...(input.featureImage !== undefined ? { featureImage: input.featureImage || null } : {}),
      categoryId: Number(input.categoryId),
      isInternational: Boolean(input.isInternational),
      isFeatured: Boolean(input.isFeatured),
      isActive: input.isActive !== false,
    },
  })

  revalidateCaches()
  return record
}

export async function deleteTestimonialAdmin(id) {
  const deleted = await prisma.testimonial.delete({ where: { id } })
  revalidateCaches()
  return deleted
}

export async function toggleTestimonialField(id, field, value) {
  const TOGGLEABLE = new Set(['isActive', 'isInternational', 'isFeatured'])
  if (!TOGGLEABLE.has(field)) throw new Error(`"${field}" is not a toggleable field`)

  const record = await prisma.testimonial.update({ where: { id }, data: { [field]: Boolean(value) } })
  revalidateCaches()
  return record
}

export async function importTestimonialsFromSource(rows, fallbackCategoryName, fallbackUserImage) {
  const { ensureTestimonialCategoryExists } = await import('./testimonial-categories.js')
  const { downloadAndNormalizeImage } = await import('./remote-asset-download.js')

  const report = { totalRows: rows.length, created: 0, skipped: 0, imageDownloaded: 0, imageFailed: 0, errors: [] }

  const fallbackCategory = await ensureTestimonialCategoryExists(fallbackCategoryName)
  let sortOrder = (await prisma.testimonial.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? -1

  for (const row of rows) {
    try {
      const title = normalizeWhitespace(row.title) || 'Lorem ipsum dolor sit amet'
      const content = normalizeWhitespace(row.content)

      const existing = await prisma.testimonial.findFirst({ where: { userName: row.userName, content } })
      if (existing) {
        report.skipped++
        continue
      }

      const category = row.categoryName ? await ensureTestimonialCategoryExists(row.categoryName) : fallbackCategory

      let userImage = fallbackUserImage
      if (row.imageUrl) {
        try {
          const saved = await downloadAndNormalizeImage(row.imageUrl, 'testimonials', { width: 40, height: 40 })
          userImage = saved.url
          report.imageDownloaded++
        } catch (error) {
          report.imageFailed++
          report.errors.push(`${row.userName}: image download failed — ${error.message}`)
        }
      }

      sortOrder++
      await prisma.testimonial.create({
        data: {
          title,
          content,
          userName: row.userName,
          userImage,
          featureImage: null,
          categoryId: category.id,
          isInternational: false,
          isFeatured: false,
          isActive: true,
          sortOrder,
        },
      })
      report.created++
    } catch (error) {
      report.skipped++
      report.errors.push(`${row.userName}: ${error.message}`)
    }
  }

  revalidateCaches()
  return report
}
