import React from 'react'
import { listAllTestimonialsPublic } from '@/lib/testimonials'
import { listTestimonialCategoriesPublic } from '@/lib/testimonial-categories'
import TestimonialClient from './TestimonialClient'

export const revalidate = 3600

export const metadata = {
  title: 'Testimonials and Reviews',
}

export default async function Page() {
  const [initial, categories] = await Promise.all([
    listAllTestimonialsPublic({ cursor: 0, limit: 3 }),
    listTestimonialCategoriesPublic(),
  ])

  return <TestimonialClient initial={initial} categories={categories} />
}
