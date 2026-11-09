"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Button from '../UI/Button'
import style from './testimonialSection.module.css'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testData = [
  {
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe",
    image:"/assets/images/usr.png"
  },
    {
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe",
    image:"/assets/images/usr.png"
  },
    {
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe",
    image:"/assets/images/usr.png"
  },
    {
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe",
    image:"/assets/images/usr.png"
  },
    {
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe",
    image:"/assets/images/usr.png"
  },
    {
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe",
    image:"/assets/images/usr.png"
  },
    {
    content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name:"John Doe l",
    image:"/assets/images/usr.png"
  },

]


export default function TestimonialSection({bg}) {

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
   <section className={`common_section ${style.testimonialSection}  ${bg==="gray"?"gray_bg":""}`}>
  <div className={`container ${style.container}`}>

<div className={`section_container column ${style.left}`}>
  <div className="top_heading" data-aos="fade-right">
    <h2 className="common_heading">Trusted Care, Shared Experiences</h2>
    <Button link="/" classname="orange_btn" text="Discover Rela Hospital"/>
  </div>


{/* featured testimonial */}
  <div className={style.featureTestimonial} data-aos="fade-up" style={{backgroundImage:`url(/assets/images/testimonial_bg.png)`}}>
    <div className={style.content}>
    <Image src="/assets/images/quote.svg" className={style.quote} width={78} height={55} alt="" />
    <p className="white_text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse</p>
    <div className={style.testUser}>
      <Image src="/assets/images/usr.png" width={40} height={40} alt=""/>
      <h3 className="white_text">John Doe</h3>
      </div>
    </div>



  </div>

</div>





<div className={style.right}>
  <Swiper
    modules={[Autoplay]}
    direction={mobile?"horizontal":"vertical"}
    slidesPerView={3}
    spaceBetween={16}
    grabCursor={true}
    allowTouchMove={true}
    loop={true}
    loopAdditionalSlides={3}
    speed={600}
    autoplay={{
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    }}
    className={`${style.testSwiper} ${bg==="gray"?style.gray:""}`}
    breakpoints={{
          0: {
            slidesPerView: 1,
          },
          600: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        }}
  >
    {testData.map((item, index) => (
      <SwiperSlide key={item.id ?? index}>
        <div className={style.testSlide}>
          <p>{item.content}</p>

          <div className={style.testUser}>
            <Image
              src={item.image}
              width={40}
              height={40}
              alt={item.name || "User"}
            />
            <h3>{item.name}</h3>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>




  </div>
</section>
  )
}
