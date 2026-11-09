import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import {
  getPatientExperienceByIdAdmin,
  updatePatientExperienceAdmin,
  deletePatientExperienceAdmin,
  togglePatientExperienceActive,
} from '@/lib/patient-experience'
import { deleteUploadedFile } from '@/lib/upload'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const record = await getPatientExperienceByIdAdmin(Number(id))
  if (!record) return NextResponse.json({ error: 'Patient experience not found' }, { status: 404 })

  return NextResponse.json({ patientExperience: record })
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
    const previous = await getPatientExperienceByIdAdmin(Number(id))
    const record = await updatePatientExperienceAdmin(Number(id), input)

    if (previous?.featureImage && previous.featureImage !== record.featureImage) {
      await deleteUploadedFile(previous.featureImage)
    }

    return NextResponse.json({ patientExperience: record })
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
    const record = await togglePatientExperienceActive(Number(id), body.isActive)
    return NextResponse.json({ patientExperience: record })
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
    const deleted = await deletePatientExperienceAdmin(Number(id))
    if (deleted.featureImage) await deleteUploadedFile(deleted.featureImage)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
