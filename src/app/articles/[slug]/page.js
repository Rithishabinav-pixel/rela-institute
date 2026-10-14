import React from 'react'
import style from './detail.module.css'
import './articleDetail.css'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import ArticleImage from '../ArticleImage'
import {
  FALLBACK_IMAGE,
  decodeEntities,
  fetchFirstPage,
  formatDate,
  getArticlePath,
  getArticlesCategoryId,
  getDepartmentIds,
  getDepartments,
  getFeaturedMedia,
} from '../wordpress'
import ArticleContent from './ArticleContent'

const FEATURE_FALLBACK_IMAGE = '/assets/images/sample-feature-img.png'
const RELATED_LIMIT = 5
const RELATED_CANDIDATES = 20

async function getArticle(slug) {
  const categoryId = await getArticlesCategoryId()
  if (!categoryId) return null

  const [post] = await fetchFirstPage('posts', {
    slug,
    status: 'publish',
    categories: categoryId,
    _embed: 'wp:featuredmedia',
    _fields: 'id,slug,status,date,title,content,tags,categories,acf,_links.wp:featuredmedia,_embedded',
  }, 1)

  if (!post || post.status !== 'publish' || !post.categories?.includes(categoryId)) return null

  return { post, categoryId }
}

async function getRelatedArticles(post, categoryId) {
  if (!post.tags?.length) return []

  const candidates = await fetchFirstPage('posts', {
    categories: categoryId,
    status: 'publish',
    tags: post.tags.join(','),
    exclude: post.id,
    _embed: 'wp:featuredmedia',
    _fields: 'id,slug,date,title,tags,_links.wp:featuredmedia,_embedded',
  }, RELATED_CANDIDATES)

  return candidates
    .map((candidate) => ({
      candidate,
      sharedTags: (candidate.tags ?? []).filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.sharedTags - a.sharedTags || b.candidate.date.localeCompare(a.candidate.date))
    .slice(0, RELATED_LIMIT)
    .map(({ candidate }) => {
      const media = getFeaturedMedia(candidate)
      const title = decodeEntities(candidate.title?.rendered)

      return {
        id: candidate.id,
        slug: candidate.slug,
        title,
        formattedDate: formatDate(candidate.date),
        image: media?.source_url || FALLBACK_IMAGE,
        imageAlt: media?.alt_text || title,
      }
    })
}

async function getDepartmentName(post) {
  const departments = await getDepartments(getDepartmentIds(post))
  return departments.map((department) => decodeEntities(department.title?.rendered)).join(', ')
}

async function getArticleUrl(slug) {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')
  const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http'
  return `${protocol}://${host}${getArticlePath(slug)}`
}

function getShareLinks(url, title) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return {}

  return { title: decodeEntities(article.post.title?.rendered) }
}

export default async function page({ params }) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const { post, categoryId } = article
  const [relatedArticles, departmentName] = await Promise.all([
    getRelatedArticles(post, categoryId),
    getDepartmentName(post),
  ])

  const title = decodeEntities(post.title?.rendered)
  const media = getFeaturedMedia(post)
  const shareLinks = getShareLinks(await getArticleUrl(post.slug), title)

  return (
  <>
  <div className={`static_page`}>

<section className={style.articleDetail}>

<div className={`container ${style.container}`}>

{/* content  */}
<div className={style.contentArea}>
    <div className={style.topContent}>

<div className={style.taxonomies_container}>

{/* title  */}
     <h1 className='common_heading'>{title}</h1>

    {/* doctor detail  */}
    <div className={style.doctor}>
<Image src="/assets/images/sample-doctor.png" width={40} height={40} alt=''/>
<p className='orange_text'>Dr. (Brig) S. Viswanath</p>
    </div>

    {/* department  */}
<div className={style.dept}>
<Image src="/assets/images/dept_icon.svg" width={40} height={40} alt=''/>
<p className='orange_text'>{departmentName}</p>
    </div>

    {/* date  */}
    <div className={style.date}>
<p className=''>{formatDate(post.date)}</p>
    </div>

</div>

<div className={style.share}>
    {/* share articles to social media  */}
    <p>Share :</p>
    <ul>
        <li><a href={shareLinks.whatsapp} target='_blank' rel='noopener noreferrer'> <Image src="/assets/images/whatsapp.svg" width={24} height={24} alt=''/> </a></li>
        <li><a href={shareLinks.facebook} target='_blank' rel='noopener noreferrer'> <Image src="/assets/images/facebook.svg" width={24} height={24} alt=''/> </a></li>
        <li><a href={shareLinks.x} target='_blank' rel='noopener noreferrer'> <Image src="/assets/images/x.svg" width={24} height={24} alt=''/> </a></li>
        <li><a href='#'> <Image src="/assets/images/insta.svg" width={24} height={24} alt=''/> </a></li>
        <li><a href={shareLinks.linkedin} target='_blank' rel='noopener noreferrer'> <Image src="/assets/images/linkedin.svg" width={24} height={24} alt=''/> </a></li>
    </ul>

</div>

</div>


{/* feature image  */}
<div className={style.featureImage}>
    <ArticleImage
      src={media?.source_url || FEATURE_FALLBACK_IMAGE}
      width={1140}
      height={639}
      alt={media?.alt_text || ''}
      fallback={FEATURE_FALLBACK_IMAGE}
    />
</div>

    {/* <div className={style.articleContents} dangerouslySetInnerHTML={{ __html: toLocalArticleLinks(post.content?.rendered) }}/> */}
    <ArticleContent content={post.content?.rendered}/>


    </div>





{/* sidebar  */}
<aside id={style.sidebar}>
{relatedArticles.length > 0 && (
  <>
<h2>Related Blog</h2>
<div className={style.cards}>
    {relatedArticles.map((related) => (
    <Link key={related.id} href={getArticlePath(related.slug)} className={style.card}>
        <div className={style.image}>
            <ArticleImage src={related.image} alt={related.imageAlt}/>
        </div>
         <div className={style.content}>
      <p className={style.date}>{related.formattedDate}</p>
      <h3>{related.title}</h3>
    </div>
    </Link>
    ))}
</div>
  </>
)}
</aside>

</div>

</section>

  </div>

  </>
  )
}
