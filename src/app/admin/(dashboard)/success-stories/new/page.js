import { listDepartments } from '@/lib/departments'
import { listDoctorsAdmin } from '@/lib/doctors'
import SuccessStoryEditForm from '../SuccessStoryEditForm'
import style from '../success-stories.module.css'

export const metadata = {
  title: 'Add Success Story — Admin',
}

export default async function NewSuccessStoryPage() {
  const [departmentRows, doctorResult] = await Promise.all([
    listDepartments(),
    listDoctorsAdmin({ pageSize: 1000 }),
  ])

  const departments = departmentRows.map((d) => ({ id: d.departmentId, name: d.name }))
  const doctors = doctorResult.doctors.map((d) => ({ id: d.id, name: d.name }))

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Success Story</h1>
      </div>
      <SuccessStoryEditForm mode="create" departments={departments} doctors={doctors} />
    </>
  )
}
