import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { listHealthPackagesAdmin, createHealthPackageAdmin } from '@/lib/health-packages'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const packages = await listHealthPackagesAdmin()
  return NextResponse.json({ packages })
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
    const pkg = await createHealthPackageAdmin(input)
    return NextResponse.json({ package: pkg }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
