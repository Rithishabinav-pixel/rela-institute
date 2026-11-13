"use client"
import React, { useEffect, useState } from 'react'
import style from './evening.module.css'
import Button from '../components/UI/Button'
import Image from 'next/image'
import Link from 'next/link'

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination,Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import DoctorCard from '../components/UI/DoctorCard'


const coeData = [
    {
        icon:"/assets/images/sample-l.svg",
        title:"General Paediatrics",
        link:"/"
    },
    {
        icon:"/assets/images/sample-l.svg",
        title:"Cardiology",
        link:"/"
    },
    {
        icon:"/assets/images/sample-l.svg",
        title:"Internal Medicine",
        link:"/"
    },
    {
        icon:"/assets/images/sample-l.svg",
        title:"General Surgery",
        link:"/"
    },
    {
        icon:"/assets/images/sample-l.svg",
        title:"Obstetrics and Gynaecology",
        link:"/"
    },
    {
        icon:"/assets/images/sample-l.svg",
        title:"Psychiatry",
        link:"/"
    },
    {
        icon:"/assets/images/sample-l.svg",
        title:"Neonatology",
        link:"/"
    },
    {
        icon:"/assets/images/sample-l.svg",
        title:"Paediatric Neurology",
        link:"/"
    },
    {
        icon:"/assets/images/sample-l.svg",
        title:"Pulmonology",
        link:"/"
    },
    {
        icon:"/assets/images/sample-l.svg",
        title:"Urology",
        link:"/"
    },
];


const decisionsData = [
    {
        icon:"/assets/images/patients.svg",
        title:"Patients and Their Representatives",
        text:"Patients can request a second opinion independently or through a guardian or authorised representative, at their own expense."
    },
    {
        icon:"/assets/images/doctors.svg",
        title:"Doctors",
        text:"With the patient's prior approval, their current doctor can request a second opinion on their behalf, at the patient's expense."
    },
    {
        icon:"/assets/images/hic.svg",
        title:"Health Insurance Companies",
        text:"A health insurance company may request a second opinion, with the expense covered by the insurance company."
    },
    {
        icon:"/assets/images/emp.svg",
        title:"Employers",
        text:"Employers may request a second opinion to verify medical certificates, recommended treatments or surgeries, and work-related injuries. "
    },
]

const doctorsData = [
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/doctors"
  },
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/doctors"
  },
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/doctors"
  },
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/doctors"
  },
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/doctors"
  },
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/doctors"
  },
  {
    image:"/assets/images/doc-sample-img.png",
    name:"Prof. Mohamed Rela",
    speciality:"Liver Transplant Surgery",
    position:"Chairman & Chief Surgeon",
    link:"/doctors"
  },
];



