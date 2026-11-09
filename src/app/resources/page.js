import React from 'react'
import { listResourcesPublic } from '@/lib/resources'
import { listResourceCategoriesPublic } from '@/lib/resource-categories'
import ResourcesClient from './ResourcesClient'

export const revalidate = 3600

export const metadata = {
  title: 'Resources',
}

export default async function Page() {
  const [initial, categories] = await Promise.all([
    listResourcesPublic({ cursor: 0, limit: 3 }),
    listResourceCategoriesPublic(),
  ])

  return <ResourcesClient initial={initial} categories={categories} />
}
