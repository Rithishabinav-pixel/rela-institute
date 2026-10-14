import { listDepartments } from '@/lib/departments'
import { listDoctorsAdmin } from '@/lib/doctors'
import ContentEditForm from '../../../content/ContentEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Add Event — Admin',
}

export default async function NewEventPage() {
  const [departmentRows, doctorResult] = await Promise.all([
    listDepartments(),
    listDoctorsAdmin({ pageSize: 1000 }),
  ])

  const departments = departmentRows.map((d) => ({ id: d.departmentId, name: d.name }))
  const doctors = doctorResult.doctors.map((d) => ({ id: d.id, name: d.name }))

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Event</h1>
      </div>
      <ContentEditForm
        mode="create"
        departments={departments}
        doctors={doctors}
        apiBasePath="/api/admin/events"
        listPath="/admin/events"
        entityLabel="Event"
      />
    </>
  )
}
