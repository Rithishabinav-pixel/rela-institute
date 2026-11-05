import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import {
  getContactEnquiryByIdAdmin,
  getCareerEnquiryByIdAdmin,
  getContentEnquiryByIdAdmin,
  getDoctorEnquiryByIdAdmin,
  getPackageEnquiryByIdAdmin,
} from '@/lib/enquiries'

const GET_FNS = {
  contact: getContactEnquiryByIdAdmin,
  career: getCareerEnquiryByIdAdmin,
  content: getContentEnquiryByIdAdmin,
  doctor: getDoctorEnquiryByIdAdmin,
  package: getPackageEnquiryByIdAdmin,
}

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type, id } = await params
  const getFn = GET_FNS[type]
  if (!getFn) {
    return NextResponse.json({ error: 'Unknown enquiry type' }, { status: 400 })
  }

  const enquiry = await getFn(Number(id))
  if (!enquiry) {
    return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })
  }

  return NextResponse.json({ enquiry })
}
