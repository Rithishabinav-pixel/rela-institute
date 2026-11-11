import React from 'react'
import { getDepartmentListingCards } from '@/lib/departments'
import DepartmentListing from './DepartmentListing'

export const revalidate = 3600

export const metadata = {
  title: 'Find a Department',
}

export default async function Page() {
  const cards = await getDepartmentListingCards()

  const departments = cards.map((card) => ({
    ...card,
    doctorLink: "/",
    departmentLink: "/",
  }))

  return (
    <DepartmentListing departments={departments}/>
  )
}
