import { notFound } from 'next/navigation'
import { getExpertTalkByIdAdmin } from '@/lib/expert-talks'
import { listDepartments } from '@/lib/departments'
import { listDoctorsAdmin } from '@/lib/doctors'
import ContentEditForm from '../../../content/ContentEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Edit Expert Talk — Admin',
}

export default async function EditExpertTalkPage({ params }) {
  const { id } = await params
  const [item, departmentRows, doctorResult] = await Promise.all([
    getExpertTalkByIdAdmin(Number(id)),
    listDepartments(),
    listDoctorsAdmin({ pageSize: 1000 }),
  ])

  if (!item) notFound()

  const departments = departmentRows.map((d) => ({ id: d.departmentId, name: d.name }))
  const doctors = doctorResult.doctors.map((d) => ({ id: d.id, name: d.name }))

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Expert Talk</h1>
      </div>
      <ContentEditForm
        mode="edit"
        item={item}
        departments={departments}
        doctors={doctors}
        apiBasePath="/api/admin/expert-talks"
        listPath="/admin/expert-talks"
        entityLabel="Expert Talk"
        contentLabel="Talk Summary"
      />
    </>
  )
}
