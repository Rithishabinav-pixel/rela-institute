import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { listResourcesAdmin, createResourceAdmin } from '@/lib/resources'

export async function GET(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const result = await listResourcesAdmin({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || null,
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
    const record = await createResourceAdmin(input)
    return NextResponse.json({ resource: record }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
