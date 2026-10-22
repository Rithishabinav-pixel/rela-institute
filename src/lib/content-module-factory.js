// Generic factory for "press content" modules that share the exact same shape
// as MediaArticle/SuccessStory: title/slug/publishedAt/featureType/featureImage/
// youtubeUrl/readMoreUrl/pageLink/content/quickSearch, with Department + Doctor
// many-to-many links and an ordered gallery. Used by Expert Talks and Events.
//
// MediaArticle and SuccessStory predate this factory and are NOT migrated onto
// it — they're already shipped, tested, and working, and retrofitting proven
// code onto a new abstraction is a needless regression risk. New modules with
// this exact shape should use this factory instead of copy-pasting a new
// ~650-line lib file.
import fs from 'node:fs'
import path from 'node:path'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'
import { prisma } from './prisma.js'
import { parseCsvSafe } from './csv.js'
import { sanitizeRichHtml } from './sanitize-html.js'
import { normalizeWhitespace, slugify } from './slug.js'
import {
  splitNames,
  resolveDepartmentsByName,
  resolveDoctorsByName,
  normalizeYoutubeUrl,
  extractYoutubeVideoId,
  parseCsvDate,
  downloadAndSaveRemoteImage as downloadAndSaveRemoteImageTo,
} from './press-content-helpers.js'

/**
 * @param {object} config
 * @param {string} config.delegateName - prisma delegate, e.g. 'successStory'
 * @param {string} config.deptJoinDelegateName - e.g. 'successStoryDepartment'
 * @param {string} config.doctorJoinDelegateName - e.g. 'successStoryDoctor'
 * @param {string} config.galleryDelegateName - e.g. 'successStoryGalleryImage'
 * @param {string} config.fkField - FK column name on all three join/gallery tables, e.g. 'successStoryId'
 * @param {string} config.cacheTag - unstable_cache tag + cache-key namespace, e.g. 'success-stories'
 * @param {string} config.csvFileName - CSV file name in the project root
 * @param {string} config.uploadFolder - public/uploads/<folder>
 * @param {string} config.publicBasePath - e.g. '/success-stories'
 * @param {string} config.slugFallback - fallback slug base, e.g. 'success-story'
 * @param {number} [config.revalidateSeconds] - defaults to 3600
 */
