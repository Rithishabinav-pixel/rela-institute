import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from './prisma.js'
import { normalizeWhitespace, slugify } from './slug.js'

const CACHE_TAG = 'resources'

function revalidateResourceCaches() {
  try {
    revalidateTag(CACHE_TAG)
    revalidatePath('/resources')
  } catch {}
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug || 'category'
  let suffix = 2

  for (;;) {
    const existing = await prisma.resourceCategory.findUnique({ where: { slug: candidate } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${baseSlug}-${suffix}`
    suffix++
  }
}

export async function listResourceCategoriesPublic() {
  return prisma.resourceCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
}

export async function listResourceCategoriesAdmin({ search = '' } = {}) {
  const trimmedSearch = search.trim()
  const where = trimmedSearch ? { name: { contains: trimmedSearch, mode: 'insensitive' } } : undefined
  return prisma.resourceCategory.findMany({ where, orderBy: { sortOrder: 'asc' } })
}

export async function getResourceCategoryByIdAdmin(id) {
  return prisma.resourceCategory.findUnique({ where: { id } })
}

function validateInput(input) {
  const errors = []
  if (!normalizeWhitespace(input.name)) errors.push('Category Name is required')
  return errors
}

export async function createResourceCategoryAdmin(input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const baseSlug = slugify(input.slug || input.name)
  const slug = await ensureUniqueSlug(baseSlug)

  const maxOrder = await prisma.resourceCategory.aggregate({ _max: { sortOrder: true } })
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1

  const record = await prisma.resourceCategory.create({
    data: {
      name: normalizeWhitespace(input.name),
      slug,
      categoryImage: input.categoryImage || null,
      isActive: input.isActive !== false,
      sortOrder,
    },
  })

  revalidateResourceCaches()
  return record
}

export async function updateResourceCategoryAdmin(id, input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const existing = await prisma.resourceCategory.findUnique({ where: { id } })
  if (!existing) throw new Error('Category not found')

  let slug = existing.slug
  const requestedSlug = slugify(input.slug || input.name)
  if (requestedSlug !== existing.slug) {
    slug = await ensureUniqueSlug(requestedSlug, id)
  }

  const record = await prisma.resourceCategory.update({
    where: { id },
    data: {
      name: normalizeWhitespace(input.name),
      slug,
      ...(input.categoryImage !== undefined ? { categoryImage: input.categoryImage || null } : {}),
      isActive: input.isActive !== false,
    },
  })

  revalidateResourceCaches()
  return record
}

export async function deleteResourceCategoryAdmin(id) {
  const usageCount = await prisma.resource.count({ where: { categoryId: id } })
  if (usageCount > 0) {
    throw new Error(`Cannot delete this category: ${usageCount} resource(s) are still assigned to it.`)
  }

  const deleted = await prisma.resourceCategory.delete({ where: { id } })
  revalidateResourceCaches()
  return deleted
}

export async function toggleResourceCategoryActive(id, isActive) {
  const record = await prisma.resourceCategory.update({ where: { id }, data: { isActive: Boolean(isActive) } })
  revalidateResourceCaches()
  return record
}

export async function ensureResourceCategoryExists(name) {
  const trimmed = normalizeWhitespace(name)
  const existing = await prisma.resourceCategory.findFirst({ where: { name: { equals: trimmed, mode: 'insensitive' } } })
  if (existing) return existing

  return createResourceCategoryAdmin({ name: trimmed, isActive: true })
}
