import Link from 'next/link'
import { listSuccessStoriesAdmin } from '@/lib/success-stories'
import SuccessStoriesClient from './SuccessStoriesClient'
import style from './success-stories.module.css'

export const metadata = {
  title: 'Success Stories — Admin',
}

export default async function SuccessStoriesPage() {
  const initial = await listSuccessStoriesAdmin({ page: 1, pageSize: 20 })

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Success Stories</h1>
        <Link href="/admin/success-stories/new" className={style.primaryButton}>
          + Add Success Story
        </Link>
      </div>
      <SuccessStoriesClient initial={initial} />
    </>
  )
}
