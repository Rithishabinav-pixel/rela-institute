"use client"

import Image from "next/image";
import style from "./page.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination,Navigation, Autoplay } from "swiper/modules";
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
import TestimonialSection from "./components/TestimonialSection/TestimonialSection";


const stats = [
  {
    icon:"/assets/images/doctor.svg",
    title:"Find a Doctor",
    link:"/doctors"
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
    link:"/health-packages"
  },
    {
    icon:"/assets/images/inter_patients.svg",
    title:"International Patients",
    link:"/"
  },
    {
    icon:"/assets/images/locat.svg",
    title:"Find a Location",
    link:"/locations"
  },

]


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





const locationData = [
  {
    name: "Dr. Rela Institute & Medical Center",
    unit: "A Unit of Jr Super Speciality Ltd.",
    image: "/assets/images/rela-institute-medical-center.png",
    location: "#7, CLC Works Road, Chromepet, Chennai 600044.",
    locationLink: "https://maps.app.goo.gl/vc9dp3FrmSMmMy7g6",
    contact: ["044 66667777", "044 71111117"],
    mail: "info@relainstitute.com",
    link:"/"
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
    link:"/locations/kumaran"
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
    link:"/locations/red-hills"
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
    link:"/locations/nanganallur"
  },
    {
    name: "Rela Clinic, Adyar",
    unit: "A unit of JR Super Speciality Ltd.",
    image: "/assets/images/rela-clinic-adyar.png",
    location:
      "34, 29, Second Main Rd, Kasturba Nagar, Adyar, Chennai, Tamil Nadu 600 020.",
    locationLink: "",
    contact: ["93846 02201"],
    mail: "adyar@relainstitute.com",
    link:"/locations/adyar"
  },
  {
    name: "Rela Clinic, Pallikaranai",
    unit: "A unit of JR Super Speciality Ltd.",
    image: "/assets/images/rela-clinic-pallikaranai.png",
    location:
      "144, 6th St, Kamakoti Nagar, Pallikaranai, Chennai, Tamil Nadu 600100",
    locationLink: "",
    contact: ["93846 02718"],
    mail: "pallikaranai@relainstitute.com",
    link:"/locations/pallikaranai"
  },
];

