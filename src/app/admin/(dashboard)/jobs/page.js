import Link from 'next/link'
import { listJobsAdmin } from '@/lib/jobs'
import JobsPageClient from './JobsPageClient'
import style from '../../content/content-admin.module.css'

export const metadata = {
  title: 'Careers / Jobs — Admin',
}

export default async function JobsPage() {
  const jobs = await listJobsAdmin()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Careers / Jobs</h1>
        <Link href="/admin/jobs/new" className={style.primaryButton}>
          + Add Job
        </Link>
      </div>
      <JobsPageClient initialJobs={jobs} />
    </>
  )
}
