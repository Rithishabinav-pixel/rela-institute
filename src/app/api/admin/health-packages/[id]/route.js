import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import {
  getHealthPackageByIdAdmin,
  updateHealthPackageAdmin,
  deleteHealthPackageAdmin,
  toggleHealthPackageActive,
} from '@/lib/health-packages'
import { deleteUploadedFile } from '@/lib/upload'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const pkg = await getHealthPackageByIdAdmin(Number(id))

  if (!pkg) {
    return NextResponse.json({ error: 'Health package not found' }, { status: 404 })
  }

  return NextResponse.json({ package: pkg })
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
    const previous = await getHealthPackageByIdAdmin(Number(id))
    const pkg = await updateHealthPackageAdmin(Number(id), input)

    if (previous?.packageImage && previous.packageImage !== pkg.packageImage) {
      await deleteUploadedFile(previous.packageImage)
    }

    return NextResponse.json({ package: pkg })
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
    const pkg = await toggleHealthPackageActive(Number(id), body.isActive)
    return NextResponse.json({ package: pkg })
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
    const deleted = await deleteHealthPackageAdmin(Number(id))
    if (deleted.packageImage) await deleteUploadedFile(deleted.packageImage)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
