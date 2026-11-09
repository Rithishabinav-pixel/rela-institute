import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { sanitizeSvg } from './sanitize-html.js'

const ALLOWED_MIME_EXTENSIONS = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

export function isAllowedImageType(mimeType) {
  return Object.prototype.hasOwnProperty.call(ALLOWED_MIME_EXTENSIONS, mimeType)
}

// Icon uploads (currently just Department Icon) additionally accept SVG, on
// top of every type the rest of the app's image uploads already accept.
// Kept separate from ALLOWED_MIME_EXTENSIONS/saveUploadedImage above so SVG
// support never leaks into doctor photos, media galleries, etc.
const ALLOWED_ICON_MIME_EXTENSIONS = {
  ...ALLOWED_MIME_EXTENSIONS,
  'image/svg+xml': 'svg',
}

export function isAllowedIconType(mimeType) {
  return Object.prototype.hasOwnProperty.call(ALLOWED_ICON_MIME_EXTENSIONS, mimeType)
}

export async function saveUploadedIcon(file, destinationFolder) {
  const extension = ALLOWED_ICON_MIME_EXTENSIONS[file.type]
  if (!extension) {
    throw new Error('Unsupported icon type. Please upload a PNG, JPEG, WEBP, or SVG image.')
  }

  let buffer = Buffer.from(await file.arrayBuffer())
  if (file.type === 'image/svg+xml') {
    buffer = Buffer.from(sanitizeSvg(buffer.toString('utf8')), 'utf8')
  }

  const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extension}`

  const destinationDir = path.join(process.cwd(), 'public', 'uploads', destinationFolder)
  await fs.mkdir(destinationDir, { recursive: true })
  await fs.writeFile(path.join(destinationDir, fileName), buffer)

  return {
    buffer,
    fileName,
    url: `/uploads/${destinationFolder}/${fileName}`,
    mimeType: file.type,
    size: buffer.length,
  }
}

export async function saveUploadedImage(file, destinationFolder) {
  const extension = ALLOWED_MIME_EXTENSIONS[file.type]
  if (!extension) {
    throw new Error('Unsupported image type. Please upload a PNG, JPEG, or WEBP image.')
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extension}`

  const destinationDir = path.join(process.cwd(), 'public', 'uploads', destinationFolder)
  await fs.mkdir(destinationDir, { recursive: true })
  await fs.writeFile(path.join(destinationDir, fileName), buffer)

  return {
    buffer,
    fileName,
    url: `/uploads/${destinationFolder}/${fileName}`,
    mimeType: file.type,
    size: buffer.length,
  }
}

export async function deleteUploadedFile(url) {
  if (!url || !url.startsWith('/uploads/')) return

  const filePath = path.join(process.cwd(), 'public', url)
  await fs.unlink(filePath).catch(() => {})
}

export function isAllowedPdfType(mimeType) {
  return mimeType === 'application/pdf'
}

function matchesPdfSignature(buffer) {
  return buffer.length >= 4 && buffer.toString('ascii', 0, 4) === '%PDF'
}

export async function savePdfBuffer(buffer, destinationFolder) {
  if (!matchesPdfSignature(buffer)) {
    throw new Error('The uploaded file does not match a valid PDF document.')
  }

  const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.pdf`

  const destinationDir = path.join(process.cwd(), 'public', 'uploads', destinationFolder)
  await fs.mkdir(destinationDir, { recursive: true })
  await fs.writeFile(path.join(destinationDir, fileName), buffer)

  return {
    fileName,
    url: `/uploads/${destinationFolder}/${fileName}`,
    size: buffer.length,
  }
}

export async function saveUploadedPdf(file, destinationFolder) {
  if (!isAllowedPdfType(file.type)) {
    throw new Error('Unsupported file type. Please upload a PDF file.')
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  return savePdfBuffer(buffer, destinationFolder)
}
