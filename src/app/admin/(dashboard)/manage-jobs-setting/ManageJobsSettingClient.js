'use client'

import { useState } from 'react'
import JobOptionManager from '../jobs/JobOptionManager'
import jobsStyle from '../jobs/jobs.module.css'

export default function ManageJobsSettingClient({ initialTitleOptions, initialCategoryOptions, initialLocationOptions }) {
  const [titleOptions, setTitleOptions] = useState(initialTitleOptions)
  const [categoryOptions, setCategoryOptions] = useState(initialCategoryOptions)
  const [locationOptions, setLocationOptions] = useState(initialLocationOptions)

  return (
    <div className={jobsStyle.optionManagers}>
      <JobOptionManager label="Job Title" apiBasePath="/api/admin/job-titles" items={titleOptions} onItemsChange={setTitleOptions} />
      <JobOptionManager label="Job Category" apiBasePath="/api/admin/job-categories" items={categoryOptions} onItemsChange={setCategoryOptions} />
      <JobOptionManager label="Location" apiBasePath="/api/admin/job-locations" items={locationOptions} onItemsChange={setLocationOptions} />
    </div>
  )
}
