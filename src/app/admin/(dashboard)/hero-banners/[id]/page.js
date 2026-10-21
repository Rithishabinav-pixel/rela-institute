import { notFound } from 'next/navigation'
import { getHeroBannerByIdAdmin } from '@/lib/hero-banners'
import HeroBannerEditForm from '../HeroBannerEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Edit Hero Banner — Admin',
}

export default async function EditHeroBannerPage({ params }) {
  const { id } = await params
  const banner = await getHeroBannerByIdAdmin(Number(id))

  if (!banner) notFound()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Hero Banner</h1>
      </div>
      <HeroBannerEditForm mode="edit" banner={banner} />
    </>
  )
}
