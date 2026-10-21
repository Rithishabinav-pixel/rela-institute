import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { saveUploadedImage, isAllowedImageType, deleteUploadedFile } from '@/lib/upload'
import { getImageDimensions } from '@/lib/image-dimensions'

const REQUIRED_DIMENSIONS = {
  desktop: { width: 1920, height: 711 },
  mobile: { width: 786, height: 1312 },
}

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const kind = formData.get('kind')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const required = REQUIRED_DIMENSIONS[kind]
  if (!required) {
    return NextResponse.json({ error: 'kind must be "desktop" or "mobile"' }, { status: 400 })
  }

  if (!isAllowedImageType(file.type)) {
    return NextResponse.json({ error: 'Unsupported image type. Use PNG, JPEG, or WEBP.' }, { status: 400 })
  }

  const saved = await saveUploadedImage(file, 'hero-banners')
  const dimensions = getImageDimensions(saved.buffer)

  if (!dimensions || dimensions.width !== required.width || dimensions.height !== required.height) {
    await deleteUploadedFile(saved.url)

    return NextResponse.json(
      {
        error: dimensions
          ? `Image must be exactly ${required.width}×${required.height}px (received ${dimensions.width}×${dimensions.height}px).`
          : 'Could not read image dimensions.',
      },
      { status: 400 }
    )
  }

  return NextResponse.json({ url: saved.url })
}
