"use client"

import React, { useEffect, useState } from 'react'
import style from './infrastructure.module.css'
import Button from '../components/UI/Button'
import Image from 'next/image'
import AnimatedCounter from '../components/UI/AnimatedCounter'
import useSectionInView from '../components/UI/useSectionInView'


const decisionsData = [
    {
        icon:"/assets/images/automated.svg",
        title:"Automated Cryostat for Frozen Section",
        text:"Lorem ipsum dolor sit amet consectetur. Eget nibh cursus libero semper a sit ut tellus cras."
    },
    {
        icon:"/assets/images/stainer.svg",
        title:"Automated Immunohistochemistry Stainer",
        text:"Lorem ipsum dolor sit amet consectetur. Eget nibh cursus libero semper a sit ut tellus cras."
    },
    {
        icon:"/assets/images/test.svg",
        title:"Liquid-Based Cytology Test",
        text:"Lorem ipsum dolor sit amet consectetur. Eget nibh cursus libero semper a sit ut tellus cras."
    },
    {
        icon:"/assets/images/maldi.svg",
        title:"MALDI-TOF for Rapid Identification of Microbes",
        text:"Lorem ipsum dolor sit amet consectetur. Eget nibh cursus libero semper a sit ut tellus cras."
    },
]

export default function page() {

    const [advancedSectionRef, countersInView] = useSectionInView();

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
                <h1 className='white_text common_heading'>Infrastructure Built for <br className='desktop_break'/><span>Advanced Care</span></h1>
                <p className='white_text'>From specialised critical care units and modern diagnostic facilities to integrated outpatient and inpatient services, Rela Hospital is equipped with advanced infrastructure designed to support complex care, accurate diagnosis and better patient outcomes.</p>
            </div>
        </div>
    </section>


{/* support section  */}
<section className={`common_section ${style.support_section}`}>
    <div className={`container ${style.container}`}>
        <div className={style.content} data-aos="fade-right">
        
                <h2 className='common_heading'>Designed to Support <span>Care at Every Step</span></h2>
                <p>Rela Hospital brings together thoughtfully planned outpatient, inpatient and critical care facilities to support patients through every stage of their healthcare journey. From dedicated consultation suites and integrated diagnostic services to comfortable inpatient spaces and specialised intensive care units, the hospital infrastructure is designed to make care more coordinated, accessible and efficient.</p>
                <Button classname="orange_btn" link="https://appointments.relainstitute.com:8080/" text="Book an Appointment"/>
     
        </div>
        <div className={style.image} ref={advancedSectionRef} data-aos="fade-left">
              <div className={style.counter} data-aos="zoom-in">
    <h3 className="orange_text"><AnimatedCounter target={450} start={countersInView} /><span>+</span></h3>
<p className="">Hospital Beds</p>
  </div>

     <div className={style.counter} data-aos="zoom-in">
    <h3 className="orange_text"><AnimatedCounter target={72} start={countersInView} /><span>+</span></h3>
<p className="">Outpatient Consultation Suites</p>
  </div>

     <div className={style.counter} data-aos="zoom-in">
    <h3 className="orange_text"><AnimatedCounter target={150} start={countersInView} /><span>+</span></h3>
<p className="">Intensive Care Beds</p>
  </div>

     <div className={style.counter} data-aos="zoom-in">
    <h3 className="orange_text"><AnimatedCounter target={360} start={countersInView} /><span>+</span></h3>
<p className="">Outpatient Services</p>
  </div>
            <Image src="/assets/images/support.png" width={600} height={600} alt=''/>
        </div>
    </div>
</section>


{/* fertility section  */}

<section className={`${style.fertility_section}`}>
<div className={`container section_container column ${style.container}`}>
    <div className={style.content} data-aos="fade-left">
        <div className='top_heading left'>
            <h2 className='common_heading'>Advanced Fertility Care for Men and Women</h2>
            <p>Rela Hospital's dedicated fertility centre provides specialised reproductive care supported by advanced assisted reproductive technologies and multidisciplinary expertise.</p>
            <ul className='common_list'>
                <li><strong>Intra Cytoplasmic Sperm Injection (ICSI)</strong><br/>Lorem ipsum dolor sit amet consectetur. Sapien sagittis velit accumsan aliquam ut. Tincidunt laoreet risus at suscipit neque.</li>
                 <li><strong>Laser Assisted Hatching (LAH)</strong><br/>Lorem ipsum dolor sit amet consectetur. Sapien sagittis velit accumsan aliquam ut. Tincidunt laoreet risus at suscipit neque.</li>
                <li><strong>Pre-implantation Genetics</strong><br/>Lorem ipsum dolor sit amet consectetur. Sapien sagittis velit accumsan aliquam ut. Tincidunt laoreet risus at suscipit neque.</li>
                 <li><strong>Uterine Transplant</strong><br/>Lorem ipsum dolor sit amet consectetur. Sapien sagittis velit accumsan aliquam ut. Tincidunt laoreet risus at suscipit neque.</li>
            </ul>
        </div>
    </div>
    {mobile && 
    <div className={style.image} data-aos="fade-right">
        <Image src="/assets/images/fertility-mobile.png" width={978} height={978} alt=''/>
    </div>
    }
</div>
</section>

{/* technology section  */}

<section className={`common_section ${style.technology_section}`}>
    <div className={`container section_container ${style.container}`}>
        <div className={style.content} data-aos="fade-right">
            <h2 className='common_heading'>Imaging Technology for <span>Clearer Clinical Decisions</span></h2>
            <p>Advanced radiology and imaging facilities support clinicians with detailed diagnostic information for accurate assessment, treatment planning and ongoing care.</p>
            <ul className='common_list'>
                <li><strong>128 Slice CT</strong> <br/>A high-speed CT scanner that captures detailed cross-sectional images of the body and supports faster, more precise diagnosis.</li>
                <li><strong>3 Tesla MRI</strong> <br/>A high-speed CT scanner that captures detailed cross-sectional images of the body and supports faster, more precise diagnosis.</li>
                <li><strong>Cardiac MRI</strong> <br/>A high-speed CT scanner that captures detailed cross-sectional images of the body and supports faster, more precise diagnosis.</li>

            </ul>
        </div>
        <div className={style.image} data-aos="fade-left">
            <Image src="/assets/images/tech.png" width={768} height={579} alt=''/>
        </div>
    </div>
</section>

{/* Transfusion section  */}
<section className={`common_section ${style.transfusion_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={style.content} data-aos="fade-right">
<div className={`top_heading left`}>
    <h2 className='common_heading white_text'>Comprehensive Support for Transfusion Care</h2>
    <p className='white_text'>Rela Hospital's blood bank and transfusion medicine facility is equipped to support routine, surgical and complex clinical requirements with specialised blood processing and therapeutic services.</p>
                    <Button classname="orange_btn" link="https://appointments.relainstitute.com:8080/" text="Book an Appointment"/>

    <ul className='common_list'>
        <li className='white_text'>Automated 1H500 Analyzer</li>
        <li className='white_text'>Blood Component Separation & Therapy</li>
        <li className='white_text'>Therapeutic Apheresis Unit</li>
    </ul>
</div>
        </div>
        {mobile && 
        <div className={style.image}>
            <Image src="/assets/images/transfusion-mobile.png" width={1114} height={800} alt=''/>
        </div>
        }
    </div>
</section>


{/* decisions section  */}
<section className={`common_section ${style.decision_section}`}>
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


{/* Diagnosis section  */}
<section className={`common_section gray_bg ${style.diagnosis_section}`}>

    <div className={`container section_container column ${style.container}`}>
        <div className={style.content} data-aos="fade-right">
            <div className={`top_heading left`}>
                <h2 className='common_heading'>Advanced Endoscopy for Diagnosis and Intervention</h2>
                <p>Dedicated endoscopy facilities at Rela Hospital support a range of advanced diagnostic and therapeutic procedures using specialised endoscopic technologies.</p>
                <ul className='common_list'>
                    <li>ERCP & EUS Suite</li>
                    <li>Endoscopic Ultrasound</li>
                    <li>Spyglass Cholangioscopy</li>
                    <li>Capsule Endoscopy</li>
                    <li>Capsule Endoscopy</li>
                </ul>
            </div>
        </div>
        {mobile && 
        <div className={style.image} data-aos="fade-left">
            <Image src="/assets/images/diagnosis_mobile.png" width={887} height={721} alt=''/>
        </div>
        }
    </div>

</section>




</>
  )
}
