import { notFound } from 'next/navigation'
import ContentDetailLayout from '@/app/components/content/ContentDetailLayout'
import { getMediaArticleBySlugPublic, getRelatedMediaArticles } from '@/lib/media-articles'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { slug } = await params
  const article = await getMediaArticleBySlugPublic(slug)
  if (!article) return {}
  return { title: article.title }
}

export default async function Page({ params }) {
  const { slug } = await params
  const article = await getMediaArticleBySlugPublic(slug)
  if (!article) notFound()

  const departmentIds = article.departments.map((d) => d.id)
  const relatedItems = await getRelatedMediaArticles(article.id, departmentIds)

  return (
    <ContentDetailLayout item={article} relatedItems={relatedItems} basePath="/media" relatedHeading="Related Media" />
  )
}
