import { unstable_cache } from 'next/cache'
import { prisma } from '../prisma.js'
import { listArticlesForSearch } from '../articles.js'
import { listAllTestimonialsPublic } from '../testimonials.js'

async function getMediaArticleSearchEntriesUncached() {
  const rows = await prisma.mediaArticle.findMany({ select: { title: true, slug: true, content: true } })
  return rows.map((row) => ({ title: row.title, content: row.content, link: `/media/${row.slug}` }))
}

async function getSuccessStorySearchEntriesUncached() {
  const rows = await prisma.successStory.findMany({ select: { title: true, slug: true, content: true } })
  return rows.map((row) => ({ title: row.title, content: row.content, link: `/success-stories/${row.slug}` }))
}

async function getExpertTalkSearchEntriesUncached() {
  const rows = await prisma.expertTalk.findMany({ select: { title: true, slug: true, content: true } })
  return rows.map((row) => ({ title: row.title, content: row.content, link: `/expert-talks/${row.slug}` }))
}

async function getEventSearchEntriesUncached() {
  const rows = await prisma.event.findMany({ select: { title: true, slug: true, content: true } })
  return rows.map((row) => ({ title: row.title, content: row.content, link: `/events/${row.slug}` }))
}

async function getWellnessNetworkSearchEntriesUncached() {
  const rows = await prisma.wellnessNetwork.findMany({ select: { title: true, slug: true, content: true } })
  return rows.map((row) => ({ title: row.title, content: row.content, link: `/wellness-network/${row.slug}` }))
}

async function getTestimonialSearchEntriesUncached() {
  const { items } = await listAllTestimonialsPublic({ limit: 50 })
  return items.map((item) => ({ title: item.title, content: item.content, link: '/testimonials-and-reviews' }))
}

async function getDoctorSearchEntriesUncached() {
  const rows = await prisma.doctor.findMany({
    select: {
      name: true,
      slug: true,
      education: true,
      position: true,
      mainPosition: true,
      speciality: { select: { name: true } },
      departments: { select: { department: { select: { name: true } } } },
    },
  })

  return rows.map((row) => {
    const departmentNames = row.departments.map((link) => link.department.name)
    const description = row.speciality?.name || row.mainPosition || row.position || ''
    const matchText = [row.name, description, row.education, row.position, row.mainPosition, ...departmentNames]
      .filter(Boolean)
      .join(' ')
    return { title: row.name, content: description, matchText, link: `/doctors/${row.slug}` }
  })
}

export const getMediaArticleSearchEntries = unstable_cache(
  getMediaArticleSearchEntriesUncached,
  ['media-articles-search-index'],
  { tags: ['media-articles'], revalidate: 3600 }
)

export const getSuccessStorySearchEntries = unstable_cache(
  getSuccessStorySearchEntriesUncached,
  ['success-stories-search-index'],
  { tags: ['success-stories'], revalidate: 3600 }
)

export const getExpertTalkSearchEntries = unstable_cache(
  getExpertTalkSearchEntriesUncached,
  ['expert-talks-search-index'],
  { tags: ['expert-talks'], revalidate: 3600 }
)

export const getEventSearchEntries = unstable_cache(
  getEventSearchEntriesUncached,
  ['events-search-index'],
  { tags: ['events'], revalidate: 3600 }
)

export const getWellnessNetworkSearchEntries = unstable_cache(
  getWellnessNetworkSearchEntriesUncached,
  ['wellness-network-search-index'],
  { tags: ['wellness-network'], revalidate: 3600 }
)

export const getTestimonialSearchEntries = unstable_cache(
  getTestimonialSearchEntriesUncached,
  ['testimonials-search-index'],
  { tags: ['testimonials'], revalidate: 3600 }
)

export const getDoctorSearchEntries = unstable_cache(
  getDoctorSearchEntriesUncached,
  ['doctors-search-index'],
  { tags: ['doctors'], revalidate: 3600 }
)

export const getArticleSearchEntries = listArticlesForSearch
