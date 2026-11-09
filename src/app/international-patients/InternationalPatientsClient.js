"use client"
import React, { useEffect, useState } from 'react'
import style from "./international.module.css"
import Button from '../components/UI/Button'
import Image from 'next/image'
import Link from 'next/link';
import AnimatedCounter from '../components/UI/AnimatedCounter'
import useSectionInView from '../components/UI/useSectionInView'

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination,Navigation, Mousewheel, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import DepartmentCard from '../components/UI/DepartmentCard'
import TestimonialSection from '../components/TestimonialSection/TestimonialSection'

const stats = [
    {
    icon:"/assets/images/medical-opinion.svg",
    title:"Medical Opinion",
    link:"/"
  },
  {
    icon:"/assets/images/cost-estimation.svg",
    title:"Cost Estimation",
    link:"/"
  },
  {
    icon:"/assets/images/doctor.svg",
    title:"Find a Doctor",
    link:"/"
  },
    {
    icon:"/assets/images/visa.svg",
    title:"Visa & Travel",
    link:"/"
  },
    {
    icon:"/assets/images/stay.svg",
    title:"Assistance for Stay",
    link:"/"
  },
    {
    icon:"/assets/images/la.svg",
    title:"Language Assistance",
    link:"/"
  },


]

const expertiseCards = [
    {
        icon:"/assets/images/multispeciality-expertise.svg",
        title:"Multispeciality Expertise",
        content:"Access specialists across a wide range of medical disciplines under one healthcare ecosystem."
    },
    {
        icon:"/assets/images/advanced-infrastructure.svg",
        title:"Advanced Infrastructure",
        content:"Modern operating suites, diagnostic capabilities and critical-care infrastructure support complex treatment."
    },
    {
        icon:"/assets/images/dedicated-support.svg",
        title:"Dedicated Support",
        content:"Our international patient team helps coordinate the practical aspects of your healthcare journey."
    },
    {
        icon:"/assets/images/personalised-care.svg",
        title:"Personalised Care",
        content:"Your medical needs, treatment plan and circumstances are considered throughout the care journey."
    },
]

const journeyCards = [
    {
        title:"Share Your Medical Information",
        content:"Provide your medical reports and relevant healthcare details."
    },
    {
        title:"Connect With the Right Specialist",
        content:"Our team helps match your needs with the appropriate doctor and service."
    },
    
    {
        title:"Understand Your Treatment Options",
        content:"Discuss your condition, recommended care and the next steps with the medical team."
    },
    {
        title:"Plan Your Visit",
        content:"Once treatment is planned, our team can assist with the practical arrangements around your visit."
    },
]


const careCards = [
    {
        icon:"/assets/images/visa-assistance.svg",
        title:"Visa Assistance",
        content:"Receive support with the documentation and processes involved in arranging a medical visit to India.",
    },
    {
        icon:"/assets/images/treatment-cost-estimates.svg",
        title:"Treatment Cost Estimates",
        content:"Receive an estimated cost of treatment to help you plan your healthcare journey and financial requirements. Rela Hospital",
    },
    {
        icon:"/assets/images/medical-assistance.svg",
        title:"Medical Assistance",
        content:"Connect with doctors and nurses who can help understand your healthcare needs and guide you towards the appropriate services.",
    },
    {
        icon:"/assets/images/international-surgeries.svg",
        title:"International Surgeries",
        content:"Access specialised surgical care supported by Rela's multidisciplinary medical teams.",
    },
    {
        icon:"/assets/images/language-assistance.svg",
        title:"Language Assistance",
        content:"Language should never become a barrier to understanding your care. Translation support is available to help international patients communicate more comfortably.",
    },
    {
        icon:"/assets/images/hotel-assistance.svg",
        title:"Hotel Assistance",
        content:"Our team can assist patients and accompanying family members with hotel arrangements suited to their requirements and budget. Rela Hospital",
    },
]



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


