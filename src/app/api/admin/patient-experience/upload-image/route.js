import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { saveUploadedImage, isAllowedImageType } from '@/lib/upload'

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

  const saved = await saveUploadedImage(file, 'patient-experience')
  return NextResponse.json({ url: saved.url })
}
