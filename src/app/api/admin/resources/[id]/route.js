import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { getResourceByIdAdmin, updateResourceAdmin, deleteResourceAdmin, toggleResourceActive } from '@/lib/resources'
import { deleteUploadedFile } from '@/lib/upload'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const record = await getResourceByIdAdmin(Number(id))
  if (!record) return NextResponse.json({ error: 'Resource not found' }, { status: 404 })

  return NextResponse.json({ resource: record })
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
    const previous = await getResourceByIdAdmin(Number(id))
    const record = await updateResourceAdmin(Number(id), input)

    if (previous?.pdfUrl && previous.pdfUrl !== record.pdfUrl) {
      await deleteUploadedFile(previous.pdfUrl)
    }

    return NextResponse.json({ resource: record })
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
    const record = await toggleResourceActive(Number(id), body.isActive)
    return NextResponse.json({ resource: record })
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
    const deleted = await deleteResourceAdmin(Number(id))
    if (deleted.pdfUrl) await deleteUploadedFile(deleted.pdfUrl)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
