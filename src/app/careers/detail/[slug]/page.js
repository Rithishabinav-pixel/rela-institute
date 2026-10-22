import React from 'react'
import { notFound } from 'next/navigation'
import style from '../detail.module.css'
import Image from 'next/image'
import CareerForm from '@/app/components/CareerForm/CareerForm'
import { getJobBySlugPublic } from '@/lib/jobs'
import MobileApplyButton from './MobileApplyButton'

export const revalidate = 3600

export async function generateMetadata({ params }) {
  const { slug } = await params
  const job = await getJobBySlugPublic(slug)
  if (!job) return {}
  return { title: job.title }
}

export default async function Page({ params }) {
  const { slug } = await params
  const job = await getJobBySlugPublic(slug)

  if (!job) notFound()

  return (
    <>
      <section className={`common_section ${style.hero_section}`}>
        <div className={`container ${style.container}`}>
          <div className={style.wrapper}>
            <h1 className="common_heading">{job.title}</h1>
            <p className={style.category}>{job.category}</p>

            <ul className={style.mainDetails}>
              <li>
                <Image src="/assets/images/job-title.svg" width={32} height={32} alt='' /> {job.title}
              </li>
              <li>
                <Image src="/assets/images/location.svg" width={32} height={32} alt='' /> {job.location}
              </li>
              <li>
                <Image src="/assets/images/experience.svg" width={32} height={32} alt='' /> {job.experience}
              </li>
              <li>
                <Image src="/assets/images/education.svg" width={32} height={32} alt='' /> {job.education}
              </li>
            </ul>

            <MobileApplyButton />
          </div>
        </div>
      </section>

      <section className={`common_section ${style.careerInfo_section}`}>
        <div className={`container ${style.container}`}>
          <div className={style.content} dangerouslySetInnerHTML={{ __html: job.content }} />

          <div className={style.formArea} id='form'>
            <CareerForm />
          </div>
        </div>
      </section>
    </>
  )
}
