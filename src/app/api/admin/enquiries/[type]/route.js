import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import {
  listContactEnquiriesAdmin,
  listCareerEnquiriesAdmin,
  listContentEnquiriesAdmin,
  listDoctorEnquiriesAdmin,
  listPackageEnquiriesAdmin,
} from '@/lib/enquiries'

const LIST_FNS = {
  contact: listContactEnquiriesAdmin,
  career: listCareerEnquiriesAdmin,
  content: listContentEnquiriesAdmin,
  doctor: listDoctorEnquiriesAdmin,
  package: listPackageEnquiriesAdmin,
}

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type } = await params
  const listFn = LIST_FNS[type]
  if (!listFn) {
    return NextResponse.json({ error: 'Unknown enquiry type' }, { status: 400 })
  }

  const page = Number(request.nextUrl.searchParams.get('page')) || 1
  const result = await listFn(page)
  return NextResponse.json(result)
}
