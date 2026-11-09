"use client"

import React, { useEffect, useMemo, useState } from 'react'
import style from './testimonial.module.css'
import Image from 'next/image'
import Link from 'next/link'
import TestimonialCard from './TestimonialCard'

const testData = [
  {
    title:"1Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe",
    image:"/assets/images/usr.png"
  },
    {
       title:"2Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe",
    image:"/assets/images/usr.png"
  },
    {
       title:"3Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe",
    image:"/assets/images/usr.png"
  },
    
  {
    title:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe",
    image:"/assets/images/usr.png"
  },
    {
       title:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe",
    image:"/assets/images/usr.png"
  },
    {
       title:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe",
    image:"/assets/images/usr.png"
  },
    
]

export default function TestimonialClient() {


  const [activePopup,setActivePopup] = useState(null)



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
    <Link href="/testimonials-and-reviews" className={style.active}>Testimonials and Reviews</Link>
    <Link href="/patient-experience" >Patient Experience</Link>
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
  <TestimonialCard data={item} key={index} index={testData.indexOf(item)} setActivePopup={setActivePopup} cardStyle={`testimonial_grid`}/>
  ))}
</div>


</div>



</div>

</section>
</div>


{/* popup --------------------- */}

{activePopup !== null &&
    <div className={style.popup}>
      <div className={style.overlay} onClick={()=>setActivePopup(null)}></div>

      <div className={style.container}>

        <button  className={style.closeBtn} onClick={()=>setActivePopup(null)}> <Image src="/assets/images/close.svg" width={24} height={24} alt="Close" /> </button>

     
        <TestimonialCard data={testData[activePopup]}/>

      </div>
    </div>

}

    </>
  )
}
