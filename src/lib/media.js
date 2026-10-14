import { prisma } from './prisma.js'

export async function listMedia({ search = '' } = {}) {
  const trimmed = search.trim()

  return prisma.media.findMany({
    where: trimmed ? { altText: { contains: trimmed, mode: 'insensitive' } } : undefined,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getMediaById(id) {
  return prisma.media.findUnique({ where: { id } })
}

export async function createMedia({ fileName, url, altText, mimeType, width, height, size }) {
  return prisma.media.create({
    data: { fileName, url, altText, mimeType, width, height, size },
  })
}

export async function updateMediaAltText(id, altText) {
  return prisma.media.update({ where: { id }, data: { altText } })
}

export async function deleteMedia(id) {
  return prisma.media.delete({ where: { id } })
}