export default function InternationalPatientsClient({deptData, allTestimonials, featuredTestimonials}) {

     const [advancedSectionRef, countersInView] = useSectionInView();

       const [mobile,setMobile] = useState(false);
    const [strictMobile,setStrictMobile] = useState(false);
         const [activeFaq,setActiveFaq] = useState(0);
    
           useEffect(()=>{
         
             const checkDevice = () =>{
             setMobile(window.innerWidth<1200);
    setStrictMobile(window.innerWidth<767);
             }
         
             checkDevice();
             window.addEventListener("resize",checkDevice);
         
             return(()=>{
             window.removeEventListener("resize",checkDevice);
             })
         
         
           },[])


  return (
    <>
    
  <section className={`${style.bannerSection}`}>
        <div className={`${style.container} container`}>
            <div className={`top_heading ${style.top_heading}`} data-aos="fade-right">
                <h1 className='white_text common_heading'>International Care, <br className=''/><span>Without the Distance</span></h1>
                <p className='white_text'>Access specialised medical care at Rela Hospital with dedicated support from your first enquiry through treatment and beyond.
Whether you are travelling for a complex procedure, seeking specialist expertise or exploring treatment options, our international patient team is here to help make your healthcare journey simpler and more comfortable.</p>
                <div className={style.buttons}>
                    <Button classname="orange_btn" text="Request a Medical Opinion" link=""/>
                    <Button classname="white_btn orange_stroke" text="Talk to Our International Patient Team" link=""/>
                </div>
            </div>
        </div>
    </section>


    <section className={`common_section ${style.yourCare_section}`}>
  <div className={`container ${style.container}`}>
<div className={style.statsArea}>
    <div className={`${style.blurLayer}`}>
      <div className={style.right}></div>
      <div className={style.center}></div>
    </div>
    <div className={style.content} data-aos="fade-right">
      <h2 className="common_heading white_text">Your Care <span>Starts Here</span></h2>
    </div>
    <div className={style.image}>
      {mobile?<Image src="/assets/images/your-care-m.svg" width={347} height={299} alt=""/>
      :
      <Image src="/assets/images/your-care.svg" width={700} height={679} alt=""/>
      }
    </div>
    <div className={style.stats} data-aos="fade-left">
      {stats.map((item,index)=>(
        <Link key={index} href={item.link} className={style.card} >
          <Image src={item.icon} width={40} height={40} alt={item.title}/>
          <p className="white_text">{item.title}</p>
        </Link>
      ))}
    </div>

</div>
  </div>
</section>


<section className={`common_section no_padding_top ${style.countersSection}`} ref={advancedSectionRef}>

    <div className={`container ${style.container} section_container`}>
        <div className={style.content}>
            <div className={`top_heading`} data-aos="fade-right">
                <h2 className='common_heading'>World-Class Care, Personalised for You</h2>
                <div className={style.para}>
                <p>Travelling to another country for medical treatment can feel overwhelming. From finding the right specialist to understanding your treatment, arranging travel and planning your stay, there is a lot to consider.</p>
                <p>At Rela Hospital, our dedicated team helps international patients navigate these steps with medical guidance and practical support.</p>
                <p>Our doctors and nurses help understand your healthcare needs and connect you with the appropriate specialists and services.</p>
                    </div>
                    <Button classname="orange_btn" text="Request a Medical Opinion" link=""/>

            </div>
        </div>

        <div className={style.counterContainer}>
            <Image className={style.map} src="/assets/images/dotted-map.svg" width={881} height={486} alt=''/>

            <div className={style.counter} data-aos="zoom-in">
    <h3 className="orange_text"><AnimatedCounter target={24} start={countersInView} /><span>/7</span></h3>
<p className="">Support System</p>
  </div>

   <div className={style.counter} data-aos="zoom-in" >
    <h3 className="orange_text"><AnimatedCounter target={1000} start={countersInView} /><span>+</span></h3>
<p className="">Surgeries</p>
  </div>

   <div className={style.counter} data-aos="zoom-in">
    <h3 className="orange_text"><AnimatedCounter target={15} start={countersInView} /><span>+</span></h3>
<p className="">Language Translators</p>
  </div>

  <div className={style.counter} data-aos="zoom-in">
    <h3 className="orange_text"><AnimatedCounter target={130} start={countersInView} /><span>+</span></h3>
<p className="">Specialists</p>
  </div>

        </div>


    </div>

</section>

     <section className={`common_section gray_bg ${style.expertise_section}`} >
        <div className={`container ${style.container} section_container column`}>
            <div className='top_heading center' data-aos="fade-up">
                <h2 className='common_heading'>More Than a Job. A Role in Better Healthcare.</h2>
                <p>Healthcare is built by people. At Rela, your expertise becomes part of a multidisciplinary environment where people work together to deliver advanced and compassionate care.</p>
            </div>

<div className={style.cards} data-aos="fade-up">
    {expertiseCards.map((card,i)=>(
        <div className={style.card} key={i}>
            <Image className={style.icon} src={card.icon} width={80} height={80} alt={card.title}/>
            <h3>{card.title}</h3>
            <p>{card.content}</p>
        </div>
    ))}
</div>

        </div>
    </section>


    <section className={`common_section ${style.journey_section}`}>
        <div className={`container ${style.container} section_container column`}>
            <div className={`top_heading center ${style.top_heading}`} data-aos="fade-up">
                <h2 className='common_heading'>Your Care Journey Can Begin Before You Travel</h2>
                <Button classname="orange_btn" text="Request a Medical Opinion" link=""/>
            </div>

            <div className={style.journeyContainer}>
                <div className={style.cards} data-aos="fade-right" style={{ order: mobile ? 2 : "unset" }}>
                    {journeyCards.map((item,index)=>(
                        
                       (index === 0 || (mobile ? index === 1 : index === 3))&& (
<div className={style.card} key={index}>
                        <h3 className={style.count}>0{index + 1}</h3>
                        <h4 className={style.title}>{item.title}</h4>
                        <p>{item.content}</p>
                    </div>
                        )
                    ))}
                </div>

<div className={style.image} data-aos="fade-up" style={{ order: mobile ? 1 : "unset" }}>
    <Image src="/assets/images/journey_img.png" width={749} height={561} alt=''/>
</div>

                   <div className={style.cards} data-aos="fade-left" style={{ order: mobile ? 3 : "unset" }}>
                    {journeyCards.map((item,index)=>(
                        ((mobile ? index === 2 : index === 1) || (mobile ? index === 3 : index === 2)) && (
<div className={style.card} key={index}>
                        <h3 className={style.count}>0{index + 1}</h3>
                        <h4 className={style.title}>{item.title}</h4>
                        <p>{item.content}</p>
                    </div>
                        )
                    ))}
                </div>

            </div>


        </div>
    </section>
    

    <section className={`common_section gray_bg ${style.expertise_section} ${style.care_section}`} >
        <div className={`container ${style.container} section_container column`}>
            <div className={`top_heading center ${style.top_heading}`} data-aos="fade-up">
                <h2 className='common_heading'>Support Beyond Medical Care</h2>
            </div>

<div className={style.cards} data-aos="fade-up">
    {careCards.map((card,i)=>(
        <div className={style.card} key={i}>
            <Image className={style.icon} src={card.icon} width={80} height={80} alt={card.title}/>
            <h3>{card.title}</h3>
            <p>{card.content}</p>
            <button className="link_btn orange_btn">Enquire Now<Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt=''/></button>
        </div>
    ))}
</div>

        </div>
    </section>

    <section className={`common_section ${style.deptSection}`}>

<div className={`section_container column ${style.section_container}`}>
 <div className={`container ${style.container}`}>
      <div className={`top_heading center ${style.top_heading}`} data-aos="fade-up">
<h2 className="common_heading">Where Expertise Comes Together</h2>
<Button link="/" classname="orange_btn" text="Explore Specialities"/>
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
            prevEl: ".slide_prev",
            nextEl: ".slide_next",
          }}
          pagination={{
          type: 'fraction',
          el: '.dept_fraction_pagination',
        }}
          className=''
          loop={true}
          breakpoints={{
            0:{
slidesPerView: 1,
            spaceBetween: 20,
            },
            500:{
slidesPerView: 1.5,
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
          {deptData.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className={`${style.slide}`}>
             <DepartmentCard dept={slide}/>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

<div className="slider_nav_container center orange">
        <button className="slide_prev slider_nav " aria-label="Previous slide">
          <Image
            src="/assets/images/slider-prev-arrow.svg"
            width={32}
            height={32}
            alt=""
          />
        </button>
      <div className="fraction_pagination dept_fraction_pagination"/>

        <button className="slide_next slider_nav" aria-label="Next slide">
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


<section className={`common_section ${style.whyChoose_section}`}>
   {mobile && 
   <Image className={style.mobileImg} src="/assets/images/int-why-choose-m.png" width={1030} height={760} alt=''/>
    }
  <div className={`container ${style.container}`}>
   
    <div className={style.content}>
      <div className='top_heading'>
        <h2 className='common_heading'>Why Patients <br className='desktop_break'/>Choose Rela</h2>
        <p>Rela's international patient experience is built around three things:</p>
        <ul className={`common_list`}>
          <li>Acute liver failure</li>
          <li>Liver cirrhosis</li>
          <li>Liver cancer in selected patients</li>
          <li>Biliary disorders</li>
          <li>Metabolic liver diseases</li>
          <li>Inherited liver conditions</li>
          <li>Paediatric liver diseases</li>
          <li>Complications of end-stage liver disease</li>
        </ul>
      </div>
    </div>
  </div>
</section>


<TestimonialSection allTestimonials={allTestimonials} featuredTestimonials={featuredTestimonials}/>

<section className={`common_section no_padding_top ${style.faq_section}`}>
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
