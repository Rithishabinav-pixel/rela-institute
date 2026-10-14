import { listEventsPublic, getEventDepartmentsForFilter, getEventDepartmentsForDropdown } from '@/lib/events'
import ContentListing from '@/app/components/content/ContentListing'

export const revalidate = 3600

export const metadata = {
  title: 'Events',
}

export default async function Page() {
  const [items, allDepartments, quickSearchDepartments] = await Promise.all([
    listEventsPublic({}),
    getEventDepartmentsForDropdown(),
    getEventDepartmentsForFilter(),
  ])

  return (
    <div className="static_page">
      <ContentListing
        items={items}
        allDepartments={allDepartments}
        quickSearchDepartments={quickSearchDepartments}
        basePath="/events"
        heading="Events"
        emptyMessage="No events found."
      />
    </div>
  )
}
