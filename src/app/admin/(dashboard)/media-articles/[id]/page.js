import { notFound } from 'next/navigation'
import { getMediaArticleByIdAdmin } from '@/lib/media-articles'
import { listDepartments } from '@/lib/departments'
import { listDoctorsAdmin } from '@/lib/doctors'
import MediaArticleEditForm from '../MediaArticleEditForm'
import style from '../media-articles.module.css'

export const metadata = {
  title: 'Edit Media Article — Admin',
}

export default async function EditMediaArticlePage({ params }) {
  const { id } = await params
  const [article, departmentRows, doctorResult] = await Promise.all([
    getMediaArticleByIdAdmin(Number(id)),
    listDepartments(),
    listDoctorsAdmin({ pageSize: 1000 }),
  ])

  if (!article) notFound()

  const departments = departmentRows.map((d) => ({ id: d.departmentId, name: d.name }))
  const doctors = doctorResult.doctors.map((d) => ({ id: d.id, name: d.name }))

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Media Article</h1>
      </div>
      <MediaArticleEditForm mode="edit" article={article} departments={departments} doctors={doctors} />
    </>
  )
}
