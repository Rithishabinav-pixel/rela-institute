import React from 'react'
import NewsLetterClient from './NewsLetterClient'

export const revalidate = 3600

export const metadata = {
  title: 'NewsLetter',
}

export default async function Page() {


  return (
    <NewsLetterClient/>
  )
}
