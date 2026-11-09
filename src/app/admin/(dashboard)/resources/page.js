import Link from 'next/link'
import { listResourcesAdmin } from '@/lib/resources'
import { listResourceCategoriesAdmin } from '@/lib/resource-categories'
import ResourcesClient from './ResourcesClient'
import style from '../../content/content-admin.module.css'

export const metadata = {
  title: 'Resources — Admin',
}

export default async function ResourcesPage() {
  const [result, categories] = await Promise.all([
    listResourcesAdmin({ page: 1, pageSize: 20 }),
    listResourceCategoriesAdmin(),
  ])

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Resources</h1>
        <Link href="/admin/resources/new" className={style.primaryButton}>
          + Add Resource
        </Link>
      </div>
      <ResourcesClient initial={result} categories={categories} />
    </>
  )
}
