import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import {
  getTestimonialCategoryByIdAdmin,
  updateTestimonialCategoryAdmin,
  deleteTestimonialCategoryAdmin,
  toggleTestimonialCategoryActive,
} from '@/lib/testimonial-categories'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const record = await getTestimonialCategoryByIdAdmin(Number(id))
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
    const record = await updateTestimonialCategoryAdmin(Number(id), input)
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
    const record = await toggleTestimonialCategoryActive(Number(id), body.isActive)
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
    await deleteTestimonialCategoryAdmin(Number(id))
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
