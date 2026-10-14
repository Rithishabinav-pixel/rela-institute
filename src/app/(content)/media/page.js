import {
  listMediaArticlesPublic,
  getMediaArticleDepartmentsForFilter,
  getMediaArticleDepartmentsForDropdown,
} from '@/lib/media-articles'
import MediaListing from './MediaListing'

export const revalidate = 3600

export const metadata = {
  title: 'Media',
}

export default async function Page() {
  const [articles, allDepartments, quickSearchDepartments] = await Promise.all([
    listMediaArticlesPublic({}),
    getMediaArticleDepartmentsForDropdown(),
    getMediaArticleDepartmentsForFilter(),
  ])

  return (
    <div className="static_page">
      <MediaListing
        articles={articles}
        allDepartments={allDepartments}
        quickSearchDepartments={quickSearchDepartments}
      />
    </div>
  )
}
