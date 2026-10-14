// Shared helpers for press-style content models that import from a CSV and
// link to Department/Doctor records — currently MediaArticle and SuccessStory.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { prisma } from './prisma.js'
import { normalizeWhitespace } from './slug.js'
import { getImageDimensions } from './image-dimensions.js'

export function splitNames(cell) {
  return (cell ?? '')
    .split(',')
    .map(normalizeWhitespace)
    .filter(Boolean)
}

export async function resolveDepartmentsByName(names) {
  const departments = await prisma.department.findMany({
    select: { id: true, departmentId: true, name: true, nameNormalized: true },
  })
  const byNormalized = new Map(departments.map((d) => [d.nameNormalized, d]))

  const matched = []
  const unmatched = []
  for (const name of names) {
    const found = byNormalized.get(name.toLowerCase())
    if (found) matched.push(found)
    else unmatched.push(name)
  }

  return { matched, unmatched }
}

export async function resolveDoctorsByName(names) {
  const doctors = await prisma.doctor.findMany({ select: { id: true, name: true } })
  const byNormalized = new Map(doctors.map((d) => [d.name.trim().toLowerCase(), d]))

  const matched = []
  const unmatched = []
  for (const name of names) {
    const found = byNormalized.get(name.toLowerCase())
    if (found) matched.push(found)
    else unmatched.push(name)
  }

  return { matched, unmatched }
}

const YOUTUBE_PATTERNS = [
  /youtube\.com\/watch\?v=([\w-]{6,})/i,
  /youtube\.com\/embed\/([\w-]{6,})/i,
  /youtu\.be\/([\w-]{6,})/i,
  /youtube\.com\/shorts\/([\w-]{6,})/i,
]

export function extractYoutubeVideoId(url) {
  if (!url) return null
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function normalizeYoutubeUrl(url) {
  const videoId = extractYoutubeVideoId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

export function parseCsvDate(value) {
  const trimmed = normalizeWhitespace(value)
  if (!trimmed) return null
  const parsed = new Date(trimmed)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function extensionFromContentType(contentType, url) {
  const map = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }
  if (contentType && map[contentType.split(';')[0].trim()]) return map[contentType.split(';')[0].trim()]

  const extMatch = url.match(/\.(png|jpe?g|webp|gif)(?:[?#]|$)/i)
  if (extMatch) return extMatch[1].toLowerCase().replace('jpeg', 'jpg')

  return 'jpg'
}

const DOWNLOAD_TIMEOUT_MS = 20000
const MAX_DOWNLOAD_BYTES = 15 * 1024 * 1024

export async function downloadAndSaveRemoteImage(sourceUrl, destinationFolder) {
  let parsed
  try {
    parsed = new URL(sourceUrl)
  } catch {
    throw new Error(`Invalid image URL: ${sourceUrl}`)
  }
  if (!/^https?:$/.test(parsed.protocol)) {
    throw new Error(`Unsupported URL protocol: ${sourceUrl}`)
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS)

  let response
  try {
    response = await fetch(parsed.toString(), { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }

  if (!response.ok) {
    throw new Error(`Download failed (${response.status}) for ${sourceUrl}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  if (arrayBuffer.byteLength > MAX_DOWNLOAD_BYTES) {
    throw new Error(`Image too large (${arrayBuffer.byteLength} bytes) for ${sourceUrl}`)
  }

  const buffer = Buffer.from(arrayBuffer)
  const contentType = response.headers.get('content-type') || ''
  const extension = extensionFromContentType(contentType, sourceUrl)
  const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extension}`

  const destinationDir = path.join(process.cwd(), 'public', 'uploads', destinationFolder)
  await fs.promises.mkdir(destinationDir, { recursive: true })
  await fs.promises.writeFile(path.join(destinationDir, fileName), buffer)

  const dimensions = getImageDimensions(buffer)

  return {
    url: `/uploads/${destinationFolder}/${fileName}`,
    sourceUrl,
    width: dimensions?.width ?? null,
    height: dimensions?.height ?? null,
    size: buffer.length,
  }
}
