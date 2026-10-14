import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { listMedia, createMedia } from '@/lib/media'
import { saveUploadedImage, isAllowedImageType } from '@/lib/upload'
import { getImageDimensions } from '@/lib/image-dimensions'

export async function GET(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const search = request.nextUrl.searchParams.get('search') ?? ''
  const media = await listMedia({ search })
  return NextResponse.json({ media })
}

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const altText = (formData.get('altText') ?? '').toString().trim()

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!altText) {
    return NextResponse.json({ error: 'Alt text is required' }, { status: 400 })
  }

  if (!isAllowedImageType(file.type)) {
    return NextResponse.json({ error: 'Unsupported image type. Use PNG, JPEG, or WEBP.' }, { status: 400 })
  }

  const saved = await saveUploadedImage(file, 'media')
  const dimensions = getImageDimensions(saved.buffer)

  const media = await createMedia({
    fileName: saved.fileName,
    url: saved.url,
    altText,
    mimeType: saved.mimeType,
    width: dimensions?.width ?? null,
    height: dimensions?.height ?? null,
    size: saved.size,
  })

  return NextResponse.json({ media }, { status: 201 })
}
