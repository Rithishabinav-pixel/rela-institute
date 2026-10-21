import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { listHeroBannersAdmin, createHeroBannerAdmin } from '@/lib/hero-banners'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const banners = await listHeroBannersAdmin()
  return NextResponse.json({ banners })
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
    const banner = await createHeroBannerAdmin(input)
    return NextResponse.json({ banner }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