export default function page() {

      const [mobile,setMobile] = useState(false);
  

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
                <h1 className='white_text common_heading'>Specialist Care <br className='desktop_break'/><span>That Fits Your Day</span></h1>
                <p className='white_text'>Make time for your health after work or school. Rela Hospital’s Evening Clinic offers specialist consultations for you and your family, at a time that works around your commitments.</p>
            </div>
        </div>
    </section>

<section className={`common_section ${style.excellenceSection}`}>
  <div className={`container ${style.container}`}>

<div className={`section_container ${style.section_container}`}>
    <div className={style.left} data-aos="fade-right">
      <div className={`top_heading ${style.top_heading}`}>
<h2 className="common_heading">Specialist Care for Every Stage of Life</h2>
<p>From children’s health to adult and women’s healthcare, explore the specialities available at our Evening Clinic and find the care you need.</p>
      </div>
    </div>

    <div className={style.right} data-aos="fade-left">

      {coeData.map((item,i)=>(
       <Link href={item.link} key={i} className={style.card}>
          <div className={style.icon}>
          <Image src={item.icon} className={style.icon} width={40} height={40} alt=""/>
          </div>
          <h3 className={style.title}>{item.title}</h3>
          <button> <Image src="/assets/images/dept_arrow.svg" width={24} height={24} alt=""/> </button>
        </Link>
      ))}

    </div>
</div>
  </div>
</section>

  {/* decisions section  */}
<section className={`common_section dark_bg ${style.decision_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={`top_heading ${style.top_heading} center`} data-aos="fade-up">
            <h2 className='common_heading white_text'>The Convenience You Need. The Care You Trust.</h2>
        </div>
        <div className={style.cards} data-aos="fade-up">
            {decisionsData.map((item,index)=>(
            <div className={style.card} key={index}>
                <Image src={item.icon} width={80} height={80} alt=''/>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
            </div>

            ))}
        </div>
    </div>
</section>

<section className={`common_section ${style.doctorSection}`}>

<div className={`section_container column ${style.section_container}`}>
 <div className={`container ${style.container}`}>
      <div className={`top_heading split ${style.top_heading}`} data-aos="fade-right">
<h2 className="common_heading">Advanced Medical Care In Trusted Hands</h2>

<Button link="/" classname="orange_btn" text="See All Doctors" data-aos="fade-left"/>
      </div>
    </div>

    <div className="padding_left_only" data-aos="fade-up">
      <div className="sliderContainer">
        <Swiper
          modules={[Navigation,Pagination]}
          spaceBetween={30}
          speed={800}
          slidesPerView={4.5}
          navigation={{
            prevEl: ".prev_nav",
            nextEl: ".next_nav",
          }}
          pagination={{
          type: 'fraction',
          el: '.doct_fraction_pagination',
        }}
          className=''
          loop={true}
          breakpoints={{
            0:{
slidesPerView: 1.2,
            spaceBetween: 20,
            },
            500:{
slidesPerView: 1.8,
            },
          800: {
            slidesPerView: 2.5,
          },
          1100: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
           1366: {
            slidesPerView: 3.5,
          },
          1600: {
            slidesPerView: 4,
          },
            1800: {
            slidesPerView: 4.5,
          },

        }}
        >
          {doctorsData.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className={`${style.slide}`}>
             <DoctorCard doctor={slide}/>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

<div className="slider_nav_container center orange">
        <button className=" prev_nav slider_nav " aria-label="Previous slide">
          <Image
            src="/assets/images/slider-prev-arrow.svg"
            width={32}
            height={32}
            alt=""
          />
        </button>
      <div className="fraction_pagination doct_fraction_pagination"/>

        <button className="next_nav slider_nav" aria-label="Next slide">
          <Image
            src="/assets/images/slider-next-arrow.svg"
            width={32}
            height={32}
            alt=""
          />
        </button>
        </div>
        </div>


    </div>


  </div>
</section>

    {/* about section  */}
   <section className={`common_section gray_bg ${style.about_section}`}>
    <div className={`container section_container ${style.container}`}>
        <div className={style.image} data-aos="fade-right">
            <Image src="/assets/images/ec-about.png" width={695} height={522} alt=''/>
        </div>
        <div className={`${style.content} top_heading left`} data-aos="fade-left">
<h2 className='common_heading'>Expert Care, Beyond Your Busy Day</h2>
<div className={style.text}>
    <p>At Rela Hospital, we know that life doesn’t pause for health concerns, and getting care during regular hours isn’t always possible.</p>
    <p>Maalai Maruthuvam, our Evening Clinics initiative, offers a flexible and accessible solution. Operating from Monday to Saturday, 5:30 PM to 8:30 PM, the clinic brings together a team of experienced specialists across multiple departments—all under one roof, in a patient-friendly environment.</p>
    <p>Whether it’s a routine consultation, follow-up, or first-time evaluation, our evening clinics are designed to ensure you receive timely, expert care without disrupting your day.</p>
    <Button classname="orange_btn" link="/second-opinion" text="Get a Second Opinion"/>
    </div>
        </div>
    </div>
   </section>




   </>
  )
}
