import { notFound } from 'next/navigation'
import { getResourceByIdAdmin } from '@/lib/resources'
import { listResourceCategoriesAdmin } from '@/lib/resource-categories'
import ResourceEditForm from '../ResourceEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Edit Resource — Admin',
}

export default async function EditResourcePage({ params }) {
  const { id } = await params
  const [item, categories] = await Promise.all([
    getResourceByIdAdmin(Number(id)),
    listResourceCategoriesAdmin(),
  ])

  if (!item) notFound()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Resource</h1>
      </div>
      <ResourceEditForm mode="edit" item={item} categories={categories} />
    </>
  )
}
