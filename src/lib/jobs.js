import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { prisma } from './prisma.js'
import { sanitizeRichHtml } from './sanitize-html.js'
import { normalizeWhitespace, slugify } from './slug.js'

const CACHE_TAG = 'jobs'
const PUBLIC_REVALIDATE_SECONDS = 3600

function revalidateJobCaches(slugs) {
  revalidateTag(CACHE_TAG)
  revalidatePath('/careers')
  for (const slug of new Set((slugs ?? []).filter(Boolean))) {
    revalidatePath(`/careers/detail/${slug}`)
  }
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug || 'job'
  let suffix = 2

  for (;;) {
    const existing = await prisma.job.findUnique({ where: { slug: candidate } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${baseSlug}-${suffix}`
    suffix++
  }
}

const relationSelect = {
  jobTitle: { select: { id: true, name: true } },
  jobCategory: { select: { id: true, name: true } },
  jobLocation: { select: { id: true, name: true } },
}

function serializePublicListItem(record) {
  return {
    id: record.id,
    slug: record.slug,
    title: record.jobTitle.name,
    category: record.jobCategory.name,
    location: record.jobLocation.name,
    experience: record.experience,
    education: record.education,
  }
}

function serializePublicDetail(record) {
  return {
    ...serializePublicListItem(record),
    content: sanitizeRichHtml(record.content),
  }
}

async function listPublicUncached() {
  const records = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, experience: true, education: true, ...relationSelect },
  })
  return records.map(serializePublicListItem)
}

const cachedListPublic = unstable_cache(listPublicUncached, ['jobs-public-list'], {
  tags: [CACHE_TAG],
  revalidate: PUBLIC_REVALIDATE_SECONDS,
})

export async function listJobsPublic() {
  return cachedListPublic()
}

async function getBySlugPublicUncached(slug) {
  const record = await prisma.job.findUnique({
    where: { slug },
    select: { id: true, slug: true, experience: true, education: true, content: true, ...relationSelect },
  })
  if (!record) return null
  return serializePublicDetail(record)
}

const cachedGetBySlugPublic = unstable_cache(getBySlugPublicUncached, ['jobs-public-detail'], {
  tags: [CACHE_TAG],
  revalidate: PUBLIC_REVALIDATE_SECONDS,
})

export async function getJobBySlugPublic(slug) {
  return cachedGetBySlugPublic(slug)
}

export async function listJobsAdmin() {
  const records = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, slug: true, experience: true, education: true, createdAt: true, ...relationSelect },
  })
  return records
}

export async function getJobByIdAdmin(id) {
  return prisma.job.findUnique({
    where: { id },
    select: {
      id: true,
      slug: true,
      jobTitleId: true,
      jobCategoryId: true,
      jobLocationId: true,
      experience: true,
      education: true,
      content: true,
    },
  })
}

function validateJobInput(input) {
  const errors = []

  if (!input.jobTitleId) errors.push('Job Title is required')
  if (!input.jobCategoryId) errors.push('Job Category is required')
  if (!input.jobLocationId) errors.push('Location is required')
  if (!normalizeWhitespace(input.experience)) errors.push('Experience is required')
  if (!normalizeWhitespace(input.education)) errors.push('Education is required')
  if (!normalizeWhitespace((input.content || '').replace(/<[^>]*>/g, ''))) errors.push('Content is required')

  return errors
}

async function buildSlugBase(input) {
  const jobTitle = await prisma.jobTitle.findUnique({ where: { id: Number(input.jobTitleId) } })
  return slugify(jobTitle?.name || 'job')
}

export async function createJobAdmin(input) {
  const errors = validateJobInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const baseSlug = await buildSlugBase(input)
  const slug = await ensureUniqueSlug(baseSlug)

  const record = await prisma.job.create({
    data: {
      slug,
      jobTitleId: Number(input.jobTitleId),
      jobCategoryId: Number(input.jobCategoryId),
      jobLocationId: Number(input.jobLocationId),
      experience: normalizeWhitespace(input.experience),
      education: normalizeWhitespace(input.education),
      content: sanitizeRichHtml(input.content),
    },
  })

  revalidateJobCaches([record.slug])

  return record
}

export async function updateJobAdmin(id, input) {
  const errors = validateJobInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const existing = await prisma.job.findUnique({ where: { id } })
  if (!existing) throw new Error('Job not found')

  const record = await prisma.job.update({
    where: { id },
    data: {
      jobTitleId: Number(input.jobTitleId),
      jobCategoryId: Number(input.jobCategoryId),
      jobLocationId: Number(input.jobLocationId),
      experience: normalizeWhitespace(input.experience),
      education: normalizeWhitespace(input.education),
      content: sanitizeRichHtml(input.content),
    },
  })

  revalidateJobCaches([existing.slug, record.slug])

  return record
}

export async function deleteJobAdmin(id) {
  const deleted = await prisma.job.delete({ where: { id } })
  revalidateJobCaches([deleted.slug])
  return deleted
}
