import Link from 'next/link'
import { listNewslettersAdmin } from '@/lib/newsletters'
import NewslettersClient from './NewslettersClient'
import style from '../../content/content-admin.module.css'

export const metadata = {
  title: 'Newsletters — Admin',
}

export default async function NewslettersPage() {
  const result = await listNewslettersAdmin({ page: 1, pageSize: 20 })

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Newsletters</h1>
        <Link href="/admin/newsletters/new" className={style.primaryButton}>
          + Add Newsletter
        </Link>
      </div>
      <NewslettersClient initial={result} />
    </>
  )
}
