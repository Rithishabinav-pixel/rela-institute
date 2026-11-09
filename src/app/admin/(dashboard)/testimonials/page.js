import Link from 'next/link'
import { listTestimonialsAdmin } from '@/lib/testimonials'
import { listTestimonialCategoriesAdmin } from '@/lib/testimonial-categories'
import TestimonialsClient from './TestimonialsClient'
import style from '../../content/content-admin.module.css'

export const metadata = {
  title: 'Testimonials & Reviews — Admin',
}

export default async function TestimonialsPage() {
  const [result, categories] = await Promise.all([
    listTestimonialsAdmin({ page: 1, pageSize: 20 }),
    listTestimonialCategoriesAdmin(),
  ])

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Testimonials & Reviews</h1>
        <Link href="/admin/testimonials/new" className={style.primaryButton}>
          + Add Testimonial
        </Link>
      </div>
      <TestimonialsClient initial={result} categories={categories} />
    </>
  )
}
