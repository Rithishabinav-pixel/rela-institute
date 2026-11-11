import { load } from 'cheerio'
import { prisma } from './prisma.js'
import { sanitizeRichHtml } from './sanitize-html.js'
import { resolveDepartmentsByName } from './press-content-helpers.js'
import { decodeEntities } from '../app/articles/wordpress.js'

const WP_API = 'https://www.relainstitute.com/wp-json/wp/v2'
const SITE_BASE = 'https://www.relainstitute.com'
const PER_PAGE = 100

const PROFILE_SECTION_HEADINGS = {
  Brief: 'Brief Profile',
  Educational: 'Educational Qualifications',
  Clinical: 'Clinical Expertise',
  Accomplishments: 'Accomplishments',
  Affiliations: 'Affiliations and Memberships',
  Present: 'Present Position',
  Honors: 'Honors and Awards',
  Editorial: 'Editorial Work and Reviewer',
  Innovation: 'Innovation',
  Associated: 'Associated Publications',
  Research: 'Research and Publication',
  Experience: 'Experience',
  Videos: 'Videos',
}
const SECTION_ORDER = Object.keys(PROFILE_SECTION_HEADINGS)

// These four already have a dedicated dynamic implementation (doctor-level
// Articles/Media/Success Stories/Expert Talk associations) — never import
// them as generic rich-text tabs.
const RESERVED_SECTION_IDS = new Set(['Blog', 'Media', 'Success-Stories', 'Expert-Talk'])

async function fetchAllDoctorListItems() {
  const firstRes = await fetch(`${WP_API}/doctor?per_page=${PER_PAGE}&page=1&_fields=id,slug,title`)
  if (!firstRes.ok) throw new Error(`Failed to fetch doctor list (page 1): ${firstRes.status}`)
  const totalPages = Number(firstRes.headers.get('X-WP-TotalPages')) || 1
  const firstItems = await firstRes.json()

  const remaining = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      fetch(`${WP_API}/doctor?per_page=${PER_PAGE}&page=${i + 2}&_fields=id,slug,title`).then((res) => res.json())
    )
  )

  return [firstItems, ...remaining].flat().map((item) => ({
    slug: item.slug,
    title: decodeEntities(item.title?.rendered ?? ''),
  }))
}

