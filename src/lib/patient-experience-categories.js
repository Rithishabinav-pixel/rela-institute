import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from './prisma.js'
import { normalizeWhitespace, slugify } from './slug.js'

const CACHE_TAG = 'patient-experience'

function revalidateCaches() {
  try {
    revalidateTag(CACHE_TAG)
    revalidatePath('/patient-experience')
  } catch {}
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug || 'category'
  let suffix = 2

  for (;;) {
    const existing = await prisma.patientExperienceCategory.findUnique({ where: { slug: candidate } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${baseSlug}-${suffix}`
    suffix++
  }
}

export async function listPatientExperienceCategoriesPublic() {
  return prisma.patientExperienceCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
}

export async function listPatientExperienceCategoriesAdmin({ search = '' } = {}) {
  const trimmedSearch = search.trim()
  const where = trimmedSearch ? { name: { contains: trimmedSearch, mode: 'insensitive' } } : undefined
  return prisma.patientExperienceCategory.findMany({ where, orderBy: { sortOrder: 'asc' } })
}

export async function getPatientExperienceCategoryByIdAdmin(id) {
  return prisma.patientExperienceCategory.findUnique({ where: { id } })
}

function validateInput(input) {
  const errors = []
  if (!normalizeWhitespace(input.name)) errors.push('Category Name is required')
  return errors
}

export async function createPatientExperienceCategoryAdmin(input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const baseSlug = slugify(input.slug || input.name)
  const slug = await ensureUniqueSlug(baseSlug)

  const maxOrder = await prisma.patientExperienceCategory.aggregate({ _max: { sortOrder: true } })
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1

  const record = await prisma.patientExperienceCategory.create({
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

export async function updatePatientExperienceCategoryAdmin(id, input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const existing = await prisma.patientExperienceCategory.findUnique({ where: { id } })
  if (!existing) throw new Error('Category not found')

  let slug = existing.slug
  const requestedSlug = slugify(input.slug || input.name)
  if (requestedSlug !== existing.slug) {
    slug = await ensureUniqueSlug(requestedSlug, id)
  }

  const record = await prisma.patientExperienceCategory.update({
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

export async function deletePatientExperienceCategoryAdmin(id) {
  const usageCount = await prisma.patientExperience.count({ where: { categoryId: id } })
  if (usageCount > 0) {
    throw new Error(`Cannot delete this category: ${usageCount} patient experience record(s) are still assigned to it.`)
  }

  const deleted = await prisma.patientExperienceCategory.delete({ where: { id } })
  revalidateCaches()
  return deleted
}

export async function togglePatientExperienceCategoryActive(id, isActive) {
  const record = await prisma.patientExperienceCategory.update({ where: { id }, data: { isActive: Boolean(isActive) } })
  revalidateCaches()
  return record
}

export async function ensurePatientExperienceCategoryExists(name) {
  const trimmed = normalizeWhitespace(name)
  const existing = await prisma.patientExperienceCategory.findFirst({
    where: { name: { equals: trimmed, mode: 'insensitive' } },
  })
  if (existing) return existing

  return createPatientExperienceCategoryAdmin({ name: trimmed, isActive: true })
}
