import { NextResponse } from 'next/server'
import { createCareerEnquiry } from '@/lib/enquiries'
import { validateMobileNumber } from '@/lib/phone-validation'
import { sanitizePageUrl } from '@/lib/request-url'
import { isAllowedResumeType, saveUploadedResume } from '@/lib/resume-upload'
import { prisma } from '@/lib/prisma'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request) {
  const formData = await request.formData()

  const name = (formData.get('name') || '').toString().trim()
  const email = (formData.get('email') || '').toString().trim()
  const phone = (formData.get('phone') || '').toString().trim()
  const message = (formData.get('message') || '').toString().trim()
  const jobIdRaw = formData.get('jobId')
  const pageUrl = sanitizePageUrl((formData.get('pageUrl') || '').toString())
  const resumeFile = formData.get('resume')

  const errors = []
  if (!name) errors.push('Name is required')
  if (!EMAIL_REGEX.test(email)) errors.push('A valid email is required')

  const phoneResult = validateMobileNumber(phone)
  if (!phoneResult.valid) errors.push(phoneResult.error)

  if (!resumeFile || typeof resumeFile === 'string') {
    errors.push('A resume file is required')
  } else if (!isAllowedResumeType(resumeFile.type)) {
    errors.push('Resume must be a PDF, DOC, or DOCX file')
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join('; ') }, { status: 400 })
  }

  let job = null
  const jobId = Number(jobIdRaw)
  if (jobId) {
    job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, slug: true, jobTitle: { select: { name: true } }, jobCategory: { select: { name: true } }, jobLocation: { select: { name: true } } },
    })
  }

  let savedResume
  try {
    savedResume = await saveUploadedResume(resumeFile)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  try {
    const record = await createCareerEnquiry(
      {
        name,
        email,
        phone: phoneResult.e164,
        jobId: job?.id ?? null,
        jobTitleSnapshot: job?.jobTitle?.name ?? null,
        jobCategorySnapshot: job?.jobCategory?.name ?? null,
        jobLocationSnapshot: job?.jobLocation?.name ?? null,
        resumePath: savedResume.storedPath,
        resumeOriginalName: savedResume.originalName,
        message: message || null,
        pageUrl,
      },
      { origin: request.nextUrl.origin, jobSlug: job?.slug ?? null }
    )

    return NextResponse.json({ ok: true, id: record.id })
  } catch (error) {
    console.error('[career-apply] failed to save enquiry:', error.message)
    return NextResponse.json({ error: 'Could not submit your application. Please try again.' }, { status: 500 })
  }
}
