import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import {
  getMediaArticleByIdAdmin,
  updateMediaArticleAdmin,
  deleteMediaArticleAdmin,
  toggleMediaArticleField,
} from '@/lib/media-articles'
import { deleteUploadedFile } from '@/lib/upload'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const article = await getMediaArticleByIdAdmin(Number(id))

  if (!article) {
    return NextResponse.json({ error: 'Media article not found' }, { status: 404 })
  }

  return NextResponse.json({ article })
}

export async function PUT(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  let input
  try {
    input = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const previous = await getMediaArticleByIdAdmin(Number(id))
  if (!previous) {
    return NextResponse.json({ error: 'Media article not found' }, { status: 404 })
  }

  try {
    const article = await updateMediaArticleAdmin(Number(id), input)

    if (previous.featureImage && previous.featureImage !== article.featureImage) {
      await deleteUploadedFile(previous.featureImage)
    }

    const keptPaths = new Set((input.gallery ?? []).map((image) => image.imagePath))
    const removedGalleryImages = previous.gallery.filter((image) => !keptPaths.has(image.imagePath))
    await Promise.all(removedGalleryImages.map((image) => deleteUploadedFile(image.imagePath)))

    return NextResponse.json({ article })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

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

  const { field, value } = body ?? {}
  if (typeof field !== 'string' || typeof value !== 'boolean') {
    return NextResponse.json({ error: 'field and a boolean value are required' }, { status: 400 })
  }

  try {
    const article = await toggleMediaArticleField(Number(id), field, value)
    return NextResponse.json({ article })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await getMediaArticleByIdAdmin(Number(id))

  try {
    const deleted = await deleteMediaArticleAdmin(Number(id))
    if (existing?.featureImage) await deleteUploadedFile(existing.featureImage)
    if (existing?.gallery?.length) {
      await Promise.all(existing.gallery.map((image) => deleteUploadedFile(image.imagePath)))
    }
    return NextResponse.json({ ok: true, deleted })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
