import React from 'react'
import { listNewslettersPublic } from '@/lib/newsletters'
import NewsLetterClient from './NewsLetterClient'

export const revalidate = 3600

export const metadata = {
  title: 'NewsLetter',
}

export default async function Page() {
  const initial = await listNewslettersPublic({ cursor: 0, limit: 3 })

  return <NewsLetterClient initial={initial} />
}
