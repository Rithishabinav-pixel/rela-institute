"use client"

import React, { useEffect, useState } from 'react'
import style from './eligibility.module.css'
import Button from '../components/UI/Button'
import Image from 'next/image';


const medicalData = {
  Anaesthesia: [
    {
      MedicalCourses: "Liver Anaesthesia",
      EligibilityCriteria: "M.D/D.N.B (Anaes)/Equivalent International Qualification",
      duration: "One Year"
    },
    {
      MedicalCourses: "Liver Critical Care",
      EligibilityCriteria: "M.D/D.N.B (Anaes)/Equivalent International Qualification",
      duration: "One Year"
    }
  ],
  Gastroenterology: [
    {
      MedicalCourses: "Hepatology",
      EligibilityCriteria: "D.M./DNB (Hepatology/Med.Gastro.)/Equivalent International Qualification",
      duration: "One Year"
    }
  ],
  Paediatrics: [
    {
      MedicalCourses: "Paediatric Hepatology",
      EligibilityCriteria: "MD/DNB(Paed)/Equivalent International Qualification",
      duration: "One Year"
    },
    {
      MedicalCourses: "Paediatric Intensive Care",
      EligibilityCriteria: "MD/DNB(Paed)/Equivalent International Qualification",
      duration: "One Year"
    }
  ],
  Radiology: [
    {
      MedicalCourses: "Interventional Radiology",
      EligibilityCriteria: "M.D/D.N.B(Radio. Diag)/Equivalent International Qualification",
      duration: "One Year"
    },
    {
      MedicalCourses: "Diagnostic HPB Radiology",
      EligibilityCriteria: "M.D/D.N.B(Radio. Diag)/Equivalent International Qualification",
      duration: "One Year"
    }
  ],
  Medicine: [
    {
      MedicalCourses: "Family Medicine",
      EligibilityCriteria: "M.B.B.S/Equivalent International Qualification",
      duration: "One Year"
    },
    {
      MedicalCourses: "Emergency Medicine",
      EligibilityCriteria: "M.B.B.S/Equivalent International Qualification",
      duration: "Two Year"
    },
    {
      MedicalCourses: "Microbial Medicine and Infectious Diseases",
      EligibilityCriteria: "M.D.(Gen.Med/Paed/Geriatric/Family Medicine) D.N.B(Gen.Med/Paed/Geriatric/Family Medicine)/Equivalent International Qualification",
      duration: "Two Year"
    }
  ]
};


const surgicalData = {
  Orthopedics: [
    {
      SurgicalCourses: "Joint Replacement (Arthroplasty)",
      EligibilityCriteria: "M.S/D.N.B(Ortho)/Equivalent International Qualification",
      duration: "One Year"
    },
    {
      SurgicalCourses: "Arthroscopy",
      EligibilityCriteria: "M.S/D.N.B(Ortho)/Equivalent International Qualification",
      duration: "One Year"
    },
    {
      SurgicalCourses: "Sports Medicine",
      EligibilityCriteria: "M.S/D.N.B(Ortho)/Equivalent International Qualification",
      duration: "One Year"
    }
  ],
  "HPB Surgery & Transplantation": [
    {
      SurgicalCourses: "Hepatobiliary Surgery",
      EligibilityCriteria: "M.Ch/D.N.B(Surg. Gastro)/Equivalent International qualification",
      duration: "One Year"
    },
    {
      SurgicalCourses: "Liver Transplantation",
      EligibilityCriteria: "M.Ch/D.N.B (Surg.Gastro)/Equivalent International qualification",
      duration: "Two Years(One year when combined with HPB Surgery fellowship)"
    }
  ]
};


