"use client"
import React, { useEffect, useState } from 'react'
import Button from '../components/UI/Button'
import Image from 'next/image'
import style from './health.module.css'
import PackageCard from '../components/UI/PackageCard'

const healthCheckData = [
    {
        icon:"/assets/images/confident.svg",
        title:"Confidential & Secure",
        text:"Your privacy is always protected."
    },
     {
        icon:"/assets/images/accurate.svg",
        title:"Accurate Results",
        text:"NABL accredited labs with advanced technology."
    },
     {
        icon:"/assets/images/expert.svg",
        title:"Expert Team",
        text:"Tests reviewed by experienced professionals."
    },
     {
        icon:"/assets/images/qa.svg",
        title:"Quick Turnaround",
        text:"Reports available within 12–48 hours."
    },
]

const stats = [
  {
    icon:"/assets/images/ba.svg",
    title:"Book an Appointment",
    text:"Lorem ipsum dolor sit amet consectetur"
  },
    {
    icon:"/assets/images/tyt.svg",
    title:"Take Your Tests",
    text:"Lorem ipsum dolor sit amet consectetur"
  },
    {
    icon:"/assets/images/ri.svg",
    title:"Reports in 24hrs",
    text:"Lorem ipsum dolor sit amet consectetur"
    }
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
    },
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

const splitIndex = Math.max(7, Math.ceil(faq.length / 2));

const firstFaq = faq.slice(0, splitIndex);
const secondFaq = faq.slice(splitIndex);

export default function HealthPackagesClient({ packages }) {

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


  return (
    <>

       <section className={`${style.bannerSection}`}>
        <div className={`${style.container} container`}>
            <div className={`top_heading ${style.top_heading} left`} data-aos="fade-up">
                <h1 className='white_text common_heading'>Stay One Step <br className='desktop_break'/><span>Ahead of Your Health</span></h1>
                <p className='white_text'>Regular health check-ups can help identify potential health risks early, monitor important health indicators, and support timely medical care. Our comprehensive health check-up packages are designed for individuals of different ages, lifestyles, and healthcare needs.</p>
                <div className={style.buttons}>
                    <Button classname="white_btn orange_btn" text="Book a Health Check-up" link=""/>
                </div>
            </div>
        </div>
    </section>



    {/* checkup section  */}
<section className={`common_section no_padding_bottom ${style.checkup_section}`}>
    <div className={`container ${style.container}`}>
        <div className={style.image} data-aos="fade-right">
            <Image src="/assets/images/checkup.png" width={730} height={797} alt=''/>
        </div>
        <div className={`${style.content} ${style.top_heading} top_heading inner`}  data-aos="fade-left">
            <h2 className='common_heading'>More Than a Checkup. A Step Towards Better Health.</h2>
            <p>At present, people ignore minor health problems and don’t consider them a big deal that later becomes a significant cause of major diseases. Therefore, everyone should pay attention to every symptom and sign the body shows. When the body reacts differently often, it is essential to take a full body checkup. It is a routine test in which all the body systems are tested, such as blood tests, urine tests, stool tests, diabetes tests, thyroid tests, etc. However, by getting the entire body examined, diseases can be detected in advance. Over and above that, to keep the body healthy, a complete body check-up must be done at least once a year.</p>
            <Button classname="orange_btn" type="download" text="Download Brochure" link="#"/>
        </div>
    </div>
</section>


<section className={`common_section dark_bg ${style.healthCheck_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={`top_heading center`} data-aos="fade-up">
            <h2 className='common_heading white_text'>Everything You Need for a Complete Health Check</h2>
        </div>
        <div className={style.cards} data-aos="fade-up">
            {healthCheckData.map((item,i)=>(
                <div className={`${style.card} top_heading inner`} key={i} >
                    <Image className={style.icon} src={item.icon} width={80} height={80} alt=''/>
                    <h3 className=''>{item.title}</h3>
                    <p>{item.text}</p>
                </div>
            ))}
        </div>
    </div>
</section>


{/* packages  */}
<section className={`common_section ${style.packages_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={`top_heading center`} data-aos="fade-up">
            <h2 className='common_heading'>Find the Right Health Check for You</h2>
            <p>Whether you are an experienced healthcare professional or building your career in healthcare, explore opportunities across Rela.</p>
        </div>


<div className={style.packageCards}>
    {packages.map((item,i)=>(
        <PackageCard item={item} key={item.id ?? i} duration={i}/>
    ))}
</div>

    </div>
</section>



<section className={`common_section no_padding_top ${style.yourCare_section}`}>
  <div className={`container ${style.container}`}>
<div className={style.statsArea}>
    <div className={`${style.blurLayer}`}>
      <div className={style.right}></div>
      <div className={style.center}></div>
    </div>
    <div className={`${style.content} top_heading left`} data-aos="fade-right">
      <h2 className="common_heading white_text">Your Health Check, Made Simple</h2>
      <div className={style.actions}>
        <Button classname={`orange_btn`} link="#" text="Book a Health Checkup"/>
        <Button classname={`white_btn orange_stroke`} link="#" text="Download Brochure "/>

      </div>
    </div>

    <div className={style.stats} data-aos="fade-left">
      {stats.map((item,index)=>(
        <div className={style.card} key={index} >
          <Image src={item.icon} width={80} height={80} alt={item.title}/>
          <h3 className='white_text'>{item.title}</h3>
          <p className="white_text">{item.text}</p>
        </div>
      ))}
    </div>

</div>
  </div>
</section>

<section className={`common_section gray_bg ${style.faq_section}`}>
<div className={`container section_container column ${style.container}`}>
    <div className={`top_heading ${style.top_heading} center`}>
    <div className={style.title}  data-aos="fade-up">
        <h2 className='common_heading'>Common Questions About Health Packages</h2>
    </div>
    </div>
  <div className={style.faq} data-aos="fade-left">

    <div className={style.cards} data-aos="fade-right">
        {firstFaq.map((item, i) => (
            <div
                className={`${style.card} ${activeFaq === i ? style.active : ""}`}
                key={i}
            >
                <div
                    className={style.head}
                    onClick={() => setActiveFaq(prev => prev === i ? null : i)}
                >
                    <h3>{item.title}</h3>
                    <button>
                        <Image
                            src="/assets/images/faq-arrow.svg"
                            width={32}
                            height={32}
                            alt=""
                        />
                    </button>
                </div>

                <div className={style.body}>
                    <div>{item.content}</div>
                </div>
            </div>
        ))}
    </div>

    <div className={style.cards} data-aos="fade-left">
        {secondFaq.map((item, i) => {
            const actualIndex = i + splitIndex;

            return (
                <div
                    className={`${style.card} ${activeFaq === actualIndex ? style.active : ""}`}
                    key={actualIndex}
                >
                    <div
                        className={style.head}
                        onClick={() => setActiveFaq(prev => prev === actualIndex ? null : actualIndex)}
                    >
                        <h3>{item.title}</h3>
                        <button>
                            <Image
                                src="/assets/images/faq-arrow.svg"
                                width={32}
                                height={32}
                                alt=""
                            />
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


    </>
  )
}
