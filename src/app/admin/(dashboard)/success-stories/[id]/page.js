import { notFound } from 'next/navigation'
import { getSuccessStoryByIdAdmin } from '@/lib/success-stories'
import { listDepartments } from '@/lib/departments'
import { listDoctorsAdmin } from '@/lib/doctors'
import SuccessStoryEditForm from '../SuccessStoryEditForm'
import style from '../success-stories.module.css'

export const metadata = {
  title: 'Edit Success Story — Admin',
}

export default async function EditSuccessStoryPage({ params }) {
  const { id } = await params
  const [story, departmentRows, doctorResult] = await Promise.all([
    getSuccessStoryByIdAdmin(Number(id)),
    listDepartments(),
    listDoctorsAdmin({ pageSize: 1000 }),
  ])

  if (!story) notFound()

  const departments = departmentRows.map((d) => ({ id: d.departmentId, name: d.name }))
  const doctors = doctorResult.doctors.map((d) => ({ id: d.id, name: d.name }))

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Success Story</h1>
      </div>
      <SuccessStoryEditForm mode="edit" story={story} departments={departments} doctors={doctors} />
    </>
  )
}
