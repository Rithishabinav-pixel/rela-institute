import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { saveUploadedImage, isAllowedImageType } from '@/lib/upload'

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const files = formData.getAll('files').filter((f) => f && typeof f !== 'string')

  if (files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 })
  }

  const uploaded = []
  const failed = []

  for (const file of files) {
    if (!isAllowedImageType(file.type)) {
      failed.push({ name: file.name, error: 'Unsupported image type. Use PNG, JPEG, or WEBP.' })
      continue
    }

    try {
      const saved = await saveUploadedImage(file, 'media-articles')
      uploaded.push({ imagePath: saved.url, name: file.name })
    } catch (error) {
      failed.push({ name: file.name, error: error.message })
    }
  }

  return NextResponse.json({ uploaded, failed })
}
