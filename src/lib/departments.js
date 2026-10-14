import fs from 'node:fs'
import path from 'node:path'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { prisma } from './prisma.js'
import { parseCsv } from './csv.js'
import { normalizeWhitespace, slugify } from './slug.js'

const DOCTORS_CSV_PATH = path.join(process.cwd(), 'rela-doctors-data.csv')
const DEPARTMENT_COLUMN_INDEX = 2 // Column C: Department
const FIRST_DEPARTMENT_ID = 1001
const MAX_ID_ASSIGN_ATTEMPTS = 5

function revalidateDepartmentCaches() {
  revalidateTag('departments')
  revalidateTag('doctors') // doctor listings/cards embed department & speciality names
  revalidatePath('/doctors')
}

export function extractDepartmentNamesFromCsv(csvText) {
  const { rows } = parseCsv(csvText)
  const seen = new Map()

  for (const row of rows) {
    const cell = row[DEPARTMENT_COLUMN_INDEX] ?? ''

    for (const rawName of cell.split(',')) {
      const name = normalizeWhitespace(rawName)
      if (!name) continue

      const key = name.toLowerCase()
      if (!seen.has(key)) seen.set(key, name)
    }
  }

  return [...seen.values()]
}

export async function getNextDepartmentId() {
  const result = await prisma.department.aggregate({ _max: { departmentId: true } })
  const currentMax = result._max.departmentId

  return currentMax && currentMax >= FIRST_DEPARTMENT_ID ? currentMax + 1 : FIRST_DEPARTMENT_ID
}

export async function createDepartment(name) {
  const cleanName = normalizeWhitespace(name)
  const nameNormalized = cleanName.toLowerCase()

  for (let attempt = 0; attempt < MAX_ID_ASSIGN_ATTEMPTS; attempt++) {
    const departmentId = await getNextDepartmentId()

    try {
      return await prisma.department.create({
        data: { departmentId, name: cleanName, nameNormalized },
      })
    } catch (error) {
      const isUniqueConflict = error?.code === 'P2002'
      const conflictsOnDepartmentId = error?.meta?.target?.includes?.('departmentId')
      if (isUniqueConflict && conflictsOnDepartmentId && attempt < MAX_ID_ASSIGN_ATTEMPTS - 1) {
        continue
      }
      throw error
    }
  }

  throw new Error(`Could not assign a unique department ID after ${MAX_ID_ASSIGN_ATTEMPTS} attempts`)
}

export async function importDepartmentsFromCsv() {
  const csvText = fs.readFileSync(DOCTORS_CSV_PATH, 'utf8')
  const names = extractDepartmentNamesFromCsv(csvText)

  const existing = await prisma.department.findMany({ select: { nameNormalized: true } })
  const existingKeys = new Set(existing.map((d) => d.nameNormalized))

  const toCreate = names.filter((name) => !existingKeys.has(name.toLowerCase()))

  let nextId = await getNextDepartmentId()
  const createdNow = new Set()
  let created = 0

  for (const name of toCreate) {
    const nameNormalized = name.toLowerCase()
    if (createdNow.has(nameNormalized)) continue

    await prisma.department.create({
      data: { departmentId: nextId, name, nameNormalized },
    })

    createdNow.add(nameNormalized)
    nextId++
    created++
  }

  return {
    totalInCsv: names.length,
    created,
    skippedExisting: names.length - created,
  }
}

export async function listDepartments({ search = '' } = {}) {
  const trimmed = search.trim()

  return prisma.department.findMany({
    where: trimmed ? { name: { contains: trimmed, mode: 'insensitive' } } : undefined,
    orderBy: { name: 'asc' },
    select: { departmentId: true, name: true },
  })
}

// Cached variant for public, unfiltered use only (e.g. the doctors page's department
// dropdown). Admin call sites keep calling listDepartments() directly so live search
// results are never served from a shared cache.
const cachedListAllDepartments = unstable_cache(() => listDepartments(), ['departments-public-list'], {
  tags: ['departments'],
  revalidate: 3600,
})

export async function getPublicDepartmentList() {
  return cachedListAllDepartments()
}

async function ensureUniqueDepartmentSlug(baseSlug, excludeId = null) {
  let candidate = baseSlug || 'department'
  let suffix = 2

  for (;;) {
    const existing = await prisma.department.findUnique({ where: { slug: candidate } })
    if (!existing || existing.id === excludeId) return candidate
    candidate = `${baseSlug}-${suffix}`
    suffix++
  }
}

