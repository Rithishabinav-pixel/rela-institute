import HeroBannerEditForm from '../HeroBannerEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Add Hero Banner — Admin',
}

export default function NewHeroBannerPage() {
  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Hero Banner</h1>
      </div>
      <HeroBannerEditForm mode="create" />
    </>
  )
}
