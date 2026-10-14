import { listExpertTalksPublic, getExpertTalkDepartmentsForFilter, getExpertTalkDepartmentsForDropdown } from '@/lib/expert-talks'
import ContentListing from '@/app/components/content/ContentListing'

export const revalidate = 3600

export const metadata = {
  title: 'Expert Talks',
}

export default async function Page() {
  const [items, allDepartments, quickSearchDepartments] = await Promise.all([
    listExpertTalksPublic({}),
    getExpertTalkDepartmentsForDropdown(),
    getExpertTalkDepartmentsForFilter(),
  ])

  return (
    <div className="static_page">
      <ContentListing
        items={items}
        allDepartments={allDepartments}
        quickSearchDepartments={quickSearchDepartments}
        basePath="/expert-talks"
        heading="Expert Talks"
        emptyMessage="No expert talks found."
      />
    </div>
  )
}
