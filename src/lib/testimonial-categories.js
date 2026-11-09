import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from './prisma.js'
import { normalizeWhitespace, slugify } from './slug.js'

const CACHE_TAG = 'testimonials'

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

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug || 'category'
  let suffix = 2

  for (;;) {
    const existing = await prisma.testimonialCategory.findUnique({ where: { slug: candidate } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${baseSlug}-${suffix}`
    suffix++
  }
}

export async function listTestimonialCategoriesPublic() {
  return prisma.testimonialCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
}

export async function listTestimonialCategoriesAdmin({ search = '' } = {}) {
  const trimmedSearch = search.trim()
  const where = trimmedSearch ? { name: { contains: trimmedSearch, mode: 'insensitive' } } : undefined
  return prisma.testimonialCategory.findMany({ where, orderBy: { sortOrder: 'asc' } })
}

export async function getTestimonialCategoryByIdAdmin(id) {
  return prisma.testimonialCategory.findUnique({ where: { id } })
}

function validateInput(input) {
  const errors = []
  if (!normalizeWhitespace(input.name)) errors.push('Category Name is required')
  return errors
}

export async function createTestimonialCategoryAdmin(input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const baseSlug = slugify(input.slug || input.name)
  const slug = await ensureUniqueSlug(baseSlug)

  const maxOrder = await prisma.testimonialCategory.aggregate({ _max: { sortOrder: true } })
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1

  const record = await prisma.testimonialCategory.create({
    data: {
      name: normalizeWhitespace(input.name),
      slug,
      isActive: input.isActive !== false,
      sortOrder,
    },
  })

  revalidateCaches()
  return record
}

export async function updateTestimonialCategoryAdmin(id, input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const existing = await prisma.testimonialCategory.findUnique({ where: { id } })
  if (!existing) throw new Error('Category not found')

  let slug = existing.slug
  const requestedSlug = slugify(input.slug || input.name)
  if (requestedSlug !== existing.slug) {
    slug = await ensureUniqueSlug(requestedSlug, id)
  }

  const record = await prisma.testimonialCategory.update({
    where: { id },
    data: {
      name: normalizeWhitespace(input.name),
      slug,
      isActive: input.isActive !== false,
    },
  })

  revalidateCaches()
  return record
}

export async function deleteTestimonialCategoryAdmin(id) {
  const usageCount = await prisma.testimonial.count({ where: { categoryId: id } })
  if (usageCount > 0) {
    throw new Error(`Cannot delete this category: ${usageCount} testimonial(s) are still assigned to it.`)
  }

  const deleted = await prisma.testimonialCategory.delete({ where: { id } })
  revalidateCaches()
  return deleted
}

export async function toggleTestimonialCategoryActive(id, isActive) {
  const record = await prisma.testimonialCategory.update({ where: { id }, data: { isActive: Boolean(isActive) } })
  revalidateCaches()
  return record
}

export async function ensureTestimonialCategoryExists(name) {
  const trimmed = normalizeWhitespace(name)
  const existing = await prisma.testimonialCategory.findFirst({ where: { name: { equals: trimmed, mode: 'insensitive' } } })
  if (existing) return existing

  return createTestimonialCategoryAdmin({ name: trimmed, isActive: true })
}
