import fs from 'node:fs'
import path from 'node:path'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { prisma } from './prisma.js'
import { parseCsv } from './csv.js'
import { sanitizeRichHtml } from './sanitize-html.js'
import { normalizeWhitespace, slugify } from './slug.js'

const DOCTORS_CACHE_TAG = 'doctors'
const PUBLIC_DOCTORS_REVALIDATE_SECONDS = 3600

function revalidateDoctorPaths(slugs) {
  revalidateTag(DOCTORS_CACHE_TAG)
  revalidatePath('/doctors')
  revalidatePath('/') // homepage reads showInHomepage
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(`/doctors/${slug}`)
  }
}

const DOCTORS_CSV_PATH = path.join(process.cwd(), 'rela-doctors-data.csv')
const NAME_COLUMN = 0
const DEPARTMENT_COLUMN = 2
const POSITION_COLUMN = 3
const SLUG_COLUMN = 4

async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug || 'doctor'
  let suffix = 2

  for (;;) {
    const existing = await prisma.doctor.findUnique({ where: { slug: candidate } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${baseSlug}-${suffix}`
    suffix++
  }
}

function splitDepartmentNames(cell) {
  return (cell ?? '')
    .split(',')
    .map(normalizeWhitespace)
    .filter(Boolean)
}

async function resolveDepartmentsByName(names) {
  const departments = await prisma.department.findMany({
    select: { id: true, departmentId: true, name: true, nameNormalized: true },
  })
  const byNormalized = new Map(departments.map((d) => [d.nameNormalized, d]))

  const matched = []
  const unmatched = []

  for (const name of names) {
    const found = byNormalized.get(name.toLowerCase())
    if (found) matched.push(found)
    else unmatched.push(name)
  }

  return { matched, unmatched }
}

function parseDoctorsFromCsv(csvText) {
  const { rows } = parseCsv(csvText)

  return rows
    .map((row) => ({
      name: normalizeWhitespace(row[NAME_COLUMN]),
      education: normalizeWhitespace(row[1]),
      departmentNames: splitDepartmentNames(row[DEPARTMENT_COLUMN]),
      position: normalizeWhitespace(row[POSITION_COLUMN]),
      slug: normalizeWhitespace(row[SLUG_COLUMN]).replace(/^\/+/, ''),
    }))
    .filter((doctor) => doctor.name)
}

export async function importDoctorsFromCsv() {
  const csvText = fs.readFileSync(DOCTORS_CSV_PATH, 'utf8')
  const rows = parseDoctorsFromCsv(csvText)

  const report = {
    totalRows: rows.length,
    imported: 0,
    updated: 0,
    skipped: 0,
    unmatchedDepartments: new Set(),
    errors: [],
  }

  for (const row of rows) {
    try {
      if (!row.slug) {
        report.skipped++
        report.errors.push(`${row.name || '(unnamed row)'}: missing slug in CSV`)
        continue
      }

      if (row.departmentNames.length === 0) {
        report.skipped++
        report.errors.push(`${row.name}: missing department in CSV`)
        continue
      }

      const { matched, unmatched } = await resolveDepartmentsByName(row.departmentNames)
      unmatched.forEach((name) => report.unmatchedDepartments.add(name))

      if (matched.length === 0) {
        report.skipped++
        report.errors.push(`${row.name}: no CSV department matched an existing Department record`)
        continue
      }

      const specialityDepartmentNormalized = row.departmentNames[0]?.toLowerCase()
      const speciality =
        matched.find((d) => d.nameNormalized === specialityDepartmentNormalized) ?? matched[0]

      const existing = await prisma.doctor.findUnique({ where: { slug: row.slug } })

      if (existing) {
        await prisma.doctorDepartment.deleteMany({ where: { doctorId: existing.id } })
        await prisma.doctor.update({
          where: { id: existing.id },
          data: {
            name: row.name,
            education: row.education,
            position: row.position,
            specialityId: speciality.id,
            departments: { create: matched.map((d) => ({ departmentId: d.id })) },
          },
        })
        report.updated++
      } else {
        await prisma.doctor.create({
          data: {
            slug: row.slug,
            name: row.name,
            education: row.education,
            position: row.position,
            mainPosition: row.position,
            specialityId: speciality.id,
            departments: { create: matched.map((d) => ({ departmentId: d.id })) },
          },
        })
        report.imported++
      }
    } catch (error) {
      report.skipped++
      report.errors.push(`${row.name || '(unnamed row)'}: ${error.message}`)
    }
  }

  return {
    ...report,
    unmatchedDepartments: [...report.unmatchedDepartments],
  }
}

const doctorCardSelect = {
  id: true,
  slug: true,
  name: true,
  image: true,
  position: true,
  speciality: { select: { id: true, departmentId: true, name: true } },
  departments: { select: { department: { select: { id: true, departmentId: true, name: true } } } },
}

const doctorDetailSelect = {
  id: true,
  slug: true,
  name: true,
  education: true,
  position: true,
  mainPosition: true,
  image: true,
  speciality: { select: { id: true, departmentId: true, name: true } },
  departments: { select: { department: { select: { id: true, departmentId: true, name: true } } } },
  tabs: { orderBy: { sortOrder: 'asc' }, select: { id: true, heading: true, content: true, sortOrder: true } },
}

function serializeDoctor(doctor) {
  return {
    id: doctor.id,
    slug: doctor.slug,
    name: doctor.name,
    image: doctor.image,
    position: doctor.position,
    speciality: doctor.speciality,
    departments: doctor.departments.map((link) => link.department),
  }
}

async function listDoctorsPublicUncached(search, departmentId) {
  const trimmedSearch = search.trim()
  const deptId = Number(departmentId) || null

  const doctors = await prisma.doctor.findMany({
    where: {
      ...(trimmedSearch ? { name: { contains: trimmedSearch, mode: 'insensitive' } } : {}),
      ...(deptId
        ? { departments: { some: { department: { departmentId: deptId } } } }
        : {}),
    },
    orderBy: { name: 'asc' },
    select: doctorCardSelect,
  })

  return doctors.map(serializeDoctor)
}

const cachedListDoctorsPublic = unstable_cache(listDoctorsPublicUncached, ['doctors-public-list'], {
  tags: [DOCTORS_CACHE_TAG],
  revalidate: PUBLIC_DOCTORS_REVALIDATE_SECONDS,
})

export async function listDoctorsPublic({ search = '', departmentId = '' } = {}) {
  return cachedListDoctorsPublic(search, departmentId)
}

async function getDoctorBySlugPublicUncached(slug) {
  const doctor = await prisma.doctor.findUnique({ where: { slug }, select: doctorDetailSelect })
  if (!doctor) return null

  return {
    id: doctor.id,
    slug: doctor.slug,
    name: doctor.name,
    education: doctor.education,
    position: doctor.position,
    mainPosition: doctor.mainPosition,
    image: doctor.image,
    speciality: doctor.speciality,
    departments: doctor.departments.map((link) => link.department),
    tabs: doctor.tabs.map((tab) => ({ ...tab, content: sanitizeRichHtml(tab.content) })),
  }
}

const cachedGetDoctorBySlugPublic = unstable_cache(getDoctorBySlugPublicUncached, ['doctor-public-detail'], {
  tags: [DOCTORS_CACHE_TAG],
  revalidate: PUBLIC_DOCTORS_REVALIDATE_SECONDS,
})

export async function getDoctorBySlugPublic(slug) {
  return cachedGetDoctorBySlugPublic(slug)
}

export async function listDoctorsAdmin({ search = '', page = 1, pageSize = 20 } = {}) {
  const trimmedSearch = search.trim()
  const where = trimmedSearch ? { name: { contains: trimmedSearch, mode: 'insensitive' } } : undefined

  const [total, doctors] = await Promise.all([
    prisma.doctor.count({ where }),
    prisma.doctor.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        slug: true,
        name: true,
        education: true,
        image: true,
        position: true,
        mainPosition: true,
        showInHomepage: true,
        quickSearch: true,
        speciality: { select: { id: true, departmentId: true, name: true } },
        departments: { select: { department: { select: { id: true, departmentId: true, name: true } } } },
      },
    }),
  ])

  return {
    doctors: doctors.map((doctor) => ({
      ...doctor,
      departments: doctor.departments.map((link) => link.department),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export async function getDoctorByIdAdmin(id) {
  const doctor = await prisma.doctor.findUnique({ where: { id }, select: doctorDetailSelect })
  if (!doctor) return null

  return {
    id: doctor.id,
    slug: doctor.slug,
    name: doctor.name,
    education: doctor.education,
    position: doctor.position,
    mainPosition: doctor.mainPosition,
    image: doctor.image,
    speciality: doctor.speciality,
    departments: doctor.departments.map((link) => link.department),
    tabs: doctor.tabs,
  }
}

async function departmentIdsToInternalIds(departmentIds) {
  const departments = await prisma.department.findMany({
    where: { departmentId: { in: departmentIds.map(Number) } },
    select: { id: true, departmentId: true },
  })

  return departments.map((d) => d.id)
}

function validateDoctorInput(input) {
  const errors = []

  if (!normalizeWhitespace(input.name)) errors.push('Name is required')
  if (!normalizeWhitespace(input.education)) errors.push('Education is required')
  if (!normalizeWhitespace(input.position)) errors.push('Doctor Position is required')
  if (!normalizeWhitespace(input.mainPosition)) errors.push('Main Position is required')
  if (!input.specialityDepartmentId) errors.push('Speciality is required')
  if (!Array.isArray(input.departmentIds) || input.departmentIds.length === 0) {
    errors.push('At least one department is required')
  }
  for (const tab of input.tabs ?? []) {
    if (!normalizeWhitespace(tab.heading)) errors.push('Every tab needs a heading')
    if (!normalizeWhitespace(tab.content)) errors.push('Every tab needs content')
  }

  return errors
}

export async function createDoctorAdmin(input) {
  const errors = validateDoctorInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const specialityDept = await prisma.department.findUnique({
    where: { departmentId: Number(input.specialityDepartmentId) },
  })
  if (!specialityDept) throw new Error('Selected speciality department does not exist')

  const internalDepartmentIds = await departmentIdsToInternalIds(input.departmentIds)
  if (internalDepartmentIds.length === 0) throw new Error('No valid departments selected')

  const baseSlug = slugify(input.slug || input.name)
  const slug = await ensureUniqueSlug(baseSlug)

  const doctor = await prisma.doctor.create({
    data: {
      slug,
      name: normalizeWhitespace(input.name),
      education: normalizeWhitespace(input.education),
      position: normalizeWhitespace(input.position),
      mainPosition: normalizeWhitespace(input.mainPosition),
      image: input.image || null,
      specialityId: specialityDept.id,
      departments: { create: internalDepartmentIds.map((id) => ({ departmentId: id })) },
      tabs: {
        create: (input.tabs ?? []).map((tab, index) => ({
          heading: normalizeWhitespace(tab.heading),
          content: sanitizeRichHtml(tab.content),
          sortOrder: index,
        })),
      },
    },
  })

  revalidateDoctorPaths([doctor.slug])

  return doctor
}

export async function updateDoctorAdmin(id, input) {
  const errors = validateDoctorInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const specialityDept = await prisma.department.findUnique({
    where: { departmentId: Number(input.specialityDepartmentId) },
  })
  if (!specialityDept) throw new Error('Selected speciality department does not exist')

  const internalDepartmentIds = await departmentIdsToInternalIds(input.departmentIds)
  if (internalDepartmentIds.length === 0) throw new Error('No valid departments selected')

  const existing = await prisma.doctor.findUnique({ where: { id }, select: { slug: true } })

  let slug
  if (input.slug) {
    slug = await ensureUniqueSlug(slugify(input.slug), id)
  }

  await prisma.$transaction([
    prisma.doctorDepartment.deleteMany({ where: { doctorId: id } }),
    prisma.doctorTab.deleteMany({ where: { doctorId: id } }),
    prisma.doctor.update({
      where: { id },
      data: {
        ...(slug ? { slug } : {}),
        name: normalizeWhitespace(input.name),
        education: normalizeWhitespace(input.education),
        position: normalizeWhitespace(input.position),
        mainPosition: normalizeWhitespace(input.mainPosition),
        ...(input.image !== undefined ? { image: input.image || null } : {}),
        specialityId: specialityDept.id,
        departments: { create: internalDepartmentIds.map((depId) => ({ departmentId: depId })) },
        tabs: {
          create: (input.tabs ?? []).map((tab, index) => ({
            heading: normalizeWhitespace(tab.heading),
            content: sanitizeRichHtml(tab.content),
            sortOrder: index,
          })),
        },
      },
    }),
  ])

  const updated = await prisma.doctor.findUnique({ where: { id } })
  revalidateDoctorPaths([existing?.slug, updated.slug])

  return updated
}

export async function deleteDoctorAdmin(id) {
  const deleted = await prisma.doctor.delete({ where: { id } })
  revalidateDoctorPaths([deleted.slug])
  return deleted
}

const TOGGLEABLE_DOCTOR_FIELDS = new Set(['showInHomepage', 'quickSearch'])

export async function toggleDoctorField(id, field, value) {
  if (!TOGGLEABLE_DOCTOR_FIELDS.has(field)) {
    throw new Error(`"${field}" is not a toggleable doctor field`)
  }

  const doctor = await prisma.doctor.update({
    where: { id },
    data: { [field]: Boolean(value) },
    select: { id: true, slug: true, showInHomepage: true, quickSearch: true },
  })

  revalidateDoctorPaths([doctor.slug])

  return doctor
}

async function getQuickSearchDepartmentsUncached() {
  const links = await prisma.doctorDepartment.findMany({
    where: { doctor: { quickSearch: true } },
    select: { department: { select: { id: true, departmentId: true, name: true } } },
  })

  const byId = new Map()
  for (const link of links) {
    byId.set(link.department.id, link.department)
  }

  return [...byId.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((department) => ({ id: department.departmentId, name: department.name }))
}

const cachedGetQuickSearchDepartments = unstable_cache(
  getQuickSearchDepartmentsUncached,
  ['doctors-quick-search-departments'],
  { tags: [DOCTORS_CACHE_TAG], revalidate: PUBLIC_DOCTORS_REVALIDATE_SECONDS }
)

export async function getQuickSearchDepartments() {
  return cachedGetQuickSearchDepartments()
}

async function getHomepageDoctorCardsUncached() {
  const doctors = await prisma.doctor.findMany({
    where: { showInHomepage: true },
    orderBy: { name: 'asc' },
    select: { slug: true, name: true, image: true, position: true, speciality: { select: { name: true } } },
  })

  return doctors.map((doctor) => ({
    image: doctor.image,
    name: doctor.name,
    speciality: doctor.speciality?.name ?? '',
    position: doctor.position,
    link: `/doctors/${doctor.slug}`,
  }))
}

const cachedGetHomepageDoctorCards = unstable_cache(
  getHomepageDoctorCardsUncached,
  ['doctors-homepage-cards'],
  { tags: [DOCTORS_CACHE_TAG], revalidate: PUBLIC_DOCTORS_REVALIDATE_SECONDS }
)

export async function getHomepageDoctorCards() {
  return cachedGetHomepageDoctorCards()
}
