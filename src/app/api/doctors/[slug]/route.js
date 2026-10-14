import { NextResponse } from 'next/server'
import { getDoctorBySlugPublic } from '@/lib/doctors'

export async function GET(request, { params }) {
  const { slug } = await params
  const doctor = await getDoctorBySlugPublic(slug)

  if (!doctor) {
    return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })
  }

  return NextResponse.json({ doctor })
}
