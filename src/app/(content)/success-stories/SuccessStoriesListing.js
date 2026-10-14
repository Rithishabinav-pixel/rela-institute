'use client'

import ContentListing from '@/app/components/content/ContentListing'

export default function SuccessStoriesListing({
  stories,
  allDepartments,
  quickSearchDepartments,
  heading = 'Success Stories',
  emptyMessage = 'No success stories found.',
}) {
  return (
    <ContentListing
      items={stories}
      allDepartments={allDepartments}
      quickSearchDepartments={quickSearchDepartments}
      basePath="/success-stories"
      heading={heading}
      emptyMessage={emptyMessage}
    />
  )
}
