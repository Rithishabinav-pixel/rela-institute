import { NextResponse } from 'next/server'
import { getStaticPageSearchEntries } from '@/lib/search/static-pages'
import {
  getArticleSearchEntries,
  getMediaArticleSearchEntries,
  getSuccessStorySearchEntries,
  getExpertTalkSearchEntries,
  getEventSearchEntries,
  getWellnessNetworkSearchEntries,
  getTestimonialSearchEntries,
  getDoctorSearchEntries,
} from '@/lib/search/dynamic-sources'
import { extractFirstParagraphText, truncateDescription } from '@/lib/search/text'

const SOURCES = [
  { category: 'Pages', getEntries: getStaticPageSearchEntries, isStatic: true },
  { category: 'Articles', getEntries: getArticleSearchEntries },
  { category: 'Media', getEntries: getMediaArticleSearchEntries },
  { category: 'Success Stories', getEntries: getSuccessStorySearchEntries },
  { category: 'Expert Talks', getEntries: getExpertTalkSearchEntries },
  { category: 'Events', getEntries: getEventSearchEntries },
  { category: 'Wellness Network', getEntries: getWellnessNetworkSearchEntries },
  { category: 'Testimonials', getEntries: getTestimonialSearchEntries },
  { category: 'Doctors', getEntries: getDoctorSearchEntries },
]

export async function GET(request) {
  const term = (request.nextUrl.searchParams.get('q') || '').trim().toLowerCase()
  if (!term) return NextResponse.json({ results: [] })

  let allSources
  try {
    allSources = await Promise.all(SOURCES.map((source) => source.getEntries()))
  } catch (error) {
    console.error('[search] failed to load search sources:', error.message)
    return NextResponse.json({ error: 'Could not load search results. Please try again.' }, { status: 500 })
  }

  const results = []
  const seenLinks = new Set()

  SOURCES.forEach((source, index) => {
    allSources[index].forEach((entry) => {
      const title = entry.title || ''
      const fullDescription = source.isStatic ? entry.description || '' : extractFirstParagraphText(entry.content)
      const link = entry.url || entry.link
      if (!link) return

      const haystack = (entry.matchText || `${title} ${fullDescription}`).toLowerCase()
      if (!haystack.includes(term)) return
      if (seenLinks.has(link)) return

      seenLinks.add(link)
      results.push({
        title,
        description: truncateDescription(fullDescription),
        category: source.category,
        link,
      })
    })
  })

  return NextResponse.json({ results })
}
