import { notFound } from 'next/navigation'
import ContentDetailLayout from '@/app/components/content/ContentDetailLayout'
import { getExpertTalkBySlugPublic, getRelatedExpertTalks } from '@/lib/expert-talks'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = await getExpertTalkBySlugPublic(slug)
  if (!item) return {}
  return { title: item.title }
}

export default async function Page({ params }) {
  const { slug } = await params
  const item = await getExpertTalkBySlugPublic(slug)
  if (!item) notFound()

  const departmentIds = item.departments.map((d) => d.id)
  const relatedItems = await getRelatedExpertTalks(item.id, departmentIds)

  return (
    <ContentDetailLayout
      item={item}
      relatedItems={relatedItems}
      basePath="/expert-talks"
      relatedHeading="Related Expert Talks"
    />
  )
}
