import { NextResponse } from 'next/server'
import { listResourcesPublic } from '@/lib/resources'

export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const result = await listResourcesPublic({
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    categoryId: searchParams.get('categoryId') || null,
    cursor: Number(searchParams.get('cursor')) || 0,
    limit: Number(searchParams.get('limit')) || 3,
  })

  return NextResponse.json(result)
}
