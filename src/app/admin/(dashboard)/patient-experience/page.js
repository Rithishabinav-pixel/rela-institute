import Link from 'next/link'
import { listPatientExperiencesAdmin } from '@/lib/patient-experience'
import { listPatientExperienceCategoriesAdmin } from '@/lib/patient-experience-categories'
import PatientExperiencesClient from './PatientExperiencesClient'
import style from '../../content/content-admin.module.css'

export const metadata = {
  title: 'Patient Experience — Admin',
}

export default async function PatientExperiencesPage() {
  const [result, categories] = await Promise.all([
    listPatientExperiencesAdmin({ page: 1, pageSize: 20 }),
    listPatientExperienceCategoriesAdmin(),
  ])

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Patient Experience</h1>
        <Link href="/admin/patient-experience/new" className={style.primaryButton}>
          + Add Patient Experience
        </Link>
      </div>
      <PatientExperiencesClient initial={result} categories={categories} />
    </>
  )
}
