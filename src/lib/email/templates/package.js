import { renderEmailLayout, fieldsTable, escapeHtml } from '../layout.js'

export function adminNotificationEmail(data) {
  const html = renderEmailLayout({
    heading: 'New Health Package Enquiry',
    bodyHtml: fieldsTable([
      ['Submitted At', new Date(data.createdAt).toLocaleString()],
      ['Name', data.name],
      ['Email', data.email],
      ['Mobile', data.phone],
      ['Package', data.packageNameSnapshot],
      ['Preferred Location', data.preferredLocation],
      ['Message', data.message],
      ['Page URL', data.pageUrl],
    ]),
  })

  return { subject: `New Health Package Enquiry — ${data.packageNameSnapshot || data.name}`, html }
}

export function thankYouEmail(data) {
  const html = renderEmailLayout({
    heading: 'Enquiry Received',
    bodyHtml: `<p>Dear ${escapeHtml(data.name)},</p>
<p>Thank you for your interest${data.packageNameSnapshot ? ` in the <strong>${escapeHtml(data.packageNameSnapshot)}</strong> package` : ''} at Rela Hospital. Our team will contact you shortly to help you book your health check-up.</p>
${data.pageUrl ? `<p>Submitted from: ${escapeHtml(data.pageUrl)}</p>` : ''}
<p>Warm regards,<br/>Rela Hospital</p>`,
  })

  return { subject: 'We Received Your Enquiry — Rela Hospital', html }
}
