import { notFound } from 'next/navigation'
import { getNewsletterByIdAdmin } from '@/lib/newsletters'
import NewsletterEditForm from '../NewsletterEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Edit Newsletter — Admin',
}

export default async function EditNewsletterPage({ params }) {
  const { id } = await params
  const item = await getNewsletterByIdAdmin(Number(id))

  if (!item) notFound()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Newsletter</h1>
      </div>
      <NewsletterEditForm mode="edit" item={item} />
    </>
  )
}
