import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import {
  getNewsletterByIdAdmin,
  updateNewsletterAdmin,
  deleteNewsletterAdmin,
  toggleNewsletterActive,
} from '@/lib/newsletters'
import { deleteUploadedFile } from '@/lib/upload'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const record = await getNewsletterByIdAdmin(Number(id))
  if (!record) return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 })

  return NextResponse.json({ newsletter: record })
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

  try {
    const previous = await getNewsletterByIdAdmin(Number(id))
    const record = await updateNewsletterAdmin(Number(id), input)

    if (previous?.featureImage && previous.featureImage !== record.featureImage) {
      await deleteUploadedFile(previous.featureImage)
    }
    if (previous?.pdfUrl && previous.pdfUrl !== record.pdfUrl) {
      await deleteUploadedFile(previous.pdfUrl)
    }

    return NextResponse.json({ newsletter: record })
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

  if (typeof body.isActive !== 'boolean') {
    return NextResponse.json({ error: 'isActive boolean is required' }, { status: 400 })
  }

  try {
    const record = await toggleNewsletterActive(Number(id), body.isActive)
    return NextResponse.json({ newsletter: record })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const deleted = await deleteNewsletterAdmin(Number(id))
    if (deleted.featureImage) await deleteUploadedFile(deleted.featureImage)
    if (deleted.pdfUrl) await deleteUploadedFile(deleted.pdfUrl)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
