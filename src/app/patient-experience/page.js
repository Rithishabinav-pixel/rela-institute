import React from 'react'
import { listPatientExperiencesPublic } from '@/lib/patient-experience'
import { listPatientExperienceCategoriesPublic } from '@/lib/patient-experience-categories'
import TestimonialClient from './TestimonialClient'

export const revalidate = 3600

export const metadata = {
  title: 'Patient  Experiences',
}

export default async function Page() {
  const [initial, categories] = await Promise.all([
    listPatientExperiencesPublic({ cursor: 0, limit: 3 }),
    listPatientExperienceCategoriesPublic(),
  ])

  return <TestimonialClient initial={initial} categories={categories} />
}
