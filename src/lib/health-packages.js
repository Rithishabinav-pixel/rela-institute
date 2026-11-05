import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { prisma } from './prisma.js'
import { sanitizeRichHtml } from './sanitize-html.js'
import { normalizeWhitespace, slugify } from './slug.js'

const CACHE_TAG = 'health-packages'
const PUBLIC_REVALIDATE_SECONDS = 3600

function revalidateHealthPackageCaches(slugs) {
  revalidateTag(CACHE_TAG)
  revalidatePath('/health-packages')
  revalidatePath('/')
  for (const slug of new Set((slugs ?? []).filter(Boolean))) {
    revalidatePath(`/health-packages/${slug}`)
  }
}

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug || 'health-package'
  let suffix = 2

  for (;;) {
    const existing = await prisma.healthPackage.findUnique({ where: { slug: candidate } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${baseSlug}-${suffix}`
    suffix++
  }
}

const detailSelect = {
  id: true,
  slug: true,
  testName: true,
  isPopular: true,
  discount: true,
  discountText: true,
  offerPrice: true,
  actualPrice: true,
  testCount: true,
  disclaimer: true,
  ageGroup: true,
  gender: true,
  fastingFor: true,
  reportsWithin: true,
  packageImage: true,
  metaTitle: true,
  metaDescription: true,
  canonicalUrl: true,
  isActive: true,
  sortOrder: true,
  testGroups: {
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      heading: true,
      tests: { orderBy: { sortOrder: 'asc' }, select: { id: true, name: true } },
    },
  },
  faqs: {
    orderBy: { sortOrder: 'asc' },
    select: { id: true, heading: true, answer: true },
  },
}

function serializePublic(record) {
  return {
    id: record.id,
    slug: record.slug,
    testName: record.testName,
    isPopular: record.isPopular,
    discount: record.discount,
    discountText: record.discountText,
    offerPrice: record.offerPrice,
    actualPrice: record.actualPrice,
    testCount: record.testCount,
    disclaimer: record.disclaimer,
    ageGroup: record.ageGroup,
    gender: record.gender,
    fastingFor: record.fastingFor,
    reportsWithin: record.reportsWithin,
    packageImage: record.packageImage,
    metaTitle: record.metaTitle,
    metaDescription: record.metaDescription,
    canonicalUrl: record.canonicalUrl,
    testsIncludes: record.testGroups.map((group) => ({
      heading: group.heading,
      tests: group.tests.map((t) => t.name),
    })),
    faqs: record.faqs.map((faq) => ({ heading: faq.heading, answer: sanitizeRichHtml(faq.answer) })),
  }
}

async function listPublicUncached() {
  const records = await prisma.healthPackage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: detailSelect,
  })
  return records.map(serializePublic)
}

const cachedListPublic = unstable_cache(listPublicUncached, ['health-packages-public-list'], {
  tags: [CACHE_TAG],
  revalidate: PUBLIC_REVALIDATE_SECONDS,
})

export async function listHealthPackagesPublic() {
  return cachedListPublic()
}

async function getBySlugPublicUncached(slug) {
  const record = await prisma.healthPackage.findUnique({ where: { slug }, select: detailSelect })
  if (!record || !record.isActive) return null
  return serializePublic(record)
}

const cachedGetBySlugPublic = unstable_cache(getBySlugPublicUncached, ['health-packages-public-detail'], {
  tags: [CACHE_TAG],
  revalidate: PUBLIC_REVALIDATE_SECONDS,
})

export async function getHealthPackageBySlugPublic(slug) {
  return cachedGetBySlugPublic(slug)
}

async function getHomepageHealthPackageCardsUncached() {
  const records = await prisma.healthPackage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { slug: true, testName: true, testCount: true, offerPrice: true, actualPrice: true, isPopular: true },
  })

  return records.map((record) => ({
    packageName: record.testName,
    tests: record.testCount,
    offerPrice: record.offerPrice,
    actualPrice: record.actualPrice,
    link: `/health-packages/${record.slug}`,
    special: record.isPopular,
  }))
}

const cachedGetHomepageHealthPackageCards = unstable_cache(
  getHomepageHealthPackageCardsUncached,
  ['health-packages-homepage-cards'],
  { tags: [CACHE_TAG], revalidate: PUBLIC_REVALIDATE_SECONDS }
)

export async function getHomepageHealthPackageCards() {
  return cachedGetHomepageHealthPackageCards()
}

export async function listHealthPackagesAdmin() {
  return prisma.healthPackage.findMany({ orderBy: { sortOrder: 'asc' } })
}

export async function getHealthPackageByIdAdmin(id) {
  const record = await prisma.healthPackage.findUnique({ where: { id }, select: detailSelect })
  if (!record) return null

  return {
    ...record,
    testGroups: record.testGroups.map((group) => ({ heading: group.heading, tests: group.tests.map((t) => t.name) })),
    faqs: record.faqs.map((faq) => ({ heading: faq.heading, answer: faq.answer })),
  }
}

function validateHealthPackageInput(input) {
  const errors = []

  if (!normalizeWhitespace(input.testName)) errors.push('Test Name is required')
  if (!normalizeWhitespace(input.offerPrice)) errors.push('Offer Price is required')
  if (!normalizeWhitespace(input.actualPrice)) errors.push('Actual Price is required')
  if (!normalizeWhitespace(input.testCount)) errors.push('Test Count is required')

  if (input.gender && !['Men', 'Women', 'Men & Women'].includes(input.gender)) {
    errors.push('Gender must be Men, Women, or Men & Women')
  }

  return errors
}

function buildTestGroupsCreate(testGroups) {
  return (testGroups ?? [])
    .filter((group) => normalizeWhitespace(group.heading))
    .map((group, groupIndex) => ({
      heading: normalizeWhitespace(group.heading),
      sortOrder: groupIndex,
      tests: {
        create: (group.tests ?? [])
          .filter((name) => normalizeWhitespace(name))
          .map((name, testIndex) => ({ name: normalizeWhitespace(name), sortOrder: testIndex })),
      },
    }))
}

function buildFaqsCreate(faqs) {
  return (faqs ?? [])
    .filter((faq) => normalizeWhitespace(faq.heading))
    .map((faq, index) => ({
      heading: normalizeWhitespace(faq.heading),
      answer: sanitizeRichHtml(faq.answer),
      sortOrder: index,
    }))
}

export async function createHealthPackageAdmin(input) {
  const errors = validateHealthPackageInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const baseSlug = slugify(input.slug || input.testName)
  const slug = await ensureUniqueSlug(baseSlug)

  const maxOrder = await prisma.healthPackage.aggregate({ _max: { sortOrder: true } })
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1

  const record = await prisma.healthPackage.create({
    data: {
      slug,
      testName: normalizeWhitespace(input.testName),
      isPopular: Boolean(input.isPopular),
      discount: normalizeWhitespace(input.discount) || null,
      discountText: normalizeWhitespace(input.discountText) || null,
      offerPrice: normalizeWhitespace(input.offerPrice),
      actualPrice: normalizeWhitespace(input.actualPrice),
      testCount: normalizeWhitespace(input.testCount),
      disclaimer: normalizeWhitespace(input.disclaimer) || null,
      ageGroup: normalizeWhitespace(input.ageGroup) || null,
      gender: input.gender || null,
      fastingFor: normalizeWhitespace(input.fastingFor) || null,
      reportsWithin: normalizeWhitespace(input.reportsWithin) || null,
      packageImage: input.packageImage || null,
      metaTitle: normalizeWhitespace(input.metaTitle) || null,
      metaDescription: normalizeWhitespace(input.metaDescription) || null,
      canonicalUrl: normalizeWhitespace(input.canonicalUrl) || null,
      isActive: input.isActive !== false,
      sortOrder,
      testGroups: { create: buildTestGroupsCreate(input.testGroups) },
      faqs: { create: buildFaqsCreate(input.faqs) },
    },
  })

  revalidateHealthPackageCaches([record.slug])

  return record
}

export async function updateHealthPackageAdmin(id, input) {
  const errors = validateHealthPackageInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const existing = await prisma.healthPackage.findUnique({ where: { id } })
  if (!existing) throw new Error('Health package not found')

  let slug = existing.slug
  const requestedSlug = slugify(input.slug || input.testName)
  if (requestedSlug !== existing.slug) {
    slug = await ensureUniqueSlug(requestedSlug, id)
  }

  await prisma.$transaction([
    prisma.healthPackageTestGroup.deleteMany({ where: { healthPackageId: id } }),
    prisma.healthPackageFaq.deleteMany({ where: { healthPackageId: id } }),
    prisma.healthPackage.update({
      where: { id },
      data: {
        slug,
        testName: normalizeWhitespace(input.testName),
        isPopular: Boolean(input.isPopular),
        discount: normalizeWhitespace(input.discount) || null,
        discountText: normalizeWhitespace(input.discountText) || null,
        offerPrice: normalizeWhitespace(input.offerPrice),
        actualPrice: normalizeWhitespace(input.actualPrice),
        testCount: normalizeWhitespace(input.testCount),
        disclaimer: normalizeWhitespace(input.disclaimer) || null,
        ageGroup: normalizeWhitespace(input.ageGroup) || null,
        gender: input.gender || null,
        fastingFor: normalizeWhitespace(input.fastingFor) || null,
        reportsWithin: normalizeWhitespace(input.reportsWithin) || null,
        ...(input.packageImage !== undefined ? { packageImage: input.packageImage || null } : {}),
        metaTitle: normalizeWhitespace(input.metaTitle) || null,
        metaDescription: normalizeWhitespace(input.metaDescription) || null,
        canonicalUrl: normalizeWhitespace(input.canonicalUrl) || null,
        isActive: input.isActive !== false,
        testGroups: { create: buildTestGroupsCreate(input.testGroups) },
        faqs: { create: buildFaqsCreate(input.faqs) },
      },
    }),
  ])

  const updated = await prisma.healthPackage.findUnique({ where: { id } })
  revalidateHealthPackageCaches([existing.slug, updated.slug])

  return updated
}

export async function deleteHealthPackageAdmin(id) {
  const deleted = await prisma.healthPackage.delete({ where: { id } })
  revalidateHealthPackageCaches([deleted.slug])
  return deleted
}

export async function toggleHealthPackageActive(id, isActive) {
  const record = await prisma.healthPackage.update({
    where: { id },
    data: { isActive: Boolean(isActive) },
  })
  revalidateHealthPackageCaches([record.slug])
  return record
}

export async function reorderHealthPackagesAdmin(orderedIds) {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    throw new Error('orderedIds must be a non-empty array')
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.healthPackage.update({ where: { id: Number(id) }, data: { sortOrder: index } })
    )
  )

  revalidateHealthPackageCaches()

  return listHealthPackagesAdmin()
}
