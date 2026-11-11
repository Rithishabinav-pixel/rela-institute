"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import style from './department.module.css'
import Image from 'next/image'
import DepartmentCard from '../components/UI/DepartmentCard'

const PAGE_SIZE = 12

export default function DepartmentListing({ departments }) {
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef(null)

  const filteredDepartments = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return departments
    return departments.filter((department) => department.name.toLowerCase().includes(term))
  }, [departments, search])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => {
          if (prev >= filteredDepartments.length) return prev
          return Math.min(prev + PAGE_SIZE, filteredDepartments.length)
        })
      }
    })

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [filteredDepartments.length])

  const visibleDepartments = filteredDepartments.slice(0, visibleCount)

  return (
      <>

<div className={`static_page`}>
<section className={style.topSection}>
  <div className={`container ${style.container}`}>
    <h1 className='common_heading'>Find a <span>Department</span></h1>
    {/* <div className={style.quickSearch_container}>
      <h2 className='orange_text'>Quick Search</h2>

      <div className={style.quickcategories}>
        <button className={department === '' ? style.active : ''} onClick={() => selectDepartment('')}>All</button>
{quickSearchDepartments.map((dept) => (
        <button
          key={dept.id}
          className={department === String(dept.id) ? style.active : ''}
          onClick={() => selectDepartment(dept.id)}
        >
          {dept.name}
        </button>
))}

      </div>
    </div> */}
  </div>
</section>

<section className={style.articlesGrid}>

  <div className={`container ${style.container}`}>

    <div className={style.doctorsListing}>

 <div className={style.actions}>

      <div className={`${style.action_button} ${style.search}`}>
<input
  type='text'
  placeholder='Search by Name'
  value={search}
  onChange={(event) => { setSearch(event.target.value); setVisibleCount(PAGE_SIZE) }}
/>
<button type='button'> <Image src="/assets/images/search-normal.svg" width={32} height={32} alt=''/> </button>
      </div>



    </div>

<div className={style.departmentCards}>
  {visibleDepartments.map((item,index)=>(
<DepartmentCard key={index} dept={item} cardStyle={`fourCard`}/>

  ))}
</div>

{filteredDepartments.length === 0 && <p>No departments found.</p>}

<div ref={sentinelRef}/>
</div>


</div>

</section>
</div>
    </>
  )
}
