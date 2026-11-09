import NewsletterEditForm from '../NewsletterEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Add Newsletter — Admin',
}

export default function NewNewsletterPage() {
  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Newsletter</h1>
      </div>
      <NewsletterEditForm mode="create" />
    </>
  )
}
