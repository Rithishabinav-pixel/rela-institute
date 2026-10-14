import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { saveUploadedImage, isAllowedImageType, deleteUploadedFile } from '@/lib/upload'
import { getImageDimensions } from '@/lib/image-dimensions'

const REQUIRED_WIDTH = 80
const REQUIRED_HEIGHT = 80

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!isAllowedImageType(file.type)) {
    return NextResponse.json({ error: 'Unsupported image type. Use PNG, JPEG, or WEBP.' }, { status: 400 })
  }

  const saved = await saveUploadedImage(file, 'departments')
  const dimensions = getImageDimensions(saved.buffer)

  if (!dimensions || dimensions.width !== REQUIRED_WIDTH || dimensions.height !== REQUIRED_HEIGHT) {
    await deleteUploadedFile(saved.url)

    return NextResponse.json(
      {
        error: dimensions
          ? `Icon must be exactly ${REQUIRED_WIDTH}×${REQUIRED_HEIGHT}px (received ${dimensions.width}×${dimensions.height}px).`
          : 'Could not read image dimensions.',
      },
      { status: 400 }
    )
  }

  return NextResponse.json({ url: saved.url })
}
