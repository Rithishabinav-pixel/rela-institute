'use client'

import ContentListing from '@/app/components/content/ContentListing'

export default function MediaListing({
  articles,
  allDepartments,
  quickSearchDepartments,
  heading = 'Media',
  emptyMessage = 'No media found.',
}) {
  return (
    <ContentListing
      items={articles}
      allDepartments={allDepartments}
      quickSearchDepartments={quickSearchDepartments}
      basePath="/media"
      heading={heading}
      emptyMessage={emptyMessage}
    />
  )
}
