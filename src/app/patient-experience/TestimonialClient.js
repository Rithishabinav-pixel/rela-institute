"use client"

import React, { useEffect, useMemo, useState } from 'react'
import style from './testimonial.module.css'
import Image from 'next/image'
import Link from 'next/link'
import TestimonialCard from './TestimonialCard'
import Popup from './Popup'

const testData = [
  {
    featureImage:"/assets/images/test-sample-feature.png",
    name:"Mr. Jafar Husain",
    videoLink:`<iframe width="560" height="315" src="https://www.youtube.com/embed/XYNztii436w?si=VUcFFFadu4bPgguQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
  },

   {
    featureImage:"/assets/images/test-sample-feature.png",
    name:"Mr. Jafar Husain",
    videoLink:`<iframe width="560" height="315" src="https://www.youtube.com/embed/l7t2ZqFTBio?si=znz81wBZMYIhWy27" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
  },
   

   {
    featureImage:"/assets/images/test-sample-feature.png",
    name:"Mr. Jafar Husain",
    videoLink:`<iframe width="560" height="315" src="https://www.youtube.com/embed/4aqrB0cpK-Q?si=nlISdOHyG4GefU33" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
  },
 {
    featureImage:"/assets/images/test-sample-feature.png",
    name:"Mr. Jafar Husain",
    videoLink:`<iframe width="560" height="315" src="https://www.youtube.com/embed/XYNztii436w?si=VUcFFFadu4bPgguQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
  },

   {
    featureImage:"/assets/images/test-sample-feature.png",
    name:"Mr. Jafar Husain",
    videoLink:`<iframe width="560" height="315" src="https://www.youtube.com/embed/l7t2ZqFTBio?si=znz81wBZMYIhWy27" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
  },
   

   {
    featureImage:"/assets/images/test-sample-feature.png",
    name:"Mr. Jafar Husain",
    videoLink:`<iframe width="560" height="315" src="https://www.youtube.com/embed/4aqrB0cpK-Q?si=nlISdOHyG4GefU33" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
  },
   
   

]

export default function TestimonialClient() {

 const [mobile,setMobile] = useState(false);
 const [activeVideo,setActiveVideo] = useState(0);
 const [popup,setPopup] = useState(false)

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
      <h1 className='common_heading'>Real Stories. <span>Real Care.</span></h1>
    <div className={style.quickSearch_container}>
      <h2 className='orange_text'>Quick Search</h2>

      <div className={style.quickcategories}>
        <button>All</button>

      </div>
    </div>
  </div>
</section>

<section className={style.articlesGrid}>

  <div className={`container ${style.container}`}>

    <div className={style.doctorsListing}>

 <div className={style.actions}>

  <div className={`${style.action_button} ${style.tabs}`}>
    <Link href="/testimonials-and-reviews" >Testimonials and Reviews</Link>
    <Link href="/patient-experience" className={style.active}>Patient Experience</Link>
  </div>

      <div className={`${style.action_button} ${style.search}`}>
<input
  type='text'
  placeholder='Search by Name'
  value=''
  onChange={()=>{}}
  
/>
<button type='button'> <Image src="/assets/images/search-normal.svg" width={32} height={32} alt=''/> </button>
      </div>

 <div className={`${style.action_button} ${style.sort}`}>
              <select >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="A-Z">A-Z</option>
              </select>
            </div>


    </div>

<div className={style.testimonialCards}>
  {testData.map((item,index)=>(
  <TestimonialCard data={item} key={index} activeVideo={index} setPopup={setPopup} setActiveVideo={setActiveVideo} cardStyle={`testimonial_grid`}/>
  ))}
</div>


</div>



</div>

</section>
</div>

{popup && 
<Popup video={testData[activeVideo].videoLink}  activeVideo={activeVideo} setPopup={setPopup} setActiveVideo={setActiveVideo} length={testData.length}/>
}
    </>
  )
}
