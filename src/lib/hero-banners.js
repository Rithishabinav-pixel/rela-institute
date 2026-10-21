import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { prisma } from './prisma.js'
import { normalizeWhitespace } from './slug.js'

const CACHE_TAG = 'hero-banners'
const PUBLIC_REVALIDATE_SECONDS = 3600

function revalidateHeroBannerCaches() {
  revalidateTag(CACHE_TAG)
  revalidatePath('/')
}

function serializePublic(record) {
  return {
    id: record.id,
    type: record.type,
    title: record.title,
    fancyText: record.fancyText,
    description: record.description,
    buttonText: record.buttonText,
    buttonType: record.buttonType,
    buttonLink: record.buttonLink,
    image: record.desktopImage,
    mobileImage: record.mobileImage,
    link: record.bannerLink,
  }
}

async function listPublicUncached() {
  const records = await prisma.heroBanner.findMany({ orderBy: { sortOrder: 'asc' } })
  return records.map(serializePublic)
}

const cachedListPublic = unstable_cache(listPublicUncached, ['hero-banners-public-list'], {
  tags: [CACHE_TAG],
  revalidate: PUBLIC_REVALIDATE_SECONDS,
})

export async function listHeroBannersPublic() {
  return cachedListPublic()
}

export async function listHeroBannersAdmin() {
  const records = await prisma.heroBanner.findMany({ orderBy: { sortOrder: 'asc' } })
  return records
}

export async function getHeroBannerByIdAdmin(id) {
  return prisma.heroBanner.findUnique({ where: { id } })
}

function validateHeroBannerInput(input) {
  const errors = []
  const type = input.type === 'image' ? 'image' : 'content'

  if (type === 'content' && !normalizeWhitespace(input.title)) {
    errors.push('Title is required for Content Type banners')
  }

  if (type === 'image' && !normalizeWhitespace(input.bannerLink)) {
    errors.push('Banner Link is required for Image Type banners')
  }

  if (!input.desktopImage) errors.push('Desktop Banner Image is required')
  if (!input.mobileImage) errors.push('Mobile Banner Image is required')

  if (input.buttonType && input.buttonType !== 'call' && input.buttonType !== 'common') {
    errors.push('Button Type must be either "call" or "common"')
  }

  return errors
}

function buildData(input) {
  const type = input.type === 'image' ? 'image' : 'content'
  const isContent = type === 'content'

  return {
    type,
    title: isContent ? normalizeWhitespace(input.title) || null : null,
    fancyText: isContent ? normalizeWhitespace(input.fancyText) || null : null,
    description: isContent ? (input.description || '').trim() || null : null,
    buttonText: isContent ? normalizeWhitespace(input.buttonText) || null : null,
    buttonType: isContent ? (input.buttonType === 'call' ? 'call' : 'common') : null,
    buttonLink: isContent ? normalizeWhitespace(input.buttonLink) || null : null,
    desktopImage: input.desktopImage || null,
    mobileImage: input.mobileImage || null,
    bannerLink: !isContent ? normalizeWhitespace(input.bannerLink) || null : null,
  }
}

export async function createHeroBannerAdmin(input) {
  const errors = validateHeroBannerInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const maxOrder = await prisma.heroBanner.aggregate({ _max: { sortOrder: true } })
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1

  const record = await prisma.heroBanner.create({
    data: { ...buildData(input), sortOrder },
  })

  revalidateHeroBannerCaches()

  return record
}

export async function updateHeroBannerAdmin(id, input) {
  const errors = validateHeroBannerInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const existing = await prisma.heroBanner.findUnique({ where: { id } })
  if (!existing) throw new Error('Hero banner not found')

  const record = await prisma.heroBanner.update({
    where: { id },
    data: buildData(input),
  })

  revalidateHeroBannerCaches()

  return record
}

export async function deleteHeroBannerAdmin(id) {
  const deleted = await prisma.heroBanner.delete({ where: { id } })
  revalidateHeroBannerCaches()
  return deleted
}

export async function reorderHeroBannersAdmin(orderedIds) {
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    throw new Error('orderedIds must be a non-empty array')
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.heroBanner.update({ where: { id: Number(id) }, data: { sortOrder: index } })
    )
  )

  revalidateHeroBannerCaches()

  return listHeroBannersAdmin()
}
