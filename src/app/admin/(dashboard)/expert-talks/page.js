import Link from 'next/link'
import { listExpertTalksAdmin } from '@/lib/expert-talks'
import ContentListingClient from '../../content/ContentListingClient'
import style from '../../content/content-admin.module.css'

export const metadata = {
  title: 'Expert Talks — Admin',
}

export default async function ExpertTalksPage() {
  const initial = await listExpertTalksAdmin({ page: 1, pageSize: 20 })

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Expert Talks</h1>
        <Link href="/admin/expert-talks/new" className={style.primaryButton}>
          + Add Expert Talk
        </Link>
      </div>
      <ContentListingClient
        initial={initial}
        apiBasePath="/api/admin/expert-talks"
        editBasePath="/admin/expert-talks"
        entityLabel="expert talk"
      />
    </>
  )
}
