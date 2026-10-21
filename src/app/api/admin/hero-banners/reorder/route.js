import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { reorderHeroBannersAdmin } from '@/lib/hero-banners'

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { orderedIds } = body ?? {}
  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: 'orderedIds array is required' }, { status: 400 })
  }

  try {
    const banners = await reorderHeroBannersAdmin(orderedIds)
    return NextResponse.json({ banners })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
