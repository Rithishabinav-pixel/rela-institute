import { NextResponse } from 'next/server'
import { listPatientExperiencesPublic } from '@/lib/patient-experience'

export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const result = await listPatientExperiencesPublic({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') || null,
    cursor: Number(searchParams.get('cursor')) || 0,
    limit: Number(searchParams.get('limit')) || 3,
  })

  return NextResponse.json(result)
}
