import React from 'react'
import ArticlesListing from './ArticlesListing'
import {
  FALLBACK_IMAGE,
  decodeEntities,
  fetchAll,
  formatDate,
  getArticlePath,
  getArticlesCategoryId,
  getDepartmentIds,
  getDepartments,
  getFeaturedMedia,
} from './wordpress'

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

export default async function page() {
  const posts = await getArticlePosts()

  const articles = posts.map((post) => {
    const media = getFeaturedMedia(post)
    const title = decodeEntities(post.title?.rendered)

    return {
      id: post.id,
      title,
      date: post.date,
      formattedDate: formatDate(post.date),
      link: getArticlePath(post.slug),
      image: media?.source_url || FALLBACK_IMAGE,
      imageAlt: media?.alt_text || title,
      departments: getDepartmentIds(post),
    }
  })

  const departmentCounts = new Map()
  articles.forEach((article) =>
    article.departments.forEach((id) => departmentCounts.set(id, (departmentCounts.get(id) ?? 0) + 1))
  )

  const wpDepartments = await getDepartments([...departmentCounts.keys()])

  const departments = wpDepartments
    .map((department) => ({ id: department.id, name: decodeEntities(department.title?.rendered) }))
    .sort((a, b) => departmentCounts.get(b.id) - departmentCounts.get(a.id) || a.name.localeCompare(b.name))

  return (
    <>

    <div className={`static_page`}>

<ArticlesListing articles={articles} departments={departments}/>

    </div>

    </>
  )
}
