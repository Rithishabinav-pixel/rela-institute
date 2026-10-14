import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { getDoctorByIdAdmin, updateDoctorAdmin, deleteDoctorAdmin, toggleDoctorField } from '@/lib/doctors'
import { deleteUploadedFile } from '@/lib/upload'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const doctor = await getDoctorByIdAdmin(Number(id))

  if (!doctor) {
    return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
  }

  return NextResponse.json({ doctor })
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
    const doctor = await updateDoctorAdmin(Number(id), input)
    return NextResponse.json({ doctor })
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
    const doctor = await toggleDoctorField(Number(id), field, value)
    return NextResponse.json({ doctor })
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
    const doctor = await deleteDoctorAdmin(Number(id))
    if (doctor.image) await deleteUploadedFile(doctor.image)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
