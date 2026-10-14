import Link from 'next/link'
import { listEventsAdmin } from '@/lib/events'
import ContentListingClient from '../../content/ContentListingClient'
import style from '../../content/content-admin.module.css'

export const metadata = {
  title: 'Events — Admin',
}

export default async function EventsPage() {
  const initial = await listEventsAdmin({ page: 1, pageSize: 20 })

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Events</h1>
        <Link href="/admin/events/new" className={style.primaryButton}>
          + Add Event
        </Link>
      </div>
      <ContentListingClient
        initial={initial}
        apiBasePath="/api/admin/events"
        editBasePath="/admin/events"
        entityLabel="event"
      />
    </>
  )
}
