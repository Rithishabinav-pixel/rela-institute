import { listWellnessNetworkPublic, getWellnessNetworkDepartmentsForFilter, getWellnessNetworkDepartmentsForDropdown } from '@/lib/wellness-network'
import ContentListing from '@/app/components/content/ContentListing'

export const revalidate = 3600

export const metadata = {
  title: 'Wellness Network',
}

export default async function Page() {
  const [items, allDepartments, quickSearchDepartments] = await Promise.all([
    listWellnessNetworkPublic({}),
    getWellnessNetworkDepartmentsForDropdown(),
    getWellnessNetworkDepartmentsForFilter(),
  ])

  return (
    <div className="static_page">
      <ContentListing
        items={items}
        allDepartments={allDepartments}
        quickSearchDepartments={quickSearchDepartments}
        basePath="/wellness-network"
        heading="Wellness Network"
        emptyMessage="No wellness network items found."
      />
    </div>
  )
}