export async function listDepartmentsAdmin({ search = '', page = 1, pageSize = 20 } = {}) {
  const trimmedSearch = search.trim()
  const where = trimmedSearch ? { name: { contains: trimmedSearch, mode: 'insensitive' } } : undefined

  const [total, departments] = await Promise.all([
    prisma.department.count({ where }),
    prisma.department.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        departmentId: true,
        name: true,
        slug: true,
        icon: true,
        showInHomepage: true,
        centerOfExcellence: true,
        _count: { select: { symptoms: true } },
      },
    }),
  ])

  return {
    departments: departments.map((d) => ({ ...d, symptomCount: d._count.symptoms, _count: undefined })),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export async function getDepartmentByIdAdmin(id) {
  const department = await prisma.department.findUnique({
    where: { id },
    include: { symptoms: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!department) return null

  return {
    ...department,
    slug: department.slug || slugify(department.name),
    symptoms: department.symptoms.map((s) => s.name),
  }
}

function validateDepartmentInput(input) {
  const errors = []
  if (!normalizeWhitespace(input.name)) errors.push('Department name is required')
  if (!normalizeWhitespace(input.slug)) errors.push('Slug is required')
  for (const symptom of input.symptoms ?? []) {
    if (!normalizeWhitespace(symptom)) errors.push('Symptoms cannot be empty')
  }
  return errors
}

async function assertNameNotDuplicate(name, excludeId = null) {
  const nameNormalized = normalizeWhitespace(name).toLowerCase()
  const existing = await prisma.department.findUnique({ where: { nameNormalized } })
  if (existing && existing.id !== excludeId) {
    throw new Error(`A department named "${normalizeWhitespace(name)}" already exists`)
  }
}

function dedupeSymptoms(symptoms) {
  const seen = new Map()
  for (const raw of symptoms ?? []) {
    const name = normalizeWhitespace(raw)
    if (!name) continue
    const key = name.toLowerCase()
    if (!seen.has(key)) seen.set(key, name)
  }
  return [...seen.values()]
}

export async function createDepartmentAdmin(input) {
  const errors = validateDepartmentInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  await assertNameNotDuplicate(input.name)

  const slug = await ensureUniqueDepartmentSlug(slugify(input.slug))
  const departmentId = await getNextDepartmentId()
  const symptoms = dedupeSymptoms(input.symptoms)

  const department = await prisma.department.create({
    data: {
      departmentId,
      name: normalizeWhitespace(input.name),
      nameNormalized: normalizeWhitespace(input.name).toLowerCase(),
      slug,
      icon: input.icon || null,
      symptoms: { create: symptoms.map((name, index) => ({ name, sortOrder: index })) },
    },
  })

  revalidateDepartmentCaches()

  return department
}

export async function updateDepartmentAdmin(id, input) {
  const errors = validateDepartmentInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  await assertNameNotDuplicate(input.name, id)

  const existing = await prisma.department.findUnique({ where: { id } })
  if (!existing) throw new Error('Department not found')

  const requestedSlug = slugify(input.slug)
  const slug =
    requestedSlug === existing.slug ? existing.slug : await ensureUniqueDepartmentSlug(requestedSlug, id)

  const symptoms = dedupeSymptoms(input.symptoms)

  await prisma.$transaction([
    prisma.departmentSymptom.deleteMany({ where: { departmentId: id } }),
    prisma.department.update({
      where: { id },
      data: {
        name: normalizeWhitespace(input.name),
        nameNormalized: normalizeWhitespace(input.name).toLowerCase(),
        slug,
        ...(input.icon !== undefined ? { icon: input.icon || null } : {}),
        symptoms: { create: symptoms.map((name, index) => ({ name, sortOrder: index })) },
      },
    }),
  ])

  revalidateDepartmentCaches()

  return prisma.department.findUnique({ where: { id } })
}

export async function getDepartmentUsage(id) {
  const [specialityCount, linkedCount] = await Promise.all([
    prisma.doctor.count({ where: { specialityId: id } }),
    prisma.doctorDepartment.count({ where: { departmentId: id } }),
  ])

  const doctorIds = new Set()
  if (specialityCount > 0 || linkedCount > 0) {
    const doctors = await prisma.doctor.findMany({
      where: { OR: [{ specialityId: id }, { departments: { some: { departmentId: id } } }] },
      select: { id: true },
    })
    doctors.forEach((d) => doctorIds.add(d.id))
  }

  return { doctorCount: doctorIds.size }
}

const TOGGLEABLE_DEPARTMENT_FIELDS = new Set(['showInHomepage', 'centerOfExcellence'])

export async function toggleDepartmentField(id, field, value) {
  if (!TOGGLEABLE_DEPARTMENT_FIELDS.has(field)) {
    throw new Error(`"${field}" is not a toggleable department field`)
  }

  const department = await prisma.department.update({
    where: { id },
    data: { [field]: Boolean(value) },
    select: { id: true, slug: true, showInHomepage: true, centerOfExcellence: true },
  })

  revalidateDepartmentCaches()

  return department
}

export async function deleteDepartmentAdmin(id) {
  const { doctorCount } = await getDepartmentUsage(id)
  if (doctorCount > 0) {
    throw new Error(
      `This department is referenced by ${doctorCount} doctor${doctorCount === 1 ? '' : 's'} and cannot be deleted. Reassign or remove those doctors from this department first.`
    )
  }

  const deleted = await prisma.department.delete({ where: { id } })
  revalidateDepartmentCaches()
  return deleted
}
