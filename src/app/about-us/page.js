"use client"

import React, { useEffect, useState } from 'react'
import style from './about.module.css'
import Button from '../components/UI/Button'
import Image from 'next/image'
import AnimatedCounter from "@/app/components/UI/AnimatedCounter";
import useSectionInView from "@/app/components/UI/useSectionInView";
import AboutAnimation from '../components/AboutAnimation/AboutAnimation'

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination,Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import DoctorCard from '../components/UI/DoctorCard'


const leadersData = [
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


const partnerData = [
    {
        icon:"/assets/images/biher.png",
        title:"Bharath Institute of Higher Education and Research"
    },
    {
        icon:"/assets/images/sbmc.png",
        title:"Sree Balaji Medical College and Hospital"
    },
    {
        icon:"/assets/images/slni.png",
        title:"Sri Lakshmi Narayana Institute of Medical Sciences"
    },
    {
        icon:"/assets/images/bist.png",
        title:"Bharath Institute of Science and Technology"
    },
]


const awardData = [
    {
        title:"Lifetime Achievement Award to Prof. Mohamed Rela",
        year:"2025"
    },
     {
        title:"Best Emerging Hospitals Award",
        year:"2025"
    },
     {
        title:"Best Liver Transplant Unit",
        year:"2025"
    },
     {
        title:"Best Performing Live Liver Transplant Team",
        year:"2019-2020"
    },
]



export default function page() {

    const [mobile,setMobile] = useState(false);
    const [laptop,setLaptop] = useState(false);

      const [strictMobile,setStrictMobile] = useState(false);
      const [advancedSectionRef, countersInView] = useSectionInView();
    
      useEffect(()=>{
    
        const checkDevice = () =>{
        setMobile(window.innerWidth<1200);
        setStrictMobile(window.innerWidth<767);
        setLaptop(window.innerWidth<1600)
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
                <h1 className='white_text common_heading'>About <br className='desktop_break'/><span>Rela Hospital</span></h1>
                <p className='white_text'>Rela Hospital brings together clinical expertise, advanced technology and compassionate care to deliver comprehensive healthcare for patients from India and around the world.</p>

            </div>
        </div>
    </section>


    {/* Transforming section  */}
<section className={`common_section ${style.transform_section}`}>
    <div className={`container section_container ${style.container} `}>
        <div className={style.image} data-aos="fade-right">
            <Image src="/assets/images/advance-healthcare.png" width={827} height={714} alt=''/>
        </div>
        <div className={style.content} data-aos="fade-left">
            <h2 className="common_heading">Advancing Healthcare.<br/><span>Transforming Lives.</span></h2>
            <p>Rela Hospital is a quaternary care multispeciality hospital committed to delivering advanced, patient-focused healthcare across a wide range of medical specialities. Established with a strong focus on clinical excellence, the hospital brings together experienced medical professionals, advanced technology and modern infrastructure to manage both routine and highly complex healthcare needs. With expertise spanning critical care, organ transplantation, surgery, diagnostics and comprehensive medical services, Rela Hospital is designed to provide coordinated care under one roof. Guided by a commitment to compassion, innovation, ethics and continuous learning, the hospital continues to serve patients from India and across the world with a focus on better outcomes, greater accessibility and a more reassuring healthcare experience.</p>
        </div>
    </div>
</section>



    {/* advance section  */}

<section className={`common_section gray_bg ${style.advancedSection}`} ref={advancedSectionRef}>

<div className={`section_container column ${style.section_container}`}>
 <div className={`container ${style.container}`}>

  <div className={style.left} data-aos="fade-right">
      <div className={`top_heading column ${style.top_heading}`}>
<h2 className="common_heading">At the Heart of Everything We Do</h2>
<Button link="/" classname="orange_btn" text="Discover Rela Hospital"/>
      </div>
      {!mobile &&
      <p>Rela Hospital brings together highly qualified medical professionals, advanced infrastructure and modern technology to provide comprehensive healthcare across more than 50 disciplines. Our focus is on clinical excellence, innovation and compassionate care.</p>
   }
      </div>

<div className={style.center} data-aos="zoom-in" data-aos-delay="500">
<div className="" data-aos="zoom-in" data-aos-delay="500">
<h3 className="white_text"><AnimatedCounter target={32} start={countersInView} /><span>+</span></h3>
<p className="white_text">Years of Clinical Expertise</p>
</div>
</div>

<div className={style.right}>
  <div className={style.counter} data-aos="zoom-in">
    <h3 className="orange_text"><AnimatedCounter target={500} start={countersInView} /><span>+</span></h3>
<p className="">Specialist Doctors</p>
  </div>

   <div className={style.counter} data-aos="zoom-in" >
    <h3 className="orange_text"><AnimatedCounter target={6000} start={countersInView} /><span>+</span></h3>
<p className="">Liver Transplants</p>
  </div>

   <div className={style.counter} data-aos="zoom-in">
    <h3 className="orange_text"><AnimatedCounter target={98} start={countersInView} /><span>%</span></h3>
<p className="">Patient Satisfaction</p>
  </div>
</div>


  {mobile &&
      <p data-aos="fade-up">Rela Hospital brings together highly qualified medical professionals, advanced infrastructure and modern technology to provide comprehensive healthcare across more than 50 disciplines. Our focus is on clinical excellence, innovation and compassionate care.</p>
   }

    </div>



  </div>
</section>


{/* mission/vision */}
<section className={`common_section ${style.misvis_section}`}>
    <div className={`container section_container column ${style.container}`}>
<div className='top_heading' data-aos="fade-up">
    <h2 className='common_heading'>A shared purpose that shapes how innovate and grow.</h2>
</div>

<div className={style.boxContainer}>
 {!mobile &&  <Image data-aos="fade-up" data-aos-delay="500" className={style.doctor} src="/assets/images/doctor-women.png" width={443} height={504} alt=''/> }  
    <div className={style.left} data-aos="fade-right">
        <div className={style.motto}>
            <div>
            <h3 className='common_heading'><span>Motto</span></h3>
            <p className='white_text'>Transforming Healthcare with Compassion And Innovation</p>
            </div>
        </div>
         <div className={style.vision}>
            <div>
            <h3 className='common_heading'><span className='black_text'>Vision</span></h3>
            <p className=''>Rela Hospital aims to bring International standards to compassionate healthcare. We envision a patient-centric system dedicated to transforming lives through excellent clinical quality, which is accessible with unmatched physician and employee commitment.</p>
        </div>
        </div>
    </div>

    <div className={style.right} data-aos="fade-left">
        <div>
            <h3 className='common_heading'><span className='black_text'>Mission</span></h3>
            <ul className='common_list'>
                <li>To cure disease and preserve health by providing comprehensive, ethical and affordable healthcare, delivered with kindness.</li>
                <li>To bring to the patient highly qualified medical professionals who are pioneers in their respective fields in our quaternary care institute.</li>
                <li>To provide primary, secondary & tertiary care to all sections of the society and international patients.</li>
                <li>To create a supportive team by helping drive innovation and focusing on positive outcomes.</li>
                <li>To foster growth through academics and research.</li>
            </ul>
       </div>
    </div>
</div>

    </div>
</section>


{/* spirit section  */}
<section className={`common_section gray_bg ${style.sprit_section}`}>
    <div className='section_container column'>
    <div className={`container  ${style.container}`}>
        <div className={`top_heading ${style.top_heading} center`} data-aos="fade-up">
            <h2 className='common_heading'>The Values and Beliefs That Define the Spirit of RELA</h2>
        </div>
        </div>

<div className={style.animatesContainer}>
    <AboutAnimation/>
    {mobile && 
    <Image className={style.mobileImg} src="/assets/images/rela-text-mobile.svg" width={1916} height={598} alt=''/>
    }
</div>


    </div>
</section>



{/* better care  */}

<section className={`common_section ${style.better_section}`}>
    <div className={`container section_container ${style.container}`}>
        <div className={style.content} data-aos="fade-right">
            <h2 className='common_heading'>A Vision That Started with <span>Better Care</span></h2>
            <div className={style.text}>
                <p>Rela Hospital was established under the able guidance of Prof. Dr. Mohamed Rela, who is a pioneer in liver transplantation with over 28 years of experience. He started the Institute of Liver Disease and Transplantation at Gleneagles Global Health City in 2009. It quickly became the largest liver transplant program in India. Since its inception, the program has performed more than 1500 Liver Transplantation Surgeries. He has moved from Gleneagles Global group of hospitals and started Rela Hospital.</p>
                <p>Dr. Rela's vision is to address health-care issues of local population with facilities of international standards to provide cost-effective high-end treatments like multi-organ transplantation. He has performed over 4000 liver transplant surgeries. He is one of the most accomplished surgeons in the world in this field with over 400 scientific articles and papers on liver transplantation, complex hepatobiliary pancreatic surgery and more.</p>
                <p>To elaborate, in December 1997, a team led by him performed a successful liver transplantation on a 5-day-old girl, which registered his name in the Guinness Book of World Records in 2000. The girl is now is leading a bright and enriched 20 years of life studying law. He has pioneered the technique of split liver transplantation where one cadaver liver is split into two and transplanted into two individuals. He is also one of the most innovative paediatric surgeons alive as per an article published by “Top Master’s in Healthcare Administration”.</p>
            </div>
        </div>


<div className={style.image} data-aos="fade-left">
    <Image src="/assets/images/mohd-rela-circle.png" width={653} height={718} alt=''/>
</div>

    </div>
</section>


{/* leadership section  */}

<section className={`common_section gray_bg ${style.leader_section}`}>
    <div className={`container section_container column ${style.container}`}>
<div className={`top_heading ${style.top_heading} center`} data-aos="fade-up">
    <h2 className='common_heading'>Leadership That Continues to Shape the Future of Rela</h2>
    <p>Whether you are an experienced healthcare professional or building your career in healthcare, explore opportunities across Rela.</p>
</div>

      <div className="sliderContainer" data-aos="fade-up">
        <Swiper
          modules={[Navigation,Pagination]}
          spaceBetween={20}
          speed={800}
          slidesPerView={4}
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
slidesPerView: 1,
            spaceBetween: 20,
            },
            650:{
slidesPerView: 2,
            },
          1100: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1600: {
            slidesPerView: 4,
          },

        }}
        >
          {leadersData.map((slide, i) => (
            <SwiperSlide key={i}>
              
             <DoctorCard doctor={slide}/>
          
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
</section>


{/* behind rela */}

<section className={`${style.behind_section}`}>
    <div className={`container section_container ${style.container}`}>
        <div className={style.content} data-aos="fade-right">
            <div className='top_heading left'>
                <h2 className='common_heading'>The Guiding Force Behind Rela</h2>
                <div className={style.text}>
                    <p>Rela Hospital was established under the able guidance of Prof. Dr. Mohamed Rela, who is a pioneer in liver transplantation with over 28 years of experience. He started the Institute of Liver Disease and Transplantation at Gleneagles Global Health City in 2009. It quickly became the largest liver transplant program in India. Since its inception, the program has performed more than 1500 Liver Transplantation Surgeries. He has moved from Gleneagles Global group of hospitals and started Rela Hospital.</p>
                    <p>Dr. Rela's vision is to address health-care issues of local population with facilities of international standards to provide cost-effective high-end treatments like multi-organ transplantation. He has performed over 4000 liver transplant surgeries. He is one of the most accomplished surgeons in the world in this field with over 400 scientific articles and papers on liver transplantation, complex hepatobiliary pancreatic surgery and more.</p>
                    <p>To elaborate, in December 1997, a team led by him performed a successful liver transplantation on a 5-day-old girl, which registered his name in the Guinness Book of World Records in 2000. The girl is now is leading a bright and enriched 20 years of life studying law. He has pioneered the technique of split liver transplantation where one cadaver liver is split into two and transplanted into two individuals. He is also one of the most innovative paediatric surgeons alive as per an article published by “Top Master’s in Healthcare Administration”.</p>
                </div>
            </div>
        </div>
        {laptop && 
        <div className={style.image} data-aos="fade-left">
            <Image src="/assets/images/behind-mobile.png" width={945} height={829} alt=''/>
        </div>
        }
    </div>
</section>


{/* partner section  */}
<section className={`common_section gray_bg ${style.partner_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={`top_heading center ${style.top_heading}`} data-aos="fade-up">
            <h2 className='common_heading'>Academic Partnerships That Support Learning and Research</h2>
        </div>

<div className={style.cards} data-aos="fade-up">
    {partnerData.map((item,i)=>(
        <div className={style.card} key={i}>
            <Image src={item.icon} width={120} height={120} alt=''/>
            <h3>{item.title}</h3>
            <p>Academic affiliation.</p>
        </div>
    ))}
</div>

    </div>
</section>



{/* Recognitions section  */}
<section className={`common_section gray_bg no_padding_top ${style.recognition_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={`top_heading center ${style.top_heading}`} data-aos="fade-up">
            <h2 className='common_heading'>Recognitions That Reflect Our Commitment</h2>
            <Button classname="orange_btn" link="/about-us/awards-honors" text="View more awards"/>
        </div>

<div className={style.cards} data-aos="fade-up">
    {awardData.map((item,i)=>(
        <div className={style.card} key={i}>
            <Image src='/assets/images/award-icon.svg' width={160} height={160} alt=''/>
            <h3>{item.title}</h3>
            <p>{item.year}</p>
        </div>
    ))}
</div>

    </div>
</section>


    </>
  )
}
