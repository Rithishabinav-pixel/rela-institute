import { renderEmailLayout, fieldsTable, escapeHtml } from '../layout.js'

export function adminNotificationEmail(data) {
  const html = renderEmailLayout({
    heading: 'New Contact Enquiry',
    bodyHtml: fieldsTable([
      ['Submitted At', new Date(data.createdAt).toLocaleString()],
      ['Name', data.name],
      ['Email', data.email],
      ['Mobile', data.phone],
      ['Preferred Location', data.preferredLocation],
      [`I'm Looking For`, data.lookingFor],
      ['Message', data.message],
      ['Page URL', data.pageUrl],
    ]),
  })

  return { subject: `New Contact Enquiry from ${data.name}`, html }
}

export function thankYouEmail(data) {
  const html = renderEmailLayout({
    heading: 'Thank You for Reaching Out',
    bodyHtml: `<p>Dear ${escapeHtml(data.name)},</p>
<p>Thank you for contacting Rela Hospital. We have received your enquiry and one of our team members will get back to you shortly.</p>
${data.pageUrl ? `<p>Submitted from: ${escapeHtml(data.pageUrl)}</p>` : ''}
<p>Warm regards,<br/>Rela Hospital</p>`,
  })

  return { subject: 'We Received Your Enquiry — Rela Hospital', html }
}
