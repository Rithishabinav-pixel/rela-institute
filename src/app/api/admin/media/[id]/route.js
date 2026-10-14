import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { getMediaById, updateMediaAltText, deleteMedia } from '@/lib/media'
import { deleteUploadedFile } from '@/lib/upload'

export async function PATCH(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const altText = (body.altText ?? '').toString().trim()
  if (!altText) {
    return NextResponse.json({ error: 'Alt text is required' }, { status: 400 })
  }

  const media = await updateMediaAltText(Number(id), altText)
  return NextResponse.json({ media })
}

export async function DELETE(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const media = await getMediaById(Number(id))

  if (!media) {
    return NextResponse.json({ error: 'Media not found' }, { status: 404 })
  }

  await deleteMedia(Number(id))
  await deleteUploadedFile(media.url)

  return NextResponse.json({ ok: true })
}
