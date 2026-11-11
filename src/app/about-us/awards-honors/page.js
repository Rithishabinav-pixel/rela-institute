"use client"

import React, { useState } from 'react'
import style from './awards.module.css'
import Image from 'next/image'
import Button from '@/app/components/UI/Button'

const awardsDatas = [
    {
        image:"/assets/images/award1.png",
        title:"Lifetime Achievement Award to Prof. Mohamed Rela",
        content:"Our Chairman, Prof. Mohamed Rela, the eminent Hepatopancreatobiliary Surgeon, was honoured with the Lifetime Achievement Award for his exemplary work in the field of Liver Transplantation. Dr. C. Vijayabaskar, Honourable Tamil Nadu Minister for Health & Family Welfare, graciously presented the award to Prof. Rela, which was collected by Dr. Gomathy Narasimhan at the Times Healthcare Achievers Awards."
    },
    {
        image:"/assets/images/award2.png",
    title:"Best Emerging Hospitals Award",
    content:"Rela Hospital  was also awarded the Prestigious Achiever Award in the Emerging Hospitals category at the Times Healthcare Achievers Awards."
},
{
        image:"/assets/images/award3.png",
    title:"Best Liver Transplant Unit (2018-2019)",
    content:"Rela Hospital was honoured with the Best Liver Transplant Unit by the Honourable Minister in appreciation of the excellent performance by Rela Hospital team in the field of Liver Transplant Surgery. The award was received by Dr. Gomathy Narasimhan and Dr. Dinesh Jothimani on behalf of Prof. Mohamed Rela and his team. The awards were presented during the Organ Donation Awareness Week Celebration organized by the Transplant Authority of Tamil Nadu on August 14th, 2019."
},
 {
        image:"/assets/images/award4.png",
    title:"Best Performing Live Liver Transplant Team (2019-2020)",
    content:"The liver transplant program at Dr. Rela Hospital, headed by Prof. Mohamed Rela has been awarded the Best Performing Live Liver Transplant Team by the Transplant Authority of Tamilnadu (TRANSTAN) on the occasion of 11th National Organ Donation day on Nov 27th, 2020. The award was received by Dr. Dinesh Jothimani, Director of Hepatology and Dr. Naresh Shanmugam, Director of Pediatric Hepatology on behalf of the team."
},
]

export default function page() {


    const [popup,setPopup] = useState(false);
    const [activePopup,setActivePopup] = useState(null)

  return (
    <>
    
     {/* hero section  */}
         <section className={`${style.bannerSection}`}>
        <div className={`${style.container} container`}>
            <div className={`top_heading ${style.top_heading} left`} data-aos="fade-up">
                <h1 className='white_text common_heading'>Achievement at <br className='desktop_break'/><span>Rela Hospital</span></h1>
                <p className='white_text'>Meet the leaders who set the direction for patient care at Rela Hospital. Their work spans clinical standards, specialist services and the day-to-day operations that support patients and their families.</p>
            </div>
        </div>
    </section>


    {/* awards section  */}
<section className={`common_section ${style.awards_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={`top_heading left ${style.top_heading}`}>
            <h2 className='common_heading'>Our Awards & Achievements</h2>
            <p>Explore each award, the person or team it honoured, and the achievement behind the recognition.</p>
        </div>

<div className={style.cards}>
    {awardsDatas.map((item,i)=>(
  <div className={style.card} key={i}>
        <div className={style.image}>
            <Image src={item.image} width={360} height={423} alt=''/>
        </div>
        <div className={style.content}>
            <h3>{item.title}</h3>
            <p>{item.content.length > 300 ? item.content.slice(0, 300) + "..." : item.content}</p>
            {item.content.length > 300 && 
            <button className={`orange_btn link_btn`} onClick={()=>{setActivePopup(i);setPopup(true)}} >Read more <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt=''/> </button>
            }
        </div>
    </div>
    ))}
  
</div>

    </div>
</section>


{popup && 
<div className={style.popup}>
    <div className={style.overlay} onClick={()=>setPopup(false)}></div>
    <div className={style.container}>
                <button className={style.closeBtn} onClick={()=>setPopup(false)}> <Image src="/assets/images/close.svg" width={24} height={24} alt="Close" /> </button>

        <div className={style.card}>
            
            <div className={style.image}>
                <Image src={awardsDatas[activePopup].image} width={360} height={423} alt=''/>
            </div>
              <div className={style.content}>
                    <h3>{awardsDatas[activePopup].title}</h3>
                    <p>{awardsDatas[activePopup].content}</p>
                </div>
        </div>
    </div>
</div>
}
    </>
  )
}
