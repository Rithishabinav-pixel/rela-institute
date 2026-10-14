import {
  listSuccessStoriesPublic,
  getSuccessStoryDepartmentsForFilter,
  getSuccessStoryDepartmentsForDropdown,
} from '@/lib/success-stories'
import SuccessStoriesListing from './SuccessStoriesListing'

export const revalidate = 3600

export const metadata = {
  title: 'Success Stories',
}

export default async function Page() {
  const [stories, allDepartments, quickSearchDepartments] = await Promise.all([
    listSuccessStoriesPublic({}),
    getSuccessStoryDepartmentsForDropdown(),
    getSuccessStoryDepartmentsForFilter(),
  ])

  return (
    <div className="static_page">
      <SuccessStoriesListing
        stories={stories}
        allDepartments={allDepartments}
        quickSearchDepartments={quickSearchDepartments}
      />
    </div>
  )
}