async function fetchDoctorDetailHtml(slug) {
  const res = await fetch(`${SITE_BASE}/doctor/${slug}/`, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

// Internal relainstitute.com links that have a known equivalent local route
// are rewritten to a relative path so they stay on this site instead of
// bouncing back to the live WordPress site; links with no local equivalent
// (e.g. /department/... detail pages) are left as absolute external links.
const INTERNAL_LINK_REWRITES = [
  [/https?:\/\/(?:www\.)?relainstitute\.com\/articles\/([^"'#?\s<>]+?)\/?(?=["'#?\s<>])/gi, '/articles/$1'],
  [/https?:\/\/(?:www\.)?relainstitute\.com\/expert-talk\/([^"'#?\s<>]+?)\/?(?=["'#?\s<>])/gi, '/expert-talks/$1'],
  [/https?:\/\/(?:www\.)?relainstitute\.com\/media\/([^"'#?\s<>]+?)\/?(?=["'#?\s<>])/gi, '/media/$1'],
  [/https?:\/\/(?:www\.)?relainstitute\.com\/success-story\/([^"'#?\s<>]+?)\/?(?=["'#?\s<>])/gi, '/success-stories/$1'],
  [/https?:\/\/(?:www\.)?relainstitute\.com\/doctor\/([^"'#?\s<>]+?)\/?(?=["'#?\s<>])/gi, '/doctors/$1'],
]

function rewriteInternalLinks(html) {
  if (!html) return html
  return INTERNAL_LINK_REWRITES.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), html)
}

// The source theme leaves a redundant trailing <br> (often wrapped in an
// empty <span>) right before closing tags on list items that contain a link.
// Strip those along with any other stray/duplicated line breaks.
function cleanupSectionHtml(html) {
  if (!html) return html
  return html
    .replace(/<span[^>]*>\s*(?:<br\s*\/?>\s*)+<\/span>/gi, '')
    .replace(/(?:<br\s*\/?>\s*)+(<\/(?:li|p|div|td|span)>)/gi, '$1')
    .replace(/<span[^>]*>\s*<\/span>/gi, '')
    .replace(/(?:<br\s*\/?>\s*){2,}/gi, '<br>')
    .replace(/^\s*(?:<br\s*\/?>\s*)+/i, '')
    .replace(/(?:<br\s*\/?>\s*)+\s*$/i, '')
    .trim()
}

function htmlLinesToArray(html) {
  if (!html) return []
  const withBreaks = html.replace(/<br\s*\/?>/gi, '\n')
  const $ = load(`<div>${withBreaks}</div>`)
  return $('div')
    .text()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function parseDoctorProfileHtml(html) {
  const $ = load(html)
  const $desc = $('.doc-description').first()

  const name = $desc.find('h1').first().text().trim()
  const education = $desc.find('h4').first().text().trim()
  const departmentNames = htmlLinesToArray($desc.find('h5').first().html())
  const position = htmlLinesToArray($desc.find('p').first().html()).join(', ')

  const sections = []
  const unknownSectionIds = []

  $('.tab-content > .tab-pane').each((_, el) => {
    const $pane = $(el)
    const paneId = $pane.attr('id') || ''
    const prefix = paneId.replace(/-tab-pane$/, '')
    if (!prefix || RESERVED_SECTION_IDS.has(prefix)) return

    const heading = PROFILE_SECTION_HEADINGS[prefix]
    if (!heading) {
      unknownSectionIds.push(paneId)
      return
    }

    const $clone = $pane.clone()
    $clone.find('h2.accordion-header').remove()
    const rawContent = ($clone.html() ?? '').trim()
    const content = cleanupSectionHtml(rewriteInternalLinks(rawContent))
    if (!content) return

    sections.push({ heading, content, order: SECTION_ORDER.indexOf(prefix) })
  })

  sections.sort((a, b) => a.order - b.order)

  return { name, education, departmentNames, position, sections, unknownSectionIds }
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length)
  let index = 0

  async function worker() {
    for (;;) {
      const current = index++
      if (current >= items.length) return
      try {
        results[current] = { value: await fn(items[current], current) }
      } catch (error) {
        results[current] = { error, item: items[current] }
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

async function updateExistingDoctorFromProfile(id, { name, education, position, departmentIds, sections }) {
  // specialityId is intentionally never overwritten here: an existing doctor
  // already has a curated primary speciality, and a name-matching mismatch
  // between the live site's department labels and ours must never silently
  // change it.
  const scalarData = {}
  if (name) scalarData.name = name
  if (education) scalarData.education = education
  if (position) {
    scalarData.position = position
    scalarData.mainPosition = position
  }

  const ops = []

  if (Object.keys(scalarData).length > 0) {
    ops.push(prisma.doctor.update({ where: { id }, data: scalarData }))
  }

  // Department links are additive-only: a name that fails to resolve against
  // the Department table (e.g. the live site's label drifted from ours) must
  // never cause an already-linked department to be dropped.
  const existingLinks = await prisma.doctorDepartment.findMany({
    where: { doctorId: id },
    select: { departmentId: true },
  })
  const existingDepartmentIds = new Set(existingLinks.map((link) => link.departmentId))
  const newDepartmentIds = departmentIds.filter((departmentId) => !existingDepartmentIds.has(departmentId))

  if (newDepartmentIds.length > 0) {
    ops.push(
      prisma.doctorDepartment.createMany({
        data: newDepartmentIds.map((departmentId) => ({ doctorId: id, departmentId })),
        skipDuplicates: true,
      })
    )
  }

  const existingTabs = await prisma.doctorTab.findMany({ where: { doctorId: id }, orderBy: { sortOrder: 'asc' } })
  const byHeading = new Map(existingTabs.map((tab) => [tab.heading.trim().toLowerCase(), tab]))
  let nextSortOrder = existingTabs.length > 0 ? Math.max(...existingTabs.map((tab) => tab.sortOrder)) + 1 : 0
  let tabsCreated = 0
  let tabsUpdated = 0

  for (const section of sections) {
    const sanitized = sanitizeRichHtml(section.content)
    if (!sanitized) continue

    const existingTab = byHeading.get(section.heading.trim().toLowerCase())
    if (existingTab) {
      if (existingTab.content !== sanitized) {
        ops.push(prisma.doctorTab.update({ where: { id: existingTab.id }, data: { content: sanitized } }))
        tabsUpdated++
      }
    } else {
      ops.push(
        prisma.doctorTab.create({
          data: { doctorId: id, heading: section.heading, content: sanitized, sortOrder: nextSortOrder++ },
        })
      )
      tabsCreated++
    }
  }

  if (ops.length > 0) await prisma.$transaction(ops)

  return { tabsCreated, tabsUpdated }
}

async function createNewDoctorFromProfile(slug, { name, education, position, specialityId, departmentIds, sections }) {
  const tabsToCreate = sections
    .map((section) => ({ heading: section.heading, content: sanitizeRichHtml(section.content) }))
    .filter((tab) => tab.content)
    .map((tab, index) => ({ ...tab, sortOrder: index }))

  await prisma.doctor.create({
    data: {
      slug,
      name,
      education: education || '',
      position: position || '',
      mainPosition: position || '',
      specialityId,
      departments: { create: departmentIds.map((departmentId) => ({ departmentId })) },
      tabs: { create: tabsToCreate },
    },
  })

  return { tabsCreated: tabsToCreate.length }
}

export async function importDoctorsFromWebsite({ concurrency = 6, onlySlugs = null } = {}) {
  const report = {
    totalOnSite: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    tabsCreated: 0,
    tabsUpdated: 0,
    unmatchedDepartments: new Set(),
    unknownProfileSections: new Set(),
    errors: [],
  }

  let listItems = await fetchAllDoctorListItems()
  report.totalOnSite = listItems.length

  if (Array.isArray(onlySlugs) && onlySlugs.length > 0) {
    const onlySet = new Set(onlySlugs)
    listItems = listItems.filter((item) => onlySet.has(item.slug))
  }

  const existingDoctors = await prisma.doctor.findMany({ select: { id: true, slug: true } })
  const existingBySlug = new Map(existingDoctors.map((doctor) => [doctor.slug, doctor.id]))

  const fetched = await mapWithConcurrency(listItems, concurrency, async (item) => {
    const html = await fetchDoctorDetailHtml(item.slug)
    return { item, html }
  })

  for (const result of fetched) {
    if (result.error) {
      report.skipped++
      report.errors.push(`${result.item?.slug ?? 'unknown'}: fetch failed - ${result.error.message}`)
      continue
    }

    const { item, html } = result.value

    try {
      const parsed = parseDoctorProfileHtml(html)
      parsed.unknownSectionIds.forEach((id) => report.unknownProfileSections.add(id))

      const { matched, unmatched } = await resolveDepartmentsByName(parsed.departmentNames)
      unmatched.forEach((name) => report.unmatchedDepartments.add(name))

      let specialityId = null
      if (matched.length > 0) {
        const specialityNormalized = parsed.departmentNames[0]?.toLowerCase()
        const speciality = matched.find((d) => d.nameNormalized === specialityNormalized) ?? matched[0]
        specialityId = speciality.id
      }
      const departmentIds = matched.map((d) => d.id)

      const name = parsed.name || item.title
      const existingId = existingBySlug.get(item.slug)

      if (existingId) {
        const outcome = await updateExistingDoctorFromProfile(existingId, {
          name,
          education: parsed.education,
          position: parsed.position,
          specialityId,
          departmentIds,
          sections: parsed.sections,
        })
        report.updated++
        report.tabsCreated += outcome.tabsCreated
        report.tabsUpdated += outcome.tabsUpdated
      } else {
        if (!name || departmentIds.length === 0) {
          report.skipped++
          report.errors.push(`${item.slug}: cannot create (missing name or no department could be resolved)`)
          continue
        }
        const outcome = await createNewDoctorFromProfile(item.slug, {
          name,
          education: parsed.education,
          position: parsed.position,
          specialityId,
          departmentIds,
          sections: parsed.sections,
        })
        report.created++
        report.tabsCreated += outcome.tabsCreated
      }
    } catch (error) {
      report.skipped++
      report.errors.push(`${item.slug}: ${error.message}`)
    }
  }

  return {
    ...report,
    unmatchedDepartments: [...report.unmatchedDepartments],
    unknownProfileSections: [...report.unknownProfileSections],
  }
}
