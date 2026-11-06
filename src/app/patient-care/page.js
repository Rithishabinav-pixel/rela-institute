"use client";

import React, { useEffect, useRef, useState } from "react";
import style from './patientCare.module.css'
import Image from "next/image";
import Button from '../components/UI/Button'


import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


const sliderTab = [
 {
    button: "Inpatient Guidelines",
    content: `
        <h2>Drop in beforehand!</h2>
        <p>As soon as you know your date of admission to the hospital, we advise you to drop in to our Admission Office a few days in advance, if your state of health permits. This gives you a chance to complete the administrative formalities and further smoothen out your experience on the day of your admission to the hospital.</p>

        <h2>Checklist for your admission:</h2>
        <ul>
            <li>The letter of referral for admission from your doctor.</li>
            <li>Your insurance card or cover guarantee from your health insurance fund or insurance company.</li>
            <li>A government issued identity document (Passport, Driving License, Aadhar Card).</li>
            <li>Previous medical health reports.</li>
        </ul>

        <h2>Check Your Insurance</h2>
        <p>If you are covered by international and foreign insurance, we suggest you to check your cover and make sure that the cost will be met before you are admitted. You should apply for a guarantee of full cover for your stay. You may have been referred for outpatient treatment but may have to spend one or more nights in the hospital. In such cases your stay is considered to be hospitalization.</p>

        <p>Your insurance does not cover the cost of personal laundry, telephone and personal expenses (Newspaper, Hairdresser etc.). You have to meet these yourself.</p>

        <p><strong>*Inclusions and exclusions depend upon the insurance policy of the patient. It may vary from one insurance policy to another, according to your coverage.</strong></p>

        <h2>What can I expect during my stay at Rela Hospital?</h2>
        <p>At Rela Hospital a warm welcome, a soothing smile and a gentle touch will boost your spirits as you experience the best of healthcare practices.</p>

        <p>And each day you will meet your treatment team, which includes your doctors and nursing staff. Our team of experts will help you understand your illness and manage your symptoms, learn strategies and skills to assist you in your recovery. Your nurse will be available to answer your questions anytime during your stay. Your nurse will also be responsible for providing you with your medication.</p>

        <h2>Am I allowed to carry medications from home?</h2>
        <p>If any medications are required during your stay, your doctor will prescribe them based on your diagnosis and they will be filled by our pharmacist. Please bring a list of prescription and over-the-counter medication, as well as any herbal products that you are taking at home. Please include the dosage and directions in your list.</p>

        <p>In the event you brought any medication of your own to the hospital, kindly send them back home with your family members. If this is not possible, please give the medication to a nurse who will send them to the pharmacy for safe storage until you are discharged. For safety and security reasons, you may not keep any medications, including vitamins, in your room.</p>
    `
},
  {
    button: "Patient & Visitor Information",
    content: `<p>Access essential information for patients and visitors, including visiting hours, hospital guidelines, and support services.</p>`
  },
  {
    button: "Billing & Insurance",
    content: `<p>Get assistance with billing, insurance coverage, payment options, and financial procedures during your hospital stay.</p>`
  },
  {
    button: "Room & Accommodation",
    content: `<p>Explore room categories, accommodation facilities, and amenities designed to make your hospital stay comfortable.</p>`
  },
  {
    button: "Patient Support Services",
    content: `<p>Discover the support services available to help patients and their families throughout their healthcare journey.</p>`
  },
  {
    button: "Discharge & Follow-up Care",
    content: `<p>Learn about discharge procedures, post-hospital care instructions, follow-up appointments, and continued medical support.</p>`
  }
];

export default function page() {

    const swiperRef = useRef(null);
      const isManualChangeRef = useRef(false);
    
      const [activeIndex, setActiveIndex] = useState(0);
      const [mobile,setMobile] = useState(0);
    
      useEffect(()=>{
    
        const checkDevice = () =>{
          setMobile(window.innerWidth<767);
        }
    
        checkDevice();
        window.addEventListener("resize",checkDevice);
    
        return(()=>window.removeEventListener("resize",checkDevice));
    
      },[])
    
      
    
      if (sliderTab.length === 0) return null;
    
      const goToTab = (index) => {
        isManualChangeRef.current = true;
        setActiveIndex(index);
        swiperRef.current?.slideToLoop(index);
      };



  return (
    <>
    
     {/* hero section  */}
         <section className={`${style.bannerSection}`}>
        <div className={`${style.container} container`}>
            <div className={`top_heading ${style.top_heading} left`} data-aos="fade-up">
                <h1 className='white_text common_heading'>Care That Supports You <br className='desktop_break'/><span>at Every Step</span></h1>
                <p className='white_text'>From admission and appointments to hospital services and discharge support, find the information you need to make your care journey at Rela Hospital easier and more comfortable.</p>
                <Button classname={`orange_btn`} link="/" text="Book a Health Check-up"/>
            </div>
        </div>
    </section>



    {/* ---------------------------------------------------------------- */}
    
    <section className={`common_section ${style.tab_section}`}>
        <div className={`container`}>
              <div className={style.tabContainer}>

      <div className={style.sliderWrapper}>

        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={`${mobile?1:"auto"}`}
          navigation={{
            prevEl: ".slide_prev",
            nextEl: ".slide_next",
          }}
          loop={sliderTab.length > 1}
          className={style.tabSlider}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            if (isManualChangeRef.current) return;
            setActiveIndex(swiper.realIndex);
          }}
          onTransitionEnd={() => {
            isManualChangeRef.current = false;
          }}
        >
          {sliderTab.map((slide, i) => (
            <SwiperSlide key={i}>
              <div
                className={`${style.slide} ${activeIndex === i ? style.active : ""}`}
                onClick={() => goToTab(i)}
              >
                {/* tab heading  */}
                {slide.button}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="slide_prev nav">
          <Image
            src="/assets/images/slider-prev.svg"
            width={24}
            height={24}
            alt=""
          />
        </button>

        <button className="slide_next nav">
          <Image
            src="/assets/images/slider-next.svg"
            width={24}
            height={24}
            alt=""
          />
        </button>

      </div>

      <div className={style.tabContent}>
        <div className={style.tabDetail}>

{/* tab content [rich text content, sanitized server-side] */}
          <div
            dangerouslySetInnerHTML={{
              __html: sliderTab[activeIndex]?.content ?? "",
            }}
          />

        </div>
      </div>

    </div>
        </div>
    </section>
    
    
    
    
    </>
  )
}
