"use client"

import React, { useEffect, useState } from 'react'
import style from './leader.module.css'
import Image from 'next/image'
import Button from '../components/UI/Button'
import DoctorCard from '../components/UI/DoctorCard'

const faq = [
    {
    title:"How can I book an appointment at Rela Hospital?",
    content:"You can book an appointment online or contact our patient-care team for assistance in finding the right specialist."
    },
    {
    title:"How do I find the right doctor?",
    content:"You can book an appointment online or contact our patient-care team for assistance in finding the right specialist."
    },
    {
    title:"How can I contact Rela in an emergency?",
    content:"You can book an appointment online or contact our patient-care team for assistance in finding the right specialist."
    },
    {
    title:"Can international patients consult Rela doctors remotely?",
    content:"You can book an appointment online or contact our patient-care team for assistance in finding the right specialist."
    },
    {
    title:"How do I find the nearest Rela facility?",
    content:"You can book an appointment online or contact our patient-care team for assistance in finding the right specialist."
    }
]


const doctorsData = [
    {
        image:"/assets/images/rela-l.png",
        name:"Prof. Mohamed Rela",
        speciality:"Liver Transplant Surgery",
        position:"Chairman & Chief Surgeon",
        link:"#"
    },
     {
        image:"/assets/images/gauthaman-l.png",
        name:"Dr. DC Gauthaman",
        speciality:"MBBS, MS (Ortho), MBA",
        position:"Medical Director",
        link:"#"
    },
     {
        image:"/assets/images/gomathy-l.png",
        name:"Dr. Gomathy Narasimhan",
        speciality:"MBBS, MS, ASTS Fellowship (USA), GMHE (IIMB)",
        position:"Chairman, Medical Advisory Board",
        link:"#"
    },
     {
        image:"/assets/images/farouk-l.png",
        name:"Mr. Mohammed Farouk",
        speciality:"",
        position:"Chief Operating Officer",
        link:"#"
    },
]

export default function page() {

    const [mobile,setMobile] = useState(false);
     const [activeFaq,setActiveFaq] = useState(0);
        
               useEffect(()=>{
             
                 const checkDevice = () =>{
                 setMobile(window.innerWidth<1200);
                 }
             
                 checkDevice();
                 window.addEventListener("resize",checkDevice);
             
                 return(()=>{
                 window.removeEventListener("resize",checkDevice);
                 })
             
             
               },[])


  return (
   <>
   
    {/* hero section  */}
         <section className={`${style.bannerSection}`}>
        <div className={`${style.container} container`}>
            <div className={`top_heading ${style.top_heading} left`} data-aos="fade-up">
                <h1 className='white_text common_heading'>Leadership at <br className='desktop_break'/><span>Rela Hospital</span></h1>
                <p className='white_text'>Meet the leaders who set the direction for patient care at Rela Hospital. Their work spans clinical standards, specialist services and the day-to-day operations that support patients and their families.</p>
            </div>
        </div>
    </section>


    <div className={`${style.about_section} common_section no_padding_bottom ${style.rela}`}>
        <div className={`container section_container ${style.container}`}>
            <div className={style.image}>
                <Image src="/assets/images/md-rela.png" width={688} height={749} alt=''/>
            </div>
            <div className={`${style.content} top_heading left`}>
                <div className={`${style.details} ${style.text}`}>
                    <h2 className='common_heading'>Prof. Mohamed Rela </h2>
                    <p>MS, FRCS, DSc</p>
                    <p className='orange_text'>Chairman and Managing Director, Dr. Rela Institute & Medical Centre</p>
                </div>
                <div className={style.text}>
                    <p>Prof. Mohamed Rela is a pioneering figure in liver transplantation with over three decades of experience. He started India’s largest liver transplant program in 2009, and has been performing over 300 liver transplants annually since then. In 2018, he founded Rela Hospital to provide high-quality, affordable medical care, including advanced multi-organ transplantation.</p>
                </div>
                <div className={style.buttons}>
                    <Button classname="orange_btn" link="/prof-mohamed-rela-appointment" text={`View Profile`}/>
                    <Button classname="white_btn orange_stroke" link="https://appointments.relainstitute.com:8080/" text={`Book an Appointment`}/>

                </div>
            </div>
        </div>
    </div>


      <div className={`${style.about_section} gray_bg common_section no_padding_bottom ${style.gomathy}`}>
        <div className={`container section_container ${style.container}`}>
         
            <div className={`${style.content} top_heading left`}>
                <div className={`${style.details} ${style.text}`}>
                    <h2 className='common_heading'>Prof. Mohamed Rela </h2>
                    <p>MS, FRCS, DSc</p>
                    <p className='orange_text'>Chairman and Managing Director, Dr. Rela Institute & Medical Centre</p>
                </div>
                <div className={style.text}>
                    <p>Lorem ipsum dolor sit amet consectetur. Mauris fermentum consectetur dictum felis dolor imperdiet libero amet. Eget egestas rhoncus nec dignissim at ipsum id nulla. Pellentesque bibendum justo aliquam metus. Pretium gravida lorem morbi viverra pretium dis ultrices. Egestas facilisi potenti ullamcorper feugiat at. Amet habitant et dignissim malesuada mi ut imperdiet arcu dolor.</p>
                    <p>Pellentesque elementum placerat varius convallis. Vulputate magna massa suspendisse tristique hac orci pellentesque cras. Quis nisi consectetur cursus risus dignissim quisque odio semper. Commodo nulla volutpat commodo enim pharetra quis felis nunc facilisis. Nibh dignissim lacus non potenti. Aliquet habitant praesent id aliquam tempor in egestas pulvinar libero.</p>
                </div>
                <div className={style.buttons}>
                    <Button classname="orange_btn" link="#" text={`View Profile`}/>
                    <Button classname="white_btn orange_stroke" link="https://appointments.relainstitute.com:8080/" text={`Book an Appointment`}/>

                </div>
            </div>
               <div className={style.image}>
                <Image src="/assets/images/gomathy.png" width={618} height={765} alt=''/>
            </div>
        </div>
    </div>

    {/* doctors  */}
   <section className={`common_section ${style.doctors_section}`}>
    <div className={`container ${style.container}`}>
        <div className={style.doctorsCards}>
            {doctorsData.map((item,i)=>(
            <DoctorCard key={i} doctor={item} type="popup" cardStyle="doctorGridCard_4"/>
            ))}
        </div>
    </div>
   </section>

<section className={`common_section gray_bg  ${style.faq_section}`}>
<div className={`container ${style.container}`}>
    <div className={style.title}  data-aos="fade-right">
        <h2 className='common_heading'>Common Questions About Liver Transplantation</h2>
    </div>
    <div className={style.faq} data-aos="fade-left">
        {faq.map((item,i)=>(
 <div className={`${style.card} ${activeFaq===i?style.active:""}`} key={i}>
            <div className={style.head} onClick={()=>{setActiveFaq((prev)=>prev===i?null:i)}}>
                <h3>{item.title}</h3>
                <button> <Image src="/assets/images/faq-arrow.svg" width={32} height={32} alt=''/> </button>
            </div>
            <div className={style.body}>
              <div>
                {item.content}
                </div>
            </div>
        </div>
        ))}
       
    </div>
</div>
</section>
   
   </>
  )
}
