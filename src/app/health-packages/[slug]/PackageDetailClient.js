"use client"

import React, { useState } from 'react'
import style from './detail.module.css'
import Image from 'next/image'
import PackageForm from '@/app/components/PackageForm/PackageForm'

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination,Navigation, Mousewheel, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import PackageCard from '@/app/components/UI/PackageCard'

export default function PackageDetailClient({ pkg, explorePackages }) {

     const [activeFaq,setActiveFaq] = useState(0);
     const [activeTestFaq,setActiveTestFaq] = useState(0);

    const packageListDetails = [
        pkg.ageGroup && { icon: "/assets/images/age-group.svg", label: "Age Group", text: pkg.ageGroup },
        pkg.gender && { icon: "/assets/images/gender.svg", label: "Gender", text: pkg.gender },
        pkg.fastingFor && { icon: "/assets/images/fasting.svg", label: "Fasting for", text: pkg.fastingFor },
        pkg.reportsWithin && { icon: "/assets/images/reports.svg", label: "Reports within", text: pkg.reportsWithin },
    ].filter(Boolean)

  return (
    <>

    <section className={`common_section ${style.packageDetail_section}`}>
        <div className={`container ${style.container}`}>
            <div className={style.content}>
                <div className={style.packageCard} data-aos="fade-right">
                    {/* test name  */}
                    <h1 className='common_heading'>{pkg.testName}</h1>
                    <div className={style.detail}>
                         {/* test count  */}
                        <p className={style.tests}>{pkg.testCount}</p>
                        {/* disclaimer */}
                        {pkg.disclaimer && <p className={style.disclaimer}>*{pkg.disclaimer}</p>}

                         <div className={style.price}>
                            {/* offer price  */}
                    <h3 className={style.offerPrice}>₹{pkg.offerPrice}</h3>
                     {/* actual price  */}
                     <del className={style.actualPrice}>₹{pkg.actualPrice}</del>
                </div>

                {/* package details */}
                <div className={style.cards}>
{packageListDetails.map((item,i)=>(
    <div className={style.card} key={i}>
        <Image src={item.icon} width={40} height={40} alt=''/>
        <p className={style.label}>{item.label}</p>
        <h3>{item.text}</h3>
    </div>
))}
                </div>
                    </div>

                    {/* package image  */}
                    <div className={style.packageDetailImage}>
                        <Image src={pkg.packageImage || "/assets/images/package-detail-img.png"} width={397} height={415} alt=''/>
                    </div>
                </div>

                <div className={`${style.testIncludes} top_heading left`} data-aos="fade-right">
    <h2 className='common_heading'>What’s Included in Your Health Check</h2>
      <div className={style.faq} >
        {/* test includes  */}
        {pkg.testsIncludes.map((item,i)=>(
 <div className={`${style.card} ${activeTestFaq===i?style.active:""}`} key={i}>
            <div className={style.head} onClick={()=>{setActiveTestFaq((prev)=>prev===i?null:i)}}>
                {/* heading  */}
                <h3>{item.heading}</h3>
                <button> <Image src="/assets/images/faq-arrow.svg" width={32} height={32} alt=''/> </button>
            </div>
            <div className={style.body}>
              <div>
                {/* list  */}
                <ul className='common_list'>
                    {item.tests.map((test,j)=>(
                    <li key={j}>{test}</li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
        ))}

    </div>
</div>

            </div>

<div className={style.formArea} id="book-package">
    <PackageForm package={pkg}/>
</div>


        </div>
    </section>



    <section className={`common_section gray_bg ${style.faq_section}`}>
<div className={`container ${style.container}`}>
    <div className={style.title}  data-aos="fade-right">
        <h2 className='common_heading'>Common Questions About {pkg.testName}</h2>
    </div>
    <div className={style.faq} data-aos="fade-left">
        {/* package faq */}
        {pkg.faqs.map((item,i)=>(
 <div className={`${style.card} ${style.white} ${activeFaq===i?style.active:""}`} key={i}>
            <div className={style.head} onClick={()=>{setActiveFaq((prev)=>prev===i?null:i)}}>
                <h3>{item.heading}</h3>
                <button> <Image src="/assets/images/faq-arrow.svg" width={32} height={32} alt=''/> </button>
            </div>
            <div className={style.body}>
              <div dangerouslySetInnerHTML={{ __html: item.answer }} />
            </div>
        </div>
        ))}

    </div>
</div>
</section>

{explorePackages.length > 0 && (
<section className={`common_section ${style.morePackages}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className='top_heading center'>
            <h2 className='common_heading'>Explore More Health Packages</h2>
        </div>

{/* other packages */}
<div className={style.packageSlider}>
     <div className="sliderContainer">
        <Swiper
          modules={[Navigation,Pagination]}
          spaceBetween={20}
          speed={800}
          slidesPerView={4.5}
          navigation={{
            prevEl: ".slide_prev",
            nextEl: ".slide_next",
          }}
          pagination={{
          type: 'fraction',
          el: '.package_fraction_pagination',
        }}
          className=''
          loop={true}
          breakpoints={{
            0:{
slidesPerView: 1,
            spaceBetween: 20,
            },
          992: {
            slidesPerView: 2,
          },
           1366: {
            slidesPerView: 3,
             spaceBetween: 30,
          }

        }}
        >
          {explorePackages.map((slide, i) => (
            <SwiperSlide key={slide.id ?? i}>
              <div className={`${style.slide}`}>
             <PackageCard item={slide} duration={i}/>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

<div className="slider_nav_container center strict_center orange">
        <button className="slide_prev slider_nav " aria-label="Previous slide">
          <Image
            src="/assets/images/slider-prev-arrow.svg"
            width={32}
            height={32}
            alt=""
          />
        </button>
      <div className="fraction_pagination package_fraction_pagination"/>

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
)}


    </>
  )
}
