import { listPatientExperienceCategoriesAdmin } from '@/lib/patient-experience-categories'
import PatientExperienceEditForm from '../PatientExperienceEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Add Patient Experience — Admin',
}

export default async function NewPatientExperiencePage() {
  const categories = await listPatientExperienceCategoriesAdmin()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Patient Experience</h1>
      </div>
      <PatientExperienceEditForm mode="create" categories={categories} />
    </>
  )
}
