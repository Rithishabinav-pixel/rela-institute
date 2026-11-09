import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { listNewslettersAdmin, createNewsletterAdmin } from '@/lib/newsletters'

export async function GET(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const result = await listNewslettersAdmin({
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
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
    const record = await createNewsletterAdmin(input)
    return NextResponse.json({ newsletter: record }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
