import { listTestimonialCategoriesAdmin } from '@/lib/testimonial-categories'
import TestimonialEditForm from '../TestimonialEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Add Testimonial — Admin',
}

export default async function NewTestimonialPage() {
  const categories = await listTestimonialCategoriesAdmin()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Testimonial</h1>
      </div>
      <TestimonialEditForm mode="create" categories={categories} />
    </>
  )
}
