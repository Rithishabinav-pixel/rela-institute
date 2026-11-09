import { notFound } from 'next/navigation'
import { getTestimonialByIdAdmin } from '@/lib/testimonials'
import { listTestimonialCategoriesAdmin } from '@/lib/testimonial-categories'
import TestimonialEditForm from '../TestimonialEditForm'
import style from '../../../content/content-admin.module.css'

export const metadata = {
  title: 'Edit Testimonial — Admin',
}

export default async function EditTestimonialPage({ params }) {
  const { id } = await params
  const [item, categories] = await Promise.all([
    getTestimonialByIdAdmin(Number(id)),
    listTestimonialCategoriesAdmin(),
  ])

  if (!item) notFound()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Testimonial</h1>
      </div>
      <TestimonialEditForm mode="edit" item={item} categories={categories} />
    </>
  )
}
