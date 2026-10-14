import React from 'react'
import { listDoctorsPublic, getQuickSearchDepartments } from '@/lib/doctors'
import { getPublicDepartmentList } from '@/lib/departments'
import DoctorsListing from './DoctorsListing'

export const revalidate = 3600

export const metadata = {
  title: 'Find a Doctor',
}

export default async function Page() {
  const [doctors, departmentRows, quickSearchDepartments] = await Promise.all([
    listDoctorsPublic({}),
    getPublicDepartmentList(),
    getQuickSearchDepartments(),
  ])

  const departments = departmentRows.map((d) => ({ id: d.departmentId, name: d.name }))

  return (
    <DoctorsListing
      doctors={doctors}
      departments={departments}
      quickSearchDepartments={quickSearchDepartments}
    />
  )
}
