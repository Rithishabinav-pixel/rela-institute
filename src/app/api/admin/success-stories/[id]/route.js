import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import {
  getSuccessStoryByIdAdmin,
  updateSuccessStoryAdmin,
  deleteSuccessStoryAdmin,
  toggleSuccessStoryField,
} from '@/lib/success-stories'
import { deleteUploadedFile } from '@/lib/upload'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const story = await getSuccessStoryByIdAdmin(Number(id))

  if (!story) {
    return NextResponse.json({ error: 'Success story not found' }, { status: 404 })
  }

  return NextResponse.json({ story })
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

  const previous = await getSuccessStoryByIdAdmin(Number(id))
  if (!previous) {
    return NextResponse.json({ error: 'Success story not found' }, { status: 404 })
  }

  try {
    const story = await updateSuccessStoryAdmin(Number(id), input)

    if (previous.featureImage && previous.featureImage !== story.featureImage) {
      await deleteUploadedFile(previous.featureImage)
    }

    const keptPaths = new Set((input.gallery ?? []).map((image) => image.imagePath))
    const removedGalleryImages = previous.gallery.filter((image) => !keptPaths.has(image.imagePath))
    await Promise.all(removedGalleryImages.map((image) => deleteUploadedFile(image.imagePath)))

    return NextResponse.json({ story })
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
    const story = await toggleSuccessStoryField(Number(id), field, value)
    return NextResponse.json({ story })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await getSuccessStoryByIdAdmin(Number(id))

  try {
    const deleted = await deleteSuccessStoryAdmin(Number(id))
    if (existing?.featureImage) await deleteUploadedFile(existing.featureImage)
    if (existing?.gallery?.length) {
      await Promise.all(existing.gallery.map((image) => deleteUploadedFile(image.imagePath)))
    }
    return NextResponse.json({ ok: true, deleted })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
