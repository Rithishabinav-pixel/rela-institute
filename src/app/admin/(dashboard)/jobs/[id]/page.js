import { notFound } from 'next/navigation'
import { getJobByIdAdmin } from '@/lib/jobs'
import { jobTitles, jobCategories, jobLocations } from '@/lib/job-options'
import JobEditForm from '../JobEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Edit Job — Admin',
}

export default async function EditJobPage({ params }) {
  const { id } = await params
  const [job, titleOptions, categoryOptions, locationOptions] = await Promise.all([
    getJobByIdAdmin(Number(id)),
    jobTitles.list(),
    jobCategories.list(),
    jobLocations.list(),
  ])

  if (!job) notFound()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Job</h1>
      </div>
      <JobEditForm
        mode="edit"
        job={job}
        titleOptions={titleOptions}
        categoryOptions={categoryOptions}
        locationOptions={locationOptions}
      />
    </>
  )
}
