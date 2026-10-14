import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { listDoctorsAdmin, createDoctorAdmin } from '@/lib/doctors'

export async function GET(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const search = request.nextUrl.searchParams.get('search') ?? ''
  const page = Number(request.nextUrl.searchParams.get('page')) || 1
  const pageSize = Number(request.nextUrl.searchParams.get('pageSize')) || 20

  const result = await listDoctorsAdmin({ search, page, pageSize })
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
    const doctor = await createDoctorAdmin(input)
    return NextResponse.json({ doctor }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
