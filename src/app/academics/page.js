"use client"
import React, { useEffect, useState } from 'react'
import style from './academic.module.css'
import Button from '../components/UI/Button'
import Image from 'next/image'
import Link from 'next/link'

const biherData = [
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "HPB Surgery and Liver Transplantation",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Liver Intensive Care",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Liver Transplant and HPB Anesthesia",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Transplant Hepatology",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Paediatric Gastroenterology & Hepatology",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Paediatric Transplant Hepatology",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Interventional Radiology",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "General Surgery (Minimal Access)",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Gynaec Surgery (Minimal Access)",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "High-Rish Obstretrics",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Critical Care",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Orthopedics - Sports Medicine",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Orthopedics - Spine Medicine",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Orthopedics - Arthroplasty",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Apheresis Medicine",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Medical Gastroenterology and Advanced Endoscopy",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Neonatology",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Infectious Disease",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Infection Prevention & Control",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Reproductive Medicine",
    link: "/"
  }
];


const NBEMSData = [
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "General Anaethesia (DNB)",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Paediatrics (DNB)",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Internal Medicine (DNB)",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Radiology (DNB)",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Surgical Gastroenterology (DrNB)",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Medical Gastroenterology (DrNB)",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Critical Care (DrNB)",
    link: "/"
  },
  {
    icon: "/assets/images/sample-ceo-icon.svg",
    title: "Transplant Anesthesia (FNB)",
    link: "/"
  }
];

const liverInterLinks = [
  {
       icon: "/assets/images/sample-ceo-icon.svg",
    title: "Liver Transplant Surgery",
    link: "/"
  },
    {
       icon: "/assets/images/sample-ceo-icon.svg",
    title: "Liver Transplant Anesthesia and Critical Care",
    link: "/"
  },
    {
       icon: "/assets/images/sample-ceo-icon.svg",
    title: "Transplant Hepatology",
    link: "/"
  },
]

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
                <h1 className='white_text common_heading'>Fellowships at Rela Hospital <br className='desktop_break'/><span>Learn. Lead. Innovate.</span></h1>
                <p className='white_text'>Rela Institute & Medical Centre is dedicated to advancing medical education through structured training, clinical excellence, and research-driven learning. Our Academic Department offers a wide range of postgraduate and fellowship programs aimed at shaping the next generation of healthcare professionals.</p>
           <Button classname="orange_btn" text="Book a Health Check-up" link="/health-packages"/>
            </div>
        </div>
    </section>


    {/* about section  */}
   <section className={`common_section ${style.about_section}`}>
    <div className={`container section_container ${style.container}`}>
        <div className={style.image} data-aos="fade-right">
            <Image src="/assets/images/academic-about.png" width={1920} height={500} alt=''/>
        </div>
        <div className={`${style.content} top_heading left`} data-aos="fade-left">
<h2 className='common_heading'>Academics at Rela Hospital</h2>
<div className={style.text}>
    <p>Rela Institute & Medical Centre is dedicated to advancing medical education through structured training, clinical excellence, and research-driven learning. Our Academic Department offers a wide range of postgraduate and fellowship programs aimed at shaping the next generation of healthcare professionals.</p>
    <p>We offer prestigious fellowship programs in collaboration with renowned institutions such as Bharath Institute of Higher Education and Research (BIHER), Liver Transplant Society of India (LTSI), Society for Emergency Medicine India (SEMI), and the Indian Diploma in Critical Care Medicine (IDCCM).</p>
    <p>RIMC is also a recognized center for the National Board of Examinations in Medical Sciences (NBEMS), offering Diplomate of National Board (DNB), Doctorate of National Board (DrNB), and Fellowship of National Board (FNB) courses across various specialties.</p>
    <p>With a focus on academic excellence, hands-on clinical experience, and interdisciplinary education, Rela Institute provides a robust platform for medical professionals to grow, lead, and innovate in their fields.</p>
</div>
        </div>
    </div>
   </section>

