import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { listResourceCategoriesAdmin, createResourceCategoryAdmin } from '@/lib/resource-categories'

export async function GET(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const categories = await listResourceCategoriesAdmin({ search: searchParams.get('search') || '' })

  return NextResponse.json({ categories })
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
    const record = await createResourceCategoryAdmin(input)
    return NextResponse.json({ category: record }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
