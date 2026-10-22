'use client'

import { useState } from 'react'
import Link from 'next/link'
import JobOptionManager from './JobOptionManager'
import style from '../../content/content-admin.module.css'
import jobsStyle from './jobs.module.css'

export default function JobsPageClient({ initialJobs, initialTitleOptions, initialCategoryOptions, initialLocationOptions }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [titleOptions, setTitleOptions] = useState(initialTitleOptions)
  const [categoryOptions, setCategoryOptions] = useState(initialCategoryOptions)
  const [locationOptions, setLocationOptions] = useState(initialLocationOptions)

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete this job posting? This cannot be undone.`)) return

    const res = await fetch(`/api/admin/jobs/${job.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      window.alert(data.error || 'Could not delete job.')
      return
    }

    setJobs((prev) => prev.filter((j) => j.id !== job.id))
  }

  return (
    <>
      <div className={jobsStyle.optionManagers}>
        <JobOptionManager label="Job Title" apiBasePath="/api/admin/job-titles" items={titleOptions} onItemsChange={setTitleOptions} />
        <JobOptionManager label="Job Category" apiBasePath="/api/admin/job-categories" items={categoryOptions} onItemsChange={setCategoryOptions} />
        <JobOptionManager label="Location" apiBasePath="/api/admin/job-locations" items={locationOptions} onItemsChange={setLocationOptions} />
      </div>

      <div className={style.card}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Experience</th>
              <th>Education</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr className={style.stateRow}>
                <td colSpan={6}>No jobs found.</td>
              </tr>
            )}

            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.jobTitle.name}</td>
                <td>{job.jobCategory.name}</td>
                <td>{job.jobLocation.name}</td>
                <td>{job.experience}</td>
                <td>{job.education}</td>
                <td>
                  <div className={style.rowActions}>
                    <Link href={`/admin/jobs/${job.id}`} className={style.secondaryButton}>
                      Edit
                    </Link>
                    <button type="button" className={style.dangerButton} onClick={() => handleDelete(job)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
