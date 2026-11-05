import { jobTitles, jobCategories, jobLocations } from '@/lib/job-options'
import ManageJobsSettingClient from './ManageJobsSettingClient'
import style from '../../content/content-admin.module.css'

export const metadata = {
  title: 'Manage Jobs Setting — Admin',
}

export default async function ManageJobsSettingPage() {
  const [titleOptions, categoryOptions, locationOptions] = await Promise.all([
    jobTitles.list(),
    jobCategories.list(),
    jobLocations.list(),
  ])

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Manage Jobs Setting</h1>
      </div>
      <ManageJobsSettingClient
        initialTitleOptions={titleOptions}
        initialCategoryOptions={categoryOptions}
        initialLocationOptions={locationOptions}
      />
    </>
  )
}
