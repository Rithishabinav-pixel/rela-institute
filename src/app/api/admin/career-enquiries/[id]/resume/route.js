import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-session'
import { getCareerEnquiryByIdAdmin } from '@/lib/enquiries'
import { readStoredResume } from '@/lib/resume-upload'

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const enquiry = await getCareerEnquiryByIdAdmin(Number(id))

  if (!enquiry || !enquiry.resumePath) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  const buffer = await readStoredResume(enquiry.resumePath)
  if (!buffer) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  const extension = enquiry.resumePath.split('.').pop()
  const contentType =
    extension === 'pdf'
      ? 'application/pdf'
      : extension === 'doc'
        ? 'application/msword'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${(enquiry.resumeOriginalName || 'resume').replace(/"/g, '')}"`,
    },
  })
}
