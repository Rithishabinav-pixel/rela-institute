import Link from 'next/link'
import { listHeroBannersAdmin } from '@/lib/hero-banners'
import HeroBannersClient from './HeroBannersClient'
import style from '../../content/content-admin.module.css'

export const metadata = {
  title: 'Hero Banners — Admin',
}

export default async function HeroBannersPage() {
  const banners = await listHeroBannersAdmin()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Hero Banners</h1>
        <Link href="/admin/hero-banners/new" className={style.primaryButton}>
          + Add Hero Banner
        </Link>
      </div>
      <HeroBannersClient initial={banners} />
    </>
  )
}
