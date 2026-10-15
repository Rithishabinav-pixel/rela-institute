import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { saveUploadedIcon, isAllowedIconType, deleteUploadedFile } from '@/lib/upload'
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

  if (!isAllowedIconType(file.type)) {
    return NextResponse.json({ error: 'Unsupported image type. Use PNG, JPEG, WEBP, or SVG.' }, { status: 400 })
  }

  const saved = await saveUploadedIcon(file, 'departments')

  // SVG is vector (scaled to 80x80 at render time via the existing <Image
  // width={80} height={80}> usage), so the exact-pixel raster check below
  // only applies to PNG/JPEG/WEBP, same as before.
  if (file.type !== 'image/svg+xml') {
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
  }

  return NextResponse.json({ url: saved.url })
}
