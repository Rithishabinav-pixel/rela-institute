import { notFound } from 'next/navigation'
import ContentDetailLayout from '@/app/components/content/ContentDetailLayout'
import { getEventBySlugPublic, getRelatedEvents } from '@/lib/events'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = await getEventBySlugPublic(slug)
  if (!item) return {}
  return { title: item.title }
}

export default async function Page({ params }) {
  const { slug } = await params
  const item = await getEventBySlugPublic(slug)
  if (!item) notFound()

  const departmentIds = item.departments.map((d) => d.id)
  const relatedItems = await getRelatedEvents(item.id, departmentIds)

  return (
    <ContentDetailLayout item={item} relatedItems={relatedItems} basePath="/events" relatedHeading="Related Events" />
  )
}
