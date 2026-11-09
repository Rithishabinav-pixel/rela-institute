import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import {
  getResourceCategoryByIdAdmin,
  updateResourceCategoryAdmin,
  deleteResourceCategoryAdmin,
  toggleResourceCategoryActive,
} from '@/lib/resource-categories'
import { deleteUploadedFile } from '@/lib/upload'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const record = await getResourceCategoryByIdAdmin(Number(id))
  if (!record) return NextResponse.json({ error: 'Category not found' }, { status: 404 })

  return NextResponse.json({ category: record })
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
    const previous = await getResourceCategoryByIdAdmin(Number(id))
    const record = await updateResourceCategoryAdmin(Number(id), input)

    if (previous?.categoryImage && previous.categoryImage !== record.categoryImage) {
      await deleteUploadedFile(previous.categoryImage)
    }

    return NextResponse.json({ category: record })
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
    const record = await toggleResourceCategoryActive(Number(id), body.isActive)
    return NextResponse.json({ category: record })
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
    const deleted = await deleteResourceCategoryAdmin(Number(id))
    if (deleted.categoryImage) await deleteUploadedFile(deleted.categoryImage)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
