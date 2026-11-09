import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { listTestimonialsAdmin, createTestimonialAdmin } from '@/lib/testimonials'

export async function GET(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const international = searchParams.get('international')
  const featured = searchParams.get('featured')

  const result = await listTestimonialsAdmin({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || null,
    international: international === null ? null : international === 'true',
    featured: featured === null ? null : featured === 'true',
    page: Number(searchParams.get('page')) || 1,
    pageSize: Number(searchParams.get('pageSize')) || 20,
  })

  return NextResponse.json(result)
}

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let input
  try {
    input = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    const record = await createTestimonialAdmin(input)
    return NextResponse.json({ testimonial: record }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
