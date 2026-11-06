import React from 'react'

import ResourcesClient from './ResourcesClient'

export const revalidate = 3600

export const metadata = {
  title: 'Resources',
}

export default async function Page() {


  return (
  <ResourcesClient/>
  )
}