export default function HomeClient({ coeData, deptData, doctorsData, heroBanners, healthPackages, allTestimonials, featuredTestimonials }) {

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
          {heroBanners.map((slide, i) => {
            const HeadingTag = i === 0 ? 'h1' : 'h2'

            if (slide.type === 'image') {
              return (
                <SwiperSlide key={slide.id}>
                  <Link href={slide.link || "/"} className={`${style.slide} ${style.imageSlide}`} style={{backgroundImage:`url(${mobile?slide.mobileImage:slide.image})`}}>
                  <div className={`container ${style.container}`}>

                  </div>
                  </Link>
                </SwiperSlide>
              )
            }

            return (
              <SwiperSlide key={slide.id}>
                <div className={`${style.slide}`} style={{backgroundImage:`url(${mobile?slide.mobileImage:slide.image})`}}>
                <div className={`container ${style.container}`}>
<div className={style.content}>
  <div className={`${style.title} common_heading`}>
    <HeadingTag>{slide.title} <span>{slide.fancyText}</span></HeadingTag>
  </div>
  <p className="white_text">{slide.description}</p>
  <Button {...(slide.buttonType === 'call' ? { type: 'call' } : {})} classname="white_btn" text={slide.buttonText} link={slide.buttonLink}/>
</div>
                </div>
                </div>
              </SwiperSlide>
            )
          })}
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


<section className={`common_section no_padding_top ${style.excellenceSection}`}>
  <div className={`container ${style.container}`}>

<div className={`section_container ${style.section_container}`}>
    <div className={style.left} data-aos="fade-right">
      <div className={`top_heading ${style.top_heading}`}>
<h2 className="common_heading">The Strength of Specialised Care.</h2>
<p>Our specialists work across disciplines to provide coordinated care for a wide range of health conditions, from routine consultations to complex treatments.</p>
<Button link="/department" classname="orange_btn" text="Explore All Specialities"/>
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

<section className={`common_section gray_bg ${style.deptSection}`}>

<div className={`section_container column ${style.section_container}`}>
 <div className={`container ${style.container}`}>
      <div className={`top_heading center ${style.top_heading}`} data-aos="fade-up">
<h2 className="common_heading">The Strength of Specialised Care.</h2>
<p>Our specialists work across disciplines to provide coordinated care for a wide range of health conditions, from routine consultations to complex treatments.</p>
<Button link="/department" classname="orange_btn" text="Explore All Specialities"/>
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


<section className={`gray_bg ${style.packageSection}`}>
<div className={`container ${style.container}`}>
  <div className={style.content}>
    <div className={`top_heading`} data-aos="fade-right">
      <h2 className="common_heading">
        A Healthier Tomorrow Starts <span>Today</span>
      </h2>
      <p>Take a proactive approach to your health with preventive screening packages designed to help you stay informed.</p>
      <Button classname="orange_btn" link="/health-packages" text="Explore Health Packages"/>
    </div>
    <div className={style.image} data-aos="fade-up">
      <span>Comprehensive<br/>Screening Packages</span>
      <span>Seamless Follow-Up Care</span>
      <span>Specialist-Led Health<br/>Assessments</span>
      <span>Advanced Diagnostic<br/>Technology</span>

      <Image src="/assets/images/happy-doctor.png" width={430} height={405} alt="Doctor with a patient"/>
    </div>
  </div>


{mobile &&
<div className={style.packages} data-aos="fade-up">


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


{!mobile &&
<div className={style.packages} data-aos="fade-left">



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



<section className={`common_section ${style.advancedSection}`} ref={advancedSectionRef}>

<div className={`section_container column ${style.section_container}`}>
 <div className={`container ${style.container}`}>

  <div className={style.left} data-aos="fade-right">
      <div className={`top_heading column ${style.top_heading}`}>
<h2 className="common_heading">At the Heart of Everything We Do</h2>
<Button link="/about-us" classname="orange_btn" text="Discover Rela Hospital"/>
      </div>
      {!mobile &&
      <p>Rela Hospital brings together highly qualified medical professionals, advanced infrastructure and modern technology to provide comprehensive healthcare across more than 50 disciplines. Our focus is on clinical excellence, innovation and compassionate care.
</p>
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
      <p data-aos="fade-up">Rela Hospital brings together highly qualified medical professionals, advanced infrastructure and modern technology to provide comprehensive healthcare across more than 50 disciplines. Our focus is on clinical excellence, innovation and compassionate care.
</p>
   }

    </div>



  </div>
</section>



<section className={`gray_bg ${style.deskSection}`}>

<div className={`section_container column ${style.section_container}`}>
 <div className={`container ${style.container}`}>

  <div className={style.left} data-aos="fade-right">
      <div className={`top_heading column ${style.top_heading}`}>
<h2 className="common_heading">From the Desk Of<br/><span>Prof. Mohamed Rela</span></h2>
<Button text={"Read more"} classname={`orange_btn`} link={`/about-us/from-the-desk-of-prof-mohamed-rela`}/>
      </div>
      </div>

      <div className={style.center} data-aos="fade-up">
        <Image src="/assets/images/mohd-rela.png" width={560} height={593} alt="Prof. Mohamed Rela"/>
      </div>

<div className={style.right} data-aos="fade-left">
<strong>Dear Friends and Colleagues,</strong>
<p>Rela Hospital was established with a vision to provide outstanding clinical care by bringing together highly qualified medical professionals and state-of-the-art infrastructure.</p>
<p>We remain committed to transforming the health of the people we serve through innovation, high standards of patient care and the dedication of our doctors and employees.</p>
<p>We believe technology can bridge therapeutic gaps. Above all, we believe that compassion cures.</p>
<p><strong>Prof. Mohamed Rela</strong><br/>Chairman and Managing Director<br/>Rela Hospital</p>
</div>


    </div>



  </div>
</section>


<section className={`common_section  ${style.internationalSection}`}>

<div className={`section_container column ${style.section_container}`}>
 <div className={`container ${style.container}`}>

  <div className={style.left} data-aos="fade-right">
      <div className={`top_heading column ${style.top_heading}`}>
<h2 className="common_heading white_text">World-Class Care, Wherever You Call Home.</h2>
<Image src="/assets/images/flags.svg" width={284} height={39} alt="Flags of countries we serve"/>
<p className="white_text">At Rela Hospital, care knows no borders. Looking for specialised medical care in India? Our team is here to guide you through your treatment journey.</p>
<Button text="Explore International Patient Services" link="/international-patients" classname="orange_btn"/>
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


<section className={`common_section gray_bg ${style.roboticSection}`}>
<div className={`container section_container column ${style.container}`}>
  <div className={`top_heading ${style.content}`} data-aos="fade-left">
<h2 className="common_heading">Robotic <br className="desktop_break"/>Surgery for More <br className="desktop_break"/>Precise Care </h2>
<Button link="" classname="orange_btn" text="Explore Robotic Surgery"/>
<p>Explore robotic-assisted surgical procedures and the technology supporting advanced treatment at Rela Hospital.</p>
  </div>
  {mobile &&
  <Image className={style.roboticImage} data-aos="fade-right" src="/assets/images/robotic-img.png" width={945} height={625} alt="Robotic surgery system"/>
  }
</div>
</section>



<TestimonialSection allTestimonials={allTestimonials} featuredTestimonials={featuredTestimonials}/>







<section className={`common_section gray_bg ${style.locationSection}`}>
  <div className={`container ${style.container}`}>

<div className={`section_container column`}>
  <div className={`top_heading center ${style.top_heading}`} data-aos="fade-up">
    <h2 className="common_heading">We're Here When You Need Us</h2>
  </div>



<div className={style.locationCards} data-aos="fade-up">


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
            slidesPerView: 1.9,
          },
          1200:{
            slidesPerView: 3,
          },
          1600:{
            slidesPerView: 4,
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
            <Button type="link" link={item.link} classname={`orange_btn ${style.locationLink}`} text="View location"/>

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
      <div className="location_fraction_pagination fraction_pagination"/>

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




  </div>
</section>


   </>
  );
}
