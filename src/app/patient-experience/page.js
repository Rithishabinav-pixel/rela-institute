import React from 'react'
import { listDoctorsPublic, getQuickSearchDepartments } from '@/lib/doctors'
import { getPublicDepartmentList } from '@/lib/departments'
import DoctorsListing from './TestimonialClient'
import TestimonialClient from './TestimonialClient'

export const revalidate = 3600

export const metadata = {
  title: 'Patient  Experience',
}

export default async function Page() {


  return (
    <TestimonialClient/>
  )
}
