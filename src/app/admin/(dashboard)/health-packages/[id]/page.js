import { notFound } from 'next/navigation'
import { getHealthPackageByIdAdmin } from '@/lib/health-packages'
import HealthPackageEditForm from '../HealthPackageEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Edit Health Package — Admin',
}

export default async function EditHealthPackagePage({ params }) {
  const { id } = await params
  const pkg = await getHealthPackageByIdAdmin(Number(id))

  if (!pkg) notFound()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Health Package</h1>
      </div>
      <HealthPackageEditForm mode="edit" pkg={pkg} />
    </>
  )
}
