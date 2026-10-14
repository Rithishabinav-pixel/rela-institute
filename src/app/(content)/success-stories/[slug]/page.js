import { notFound } from 'next/navigation'
import ContentDetailLayout from '@/app/components/content/ContentDetailLayout'
import { getSuccessStoryBySlugPublic, getRelatedSuccessStories } from '@/lib/success-stories'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { slug } = await params
  const story = await getSuccessStoryBySlugPublic(slug)
  if (!story) return {}
  return { title: story.title }
}

export default async function Page({ params }) {
  const { slug } = await params
  const story = await getSuccessStoryBySlugPublic(slug)
  if (!story) notFound()

  const departmentIds = story.departments.map((d) => d.id)
  const relatedItems = await getRelatedSuccessStories(story.id, departmentIds)

  return (
    <ContentDetailLayout
      item={story}
      relatedItems={relatedItems}
      basePath="/success-stories"
      relatedHeading="Related Success Stories"
    />
  )
}
