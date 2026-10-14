import { listDepartments } from '@/lib/departments'
import { listDoctorsAdmin } from '@/lib/doctors'
import MediaArticleEditForm from '../MediaArticleEditForm'
import style from '../media-articles.module.css'

export const metadata = {
  title: 'Add Media Article — Admin',
}

export default async function NewMediaArticlePage() {
  const [departmentRows, doctorResult] = await Promise.all([
    listDepartments(),
    listDoctorsAdmin({ pageSize: 1000 }),
  ])

  const departments = departmentRows.map((d) => ({ id: d.departmentId, name: d.name }))
  const doctors = doctorResult.doctors.map((d) => ({ id: d.id, name: d.name }))

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Media Article</h1>
      </div>
      <MediaArticleEditForm mode="create" departments={departments} doctors={doctors} />
    </>
  )
}
