import {
  FALLBACK_IMAGE,
  decodeEntities,
  fetchAll,
  formatDate,
  getArticlePath,
  getArticlesCategoryId,
  getFeaturedMedia,
} from '@/app/articles/wordpress'

async function getArticlePosts() {
  const categoryId = await getArticlesCategoryId()
  if (!categoryId) return []

  return fetchAll('posts', {
    categories: categoryId,
    status: 'publish',
    _embed: 'wp:featuredmedia',
    _fields: 'id,slug,date,title,acf,_links.wp:featuredmedia,_embedded',
  })
}

export async function listArticlesForDoctorLinking() {
  const posts = await getArticlePosts()

  return posts.map((post) => {
    const media = getFeaturedMedia(post)
    const title = decodeEntities(post.title?.rendered)

    return {
      slug: post.slug,
      title,
      date: post.date,
      formattedDate: formatDate(post.date),
      link: getArticlePath(post.slug),
      image: media?.source_url || FALLBACK_IMAGE,
    }
  })
}

export async function listArticlesForSearch() {
  const categoryId = await getArticlesCategoryId()
  if (!categoryId) return []

  const posts = await fetchAll('posts', {
    categories: categoryId,
    status: 'publish',
    _fields: 'slug,title,excerpt',
  })

  return posts.map((post) => ({
    title: decodeEntities(post.title?.rendered),
    content: post.excerpt?.rendered || '',
    link: getArticlePath(post.slug),
  }))
}
