import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { listJobsAdmin, createJobAdmin } from '@/lib/jobs'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jobs = await listJobsAdmin()
  return NextResponse.json({ jobs })
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
    const job = await createJobAdmin(input)
    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
