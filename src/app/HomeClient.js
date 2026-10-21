"use client"

import Image from "next/image";
import style from "./page.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination,Navigation, Mousewheel, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Button from "./components/UI/Button";
import { useEffect, useState } from "react";
import Link from "next/link";
import DepartmentCard from "./components/UI/DepartmentCard";
import DoctorCard from "./components/UI/DoctorCard";
import AnimatedCounter from "./components/UI/AnimatedCounter";
import useSectionInView from "./components/UI/useSectionInView";
import React from "react";


// banner content
const heroSliderContent = [
{
    title:`<h1>Find the Right Specialist for <span>Your Health</span></h1>`,
  content:"Search by doctor, speciality, symptom or treatment and take the next step towards better care.",
  link:"",
  image:"/assets/images/hero-banner.png",
  mobileImage:"/assets/images/hero-banner-mobile.png"

},
{
    title:`<h2>Find the Right Specialist for <span>Your Health</span></h2>`,
  content:"Search by doctor, speciality, symptom or treatment and take the next step towards better care.",
  link:"",
  image:"/assets/images/hero-banner.png",
  mobileImage:"/assets/images/hero-banner-mobile.png"
},
]


// stats content
const stats = [
  {
    icon:"/assets/images/doctor.svg",
    title:"Find a Doctor",
    link:"/"
  },
    {
    icon:"/assets/images/b_app.svg",
    title:"Book an Appointment",
    link:"/"
  },
    {
    icon:"/assets/images/emer_core.svg",
    title:"Emergency care",
    link:"/"
  },
    {
    icon:"/assets/images/health_pack.svg",
    title:"Health Packages",
    link:"/"
  },
    {
    icon:"/assets/images/inter_patients.svg",
    title:"International Patients",
    link:"/"
  },
    {
    icon:"/assets/images/locat.svg",
    title:"Find a Loaction",
    link:"/"
  },

]

// packages

const healthPackages = [
{
  packageName:"Essential Health Check",
  tests:"7 tests with consultations",
  actualPrice:"2,500",
  offerPrice:"1,800",
  link:"/",
  special:false
},
{
  packageName:"Essential Health Check",
  tests:"7 tests with consultations",
  actualPrice:"2,500",
  offerPrice:"1,800",
  link:"/",
  special:false
},
{
  packageName:"Essential Health Check",
  tests:"7 tests with consultations",
  actualPrice:"2,500",
  offerPrice:"1,800",
  link:"/",
  special:false
},
{
  packageName:"Essential Health Check",
  tests:"7 tests with consultations",
  actualPrice:"2,500",
  offerPrice:"1,800",
  link:"/",
  special:false
},
{
  packageName:"Essential Health Check",
  tests:"7 tests with consultations",
  actualPrice:"2,500",
  offerPrice:"1,800",
  link:"/",
  special:false
},
{
  packageName:"Essential Health Check",
  tests:"7 tests with consultations",
  actualPrice:"2,500",
  offerPrice:"1,800",
  link:"/",
  special:false
},
{
  packageName:"Essential Health Check",
  tests:"7 tests with consultations",
  actualPrice:"2,500",
  offerPrice:"1,800",
  link:"/",
  special:false
},
{
  packageName:"Essential Health Check",
  tests:"7 tests with consultations",
  actualPrice:"2,500",
  offerPrice:"1,800",
  link:"/",
  special:true
},
{
  packageName:"Essential Health Check",
  tests:"7 tests with consultations",
  actualPrice:"2,500",
  offerPrice:"1,800",
  link:"/",
  special:true
},
]


// international patients

const internationalPatients = [
  {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },
   {
    image:"/assets/images/int.png",
    name:"John Doe",
    location:"Italy"
  },

]


// testimonial data

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


