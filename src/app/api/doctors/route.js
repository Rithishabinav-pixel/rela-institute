import { NextResponse } from 'next/server'
import { listDoctorsPublic } from '@/lib/doctors'

export async function GET(request) {
  const search = request.nextUrl.searchParams.get('search') ?? ''
  const departmentId = request.nextUrl.searchParams.get('department') ?? ''

  const doctors = await listDoctorsPublic({ search, departmentId })
  return NextResponse.json({ doctors })
}
