import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from './prisma.js'
import { normalizeWhitespace } from './slug.js'

const CACHE_TAG = 'resources'
const PAGE_SIZE = 20

function revalidateResourceCaches() {
  try {
    revalidateTag(CACHE_TAG)
    revalidatePath('/resources')
  } catch {}
}

function serializePublic(record) {
  return {
    id: record.id,
    title: record.title,
    categoryId: record.categoryId,
    linkType: record.linkType,
    externalUrl: record.externalUrl,
    pdfUrl: record.pdfUrl,
    link: record.linkType === 'pdf' ? record.pdfUrl : record.externalUrl,
  }
}

function sortClause(sort) {
  if (sort === 'oldest') return { createdAt: 'asc' }
  if (sort === 'az') return { title: 'asc' }
  return { sortOrder: 'asc' }
}

export async function listResourcesPublic({ search = '', sort = 'newest', categoryId = null, cursor = 0, limit = 3 } = {}) {
  const trimmedSearch = search.trim()
  const take = Math.max(1, Math.min(50, Number(limit) || 3))
  const skip = Math.max(0, Number(cursor) || 0)

  const where = {
    isActive: true,
    category: { isActive: true },
    ...(categoryId ? { categoryId: Number(categoryId) } : {}),
    ...(trimmedSearch ? { title: { contains: trimmedSearch, mode: 'insensitive' } } : {}),
  }

  const records = await prisma.resource.findMany({
    where,
    orderBy: [sortClause(sort), { id: 'desc' }],
    skip,
    take: take + 1,
  })

  const hasMore = records.length > take
  const items = records.slice(0, take).map(serializePublic)

  return { items, hasMore, nextCursor: skip + items.length }
}

export async function listResourceCategoriesWithResourcesPublic(limit = 3) {
  const { listResourceCategoriesPublic } = await import('./resource-categories.js')
  const categories = await listResourceCategoriesPublic()

  const withResources = await Promise.all(
    categories.map(async (category) => {
      const { items, hasMore, nextCursor } = await listResourcesPublic({ categoryId: category.id, cursor: 0, limit })
      return { ...category, resources: items, hasMore, nextCursor }
    })
  )

  return withResources
}

export async function listResourcesAdmin({ search = '', categoryId = null, page = 1, pageSize = PAGE_SIZE } = {}) {
  const trimmedSearch = search.trim()
  const where = {
    ...(categoryId ? { categoryId: Number(categoryId) } : {}),
    ...(trimmedSearch ? { title: { contains: trimmedSearch, mode: 'insensitive' } } : {}),
  }

  const [total, items] = await Promise.all([
    prisma.resource.count({ where }),
    prisma.resource.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { id: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: { select: { id: true, name: true } } },
    }),
  ])

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
}

export async function getResourceByIdAdmin(id) {
  return prisma.resource.findUnique({ where: { id } })
}

function validateInput(input) {
  const errors = []
  if (!normalizeWhitespace(input.title)) errors.push('Resource Title is required')
  if (!input.categoryId) errors.push('Category is required')
  if (input.linkType === 'pdf') {
    if (!normalizeWhitespace(input.pdfUrl)) errors.push('PDF Upload is required for PDF resources')
  } else if (!normalizeWhitespace(input.externalUrl)) {
    errors.push('External URL is required for URL resources')
  }
  return errors
}

export async function createResourceAdmin(input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const isPdf = input.linkType === 'pdf'
  const maxOrder = await prisma.resource.aggregate({ _max: { sortOrder: true } })
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1

  const record = await prisma.resource.create({
    data: {
      title: normalizeWhitespace(input.title),
      categoryId: Number(input.categoryId),
      linkType: isPdf ? 'pdf' : 'url',
      externalUrl: isPdf ? null : normalizeWhitespace(input.externalUrl),
      pdfUrl: isPdf ? input.pdfUrl || null : null,
      isActive: input.isActive !== false,
      sortOrder,
    },
  })

  revalidateResourceCaches()
  return record
}