// locations data
const locationData = [
  {
    name: "Dr. Rela Institute & Medical Center",
    unit: "A Unit of Jr Super Speciality Ltd.",
    image: "/assets/images/rela-institute-medical-center.png",
    location: "#7, CLC Works Road, Chromepet, Chennai 600044.",
    locationLink: "https://maps.app.goo.gl/vc9dp3FrmSMmMy7g6",
    contact: ["044 66667777", "044 71111117"],
    mail: "info@relainstitute.com",
  },
  {
    name: "Kumaran Hospitals & Rela Institute",
    unit: "A unit of Kumaran Hospital Pvt Ltd.",
    image: "/assets/images/kumaran-hospital.png",
    location:
      "214, E.V.R Periyar Salai, Poonamallee High Road, Kilpauk, Chennai - 600 010.",
    locationLink: "",
    contact: ["+91 98410 04625"],
    mail: "kumaranhospitals@hotmail.com",
  },
  {
    name: "Rela MS Hospital - Red Hills",
    unit: "A unit of Harsha Management",
    image: "/assets/images/rims-hospital.png",
    location:
      "4/833, GNT Road, Padiyanallur, Redhills, Chennai 600052",
    locationLink: "",
    contact: ["044-7111 1111"],
    mail: "info@rimshospitals.com",
  },
  {
    name: "Rela Clinics, Nanganallur",
    unit: "A unit of JR Super Speciality Ltd.",
    image: "/assets/images/rela-clinic-nanganallur.png",
    location:
      "No 35, 1st Main Rd, Opp. to Bata Showroom, Nanganallur, Chennai-600 061.",
    locationLink: "",
    contact: ["044 66667777", "044 71111117"],
    mail: "nanganallur@relainstitute.com",
  },
];

