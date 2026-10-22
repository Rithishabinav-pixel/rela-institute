import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from './prisma.js'
import { normalizeWhitespace } from './slug.js'

function revalidateJobCaches() {
  revalidateTag('jobs')
  revalidatePath('/careers')
}

function createJobOptionModule({ delegateName, usageField }) {
  const db = () => prisma[delegateName]

  async function list() {
    return db().findMany({ orderBy: { name: 'asc' } })
  }

  async function create(name) {
    const cleanName = normalizeWhitespace(name)
    if (!cleanName) throw new Error('Name is required')

    const nameNormalized = cleanName.toLowerCase()
    const existing = await db().findUnique({ where: { nameNormalized } })
    if (existing) throw new Error('This value already exists')

    const record = await db().create({ data: { name: cleanName, nameNormalized } })
    revalidateJobCaches()
    return record
  }

  async function update(id, name) {
    const cleanName = normalizeWhitespace(name)
    if (!cleanName) throw new Error('Name is required')

    const nameNormalized = cleanName.toLowerCase()
    const existing = await db().findUnique({ where: { nameNormalized } })
    if (existing && existing.id !== id) throw new Error('This value already exists')

    const record = await db().update({ where: { id }, data: { name: cleanName, nameNormalized } })
    revalidateJobCaches()
    return record
  }

  async function remove(id) {
    const usageCount = await prisma.job.count({ where: { [usageField]: id } })
    if (usageCount > 0) {
      throw new Error(
        `This value is used by ${usageCount} job${usageCount === 1 ? '' : 's'} and cannot be deleted. Reassign or remove those jobs first.`
      )
    }

    const record = await db().delete({ where: { id } })
    revalidateJobCaches()
    return record
  }

  return { list, create, update, remove }
}

export const jobTitles = createJobOptionModule({ delegateName: 'jobTitle', usageField: 'jobTitleId' })
export const jobCategories = createJobOptionModule({ delegateName: 'jobCategory', usageField: 'jobCategoryId' })
export const jobLocations = createJobOptionModule({ delegateName: 'jobLocation', usageField: 'jobLocationId' })
