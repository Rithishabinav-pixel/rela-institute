import { NextResponse } from 'next/server'
import { createDoctorEnquiry } from '@/lib/enquiries'
import { validateMobileNumber } from '@/lib/phone-validation'
import { sanitizePageUrl } from '@/lib/request-url'
import { isValidCountryState, getCountryName, getStateName } from '@/lib/geo'

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
  const country = (body.country || '').trim()
  const state = (body.state || '').trim()
  const enquiryType = (body.enquiryType || '').trim()
  const message = (body.message || '').trim()

  const errors = []
  if (!name) errors.push('Name is required')
  if (!EMAIL_REGEX.test(email)) errors.push('A valid email is required')

  const phoneResult = validateMobileNumber(body.phone)
  if (!phoneResult.valid) errors.push(phoneResult.error)

  if (!isValidCountryState(country || null, state || null)) {
    errors.push('Selected state does not belong to the selected country')
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join('; ') }, { status: 400 })
  }

  try {
    const record = await createDoctorEnquiry({
      name,
      email,
      phone: phoneResult.e164,
      country: getCountryName(country) || null,
      state: getStateName(country, state) || null,
      enquiryType: enquiryType || null,
      message: message || null,
      pageUrl: sanitizePageUrl(body.pageUrl),
    })

    return NextResponse.json({ ok: true, id: record.id })
  } catch (error) {
    console.error('[doctor-enquiry] failed to save enquiry:', error.message)
    return NextResponse.json({ error: 'Could not submit your enquiry. Please try again.' }, { status: 500 })
  }
}
