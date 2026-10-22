"use client"
import React, { useEffect, useState } from 'react'
import style from './contact.module.css'
import Image from 'next/image'
import Link from 'next/link';
import ContactForm from '../components/ContactForm/ContactForm';

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

  return (
    <div className='static_page'>

<section className={style.contactSection}>
<div className={`container ${style.container}`}>

    <div className={style.contentArea}>

        <div className={style.topSection} data-aos="fade-right">
        <h1 className='common_heading'>We’re Here to Help You Find the <span>Right Care</span></h1>
        <p>Whether you need help with an appointment, medical enquiry, location, or patient support, our team is here to assist you.</p>

        <div className={`${style.emergency} top_heading`}>
            <h2>For Medical Emergencies, <br className='desktop_break'/>Help Is Just a Call Away</h2>
            <p>If you require urgent medical attention, contact Rela's emergency services directly.</p>
        </div>
        </div>

        <div className={`${style.topbarCta}`}>
                <ul>
                    <li data-aos="fade-up" data-aos-delay="100"> 
                        <a href='tel:04422006001'>
                            <div className={style.icon}> <Image src="/assets/images/ambulance.svg" width={40} height={40} alt=''/></div>

                            <div className={style.content}>
                                <p className={style.label}>Ambulance:</p>
                                <p className={style.text}>044 2200 6001</p>
                                </div>
                        </a>
                         </li>
                         <li data-aos="fade-up" data-aos-delay="200"> 
                        <a href='tel:04422006000'>
                            <div className={style.icon}> <Image src="/assets/images/emergency.svg" width={40} height={40} alt=''/></div>
                            <div className={style.content}>
                                <p className={style.label}>Emergency:</p>
                                <p className={style.text}>044 2200 6000</p>
                                </div>
                             
                        </a>
                         </li>
                         <li data-aos="fade-up" data-aos-delay="300"> 
                        <a href='tel:+911234567890'>
                            <div className={style.icon}> <Image src="/assets/images/apointment.svg" width={40} height={40} alt=''/></div>
                            <div className={style.content}>
                                <p className={style.label}>Appointment:</p>
                                <p className={style.text}>+91 1234567890</p>
                                </div>
                             
                        </a>
                         </li>
                </ul>
            </div>

            <div className={`${style.locationContainer} top_heading`} data-aos="fade-right">
<h2>Find a Rela Location Near You</h2>
<p>Access Rela's hospitals and clinics across Chennai. Choose a location to view its services, contact details and directions.</p>

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

            </div>


            
            
    </div>

    <div className={style.formArea} data-aos="fade-left">
      <ContactForm/>
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

<section className={`common_section no_padding_top ${style.faq_section}`}>
<div className={`container ${style.container}`}>
    <div className={style.title}  data-aos="fade-right">
        <h2 className='common_heading'>Common Questions About Liver Transplantation</h2>
    </div>
    <div className={style.faq} data-aos="fade-left">
        {faq.map((item,i)=>(
 <div className={`${style.card} ${activeFaq===i?style.active:""}`} key={i}>
            <div className={style.head} onClick={()=>{setActiveFaq((prev)=>prev===i?null:i)}}>
                <h3>{item.title}</h3>
                <button> <Image src="/assets/images/faq-arrow.svg" width={32} height={32} alt=''/> </button>
            </div>
            <div className={style.body}>
              <div>
                {item.content}
                </div>
            </div>
        </div>
        ))}
       
    </div>
</div>
</section>

    </div>
  )
}
