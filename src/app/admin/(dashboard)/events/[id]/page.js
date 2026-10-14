import { notFound } from 'next/navigation'
import { getEventByIdAdmin } from '@/lib/events'
import { listDepartments } from '@/lib/departments'
import { listDoctorsAdmin } from '@/lib/doctors'
import ContentEditForm from '../../../content/ContentEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Edit Event — Admin',
}

export default async function EditEventPage({ params }) {
  const { id } = await params
  const [item, departmentRows, doctorResult] = await Promise.all([
    getEventByIdAdmin(Number(id)),
    listDepartments(),
    listDoctorsAdmin({ pageSize: 1000 }),
  ])

  if (!item) notFound()

  const departments = departmentRows.map((d) => ({ id: d.departmentId, name: d.name }))
  const doctors = doctorResult.doctors.map((d) => ({ id: d.id, name: d.name }))

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Event</h1>
      </div>
      <ContentEditForm
        mode="edit"
        item={item}
        departments={departments}
        doctors={doctors}
        apiBasePath="/api/admin/events"
        listPath="/admin/events"
        entityLabel="Event"
      />
    </>
  )
}
