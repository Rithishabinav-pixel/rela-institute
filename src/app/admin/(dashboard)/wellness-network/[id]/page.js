import { notFound } from 'next/navigation'
import { getWellnessNetworkByIdAdmin } from '@/lib/wellness-network'
import { listDepartments } from '@/lib/departments'
import { listDoctorsAdmin } from '@/lib/doctors'
import ContentEditForm from '../../../content/ContentEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Edit Wellness Network — Admin',
}

export default async function EditWellnessNetworkPage({ params }) {
  const { id } = await params
  const [item, departmentRows, doctorResult] = await Promise.all([
    getWellnessNetworkByIdAdmin(Number(id)),
    listDepartments(),
    listDoctorsAdmin({ pageSize: 1000 }),
  ])

  if (!item) notFound()

  const departments = departmentRows.map((d) => ({ id: d.departmentId, name: d.name }))
  const doctors = doctorResult.doctors.map((d) => ({ id: d.id, name: d.name }))

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Wellness Network</h1>
      </div>
      <ContentEditForm
        mode="edit"
        item={item}
        departments={departments}
        doctors={doctors}
        apiBasePath="/api/admin/wellness-network"
        listPath="/admin/wellness-network"
        entityLabel="Wellness Network"
        contentLabel="Summary"
      />
    </>
  )
}