export async function updateResourceAdmin(id, input) {
  const errors = validateInput(input)
  if (errors.length > 0) {
    const error = new Error(errors.join('; '))
    error.validation = errors
    throw error
  }

  const isPdf = input.linkType === 'pdf'

  const record = await prisma.resource.update({
    where: { id },
    data: {
      title: normalizeWhitespace(input.title),
      categoryId: Number(input.categoryId),
      linkType: isPdf ? 'pdf' : 'url',
      externalUrl: isPdf ? null : normalizeWhitespace(input.externalUrl),
      ...(isPdf ? (input.pdfUrl !== undefined ? { pdfUrl: input.pdfUrl || null } : {}) : { pdfUrl: null }),
      isActive: input.isActive !== false,
    },
  })

  revalidateResourceCaches()
  return record
}

export async function deleteResourceAdmin(id) {
  const deleted = await prisma.resource.delete({ where: { id } })
  revalidateResourceCaches()
  return deleted
}

export async function toggleResourceActive(id, isActive) {
  const record = await prisma.resource.update({ where: { id }, data: { isActive: Boolean(isActive) } })
  revalidateResourceCaches()
  return record
}

export async function importResourcesFromSource(categoriesWithResources) {
  const { downloadAndNormalizeImage, downloadAndSavePdf } = await import('./remote-asset-download.js')
  const { ensureResourceCategoryExists } = await import('./resource-categories.js')

  const report = {
    totalCategories: categoriesWithResources.length,
    categoriesCreated: 0,
    totalResources: 0,
    created: 0,
    skipped: 0,
    imageDownloaded: 0,
    imageFailed: 0,
    pdfDownloaded: 0,
    pdfFailed: 0,
    errors: [],
  }

  let categorySortOrder = (await prisma.resourceCategory.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? -1
  let resourceSortOrder = (await prisma.resource.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? -1

  for (const categoryRow of categoriesWithResources) {
    try {
      let category = await prisma.resourceCategory.findFirst({
        where: { name: { equals: categoryRow.name, mode: 'insensitive' } },
      })

      if (!category) {
        let categoryImage = null
        if (categoryRow.imageUrl) {
          try {
            const saved = await downloadAndNormalizeImage(categoryRow.imageUrl, 'resources/categories', {
              width: 360,
              height: 423,
            })
            categoryImage = saved.url
            report.imageDownloaded++
          } catch (error) {
            report.imageFailed++
            report.errors.push(`${categoryRow.name}: category image download failed — ${error.message}`)
          }
        }

        categorySortOrder++
        category = await prisma.resourceCategory.create({
          data: {
            name: categoryRow.name,
            slug: (await import('./slug.js')).slugify(categoryRow.name),
            categoryImage,
            isActive: true,
            sortOrder: categorySortOrder,
          },
        })
        report.categoriesCreated++
      }

      for (const resourceRow of categoryRow.resources) {
        report.totalResources++
        try {
          const existing = await prisma.resource.findFirst({
            where: { title: resourceRow.title, categoryId: category.id },
          })
          if (existing) {
            report.skipped++
            continue
          }

          let pdfUrl = null
          if (resourceRow.pdfUrl) {
            try {
              const saved = await downloadAndSavePdf(resourceRow.pdfUrl, 'resources/pdfs')
              pdfUrl = saved.url
              report.pdfDownloaded++
            } catch (error) {
              report.pdfFailed++
              report.errors.push(`${resourceRow.title}: PDF download failed — ${error.message}`)
              continue
            }
          }

          resourceSortOrder++
          await prisma.resource.create({
            data: {
              title: resourceRow.title,
              categoryId: category.id,
              linkType: pdfUrl ? 'pdf' : 'url',
              externalUrl: pdfUrl ? null : resourceRow.externalUrl || null,
              pdfUrl,
              isActive: true,
              sortOrder: resourceSortOrder,
            },
          })
          report.created++
        } catch (error) {
          report.skipped++
          report.errors.push(`${resourceRow.title}: ${error.message}`)
        }
      }
    } catch (error) {
      report.errors.push(`${categoryRow.name}: ${error.message}`)
    }
  }

  revalidateResourceCaches()
  return report
}
