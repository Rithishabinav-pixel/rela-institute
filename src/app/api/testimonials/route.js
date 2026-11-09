import { NextResponse } from 'next/server'
import { listAllTestimonialsPublic, listInternationalTestimonialsPublic } from '@/lib/testimonials'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const scope = searchParams.get('scope') || 'all'

  const params = {
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    categoryId: searchParams.get('categoryId') || null,
    cursor: Number(searchParams.get('cursor')) || 0,
    limit: Number(searchParams.get('limit')) || 3,
  }

  const result =
    scope === 'international' ? await listInternationalTestimonialsPublic(params) : await listAllTestimonialsPublic(params)

  return NextResponse.json(result)
}
