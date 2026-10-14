import { listDepartments } from '@/lib/departments'
import { listDoctorsAdmin } from '@/lib/doctors'
import ContentEditForm from '../../../content/ContentEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Add Expert Talk — Admin',
}

export default async function NewExpertTalkPage() {
  const [departmentRows, doctorResult] = await Promise.all([
    listDepartments(),
    listDoctorsAdmin({ pageSize: 1000 }),
  ])

  const departments = departmentRows.map((d) => ({ id: d.departmentId, name: d.name }))
  const doctors = doctorResult.doctors.map((d) => ({ id: d.id, name: d.name }))

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Expert Talk</h1>
      </div>
      <ContentEditForm
        mode="create"
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