export function createContentModule(config) {
  const {
    delegateName,
    deptJoinDelegateName,
    doctorJoinDelegateName,
    galleryDelegateName,
    fkField,
    cacheTag,
    csvFileName,
    uploadFolder,
    publicBasePath,
    slugFallback,
    revalidateSeconds = 3600,
  } = config

  const db = () => prisma[delegateName]
  const deptJoinDb = () => prisma[deptJoinDelegateName]
  const doctorJoinDb = () => prisma[doctorJoinDelegateName]
  const galleryDb = () => prisma[galleryDelegateName]
  // csvFileName is always one of a small set of known top-level CSV
  // filenames passed by the two call sites (never user input), but it's a
  // runtime parameter from Turbopack's point of view, which would otherwise
  // trace and bundle the entire project as a precaution.
  const csvPath = path.join(process.cwd(), /* turbopackIgnore: true */ csvFileName)

  const downloadAndSaveRemoteImage = (sourceUrl) => downloadAndSaveRemoteImageTo(sourceUrl, uploadFolder)

  function revalidatePaths(slugs) {
    revalidateTag(cacheTag)
    revalidatePath(publicBasePath)
    for (const slug of new Set((slugs ?? []).filter(Boolean))) {
      revalidatePath(`${publicBasePath}/${slug}`)
    }
  }

  async function ensureUniqueSlug(baseSlug, excludeId = null) {
    let candidate = baseSlug || slugFallback
    let suffix = 2

    for (;;) {
      const existing = await db().findUnique({ where: { slug: candidate } })
      if (!existing || existing.id === excludeId) return candidate
      candidate = `${baseSlug}-${suffix}`
      suffix++
    }
  }

  function parseCsvRows() {
    const csvText = fs.readFileSync(csvPath, 'utf8')
    const { header, rows } = parseCsvSafe(csvText)
    const idx = (name) => header.indexOf(name)

    const col = {
      title: idx('title'),
      date: idx('date'),
      featureImage: idx('feature_image'),
      link: idx('link'),
      department: idx('department'),
      doctor: idx('doctor'),
      content: idx('content'),
      gallery: idx('gallery'),
      pageLink: idx('page_link'),
    }

    return rows
      .map((row) => ({
        title: normalizeWhitespace(row[col.title]),
        publishedAt: parseCsvDate(row[col.date]),
        featureImageUrl: normalizeWhitespace(row[col.featureImage]),
        readMoreUrl: normalizeWhitespace(row[col.link]),
        departmentNames: splitNames(row[col.department]),
        doctorNames: splitNames(row[col.doctor]),
        content: (row[col.content] ?? '').trim(),
        galleryUrls: splitNames(row[col.gallery]),
        pageLink: normalizeWhitespace(row[col.pageLink]),
      }))
      .filter((r) => r.title)
  }

  async function importFromCsv() {
    const rows = parseCsvRows()

    const report = {
      totalRows: rows.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: [],
      unmatchedDepartments: new Set(),
      unmatchedDoctors: new Set(),
      featureImageDownloaded: 0,
      featureImageFailed: 0,
      galleryImageDownloaded: 0,
      galleryImageFailed: 0,
      unresolvedRelationships: [],
    }

    for (const row of rows) {
      try {
        const { matched: matchedDepartments, unmatched: unmatchedDeptNames } = await resolveDepartmentsByName(
          row.departmentNames
        )
        const { matched: matchedDoctors, unmatched: unmatchedDocNames } = await resolveDoctorsByName(row.doctorNames)

        unmatchedDeptNames.forEach((n) => report.unmatchedDepartments.add(n))
        unmatchedDocNames.forEach((n) => report.unmatchedDoctors.add(n))
        if (unmatchedDeptNames.length > 0 || unmatchedDocNames.length > 0) {
          report.unresolvedRelationships.push({
            title: row.title,
            unmatchedDepartments: unmatchedDeptNames,
            unmatchedDoctors: unmatchedDocNames,
          })
        }

        const existing = row.pageLink ? await db().findUnique({ where: { pageLink: row.pageLink } }) : null

        const isVideo = /youtube\.com|youtu\.be/i.test(row.featureImageUrl)
        let featureType = 'image'
        let featureImage = existing?.featureImage ?? null
        let featureImageSourceUrl = existing?.featureImageSourceUrl ?? null
        let youtubeUrl = existing?.youtubeUrl ?? null

        if (isVideo) {
          featureType = 'video'
          youtubeUrl = normalizeYoutubeUrl(row.featureImageUrl) || row.featureImageUrl
          featureImage = null
          featureImageSourceUrl = null
        } else if (row.featureImageUrl) {
          if (!existing || existing.featureImageSourceUrl !== row.featureImageUrl || !existing.featureImage) {
            try {
              const saved = await downloadAndSaveRemoteImage(row.featureImageUrl)
              featureImage = saved.url
              featureImageSourceUrl = row.featureImageUrl
              report.featureImageDownloaded++
            } catch (error) {
              report.featureImageFailed++
              report.errors.push(`${row.title}: feature image download failed — ${error.message}`)
            }
          }
        } else {
          featureImage = null
          featureImageSourceUrl = null
        }

        const baseSlug = slugify(row.title)
        const slug = existing ? existing.slug : await ensureUniqueSlug(baseSlug)

        const data = {
          title: row.title,
          slug,
          publishedAt: row.publishedAt,
          featureType,
          featureImage,
          featureImageSourceUrl,
          youtubeUrl,
          readMoreUrl: row.readMoreUrl || null,
          pageLink: row.pageLink || null,
          content: sanitizeRichHtml(row.content),
        }

        let record
        if (existing) {
          record = await prisma.$transaction(async (tx) => {
            await tx[deptJoinDelegateName].deleteMany({ where: { [fkField]: existing.id } })
            await tx[doctorJoinDelegateName].deleteMany({ where: { [fkField]: existing.id } })
            return tx[delegateName].update({
              where: { id: existing.id },
              data: {
                ...data,
                departments: { create: matchedDepartments.map((d) => ({ departmentId: d.id })) },
                doctors: { create: matchedDoctors.map((d) => ({ doctorId: d.id })) },
              },
            })
          })
          report.updated++
        } else {
          record = await db().create({
            data: {
              ...data,
              departments: { create: matchedDepartments.map((d) => ({ departmentId: d.id })) },
              doctors: { create: matchedDoctors.map((d) => ({ doctorId: d.id })) },
            },
          })
          report.created++
        }

        if (row.galleryUrls.length > 0) {
          const existingGallery = await galleryDb().findMany({
            where: { [fkField]: record.id },
            select: { sourceUrl: true },
          })
          const alreadyDownloaded = new Set(existingGallery.map((g) => g.sourceUrl).filter(Boolean))

          if (alreadyDownloaded.size === 0) {
            let sortOrder = 0
            for (const galleryUrl of row.galleryUrls) {
              try {
                const saved = await downloadAndSaveRemoteImage(galleryUrl)
                await galleryDb().create({
                  data: {
                    [fkField]: record.id,
                    imagePath: saved.url,
                    sourceUrl: galleryUrl,
                    sortOrder: sortOrder++,
                  },
                })
                report.galleryImageDownloaded++
              } catch (error) {
                report.galleryImageFailed++
                report.errors.push(`${row.title}: gallery image download failed (${galleryUrl}) — ${error.message}`)
              }
            }
          }
        }
      } catch (error) {
        report.skipped++
        report.errors.push(`${row.title || '(untitled row)'}: ${error.message}`)
      }
    }

    return {
      ...report,
      unmatchedDepartments: [...report.unmatchedDepartments],
      unmatchedDoctors: [...report.unmatchedDoctors],
    }
  }

  const listSelect = {
    id: true,
    title: true,
    slug: true,
    publishedAt: true,
    featureType: true,
    featureImage: true,
    youtubeUrl: true,
    quickSearch: true,
    departments: { select: { department: { select: { id: true, departmentId: true, name: true } } } },
  }

  const detailSelect = {
    id: true,
    title: true,
    slug: true,
    publishedAt: true,
    featureType: true,
    featureImage: true,
    featureImageSourceUrl: true,
    youtubeUrl: true,
    readMoreUrl: true,
    pageLink: true,
    content: true,
    departments: {
      select: {
        department: {
          select: {
            id: true,
            departmentId: true,
            name: true,
            icon: true,
            slug: true,
            symptoms: { select: { name: true }, orderBy: { sortOrder: 'asc' } },
          },
        },
      },
    },
    doctors: {
      select: {
        doctor: {
          select: {
            id: true,
            slug: true,
            name: true,
            image: true,
            position: true,
            speciality: { select: { id: true, departmentId: true, name: true } },
          },
        },
      },
    },
    gallery: { orderBy: { sortOrder: 'asc' }, select: { id: true, imagePath: true, altText: true, sortOrder: true } },
  }

  function serializeListItem(record) {
    const videoId = record.featureType === 'video' ? extractYoutubeVideoId(record.youtubeUrl) : null

    return {
      id: record.id,
      title: record.title,
      slug: record.slug,
      publishedAt: record.publishedAt,
      featureType: record.featureType,
      featureImage: record.featureImage,
      youtubeUrl: record.youtubeUrl,
      thumbnailUrl:
        record.featureType === 'video'
          ? videoId
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : null
          : record.featureImage,
      quickSearch: record.quickSearch,
      departments: record.departments.map((link) => link.department),
    }
  }

  function serializeDetail(record) {
    return {
      id: record.id,
      title: record.title,
      slug: record.slug,
      publishedAt: record.publishedAt,
      featureType: record.featureType,
      featureImage: record.featureImage,
      featureImageSourceUrl: record.featureImageSourceUrl,
      youtubeUrl: record.youtubeUrl,
      readMoreUrl: record.readMoreUrl,
      pageLink: record.pageLink,
      content: sanitizeRichHtml(record.content),
      departments: record.departments.map((link) => link.department),
      doctors: record.doctors.map((link) => link.doctor),
      gallery: record.gallery,
    }
  }

  async function listPublicUncached(search, departmentId) {
    const trimmedSearch = search.trim()
    const deptId = Number(departmentId) || null

    const records = await db().findMany({
      where: {
        ...(trimmedSearch ? { title: { contains: trimmedSearch, mode: 'insensitive' } } : {}),
        ...(deptId ? { departments: { some: { department: { departmentId: deptId } } } } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      select: listSelect,
    })

    return records.map(serializeListItem)
  }

  const cachedListPublic = unstable_cache(listPublicUncached, [`${cacheTag}-public-list`], {
    tags: [cacheTag],
    revalidate: revalidateSeconds,
  })

  async function getBySlugPublicUncached(slug) {
    const record = await db().findUnique({ where: { slug }, select: detailSelect })
    if (!record) return null
    return serializeDetail(record)
  }

  const cachedGetBySlugPublic = unstable_cache(getBySlugPublicUncached, [`${cacheTag}-public-detail`], {
    tags: [cacheTag],
    revalidate: revalidateSeconds,
  })

  async function getRelatedUncached(id, departmentIds, limit) {
    if (departmentIds.length > 0) {
      const related = await db().findMany({
        where: {
          id: { not: id },
          departments: { some: { departmentId: { in: departmentIds } } },
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        select: listSelect,
      })
      if (related.length > 0) return related.map(serializeListItem)
    }

    const fallback = await db().findMany({
      where: { id: { not: id } },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: listSelect,
    })

    return fallback.map(serializeListItem)
  }

  const cachedGetRelated = unstable_cache(getRelatedUncached, [`${cacheTag}-public-related`], {
    tags: [cacheTag],
    revalidate: revalidateSeconds,
  })

  async function getDepartmentsUncached(quickSearchOnly) {
    const links = await deptJoinDb().findMany({
      where: quickSearchOnly ? { [delegateName]: { quickSearch: true } } : undefined,
      select: { department: { select: { id: true, departmentId: true, name: true } } },
    })

    const byId = new Map()
    for (const link of links) byId.set(link.department.id, link.department)

    return [...byId.values()]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((department) => ({ id: department.departmentId, name: department.name }))
  }

  const cachedGetDepartmentsForFilter = unstable_cache(
    () => getDepartmentsUncached(true),
    [`${cacheTag}-filter-departments`],
    { tags: [cacheTag], revalidate: revalidateSeconds }
  )

  const cachedGetDepartmentsForDropdown = unstable_cache(
    () => getDepartmentsUncached(false),
    [`${cacheTag}-dropdown-departments`],
    { tags: [cacheTag], revalidate: revalidateSeconds }
  )

  async function listAdmin({ search = '', page = 1, pageSize = 20 } = {}) {
    const trimmedSearch = search.trim()
    const where = trimmedSearch ? { title: { contains: trimmedSearch, mode: 'insensitive' } } : undefined

    const [total, records] = await Promise.all([
      db().count({ where }),
      db().findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          ...listSelect,
          createdAt: true,
          updatedAt: true,
          doctors: { select: { doctor: { select: { id: true, name: true } } } },
        },
      }),
    ])

    return {
      items: records.map((record) => ({
        id: record.id,
        title: record.title,
        slug: record.slug,
        publishedAt: record.publishedAt,
        featureType: record.featureType,
        featureImage: record.featureImage,
        youtubeUrl: record.youtubeUrl,
        quickSearch: record.quickSearch,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        departments: record.departments.map((link) => link.department),
        doctors: record.doctors.map((link) => link.doctor),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    }
  }

  async function getByIdAdmin(id) {
    const record = await db().findUnique({ where: { id }, select: detailSelect })
    if (!record) return null

    return {
      id: record.id,
      title: record.title,
      slug: record.slug,
      publishedAt: record.publishedAt,
      featureType: record.featureType,
      featureImage: record.featureImage,
      featureImageSourceUrl: record.featureImageSourceUrl,
      youtubeUrl: record.youtubeUrl,
      readMoreUrl: record.readMoreUrl,
      pageLink: record.pageLink,
      content: record.content,
      departments: record.departments.map((link) => link.department),
      doctors: record.doctors.map((link) => link.doctor),
      gallery: record.gallery,
    }
  }

  async function departmentIdsToInternalIds(departmentIds) {
    if (!Array.isArray(departmentIds) || departmentIds.length === 0) return []
    const departments = await prisma.department.findMany({
      where: { departmentId: { in: departmentIds.map(Number) } },
      select: { id: true },
    })
    return departments.map((d) => d.id)
  }

  async function doctorIdsToValidIds(doctorIds) {
    if (!Array.isArray(doctorIds) || doctorIds.length === 0) return []
    const doctors = await prisma.doctor.findMany({
      where: { id: { in: doctorIds.map(Number) } },
      select: { id: true },
    })
    return doctors.map((d) => d.id)
  }

  function validateInput(input) {
    const errors = []

    if (!normalizeWhitespace(input.title)) errors.push('Title is required')
    if (!normalizeWhitespace(input.slug)) errors.push('Slug is required')
    if (input.featureType === 'video') {
      const trimmedUrl = normalizeWhitespace(input.youtubeUrl)
      if (!trimmedUrl) errors.push('YouTube URL is required when feature type is Video')
      else if (!normalizeYoutubeUrl(trimmedUrl)) errors.push('Could not recognize this as a valid YouTube URL')
    }

    return errors
  }

  async function createAdmin(input) {
    const errors = validateInput(input)
    if (errors.length > 0) {
      const error = new Error(errors.join('; '))
      error.validation = errors
      throw error
    }

    const internalDepartmentIds = await departmentIdsToInternalIds(input.departmentIds)
    const validDoctorIds = await doctorIdsToValidIds(input.doctorIds)

    const baseSlug = slugify(input.slug || input.title)
    const slug = await ensureUniqueSlug(baseSlug)

    const isVideo = input.featureType === 'video'

    const record = await db().create({
      data: {
        title: normalizeWhitespace(input.title),
        slug,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        featureType: isVideo ? 'video' : 'image',
        featureImage: isVideo ? null : input.featureImage || null,
        featureImageSourceUrl: isVideo ? null : input.featureImageSourceUrl || null,
        youtubeUrl: isVideo ? normalizeYoutubeUrl(input.youtubeUrl) || normalizeWhitespace(input.youtubeUrl) : null,
        readMoreUrl: normalizeWhitespace(input.readMoreUrl) || null,
        pageLink: normalizeWhitespace(input.pageLink) || null,
        content: sanitizeRichHtml(input.content),
        departments: { create: internalDepartmentIds.map((id) => ({ departmentId: id })) },
        doctors: { create: validDoctorIds.map((id) => ({ doctorId: id })) },
        gallery: {
          create: (input.gallery ?? []).map((image, index) => ({
            imagePath: image.imagePath,
            altText: image.altText || null,
            sortOrder: index,
          })),
        },
      },
    })

    revalidatePaths([record.slug])

    return record
  }

  async function updateAdmin(id, input) {
    const errors = validateInput(input)
    if (errors.length > 0) {
      const error = new Error(errors.join('; '))
      error.validation = errors
      throw error
    }

    const existing = await db().findUnique({ where: { id }, select: { slug: true } })
    if (!existing) throw new Error('Record not found')

    const internalDepartmentIds = await departmentIdsToInternalIds(input.departmentIds)
    const validDoctorIds = await doctorIdsToValidIds(input.doctorIds)

    let slug = existing.slug
    if (input.slug && slugify(input.slug) !== existing.slug) {
      slug = await ensureUniqueSlug(slugify(input.slug), id)
    }

    const isVideo = input.featureType === 'video'

    await prisma.$transaction([
      prisma[deptJoinDelegateName].deleteMany({ where: { [fkField]: id } }),
      prisma[doctorJoinDelegateName].deleteMany({ where: { [fkField]: id } }),
      prisma[galleryDelegateName].deleteMany({ where: { [fkField]: id } }),
      db().update({
        where: { id },
        data: {
          slug,
          title: normalizeWhitespace(input.title),
          publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
          featureType: isVideo ? 'video' : 'image',
          featureImage: isVideo ? null : input.featureImage || null,
          featureImageSourceUrl: isVideo ? null : input.featureImageSourceUrl || null,
          youtubeUrl: isVideo ? normalizeYoutubeUrl(input.youtubeUrl) || normalizeWhitespace(input.youtubeUrl) : null,
          readMoreUrl: normalizeWhitespace(input.readMoreUrl) || null,
          pageLink: normalizeWhitespace(input.pageLink) || null,
          content: sanitizeRichHtml(input.content),
          departments: { create: internalDepartmentIds.map((depId) => ({ departmentId: depId })) },
          doctors: { create: validDoctorIds.map((docId) => ({ doctorId: docId })) },
          gallery: {
            create: (input.gallery ?? []).map((image, index) => ({
              imagePath: image.imagePath,
              altText: image.altText || null,
              sortOrder: index,
            })),
          },
        },
      }),
    ])

    const updated = await db().findUnique({ where: { id } })
    revalidatePaths([existing.slug, updated.slug])

    return updated
  }

  async function deleteAdmin(id) {
    const deleted = await db().delete({ where: { id } })
    revalidatePaths([deleted.slug])
    return deleted
  }

  const TOGGLEABLE_FIELDS = new Set(['quickSearch'])

  async function toggleField(id, field, value) {
    if (!TOGGLEABLE_FIELDS.has(field)) {
      throw new Error(`"${field}" is not a toggleable field`)
    }

    const record = await db().update({
      where: { id },
      data: { [field]: Boolean(value) },
      select: { id: true, slug: true, quickSearch: true },
    })

    revalidatePaths([record.slug])

    return record
  }

  return {
    importFromCsv,
    listPublic: ({ search = '', departmentId = '' } = {}) => cachedListPublic(search, departmentId),
    getBySlugPublic: (slug) => cachedGetBySlugPublic(slug),
    getRelated: (id, departmentIds, limit = 3) => cachedGetRelated(id, departmentIds, limit),
    getDepartmentsForFilter: () => cachedGetDepartmentsForFilter(),
    getDepartmentsForDropdown: () => cachedGetDepartmentsForDropdown(),
    listAdmin,
    getByIdAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    toggleField,
  }
}
