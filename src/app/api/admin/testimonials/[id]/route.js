import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import {
  getTestimonialByIdAdmin,
  updateTestimonialAdmin,
  deleteTestimonialAdmin,
  toggleTestimonialField,
} from '@/lib/testimonials'
import { deleteUploadedFile } from '@/lib/upload'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const record = await getTestimonialByIdAdmin(Number(id))
  if (!record) return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })

  return NextResponse.json({ testimonial: record })
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
    const previous = await getTestimonialByIdAdmin(Number(id))
    const record = await updateTestimonialAdmin(Number(id), input)

    if (previous?.userImage && previous.userImage !== record.userImage) {
      await deleteUploadedFile(previous.userImage)
    }
    if (previous?.featureImage && previous.featureImage !== record.featureImage) {
      await deleteUploadedFile(previous.featureImage)
    }

    return NextResponse.json({ testimonial: record })
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

  if (!body.field || typeof body.value !== 'boolean') {
    return NextResponse.json({ error: 'field and boolean value are required' }, { status: 400 })
  }

  try {
    const record = await toggleTestimonialField(Number(id), body.field, body.value)
    return NextResponse.json({ testimonial: record })
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
    const deleted = await deleteTestimonialAdmin(Number(id))
    if (deleted.userImage) await deleteUploadedFile(deleted.userImage)
    if (deleted.featureImage) await deleteUploadedFile(deleted.featureImage)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
