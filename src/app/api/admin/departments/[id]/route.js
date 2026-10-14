import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { getDepartmentByIdAdmin, updateDepartmentAdmin, deleteDepartmentAdmin, toggleDepartmentField } from '@/lib/departments'
import { deleteUploadedFile } from '@/lib/upload'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const department = await getDepartmentByIdAdmin(Number(id))

  if (!department) {
    return NextResponse.json({ error: 'Department not found' }, { status: 404 })
  }

  return NextResponse.json({ department })
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
    const previous = await getDepartmentByIdAdmin(Number(id))
    const department = await updateDepartmentAdmin(Number(id), input)

    if (previous?.icon && input.icon !== undefined && input.icon !== previous.icon) {
      await deleteUploadedFile(previous.icon)
    }

    return NextResponse.json({ department })
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
    const department = await toggleDepartmentField(Number(id), field, value)
    return NextResponse.json({ department })
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
    const deleted = await deleteDepartmentAdmin(Number(id))
    if (deleted.icon) await deleteUploadedFile(deleted.icon)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