{/* overview section  */}
<section className={`common_section no_padding_bottom ${style.overview_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={`top_heading ${style.top_heading} left`} data-aos="fade-right">
            <h2 className='common_heading white_text'>Lorem ipsum dolor sit amet, consectetur</h2>
        </div>

<div className={style.cards}>
    <div className={`${style.card} ${style.card1} top_heading left`} data-aos="fade-right">
<h3 className='orange_text'>Overview</h3>
<div className={style.text}>
    <p className='white_text'>Keeping in view the explosion of knowledge in modern medicine, Rela hospital (accredited Bharat Institute of Higher Education & Research) has introduced a series of Post-Doctoral Fellowship Programmes in different disciplines (specialty or sub-specialty), wherein suitable candidates will be imparted training in the concerned area.</p>
    <p className='white_text'>These Post-Doctoral Fellowship Programmes aim that the candidates get exposure in the concerned disciplines with particular emphasis on their clinical skills. The course is meant to give intensive hands–on clinical training with periodic evaluation by experienced teaching staff.</p>
</div>
    </div>

<div className={style.image} data-aos="fade-up">
    {mobile?
    <Image src="/assets/images/academic-overview-bg-m.png" width={393} height={439} alt=''/>:
    <Image src="/assets/images/academic-overview.png" width={628} height={543} alt=''/>}
</div>

   <div className={`${style.card} ${style.card2} top_heading left`} data-aos="fade-left">
<h3 className='orange_text'>Eligibility For Admission</h3>
<div className={style.text}>
    <p className='white_text'>Candidates who have passed Medical Post Graduate Degree Courses recognized by the Medical Council of India are eligible to join in Post–Doctoral Fellowship Programme. This includes M.D., M.S., D.M., M.Ch., & D.N.B., in the concerned specialty.</p>
    <p className='white_text'>Candidates who have studied in foreign countries (outside India) and qualified in Medical P.G, Diploma in Clinical Courses, FRCS, MRCP, MRCS, FRACS & AB or any other equivalent specialty degree in their country of concerned specialty are also eligible to join the Post-Doctoral Fellowship Programme</p>
</div>
    </div>

</div>

    </div>
</section>




<section className={`common_section ${style.excellenceSection}`}>
  <div className={`container ${style.container}`}>

<div className={`section_container ${style.section_container}`}>
    <div className={style.left} data-aos="fade-right">
      <div className={`top_heading ${style.top_heading}`}>
<h2 className="common_heading">BIHER Fellowship Program</h2>
<ul className='common_list'>
    <li>BIHER is a deemed-to-be-university, recognized by the University Grants Commission (UGC) and accredited by NAAC. Located in Chennai, India, BIHER offers various undergraduate, postgraduate, and doctoral programs in fields like medicine, dentistry, nursing, engineering, and more.</li>
    <li>At BIHER, we strive for academic excellence, innovative research, and holistic development. Our faculty and infrastructure provide students with a conducive learning environment.</li>
    <li>As an affiliate of BIHER, Dr. Rela Institute and Medical Centre collaborates to offer high- quality medical education and training, adhering to BIHER's standards and regulations.</li>
</ul>
      </div>
    </div>

    <div className={style.right} data-aos="fade-left">

      {biherData.map((item,i)=>(
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


<section className={`common_section gray_bg ${style.excellenceSection}`}>
  <div className={`container ${style.container}`}>

<div className={`section_container ${style.section_container}`}>
    <div className={style.left} data-aos="fade-right">
      <div className={`top_heading ${style.top_heading}`}>
<h2 className="common_heading">National Board of Examinations in Medical Sciences (NBEMS)</h2>
<ul className='common_list'>
    <li>The National Board of Examinations in Medical Sciences (NBEMS) is an autonomous organization under the Ministry of Health and Family Welfare, Government of India. NBEMS conducts postgraduate medical entrance examinations, diplomas, and fellowships in various specialties.</li>
    <li>At Dr. Rela Institute and Medical Centre, we are committed to providing high-quality education and training in medical sciences, aligning with NBEMS standards.</li>
    <li>Our faculty and programs are designed to prepare students for NBEMS examinations and equip them with the knowledge, skills, and expertise required for excellence in their chosen specialties."
</li>
</ul>
      </div>
    </div>

    <div className={style.right} data-aos="fade-left">

      {NBEMSData.map((item,i)=>(
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


<section className={`common_section no_padding_bottom ${style.liver_section}`}>
    <div className={`container section_container ${style.container}`}>
        <div className={`${style.content} top_heading left`}>
            <h2 className='common_heading'>Liver Transplant Soceity of India</h2>
            <p>In collaboration with LTSI, RIMC offers fellowship program - comperhensive training in liver transplant specialties</p>
            <h3 className='orange_text'>Key features</h3>
            <ul className='common_list'>
                <li><b>Course Regulations:</b> <span>Developed by LTSI</span></li>
                <li><b>Candidate Selection and Training:</b> <span>Conducted and regulated by RIMC</span></li>
                <li><b>Intake Sessions:</b> <span>Twice a year (January and June)</span></li>
                <li><b>Program Duration:</b> <span>1 and 2 years</span></li>
                <li><b>Specialties :</b> <span>Liver Transplant Surgery<br/>Liver Transplant Anesthesia and Critical Care<br/>Transplant Hepatology</span></li>
                <li><b>Fees and Examination:</b> <span>Managed by LTSI</span></li>

            </ul>
        </div>
        <div className={style.image}>
          <Image className={style.mainImg} src="/assets/images/academic-liver.png" width={604} height={619} alt=''/>
{liverInterLinks.map((item,index)=>(
  <Link href={item.link} key={index}>
    <Image src={item.icon} width={40} height={40} alt=''/>
    <h3>{item.title}</h3>
  </Link>
))}
        </div>
    </div>
</section>


<section className={`common_section gray_bg no_padding_bottom ${style.isccm_section}`}>
    <div className={`container section_container ${style.container}`}>
       
        <div className={style.image}>
          <Image className={style.mainImg} src="/assets/images/isccm-img.png" width={452} height={680} alt=''/>

  <Link href="/">
    <Image className={style.icon} src="/assets/images/sample-ceo-icon.svg" width={40} height={40} alt=''/>
    <h3>Intensive Care</h3>
  </Link>

    <Link href="/">
    <Image className={style.logo} src="/assets/images/isscm.png" width={260} height={100} alt=''/>
  </Link>

        </div>

         <div className={`${style.content} top_heading left`}>
            <h2 className='common_heading'>Intensive Care Fellowship Program by Indian Society of Critical Care Medicine (ISCCM)</h2>
            <p>In collaboration with ISCCM offers a 1-year Intensive Care Fellowship Program (IDCCM).</p>
            <h3 className='orange_text'>Key features</h3>
            <ul className='common_list'>
                <li><b>Course Regulations:</b> <span>Designed by ISCCM</span></li>
                <li><b>Candidate Selection, Training, and Stipends:</b> <span>Managed and regulated by RIMC</span></li>
                <li><b>Exit Exam and Degree Certificate:</b> <span> Conducted and awarded by ISCCM</span></li>
                <li><b>Course Start Dates:</b> <span> January and July</span></li>
                <li><b>Fees and Examination:</b> <span>Managed by LTSI</span></li>

            </ul>
        </div>

    </div>
</section>


<section className={`common_section no_padding_bottom ${style.semi_section}`}>
    <div className={`container section_container ${style.container}`}>
       

         <div className={`${style.content} top_heading left`}>
            <h2 className='common_heading'>Society for Emergency Medicine India (SEMI)</h2>
            <p>In collaboration with of Society for Emergency Medicine India (SEMI), RIMC offers a 3-year Emergency Medicine Fellowship Program.</p>
            <h3 className='orange_text'>Key features</h3>
            <ul className='common_list'>
                <li><b>Course Regulations:</b> <span>Designed by SEMI</span></li>
                <li><b>Program Duration: </b> <span>3 years</span></li>
                <li><b>Candidate Selection, Training, and Stipend:</b> <span>  Managed and regulated by RIMC</span></li>
                <li><b>Exit Exam and Degree Certificate: </b> <span> Conducted and awarded by SEMI</span></li>

            </ul>
        </div>

        
        <div className={style.image}>
          <Image className={style.mainImg} src="/assets/images/semi-img.png" width={656} height={597} alt=''/>

  <Link href="/">
    <Image className={style.icon} src="/assets/images/sample-ceo-icon.svg" width={40} height={40} alt=''/>
    <h3>Emergency Medicine</h3>
  </Link>

    <Link href="/">
    <Image className={style.logo} src="/assets/images/semi.png" width={96} height={83} alt=''/>
  </Link>

        </div>

    </div>
</section>



<section className={`common_section gray_bg no_padding_bottom ${style.neuroscience_section}`}>
    <div className={`container section_container ${style.container}`}>
        

        <div className={style.image}>
          
        
          <Image className={style.mainImg} src="/assets/images/neuroscience-img.png" width={750} height={716} alt=''/>

        </div>

         <div className={`${style.content} top_heading left`}>
            <h2 className='common_heading'>M.Sc. Physician Associate in Clinical Neuroscience</h2>
            <p>Admissions Open for 2026-2027<br/>Build a Career in Advanced Neurocare</p>
            <p>Course starting on <strong>1st August</strong><br/>
            Last date of application : <strong>15-Jul-2026</strong><br/>
            Interview: <strong>23-Jul-2026</strong></p>

            <h3 className='orange_text'>Programme Highlights:</h3>
            <ul className='common_list'>
                <li><b>Duration:</b> <span>2 Years + Clinical Training</span></li>
                <li>Exposure to advanced neurodiagnostic techniques / simulation-based learning</li>
            </ul>

             <h3 className='orange_text'>Eligibility for Admission</h3>
            <ul className='common_list'>
                <li>B.Sc. in Allied Health Sciences / Life Sciences. Background in Biology preferred.</li>
                <li>As per institutional and NCAHP norms</li>
                <li><b>Fees: </b><span>2 lakhs per annum</span></li>
            </ul>

            <Button classname="orange_btn" text="Read More" link="/"/>

        </div>

    </div>
</section>


   </>
  )
}
