import Link from 'next/link'
import { listHealthPackagesAdmin } from '@/lib/health-packages'
import HealthPackagesClient from './HealthPackagesClient'
import style from '../../content/content-admin.module.css'

export const metadata = {
  title: 'Health Packages — Admin',
}

export default async function HealthPackagesPage() {
  const packages = await listHealthPackagesAdmin()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Health Packages</h1>
        <Link href="/admin/health-packages/new" className={style.primaryButton}>
          + Add Health Package
        </Link>
      </div>
      <HealthPackagesClient initial={packages} />
    </>
  )
}
