import { renderEmailLayout, fieldsTable, escapeHtml } from '../layout.js'

export function adminNotificationEmail(data) {
  const html = renderEmailLayout({
    heading: 'New Doctor Enquiry',
    bodyHtml: fieldsTable([
      ['Submitted At', new Date(data.createdAt).toLocaleString()],
      ['Name', data.name],
      ['Email', data.email],
      ['Mobile', data.phone],
      ['Country', data.countryName],
      ['State', data.stateName],
      ['Enquiry Type', data.enquiryType],
      ['Message', data.message],
      ['Page URL', data.pageUrl],
    ]),
  })

  return { subject: `New Doctor Enquiry from ${data.name}`, html }
}

export function thankYouEmail(data) {
  const html = renderEmailLayout({
    heading: 'Thank You for Your Enquiry',
    bodyHtml: `<p>Dear ${escapeHtml(data.name)},</p>
<p>Thank you for your enquiry with Rela Hospital. Our team will review your request and get in touch with you shortly.</p>
${data.pageUrl ? `<p>Submitted from: ${escapeHtml(data.pageUrl)}</p>` : ''}
<p>Warm regards,<br/>Rela Hospital</p>`,
  })

  return { subject: 'We Received Your Enquiry — Rela Hospital', html }
}
