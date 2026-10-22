import { jobTitles, jobCategories, jobLocations } from '@/lib/job-options'
import JobEditForm from '../JobEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Add Job — Admin',
}

export default async function NewJobPage() {
  const [titleOptions, categoryOptions, locationOptions] = await Promise.all([
    jobTitles.list(),
    jobCategories.list(),
    jobLocations.list(),
  ])

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Job</h1>
      </div>
      <JobEditForm
        mode="create"
        titleOptions={titleOptions}
        categoryOptions={categoryOptions}
        locationOptions={locationOptions}
      />
    </>
  )
}
