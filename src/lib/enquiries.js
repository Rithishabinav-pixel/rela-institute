import { prisma } from './prisma.js'
import { sendMail, getAdminEmail } from './email/mailer.js'
import * as contactTemplate from './email/templates/contact.js'
import * as careerTemplate from './email/templates/career.js'
import * as contentTemplate from './email/templates/content.js'
import * as doctorTemplate from './email/templates/doctor.js'
import * as packageTemplate from './email/templates/package.js'

async function dispatchEmails(model, id, data, template) {
  try {
    const adminEmail = getAdminEmail()

    const [adminSend, userSend] = await Promise.all([
      adminEmail
        ? sendMail({ ...template.adminNotificationEmail(data), to: adminEmail })
        : Promise.resolve({ sent: false, reason: 'no-admin-email' }),
      sendMail({ ...template.thankYouEmail(data), to: data.email }),
    ])

    const emailStatus = adminSend.sent && userSend.sent ? 'sent' : adminSend.sent || userSend.sent ? 'partial' : 'failed'

    await model.update({ where: { id }, data: { emailStatus } }).catch(() => {})

    return { adminSend, userSend, emailStatus }
  } catch (error) {
    console.error('[enquiries] email dispatch failed:', error.message)
    return { adminSend: { sent: false }, userSend: { sent: false }, emailStatus: 'failed' }
  }
}

export async function createContactEnquiry(input) {
  const record = await prisma.contactEnquiry.create({ data: input })
  await dispatchEmails(prisma.contactEnquiry, record.id, { ...record }, contactTemplate)
  return record
}

export async function createCareerEnquiry(input, context = {}) {
  const { origin, jobSlug } = context
  const record = await prisma.careerEnquiry.create({ data: input })

  await dispatchEmails(
    prisma.careerEnquiry,
    record.id,
    {
      ...record,
      jobPageUrl: origin && jobSlug ? `${origin}/careers/detail/${jobSlug}` : null,
      resumeAdminUrl: origin && record.resumePath ? `${origin}/api/admin/career-enquiries/${record.id}/resume` : null,
    },
    careerTemplate
  )

  return record
}

export async function createContentEnquiry(input) {
  const record = await prisma.contentEnquiry.create({ data: input })
  await dispatchEmails(prisma.contentEnquiry, record.id, { ...record }, contentTemplate)
  return record
}

export async function createDoctorEnquiry(input) {
  const record = await prisma.doctorEnquiry.create({ data: input })
  await dispatchEmails(prisma.doctorEnquiry, record.id, { ...record }, doctorTemplate)
  return record
}

export async function createPackageEnquiry(input) {
  const record = await prisma.packageEnquiry.create({ data: input })
  await dispatchEmails(prisma.packageEnquiry, record.id, { ...record }, packageTemplate)
  return record
}

const PAGE_SIZE = 20

export async function listContactEnquiriesAdmin(page = 1) {
  const [total, items] = await Promise.all([
    prisma.contactEnquiry.count(),
    prisma.contactEnquiry.findMany({ orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ])
  return { items, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) }
}

export async function listCareerEnquiriesAdmin(page = 1) {
  const [total, items] = await Promise.all([
    prisma.careerEnquiry.count(),
    prisma.careerEnquiry.findMany({ orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ])
  return { items, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) }
}

export async function listContentEnquiriesAdmin(page = 1) {
  const [total, items] = await Promise.all([
    prisma.contentEnquiry.count(),
    prisma.contentEnquiry.findMany({ orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ])
  return { items, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) }
}

export async function listDoctorEnquiriesAdmin(page = 1) {
  const [total, items] = await Promise.all([
    prisma.doctorEnquiry.count(),
    prisma.doctorEnquiry.findMany({ orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ])
  return { items, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) }
}

export async function getContactEnquiryByIdAdmin(id) {
  return prisma.contactEnquiry.findUnique({ where: { id } })
}

export async function getCareerEnquiryByIdAdmin(id) {
  return prisma.careerEnquiry.findUnique({ where: { id } })
}

export async function getContentEnquiryByIdAdmin(id) {
  return prisma.contentEnquiry.findUnique({ where: { id } })
}

export async function getDoctorEnquiryByIdAdmin(id) {
  return prisma.doctorEnquiry.findUnique({ where: { id } })
}

export async function listPackageEnquiriesAdmin(page = 1) {
  const [total, items] = await Promise.all([
    prisma.packageEnquiry.count(),
    prisma.packageEnquiry.findMany({ orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ])
  return { items, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) }
}

export async function getPackageEnquiryByIdAdmin(id) {
  return prisma.packageEnquiry.findUnique({ where: { id } })
}
