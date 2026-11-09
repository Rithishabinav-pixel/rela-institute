import Link from 'next/link'
import { listWellnessNetworkAdmin } from '@/lib/wellness-network'
import ContentListingClient from '../../content/ContentListingClient'
import style from '../../content/content-admin.module.css'

export const metadata = {
  title: 'Wellness Network — Admin',
}

export default async function WellnessNetworkPage() {
  const initial = await listWellnessNetworkAdmin({ page: 1, pageSize: 20 })

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Wellness Network</h1>
        <Link href="/admin/wellness-network/new" className={style.primaryButton}>
          + Add Wellness Network
        </Link>
      </div>
      <ContentListingClient
        initial={initial}
        apiBasePath="/api/admin/wellness-network"
        editBasePath="/admin/wellness-network"
        entityLabel="wellness network item"
      />
    </>
  )
}
