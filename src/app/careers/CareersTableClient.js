'use client'

import { useState } from 'react'
import Image from 'next/image'
import Button from '../components/UI/Button'
import style from './career.module.css'

function LoadMoreButton({ label, onClick }) {
  return (
    <a
      href="#"
      role="button"
      className="common_btn white_btn orange_stroke"
      onClick={(event) => { event.preventDefault(); onClick(); }}
    >
      {label} <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt="" />
    </a>
  )
}

const PAGE_SIZE = 6

export default function CareersTableClient({ jobs }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const visibleJobs = jobs.slice(0, visibleCount)
  const allShown = visibleCount >= jobs.length

  const handleClick = () => {
    if (allShown) {
      setVisibleCount(PAGE_SIZE)
    } else {
      setVisibleCount((prev) => prev + PAGE_SIZE)
    }
  }

  return (
    <>
      <table className={style.careerTable} data-aos="fade-up">
        <thead>
          <tr>
            <th> <Image src="/assets/images/job-title.svg" width={32} height={32} alt='' /> Job title </th>
            <th> <Image src="/assets/images/location.svg" width={32} height={32} alt='' /> Location </th>
            <th> <Image src="/assets/images/experience.svg" width={32} height={32} alt='' /> Experience </th>
            <th> <Image src="/assets/images/education.svg" width={32} height={32} alt='' /> Education </th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {jobs.length === 0 && (
            <tr>
              <td colSpan={5}>No open positions at the moment.</td>
            </tr>
          )}

          {visibleJobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}<br/><span className={style.category}>{job.category}</span></td>
              <td>{job.location}</td>
              <td>{job.experience}</td>
              <td>{job.education}</td>
              <td> <Button link={`/careers/${job.slug}`} classname="orange_btn" text="Apply Now"/> </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={style.mobileCardList}>
        {jobs.length === 0 && <p>No open positions at the moment.</p>}

        {visibleJobs.map((job) => (
          <div key={job.id} className={style.mobileCard}>
            <div className={style.mobileCardHeader}>
              <p className={style.mobileCardTitle}>{job.title}</p>
              <span className={style.category}>{job.category}</span>
            </div>

            <div className={style.mobileCardRow}>
              <span className={style.mobileCardLabel}>
                <Image src="/assets/images/location.svg" width={20} height={20} alt="" /> Location
              </span>
              <span className={style.mobileCardValue}>{job.location}</span>
            </div>

            <div className={style.mobileCardRow}>
              <span className={style.mobileCardLabel}>
                <Image src="/assets/images/experience.svg" width={20} height={20} alt="" /> Experience
              </span>
              <span className={style.mobileCardValue}>{job.experience}</span>
            </div>

            <div className={style.mobileCardRow}>
              <span className={style.mobileCardLabel}>
                <Image src="/assets/images/education.svg" width={20} height={20} alt="" /> Education
              </span>
              <span className={style.mobileCardValue}>{job.education}</span>
            </div>

            <div className={style.mobileCardActions}>
              <Button link={`/careers/${job.slug}`} classname="orange_btn" text="Apply Now" />
            </div>
          </div>
        ))}
      </div>

      {jobs.length > PAGE_SIZE && (
        <LoadMoreButton label={allShown ? 'Show Less' : 'Load More'} onClick={handleClick} />
      )}
    </>
  )
}
