import nodemailer from 'nodemailer'

let cachedTransporter = null
let loggedMissingConfigWarning = false

export function isMailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS)
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter
  if (!isMailConfigured()) return null

  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  return cachedTransporter
}

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL || ''
}

export async function sendMail({ to, subject, html }) {
  if (!to) return { sent: false, reason: 'no-recipient' }

  const transporter = getTransporter()
  if (!transporter) {
    if (!loggedMissingConfigWarning) {
      loggedMissingConfigWarning = true
      console.warn('[mailer] SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS are not fully configured — emails will be skipped.')
    }
    return { sent: false, reason: 'not-configured' }
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    })
    return { sent: true }
  } catch (error) {
    console.error('[mailer] failed to send email:', error.message)
    return { sent: false, reason: 'send-error' }
  }
}
