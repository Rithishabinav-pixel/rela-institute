import Link from 'next/link'
import { listMediaArticlesAdmin } from '@/lib/media-articles'
import MediaArticlesClient from './MediaArticlesClient'
import style from './media-articles.module.css'

export const metadata = {
  title: 'Media Articles — Admin',
}

export default async function MediaArticlesPage() {
  const initial = await listMediaArticlesAdmin({ page: 1, pageSize: 20 })

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Media Articles</h1>
        <Link href="/admin/media-articles/new" className={style.primaryButton}>
          + Add Media Article
        </Link>
      </div>
      <MediaArticlesClient initial={initial} />
    </>
  )
}