export default function page() {

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
                <h1 className='white_text common_heading'>Take the Next Step <br className='desktop_break'/><span>in Your Medical Career</span></h1>
                <p className='white_text'>Ready to deepen your expertise? Explore Rela Hospital’s fellowship programmes and find the eligibility requirements that match your qualifications and clinical interests.</p>
            </div>
        </div>
    </section>

    {/* table section  */}

    <section className={`common_section ${style.table_section}`}>

        <div className={`container section_container column ${style.container}`}>
              <div className={`top_heading split ${style.top_heading}`} >
                <div className={`top_heading ${style.top_heading}`} data-aos="fade-right">
<h2 className="common_heading">Find the Fellowship That Fits Your Qualifications</h2>
<p>Explore medical and surgical fellowships across a range of specialities. Review the qualifications and training duration for each programme to understand where your next step could take you.</p>
</div>

<Button link="/" classname="orange_btn" text="Enquire About Admissions" data-aos="fade-left"/>
      </div>

<div className={style.tableContainer}>
    <h3>1. Medical</h3>
   <div className={style.table}>
  <div className={`${style.row} ${style.head}`}>
    <div className={style.col}>S. No.</div>
    <div className={style.col}>Medical Courses</div>
    <div className={style.col}>Eligibility Criteria</div>
    <div className={style.col}>Duration</div>
  </div>

  {Object.entries(medicalData).map(([department, courses]) => (
    <React.Fragment key={department}>
      <div className={style.fullRow}>
        {department} ({courses.length} Courses)
      </div>

      {courses.map((course, index) => (
        <div className={style.row} key={index}>
          <div className={style.col} data-label="S. No.">{index + 1}</div>
          <div className={style.col} data-label="Medical Courses">{course.MedicalCourses}</div>
          <div className={style.col} data-label="Eligibility Criteria">{course.EligibilityCriteria}</div>
          <div className={style.col} data-label="Duration">{course.duration}</div>
        </div>
      ))}
    </React.Fragment>
  ))}
</div>

<h3>2. Surgical</h3>
<div className={style.table}>
  <div className={`${style.row} ${style.head}`}>
    <div className={style.col}>S. No.</div>
    <div className={style.col}>Surgical Courses</div>
    <div className={style.col}>Eligibility Criteria</div>
    <div className={style.col}>Duration</div>
  </div>

  {Object.entries(surgicalData).map(([department, courses]) => (
    <React.Fragment key={department}>
      <div className={style.fullRow}>
        {department} ({courses.length} {courses.length === 1 ? "Course" : "Courses"})
      </div>

      {courses.map((course, index) => (
        <div className={style.row} key={index}>
          <div className={style.col} data-label="S. No.">{index + 1}</div>
          <div className={style.col} data-label="Surgical Courses">{course.SurgicalCourses}</div>
          <div className={style.col} data-label="Eligibility Criteria">{course.EligibilityCriteria}</div>
          <div className={style.col} data-label="Duration">{course.duration}</div>
        </div>
      ))}
    </React.Fragment>
  ))}
</div>
</div>


        </div>

    </section>
  
  <section className={`common_section gray_bg ${style.diagnosis_section}`}>

    <div className={`container section_container column ${style.container}`}>
        <div className={style.content} data-aos="fade-right">
            <div className={`top_heading left`}>
                <h2 className='common_heading'>Apply for Your Fellowship</h2>
                <div className={style.text}>
                <p className='orange_text'><strong>Send your application and updated CV to the Academic Director</strong></p>
                <a href='mailto:academics@relainstitute.com' target='_blank' className={style.mail}>academics@relainstitute.com</a>
                </div>
                <ul className='common_list'>
                    <li><strong>Two admission sessions each year</strong><p>Fellowship sessions begin on 1 January and 1 July.</p></li>
                    <li><strong>Admission and registration deadlines</strong><p>For the January session, admission is permitted until 31 January, with registration closing on 28 February. For the July session, admission is permitted until 31 July, with registration closing on 31 August.</p></li>
                    <li><strong>Up to eight candidates per programme annually</strong><p>Places may be allocated across the January and July sessions, including an intake of four candidates per session, within the annual limit.</p></li>
                    <li><strong>Maximum trainee-to-trainer ratio of 2:1</strong><p>At all times, each trainer may supervise no more than two trainees.</p></li>
                    <li><strong>Apply ahead of your preferred session</strong><p>Applications open three months before the session begins and close one month before the fellowship start date. Submit an up-to-date CV with your application.</p></li>
                </ul>
<Button classname="orange_btn" link={`#`} text={`Enquire Now`}/>


             
            </div>
        </div>
        {mobile && 
        <div className={style.image} data-aos="fade-left">
            <Image src="/assets/images/f-apply.png" width={945} height={867} alt=''/>
        </div>
        }
    </div>

</section>
  
  </>
  )
}
