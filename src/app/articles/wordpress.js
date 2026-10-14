export const WP_API = 'https://www.relainstitute.com/wp-json/wp/v2'
export const FALLBACK_IMAGE = '/assets/images/sample-article-img.png'
const PER_PAGE = 100
const ARTICLES_CATEGORY_SLUG = 'articles'
const DEPARTMENT_FIELD = 'departments'

async function fetchPage(endpoint, params, page, perPage = PER_PAGE) {
  const query = new URLSearchParams({ ...params, per_page: perPage, page })
  const res = await fetch(`${WP_API}/${endpoint}?${query}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`WordPress ${endpoint} request failed (page ${page}): ${res.status}`)
  return res
}

export async function fetchAll(endpoint, params) {
  try {
    const firstRes = await fetchPage(endpoint, params, 1)
    const totalPages = Number(firstRes.headers.get('X-WP-TotalPages')) || 1
    const firstItems = await firstRes.json()

    const remaining = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        fetchPage(endpoint, params, i + 2).then((res) => res.json())
      )
    )

    return [firstItems, ...remaining].flat()
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function fetchFirstPage(endpoint, params, perPage) {
  try {
    const res = await fetchPage(endpoint, params, 1, perPage)
    return await res.json()
  } catch (error) {
    console.error(error)
    return []
  }
}

export function decodeEntities(text = '') {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&(\w+);/g, (match, name) => named[name] ?? match)
}

export function formatDate(date) {
  return new Date(`${date}Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

const LIVE_ARTICLE_URL = /https?:\/\/(?:www\.)?relainstitute\.com\/articles\/?([^"'#?\s<>]*?)\/?(?=["'#?\s<>])/gi

export function getArticlePath(slug) {
  return slug ? `/articles/${slug}` : '/articles'
}

export function toLocalArticleLinks(html = '') {
  return html.replace(LIVE_ARTICLE_URL, (_, slug) => getArticlePath(slug))
}

export function getFeaturedMedia(post) {
  return post._embedded?.['wp:featuredmedia']?.[0]
}

export async function getArticlesCategoryId() {
  const [category] = await fetchAll('categories', { slug: ARTICLES_CATEGORY_SLUG, _fields: 'id' })
  return category?.id ?? null
}

export function getDepartmentIds(post) {
  const value = post.acf?.[DEPARTMENT_FIELD]
  if (!value) return []

  return [value]
    .flat()
    .map((item) => Number(typeof item === 'object' ? item?.ID ?? item?.id : item))
    .filter((id) => Number.isInteger(id) && id > 0)
}

export async function getDepartments(ids) {
  if (ids.length === 0) return []

  return fetchAll('department', {
    include: ids.join(','),
    status: 'publish',
    _fields: 'id,title',
  })
}
