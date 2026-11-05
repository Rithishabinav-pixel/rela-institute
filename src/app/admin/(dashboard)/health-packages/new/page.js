import HealthPackageEditForm from '../HealthPackageEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Add Health Package — Admin',
}

export default function NewHealthPackagePage() {
  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Health Package</h1>
      </div>
      <HealthPackageEditForm mode="create" />
    </>
  )
}
