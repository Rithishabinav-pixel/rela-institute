import React from 'react'
import TestimonialClient from './TestimonialClient'

export const revalidate = 3600

export const metadata = {
  title: 'Patient  Experiences',
}

export default async function Page() {


  return (
    <TestimonialClient/>
  )
}
