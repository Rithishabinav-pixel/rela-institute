import { notFound } from 'next/navigation'
import { getPatientExperienceByIdAdmin } from '@/lib/patient-experience'
import { listPatientExperienceCategoriesAdmin } from '@/lib/patient-experience-categories'
import PatientExperienceEditForm from '../PatientExperienceEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Edit Patient Experience — Admin',
}

export default async function EditPatientExperiencePage({ params }) {
  const { id } = await params
  const [item, categories] = await Promise.all([
    getPatientExperienceByIdAdmin(Number(id)),
    listPatientExperienceCategoriesAdmin(),
  ])

  if (!item) notFound()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Patient Experience</h1>
      </div>
      <PatientExperienceEditForm mode="edit" item={item} categories={categories} />
    </>
  )
}
