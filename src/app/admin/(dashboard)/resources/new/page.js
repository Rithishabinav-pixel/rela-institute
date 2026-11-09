import { listResourceCategoriesAdmin } from '@/lib/resource-categories'
import ResourceEditForm from '../ResourceEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Add Resource — Admin',
}

export default async function NewResourcePage() {
  const categories = await listResourceCategoriesAdmin()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Resource</h1>
      </div>
      <ResourceEditForm mode="create" categories={categories} />
    </>
  )
}