export default function HomeClient({ coeData, deptData, doctorsData }) {

  const [mobile,setMobile] = useState(false);
  const [strictMobile,setStrictMobile] = useState(false);
  const [advancedSectionRef, countersInView] = useSectionInView();

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

   {/* hero section  */}

   <section className={`${style.heroSection}`}>

     <Swiper
          modules={[Navigation,Pagination]}
          spaceBetween={0}
          speed={800}
          slidesPerView="auto"
          navigation={{
            prevEl: ".slide_prev",
            nextEl: ".slide_next",
          }}
          pagination={{
          type: 'fraction',
          el: '.hero_fraction_pagination',
        }}
          className=''
          loop={true}
        >
          {heroSliderContent.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className={`${style.slide}`} style={{backgroundImage:`url(${mobile?slide.mobileImage:slide.image})`}}>
              <div className={`container ${style.container}`}>
<div className={style.content}>
  <div className={`${style.title} common_heading`} dangerouslySetInnerHTML={{ __html: slide.title }} />
  <p className="white_text">{slide.content}</p>
  <Button type="call" classname="white_btn" text="Book an Appointment"/>
</div>
              </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={`container ${style.navContainer} `}>
<div className="slider_nav_container white">
        <button className="slide_prev slider_nav " aria-label="Previous slide">
          <Image
            src="/assets/images/slider-prev-arrow.svg"
            width={32}
            height={32}
            alt=""
          />
        </button>
      <div className="fraction_pagination hero_fraction_pagination"/>

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

   </section>

   {/* your care section  */}

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

{/* center of excellence  */}

<section className={`common_section no_padding_top ${style.excellenceSection}`}>
  <div className={`container ${style.container}`}>

<div className={`section_container ${style.section_container}`}>
    <div className={style.left} data-aos="fade-right">
      <div className={`top_heading ${style.top_heading}`}>
<h2 className="common_heading">Complete Care, Connected Across Specialities</h2>
<p>Our specialists collaborate across departments to provide coordinated care for both everyday and complex health conditions.</p>
<Button link="" classname="orange_btn" text="Explore Specialities"/>
      </div>
    </div>

    <div className={style.right} data-aos="fade-left">

      {coeData.slice(0,10).map((item,i)=>(
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

{/* department section  */}
<section className={`common_section gray_bg ${style.deptSection}`}>

<div className={`section_container column ${style.section_container}`}>
 <div className={`container ${style.container}`}>
      <div className={`top_heading center ${style.top_heading}`} data-aos="fade-up">
<h2 className="common_heading">Where Expertise Comes Together</h2>
<Button link="/" classname="orange_btn" text="Explore Specialities"/>
      </div>
    </div>

    {/* dept slider  */}
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


{/* doctor section  */}
<section className={`common_section ${style.doctorSection}`}>

<div className={`section_container column ${style.section_container}`}>
 <div className={`container ${style.container}`}>
      <div className={`top_heading split ${style.top_heading}`} data-aos="fade-right">
<h2 className="common_heading">Trusted Doctors. Advanced Care.</h2>
<Button link="/" classname="orange_btn" text="See All Doctors" data-aos="fade-left"/>
      </div>
    </div>

    {/* doctors slider  */}
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
        <button className="slide_prev slider_nav " aria-label="Previous slide">
          <Image
            src="/assets/images/slider-prev-arrow.svg"
            width={32}
            height={32}
            alt=""
          />
        </button>
      <div className="fraction_pagination doct_fraction_pagination"/>

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


{/* health package section */}
<section className={`gray_bg ${style.packageSection}`}>
<div className={`container ${style.container}`}>
  <div className={style.content}>
    <div className={`top_heading`} data-aos="fade-right">
      <h2 className="common_heading">
        A Simple Check Today Can Make a <span>Difference Tomorrow</span>
      </h2>
      <p>Take a proactive step towards better health with screening packages designed for individuals, families and different lifestyle needs.</p>
      <Button classname="orange_btn" link="/" text="Book a Health Check"/>
    </div>
    <div className={style.image} data-aos="fade-up">
      <span>Comprehensive<br/>Screening Packages</span>
      <span>Seamless Follow-Up Care</span>
      <span>Specialist-Led Health<br/>Assessments</span>
      <span>Advanced Diagnostic<br/>Technology</span>

      <Image src="/assets/images/happy-doctor.png" width={430} height={405} alt="Doctor with a patient"/>
    </div>
  </div>

{/* packages  */}

{mobile &&
<div className={style.packages} data-aos="fade-up">

  {/* package slider  */}

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
slidesPerView: 1.5,
            },
          700: {
            slidesPerView: 2,
          },
          1000: {
            slidesPerView: 3,
          }

        }}
        >
          {healthPackages.map((packageItem, i) => (
            <SwiperSlide key={i}>
              <div className={style.card} key={i}>
  <div className={style.pricing}>
    <span className={`${style.offerPrice} orange_text`}>₹ {packageItem.offerPrice}</span> <del className={style.actualprice}>₹ {packageItem.actualPrice}</del>
  </div>
  <h3 className={style.packageName}>{packageItem.packageName}</h3>
  <p className={style.test}>{packageItem.tests}</p>
  <Button type="link" classname="orange_btn" text="Book Now" link={packageItem.link}/>
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
}

{/* for desktop  */}

{!mobile &&
<div className={style.packages} data-aos="fade-left">



{/* normal packages  */}
{ healthPackages.filter((item)=>item.special===false).slice(0,6).map((packageItem,index)=>(
<div className={style.card} key={index}>
  <div className={style.pricing}>
    <span className={`${style.offerPrice} orange_text`}>₹ {packageItem.offerPrice}</span> <del className={style.actualprice}>₹ {packageItem.actualPrice}</del>
  </div>
  <h3 className={style.packageName}>{packageItem.packageName}</h3>
  <p className={style.test}>{packageItem.tests}</p>
  <Button type="link" classname="orange_btn" text="Book Now" link={packageItem.link}/>
</div>
)
)}

{/* sepcial packages  */}
{healthPackages.filter((item)=>item.special===true).slice(0,1).map((packageItem,index)=>(
<div className={`${style.card} ${style.fullCard}`} key={index}>
  <div className={style.detail}>
  <div className={style.pricing}>
    <span className={`${style.offerPrice} orange_text`}>₹ {packageItem.offerPrice}</span> <del className={style.actualprice}>₹ {packageItem.actualPrice}</del>
  </div>
  <h3 className={style.packageName}>{packageItem.packageName}</h3>
  </div>
  <Button type="link" classname="orange_btn" text="Book Now" link={packageItem.link}/>
</div>
)
)}


</div>
}

</div>
</section>


{/* advanced medicine section  */}

<section className={`common_section ${style.advancedSection}`} ref={advancedSectionRef}>

<div className={`section_container column ${style.section_container}`}>
 <div className={`container ${style.container}`}>

  <div className={style.left} data-aos="fade-right">
      <div className={`top_heading column ${style.top_heading}`}>
<h2 className="common_heading">Advanced Medicine, Delivered With Compassion</h2>
<Button link="/" classname="orange_btn" text="Discover Rela Hospital"/>
      </div>
      {!mobile &&
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
   }
      </div>

<div className={style.center} data-aos="zoom-in" data-aos-delay="500">
<div className="" data-aos="zoom-in" data-aos-delay="500">
  {/* counter - 32+ */}
<h3 className="white_text"><AnimatedCounter target={32} start={countersInView} /><span>+</span></h3>
<p className="white_text">Years of Clinical Expertise</p>
</div>
</div>

<div className={style.right}>
  <div className={style.counter} data-aos="zoom-in">
     {/* counter - 500+ */}
    <h3 className="orange_text"><AnimatedCounter target={500} start={countersInView} /><span>+</span></h3>
<p className="">Specialist Doctors</p>
  </div>

   <div className={style.counter} data-aos="zoom-in" >
     {/* counter - 6000+ */}
    <h3 className="orange_text"><AnimatedCounter target={6000} start={countersInView} /><span>+</span></h3>
<p className="">Liver Transplants</p>
  </div>

   <div className={style.counter} data-aos="zoom-in">
     {/* counter - 98% */}
    <h3 className="orange_text"><AnimatedCounter target={98} start={countersInView} /><span>%</span></h3>
<p className="">Patient Satisfaction</p>
  </div>
</div>


  {mobile &&
      <p data-aos="fade-up">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
   }

    </div>



  </div>
</section>


{/* desk section  */}

<section className={`gray_bg ${style.deskSection}`}>

<div className={`section_container column ${style.section_container}`}>
 <div className={`container ${style.container}`}>

  <div className={style.left} data-aos="fade-right">
      <div className={`top_heading column ${style.top_heading}`}>
<h2 className="common_heading">From the Desk Of<br/><span>Prof. Mohamed Rela</span></h2>
      </div>
      </div>

      <div className={style.center} data-aos="fade-up">
        <Image src="/assets/images/mohd-rela.png" width={560} height={593} alt="Prof. Mohamed Rela"/>
      </div>

<div className={style.right} data-aos="fade-left">
<strong>Dear Friends and Colleagues,</strong>
<p>Rela Hospital was founded with a clear purpose: to make advanced healthcare more accessible, precise and compassionate.</p>
<p>Our specialists work across disciplines, supported by modern technology and clinical infrastructure, to provide care tailored to every patient. From early diagnosis to complex treatments and recovery, we remain committed to delivering the highest standards of medical excellence.</p>
<p>Innovation continues to shape how we treat, heal and improve outcomes. Yet, technology alone does not define great healthcare. It is the trust we build, the compassion we show and the responsibility we carry for every life entrusted to us.</p>
<p>At Rela Hospital, expertise guides our decisions, and compassion remains at the heart of everything we do.</p>
<p><strong>Prof. Mohamed Rela</strong><br/>Chairman and Managing Director<br/>Rela Hospital</p>
</div>


    </div>



  </div>
</section>


{/* international section  */}
<section className={`common_section gray_bg ${style.internationalSection}`}>

<div className={`section_container column ${style.section_container}`}>
 <div className={`container ${style.container}`}>

  <div className={style.left} data-aos="fade-right">
      <div className={`top_heading column ${style.top_heading}`}>
<h2 className="common_heading white_text">International Healthcare, Closer to You</h2>
<Image src="/assets/images/flags.svg" width={284} height={39} alt="Flags of countries we serve"/>
<p className="white_text">Share your medical reports, receive expert guidance and get dedicated assistance with appointments, travel, accommodation and treatment coordination.</p>
<Button text="Request a Medical Opinion" link="/" classname="orange_btn"/>
      </div>

      <div className={style.trusted}>
        <Image src="/assets/images/usr.png" width={60} height={60} alt=""/>
        <Image src="/assets/images/usr1.png" width={60} height={60} alt=""/>
        <Image src="/assets/images/usr2.png" width={60} height={60} alt=""/>
<div>
  <span>1 M+</span>
  <p>Trusted by  happy International Patients</p>
</div>
      </div>

      </div>

<div className={style.right}>

<div className={style.userMarqueeWrapper}>
  <div className={style.wrapper}>
{internationalPatients.map((patients,i)=>(
  <div className={style.card} key={i}>
    <div className={style.image}> <Image src={patients.image} width={100} height={100} alt={patients.name}/> </div>
    <div className={style.detail}>
      <h3 className={style.name}>{patients.name}</h3>
      <p className={style.location}>{patients.location}</p>
      </div>

  </div>
))}
</div>
</div>

<div className={style.userMarqueeWrapper}>
  <div className={`${style.wrapper} ${style.reverse}`}>
{internationalPatients.map((patients,i)=>(
  <div className={style.card} key={i}>
    <div className={style.image}> <Image src={patients.image} width={100} height={100} alt={patients.name}/> </div>
    <div className={style.detail}>
      <h3 className={style.name}>{patients.name}</h3>
      <p className={style.location}>{patients.location}</p>
      </div>

  </div>
))}
</div>
</div>

</div>


    </div>



  </div>
</section>


{/* robotic section  */}
<section className={`common_section gray_bg ${style.roboticSection}`}>
<div className={`container section_container column ${style.container}`}>
  <div className={`top_heading ${style.content}`} data-aos="fade-left">
<h2 className="common_heading">ROBOTIC <br className="desktop_break"/>Surgery for More <br className="desktop_break"/>Precise Care </h2>
<Button link="" classname="orange_btn" text="Consult a Specialist"/>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  </div>
  {mobile &&
  <Image className={style.roboticImage} data-aos="fade-right" src="/assets/images/robotic-img.png" width={945} height={625} alt="Robotic surgery system"/>
  }
</div>
</section>




{/* testimonial section  */}
<section className={`common_section ${style.testimonialSection}`}>
  <div className={`container ${style.container}`}>

<div className={`section_container column ${style.left}`}>
  <div className="top_heading" data-aos="fade-right">
    <h2 className="common_heading">Trusted Care, Shared Experiences</h2>
    <Button link="/" classname="orange_btn" text="Discover Rela Hospital"/>
  </div>

  <div className={style.featureTestimonial} data-aos="fade-up">
    <div className={style.content}>
    <Image src="/assets/images/quote.svg" className={style.quote} width={78} height={55} alt="" />
    <p className="white_text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse</p>
    <div className={style.testUser}>
      <Image src="/assets/images/usr.png" width={40} height={40} alt=""/>
      <h3 className="white_text">John Doe</h3>
      </div>
    </div>

    <div className={style.image}>
      {strictMobile?
    <Image src="/assets/images/feature_test_m.svg" width={361} height={230} alt=""/>:
    <Image src="/assets/images/feature_test.svg" width={427} height={415} alt=""/>
    }

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
    className={style.testSwiper}
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





{/* location section  */}

<section className={`common_section gray_bg ${style.locationSection}`}>
  <div className={`container ${style.container}`}>

<div className={`section_container column`}>
  <div className={`top_heading center ${style.top_heading}`} data-aos="fade-up">
    <h2 className="common_heading">Care Across Every Location </h2>
  </div>


{/* locations cards for mobile   */}
  {mobile &&
<div className={style.locationCards} data-aos="fade-up">

  {/* package slider  */}

      <div className="sliderContainer">
        <Swiper
          modules={[Navigation,Pagination]}
          spaceBetween={20}
          speed={800}
          slidesPerView={2}
          navigation={{
            prevEl: ".slide_prev",
            nextEl: ".slide_next",
          }}
          pagination={{
          type: 'fraction',
          el: '.location_fraction_pagination',
        }}
          className=''
          loop={true}
          breakpoints={{
            0:{
slidesPerView: 1.1,
            },
          700: {
            slidesPerView: 2.3,
          }

        }}
        >
          {locationData.map((item, i) => (
            <SwiperSlide key={i}>
              <div className={style.card} key={i}>

    <div className={style.top}>
      <div className={style.image}>
        <Image src={item.image} width={360} height={375} alt={item.name} />
      </div>
      <div className={style.content}>
        <h3 className="white_text">{item.name}</h3>
        <p className="white_text">{item.unit}</p>
      </div>
    </div>

    <div className={style.detail}>
      <ul>
        <li>
           <div className={style.icon}> <Image src="/assets/images/map-pin.svg" width={32} height={32} alt=""/></div>
          <div className={style.link}><a href={item.locationLink} target="_blank" rel="noopener noreferrer">{item.location}</a></div>

          </li>
          <li>
            <div className={style.icon}> <Image src="/assets/images/call-pin.svg" width={32} height={32} alt=""/></div>
          <div className={style.link}>
            {item.contact && item.contact.map((tel,i)=>(
              <React.Fragment key={i}>
<a href={`tel:${tel.replaceAll(" ","")}`}>{tel}</a>
              </React.Fragment>
            ))}

            </div>
          </li>
           <li>
           <div className={style.icon}> <Image src="/assets/images/mail-pin.svg" width={32} height={32} alt=""/></div>
          <div className={style.link}><a href={`mailto:${item.mail}`}>{item.mail}</a></div>

          </li>
      </ul>
    </div>

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
      <div className="location_fraction_pagination package_fraction_pagination"/>

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
}

  {/* locations cards for desktop   */}
    {!mobile &&
<div className={style.locationCards} data-aos="fade-up">

  {locationData && locationData.map((item,i)=>(
<div className={style.card} key={i}>

    <div className={style.top}>
      <div className={style.image}>
        <Image src={item.image} width={360} height={375} alt={item.name} />
      </div>
      <div className={style.content}>
        <h3 className="white_text">{item.name}</h3>
        <p className="white_text">{item.unit}</p>
      </div>
    </div>

    <div className={style.detail}>
      <ul>
        <li>
           <div className={style.icon}> <Image src="/assets/images/map-pin.svg" width={32} height={32} alt=""/></div>
          <div className={style.link}><a href={item.locationLink} target="_blank" rel="noopener noreferrer">{item.location}</a></div>

          </li>
          <li>
            <div className={style.icon}> <Image src="/assets/images/call-pin.svg" width={32} height={32} alt=""/></div>
          <div className={style.link}>
            {item.contact && item.contact.map((tel,i)=>(
              <React.Fragment key={i}>
<a href={`tel:${tel.replaceAll(" ","")}`}>{tel}</a>
              </React.Fragment>
            ))}

            </div>
          </li>
           <li>
           <div className={style.icon}> <Image src="/assets/images/mail-pin.svg" width={32} height={32} alt=""/></div>
          <div className={style.link}><a href={`mailto:${item.mail}`}>{item.mail}</a></div>

          </li>
      </ul>
    </div>

  </div>
  ))}

</div>
}


</div>




  </div>
</section>


   </>
  );
}
