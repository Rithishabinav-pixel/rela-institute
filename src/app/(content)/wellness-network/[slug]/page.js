import { notFound } from 'next/navigation'
import ContentDetailLayout from '@/app/components/content/ContentDetailLayout'
import { getWellnessNetworkBySlugPublic, getRelatedWellnessNetwork } from '@/lib/wellness-network'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { slug } = await params
  const item = await getWellnessNetworkBySlugPublic(slug)
  if (!item) return {}
  return { title: item.title }
}

export default async function Page({ params }) {
  const { slug } = await params
  const item = await getWellnessNetworkBySlugPublic(slug)
  if (!item) notFound()

  const departmentIds = item.departments.map((d) => d.id)
  const relatedItems = await getRelatedWellnessNetwork(item.id, departmentIds)

  return (
    <ContentDetailLayout
      item={item}
      relatedItems={relatedItems}
      basePath="/wellness-network"
      relatedHeading="Related Wellness Network"
    />
  )
}
