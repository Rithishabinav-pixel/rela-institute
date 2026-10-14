import { NextResponse } from 'next/server'
import { listDepartments } from '@/lib/departments'
import { getQuickSearchDepartments } from '@/lib/doctors'

export async function GET(request) {
  const quickSearchOnly = request.nextUrl.searchParams.get('quickSearch') === 'true'

  if (quickSearchOnly) {
    const departments = await getQuickSearchDepartments()
    return NextResponse.json({ departments })
  }

  const departments = await listDepartments()
  return NextResponse.json({
    departments: departments.map((d) => ({ id: d.departmentId, name: d.name })),
  })
}
