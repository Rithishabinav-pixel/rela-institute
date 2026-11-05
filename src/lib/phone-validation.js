import { parsePhoneNumber } from 'libphonenumber-js'

export function validateMobileNumber(value) {
  if (!value || typeof value !== 'string') {
    return { valid: false, error: 'Mobile number is required' }
  }

  let parsed
  try {
    parsed = parsePhoneNumber(value)
  } catch {
    return { valid: false, error: 'Enter a valid mobile number' }
  }

  if (!parsed || !parsed.isValid()) {
    return { valid: false, error: 'Enter a valid mobile number' }
  }

  if (!/^\d{10}$/.test(parsed.nationalNumber)) {
    return { valid: false, error: 'Mobile number must contain exactly 10 digits' }
  }

  return {
    valid: true,
    nationalNumber: parsed.nationalNumber,
    callingCode: parsed.countryCallingCode,
    e164: parsed.number,
  }
}
