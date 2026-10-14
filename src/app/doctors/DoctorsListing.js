"use client"

import React, { useEffect, useMemo, useState } from 'react'
import style from './doctor.module.css'
import Image from 'next/image'
import DoctorCard from '../components/UI/DoctorCard'
import DoctorForm from '../components/DoctorForm/DoctorForm'

export default function DoctorsListing({ doctors, departments, quickSearchDepartments }) {

 const [mobile,setMobile] = useState(false);
 const [search, setSearch] = useState('');
 const [department, setDepartment] = useState('');

   useEffect(()=>{

          const checkDevice = () =>{
              setMobile(window.innerWidth<1200)
          }

          checkDevice();

          window.addEventListener("resize",checkDevice);

          return(()=>{
              window.removeEventListener("resize",checkDevice)
      })

      },[])

  const selectDepartment = (id) => {
    setDepartment(id === '' ? '' : String(id))
  }

  const filteredDoctors = useMemo(() => {
    const term = search.trim().toLowerCase()

    return doctors
      .filter((doctor) => !term || doctor.name.toLowerCase().includes(term))
      .filter((doctor) => !department || doctor.departments.some((d) => String(d.departmentId) === department))
      .map((doctor) => ({
        image: doctor.image,
        name: doctor.name,
        speciality: doctor.speciality?.name ?? '',
        position: doctor.position,
        link: `/doctors/${doctor.slug}`,
      }))
  }, [doctors, search, department])

  return (
      <>

<div className={`static_page`}>
<section className={style.topSection}>
  <div className={`container ${style.container}`}>
    <h1 className='common_heading'>Find a <span>Doctor</span></h1>
    <div className={style.quickSearch_container}>
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
    </div>
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
  onChange={(event) => setSearch(event.target.value)}
/>
<button type='button'> <Image src="/assets/images/search-normal.svg" width={32} height={32} alt=''/> </button>
      </div>

      <div className={`${style.action_button} ${style.dropdown}`}>
<select value={department} onChange={(event) => setDepartment(event.target.value)}>
  <option value="">All Department</option>
{departments.map((dept) => (
  <option key={dept.id} value={dept.id}>{dept.name}</option>
))}
</select>
      </div>

       <div className={`${style.action_button} ${style.dropdown}`}>
<select>
  <option disabled value="">Branch</option>
  <option   value="Branch">Branch</option>
  <option   value="Branch">Branch</option>
  <option   value="Branch">Branch</option>

</select>
      </div>

    </div>

<div className={style.doctorsCards}>
{filteredDoctors.map((doctor,i)=>(
<DoctorCard key={i} doctor={doctor} cardStyle={'doctorGridCard'}/>

))}
</div>
</div>

{/* form  */}
{!mobile &&
<div className={style.form}>
  <DoctorForm/>
</div>
}


</div>

</section>
</div>
    </>
  )
}
