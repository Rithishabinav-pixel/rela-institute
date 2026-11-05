import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

const ALLOWED_RESUME_MIME_EXTENSIONS = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
}

const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024

const RESUME_STORAGE_DIR = path.join(process.cwd(), 'private-uploads', 'resumes')

export function isAllowedResumeType(mimeType) {
  return Object.prototype.hasOwnProperty.call(ALLOWED_RESUME_MIME_EXTENSIONS, mimeType)
}

function matchesSignature(buffer, extension) {
  if (buffer.length < 4) return false

  if (extension === 'pdf') {
    return buffer.toString('ascii', 0, 4) === '%PDF'
  }

  if (extension === 'doc') {
    return buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0
  }

  if (extension === 'docx') {
    return buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04
  }

  return false
}

export async function saveUploadedResume(file) {
  const extension = ALLOWED_RESUME_MIME_EXTENSIONS[file.type]
  if (!extension) {
    throw new Error('Unsupported file type. Please upload a PDF, DOC, or DOCX file.')
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    throw new Error('File is too large. Maximum size is 5MB.')
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  if (!matchesSignature(buffer, extension)) {
    throw new Error('The uploaded file does not match a valid PDF/DOC/DOCX document.')
  }

  const fileName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${extension}`

  await fs.mkdir(RESUME_STORAGE_DIR, { recursive: true })
  await fs.writeFile(path.join(RESUME_STORAGE_DIR, fileName), buffer)

  return {
    storedPath: fileName,
    originalName: file.name,
    size: buffer.length,
  }
}

export async function readStoredResume(storedPath) {
  if (!storedPath || typeof storedPath !== 'string') return null

  const resolved = path.resolve(RESUME_STORAGE_DIR, storedPath)
  if (!resolved.startsWith(RESUME_STORAGE_DIR + path.sep)) return null

  try {
    return await fs.readFile(resolved)
  } catch {
    return null
  }
}

export async function deleteStoredResume(storedPath) {
  if (!storedPath || typeof storedPath !== 'string') return

  const resolved = path.resolve(RESUME_STORAGE_DIR, storedPath)
  if (!resolved.startsWith(RESUME_STORAGE_DIR + path.sep)) return

  await fs.unlink(resolved).catch(() => {})
}
