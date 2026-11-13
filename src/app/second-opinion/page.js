"use client"

import React, { useEffect, useState } from 'react'
import style from './second.module.css'
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
import SecondOpinionForm from '../components/SecondOpinionForm/SecondOpinionForm'



const whyChooseData = [
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


export default function page() {

     const [mobile,setMobile] = useState(false);
         const [activeFaq,setActiveFaq] = useState(0);
    
           useEffect(()=>{
         
             const checkDevice = () =>{
             setMobile(window.innerWidth<767);
             }
         
             checkDevice();
             window.addEventListener("resize",checkDevice);
         
             return(()=>{
             window.removeEventListener("resize",checkDevice);
             })
         
         
           },[])

           const whyChooseFirstColumn = whyChooseData.slice(0, Math.ceil(whyChooseData.length / 2));
const whyChooseSecondColumn = whyChooseData.slice(Math.ceil(whyChooseData.length / 2));

  return (
    <>
    
    {/* hero section  */}
         <section className={`${style.bannerSection}`}>
        <div className={`${style.container} container`}>
            <div className={`top_heading ${style.top_heading} left`} data-aos="fade-up">
                <h1 className='white_text common_heading'>Before You Decide, <br className='desktop_break'/><span>Get Another Perspective.</span></h1>
                <p className='white_text'>Make informed decisions about your health with guidance from Rela's medical specialists.</p>
<Button classname="orange_btn" link={`#`} text={`Get a Second Opinion`}/>
            </div>
        </div>
    </section>


    {/* Transforming section  */}
<section className={`common_section no_padding_bottom ${style.transform_section}`}>
    <div className={`container section_container ${style.container} `}>
        <div className={style.image} data-aos="fade-right">
            <Image src="/assets/images/so-about-img.png" width={697} height={689} alt=''/>
        </div>
        <div className={`${style.content} top_heading left`} data-aos="fade-left">
            <h2 className="common_heading">A Better Understanding of Your Diagnosis and Treatment Options</h2>
            <div className={style.text}>
                <p>When faced with a medical diagnosis or a major treatment decision, you may want another specialist's perspective before deciding how to proceed.</p>
                <p>At Rela Hospital, our specialists use advanced tools and collaborate closely to explore available treatment options and help you make informed decisions about your health.</p>
                <p>Whether you're dealing with a complex condition or seeking reassurance, a second opinion can offer another perspective on your healthcare journey.</p>
<Button classname="orange_btn" link={`#`} text={`Get a Second Opinion`}/>
            
            </div>
        </div>
    </div>
</section>

<section className={`common_section gray_bg ${style.why_section}`}>
    <div className={`container column section_container ${style.container}`}>
    <div className={`top_heading center ${style.top_heading}`}>
        <h2 className='common_heading'>When Should You Get A Second Opinion?</h2>
        <p>There are several situations in which another medical perspective may help you better understand your condition and treatment choices:</p>
    </div>

       <div className={`${style.faq} ${style.wrap}`} >
      <div className={style.column} data-aos="fade-right">
  {whyChooseFirstColumn.map((item, i) => (
    <div
      className={`${style.card} ${activeFaq === i ? style.active : ""}`}
      key={i}
    >
      <div className={style.head} onClick={() => setActiveFaq(prev => prev === i ? null : i)}>
        <h3>{item.title}</h3>
        <button>
          <Image src="/assets/images/faq-arrow.svg" width={32} height={32} alt="" />
        </button>
      </div>
      <div className={style.body}>
        <div>{item.content}</div>
      </div>
    </div>
  ))}
</div>

<div className={style.column} data-aos="fade-left">
  {whyChooseSecondColumn.map((item, i) => {
    const actualIndex = i + whyChooseFirstColumn.length;

    return (
      <div
        className={`${style.card} ${activeFaq === actualIndex ? style.active : ""}`}
        key={actualIndex}
      >
        <div className={style.head} onClick={() => setActiveFaq(prev => prev === actualIndex ? null : actualIndex)}>
          <h3>{item.title}</h3>
          <button>
            <Image src="/assets/images/faq-arrow.svg" width={32} height={32} alt="" />
          </button>
        </div>
        <div className={style.body}>
          <div>{item.content}</div>
        </div>
      </div>
    );
  })}
</div>
       
    </div>


</div>
</section>


{/* Diagnosis section  */}
<section className={`common_section ${style.diagnosis_section}`}>

    <div className={`container section_container column ${style.container}`}>
        <div className={style.content} data-aos="fade-right">
            <div className={`top_heading left`}>
                <h2 className='common_heading'>Getting a Second Opinion Starts with Three Simple Steps</h2>
                <p>There are several situations in which another medical perspective may help you better understand your condition and treatment choices:</p>
<Button classname="orange_btn" link={`#`} text={`Share Your Information`}/>

<div className={style.points}>
    <div className={style.point}>
        <h3 className='orange_text'>Step 1 – Share Your Medical Information</h3>
        <p>Fill out the online form with your contact details and medical history.</p>
    </div>
     <div className={style.point}>
        <h3 className='orange_text'>Step 2 – Schedule Your Consultation</h3>
        <p>Our team will review your information and contact you to schedule a consultation with a specialist.</p>
    </div>
     <div className={style.point}>
        <h3 className='orange_text'>Step 3 – Gain Another Medical Perspective</h3>
        <p>Discuss your condition and treatment options with the specialist to help inform your healthcare decisions.</p>
    </div>
</div>
             
            </div>
        </div>
        {mobile && 
        <div className={style.image} data-aos="fade-left">
            <Image src="/assets/images/so-sec.png" width={887} height={721} alt=''/>
        </div>
        }
    </div>

</section>


  {/* decisions section  */}
<section className={`common_section gray_bg ${style.decision_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={`top_heading ${style.top_heading} center`} data-aos="fade-up">
            <h2 className='common_heading'>Advanced Diagnostics Behind Every Clinical Decision</h2>
            <p>Rela Hospital's laboratory services combine automated diagnostic technologies with specialised testing capabilities to support timely and detailed clinical evaluation.</p>
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


    {/* about location  */}
  <section className={`common_section ${style.about_section}`}>
    <div className={`container section_container ${style.container}`}>
        <div className={style.content} data-aos="fade-right">
            <div className='top_heading left'>
            <h2 className='common_heading'>When Should You Get A Second Opinion?</h2>
           <p>There are several situations in which another medical perspective may help you better understand your condition and treatment choices:</p>
            <ul className='common_list'>
                <li><b>Specialist Expertise:</b> Gain another medical perspective from Rela's specialists.</li>
                <li><b>Collaborative Approach:</b> Benefit from specialists working closely to explore treatment options.</li>
                <li><b>Advanced Medical Tools:</b> Access the advanced tools used by the medical team.</li>
                <li><b>Informed Decisions:</b> Better understand your healthcare options before deciding on your next steps.</li>
            </ul>
            <Button classname="orange_btn" link={`#`} text={`Get a Second Opinion`}/>

            </div>
        </div>

        <div className={style.image} data-aos="fade-left">
            <Image src="/assets/images/so-2.png" width={750} height={574} alt=''/>
        </div>

    </div>
  </section>


  {/* form secrtion  */}

<section className={`common_section gray_bg ${style.form_section}`}>
    <div className={`container section_container ${style.container}`}>
        <div className={style.content}>
            <div className={`top_heading`}>
                <h2 className='common_heading'>Take the First Step Towards a Second Opinion</h2>
                <p>Share your contact details and medical information with us. Our team will review your request and get in touch to help arrange your consultation.</p>
            </div>
        </div>
        <div className={style.formArea}>
            <SecondOpinionForm bgStyle={`white_form`}/>
        </div>
    </div>
</section>


<section className={`common_section ${style.why_section} ${style.faq_section}`}>
    <div className={`container section_container ${style.container}`}>
        <div className={style.content}>
        <h2 className='common_heading'>Your Questions About Getting a Second Opinion</h2>

</div>

       <div className={`${style.faq}`} >
  {faq.map((item, i) => (
    <div
      className={`${style.card} ${activeFaq === i ? style.active : ""}`}
      key={i}
    >
      <div className={style.head} onClick={() => setActiveFaq(prev => prev === i ? null : i)}>
        <h3>{item.title}</h3>
        <button>
          <Image src="/assets/images/faq-arrow.svg" width={32} height={32} alt="" />
        </button>
      </div>
      <div className={style.body}>
        <div>{item.content}</div>
      </div>
    </div>
  ))}


       
    </div>


</div>
</section>


    </>
  )
}
