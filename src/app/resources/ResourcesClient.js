"use client"

import React, { useEffect, useMemo, useState } from 'react'
import style from './resources.module.css'
import Image from 'next/image'
import ResourcesCard from './ResourcesCard'

const resourcesData = [
  {
    image:"/assets/images/resouces-sample.png",
    title:"Life After Transplant",
    link:"#"
  },
  {
    image:"/assets/images/resouces-sample.png",
    title:"Life After Transplant",
    link:"#"
  },
  {
    image:"/assets/images/resouces-sample.png",
    title:"Life After Transplant",
    link:"#"
  },
  {
    image:"/assets/images/resouces-sample.png",
    title:"Life After Transplant",
    link:"#"
  },
  {
    image:"/assets/images/resouces-sample.png",
    title:"Life After Transplant",
    link:"#"
  },
]

export default function ResourcesClient() {

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

  
  return (
      <>

<div className={`static_page`}>
<section className={style.topSection}>
  <div className={`container ${style.container}`}>
    <h1 className='common_heading'>Resource Centre</h1>
  </div>
</section>

<section className={style.resourcesGrid}>

  <div className={`container ${style.container}`}>

    <div className={style.resourcesListing}>

 <div className={style.actions}>

      <div className={`${style.action_button} ${style.dropdown}`}>
<select >
  <option value="">All Department</option>
</select>
      </div>

       <div className={`${style.action_button} ${style.sort}`}>
              <select >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="A-Z">A-Z</option>
              </select>
            </div>


    </div>


</div>


{/* cards  */}
<div className={style.resourcesCards}>
  {resourcesData.map((item,i)=>(
  <ResourcesCard key={i} resources={item} cardStyle={`resourcesGridCard`}/>
  ))}
</div>

</div>

</section>
</div>
    </>
  )
}
