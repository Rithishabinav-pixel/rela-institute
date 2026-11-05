import { NextResponse } from 'next/server'
import { createPackageEnquiry } from '@/lib/enquiries'
import { validateMobileNumber } from '@/lib/phone-validation'
import { sanitizePageUrl } from '@/lib/request-url'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const name = (body.name || '').trim()
  const email = (body.email || '').trim()
  const preferredLocation = (body.preferredLocation || '').trim()
  const message = (body.message || '').trim()
  const packageId = Number.isFinite(Number(body.packageId)) && body.packageId ? Number(body.packageId) : null
  const packageName = (body.packageName || '').trim()
  const packageSlug = (body.packageSlug || '').trim()

  const errors = []
  if (!name) errors.push('Name is required')
  if (!EMAIL_REGEX.test(email)) errors.push('A valid email is required')

  const phoneResult = validateMobileNumber(body.phone)
  if (!phoneResult.valid) errors.push(phoneResult.error)

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join('; ') }, { status: 400 })
  }

  try {
    const record = await createPackageEnquiry({
      name,
      email,
      phone: phoneResult.e164,
      preferredLocation: preferredLocation || null,
      message: message || null,
      packageId,
      packageNameSnapshot: packageName || null,
      packageSlugSnapshot: packageSlug || null,
      pageUrl: sanitizePageUrl(body.pageUrl),
    })

    return NextResponse.json({ ok: true, id: record.id })
  } catch (error) {
    console.error('[package-enquiry] failed to save enquiry:', error.message)
    return NextResponse.json({ error: 'Could not submit your enquiry. Please try again.' }, { status: 500 })
  }
}
