import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { saveUploadedPdf, isAllowedPdfType } from '@/lib/upload'

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!isAllowedPdfType(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type. Use PDF.' }, { status: 400 })
  }

  try {
    const saved = await saveUploadedPdf(file, 'resources/pdfs')
    return NextResponse.json({ url: saved.url })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
