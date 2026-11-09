import { NextResponse } from 'next/server'
import { listNewslettersPublic } from '@/lib/newsletters'

export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const result = await listNewslettersPublic({
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    cursor: Number(searchParams.get('cursor')) || 0,
    limit: Number(searchParams.get('limit')) || 3,
  })

  return NextResponse.json(result)
}
