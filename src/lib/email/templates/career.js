import { renderEmailLayout, fieldsTable, escapeHtml } from '../layout.js'

export function adminNotificationEmail(data) {
  const html = renderEmailLayout({
    heading: 'New Career Application',
    bodyHtml: fieldsTable([
      ['Submitted At', new Date(data.createdAt).toLocaleString()],
      ['Name', data.name],
      ['Email', data.email],
      ['Mobile', data.phone],
      ['Job Title', data.jobTitleSnapshot],
      ['Job Category', data.jobCategorySnapshot],
      ['Job Location', data.jobLocationSnapshot],
      ['Message', data.message],
      ['Page URL', data.pageUrl],
      ['Job Detail Page URL', data.jobPageUrl],
      ['Resume', data.resumeAdminUrl],
    ]),
  })

  return { subject: `New Career Application — ${data.jobTitleSnapshot || data.name}`, html }
}

export function thankYouEmail(data) {
  const html = renderEmailLayout({
    heading: 'Application Received',
    bodyHtml: `<p>Dear ${escapeHtml(data.name)},</p>
<p>Thank you for applying${data.jobTitleSnapshot ? ` for the position of <strong>${escapeHtml(data.jobTitleSnapshot)}</strong>` : ''} at Rela Hospital. Our recruitment team has received your application and will review it shortly.</p>
${data.pageUrl ? `<p>Submitted from: ${escapeHtml(data.pageUrl)}</p>` : ''}
<p>Warm regards,<br/>Rela Hospital Careers Team</p>`,
  })

  return { subject: 'Your Application Has Been Received — Rela Hospital', html }
}
