import React from 'react'
import style from '../detail.module.css'
import Image from 'next/image'
import Button from '@/app/components/UI/Button'
import Link from 'next/link'
import TestimonialSection from '@/app/components/TestimonialSection/TestimonialSection'
import { listAllTestimonialsPublic, listFeaturedTestimonialsPublic } from '@/lib/testimonials'


const stats = [

    {
        count:"100+",
        text:"Hospital Beds"
    },
     {
        count:"45+",
        text:"Advanced ICU Beds"
    },
     {
        count:"24/7",
        text:"Emergency Care"
    },
]


const coeData = [
  {
    icon: "/assets/images/sample-l.svg",
    title: "Liver Transplantation & Gastro care Services"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Emergency and Trauma"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Orthopaedics & Spine Surgery"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "ENT"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "General Surgery & Minimal Access Surgery"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "General Medicine & Internal Medicine"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Plastic Surgery"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Nephrology and Urology"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Dermatology"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Vascular Surgery"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "ICU and Critical Care Services"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Obstetrics & Gynaecology"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Psychiatry"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Neurology & Neurosurgery"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Cardiology"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Diabetology"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Oncology"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Pediatrics"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Pulmonology"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Pharmacy"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "CT Scan"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "X-Ray"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "ECHO"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "TMT"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "ECG"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Cath Lab"
  },
  {
    icon: "/assets/images/sample-l.svg",
    title: "Ultrasound Scan"
  }
];

const whyChooseData = [
    {
        icon:"/assets/images/pharma.svg",
        title:"Pharmacy",
        text:'Lorem ipsum dolor sit amet consectetur.'
    },
     {
        icon:"/assets/images/ct.svg",
        title:"CT Scan",
        text:'Lorem ipsum dolor sit amet consectetur.'
    },
     {
        icon:"/assets/images/xray.svg",
        title:"X-Ray",
        text:'Lorem ipsum dolor sit amet consectetur.'
    },
     {
        icon:"/assets/images/echo.svg",
        title:"ECHO",
        text:'Lorem ipsum dolor sit amet consectetur.'
    },
     {
        icon:"/assets/images/tmt.svg",
        title:"TMT",
        text:'Lorem ipsum dolor sit amet consectetur.'
    },
     {
        icon:"/assets/images/ecg.svg",
        title:"ECG",
        text:'Lorem ipsum dolor sit amet consectetur.'
    },
     {
        icon:"/assets/images/cathlab.svg",
        title:"Cath Lab",
        text:'Lorem ipsum dolor sit amet consectetur.'
    },
     {
        icon:"/assets/images/uss.svg",
        title:"Ultrasound Scan",
        text:'Lorem ipsum dolor sit amet consectetur.'
    },
]

const locationData={
    address:`4/833, GNT Road,<br>Padiyanallur, Redhills,<br>Chennai 600052`,
    contact:["044-7111 1111"],
    mail:["info@rimshospitals.com"]
}

export default async function page() {
  const [allTestimonialsResult, featuredTestimonialsResult] = await Promise.all([
    listAllTestimonialsPublic({ cursor: 0, limit: 20 }).catch(() => ({ items: [] })),
    listFeaturedTestimonialsPublic({ cursor: 0, limit: 5 }).catch(() => ({ items: [] })),
  ])
  const allTestimonials = allTestimonialsResult.items
  const featuredTestimonials = featuredTestimonialsResult.items
  return (
  <>
   {/* hero section  */}
         <section className={`${style.bannerSection}`} style={{backgroundImage:`url(/assets/images/adyar-bg.png)`}}>
        <div className={`${style.container} container`}>
            <div className={`top_heading ${style.top_heading} left`} data-aos="fade-up">
                <p className={`${style.locationName} white_text`}>Rela MS Hospital, Red Hills</p>
                <h1 className='white_text common_heading'>One Stop Destination for <br className='desktop_break'/><span>Complete Health Care</span></h1>
                <Image className={style.ratingImg} src="/assets/images/rating-img-adyar.svg" width={231} height={76} alt=''/>
            </div>
        </div>
    </section>

    {/* about location  */}
  <section className={`common_section ${style.about_section}`}>
    <div className={`container section_container ${style.container}`}>
        <div className={style.content} data-aos="fade-right">
            <div className='top_heading left'>
            <h2 className='common_heading'>Comprehensive Care, Closer to You</h2>
            <div className={style.text}>
                <p>Rela MS Hospital, Red Hills was established to extend advanced healthcare services to North Chennai and neighbouring communities. By bringing together Rela's clinical expertise with the established infrastructure of MS Hospital, the centre offers coordinated care across medical, surgical, critical care and emergency services.</p>
                <p>With specialists across multiple disciplines and facilities equipped to manage both routine and complex conditions, the hospital is focused on delivering timely, accessible and high-quality care for every patient.</p>
            </div>
            <div className={style.stats}>
{stats.map((item,i)=>(
    <div className={style.card} key={i}>
        <h2 className={`${style.count} orange_text`}>{item.count}</h2>
        <p>{item.text}</p>
    </div>
))}
            </div>
            </div>
        </div>

        <div className={style.image} data-aos="fade-left">
            <Image src="/assets/images/adyar-feature-img.png" width={750} height={574} alt=''/>
        </div>

    </div>
  </section>


  
<section className={`common_section gray_bg ${style.excellenceSection}`}>
  <div className={`container ${style.container}`}>

<div className={`section_container ${style.section_container}`}>
    <div className={style.left} data-aos="fade-right">
      <div className={`top_heading ${style.top_heading}`}>
<h2 className="common_heading">Services & Facilities Designed Around Your Care</h2>
<p>Our specialists collaborate across departments to provide coordinated care for both everyday and complex health conditions.</p>
<Button link="" classname="orange_btn" text="Book an Appointment"/>
      </div>
    </div>

    <div className={style.right} data-aos="fade-left">

      {coeData.map((item,i)=>(
        <div key={i} className={style.card}>
          <div className={style.icon}>
          <Image src={item.icon} className={style.icon} width={40} height={40} alt=""/>
          </div>
          <h3 className={style.title}>{item.title}</h3>
        </div>
      ))}

    </div>
</div>
  </div>
</section>


<section className={`common_section ${style.why_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={`top_heading center`} data-aos="fade-up">
            <h2 className='common_heading'>Why Choose Rela for Liver Transplant Care?</h2>
        </div>
        <div className={style.cards} data-aos="fade-up">
            {whyChooseData.map((item,i)=>(
                <div className={style.card} key={i}>
                    <Image src={item.icon} width={80} height={80} alt=''/>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                </div>
            ))}
        </div>
    </div>
</section>

<TestimonialSection bg="gray" allTestimonials={allTestimonials} featuredTestimonials={featuredTestimonials}/>


<section className={`common_section ${style.map_section}`}>

<div className={`container ${style.container}`} data-aos="fade-up">
        <div className={style.content} >
            <div className="top_heading left">
                <h2 className='common_heading'>Your Route to Rela MS Hospital, Red Hills</h2>
                <p>Conveniently located on GNT Road, Rela MS Hospital, Red Hills provides multispeciality and emergency healthcare services for patients across North Chennai and surrounding areas.</p>
                <strong>Dr. Rela Institute & MS Hospital</strong>
                <ul>
                    <li>
                    <div className={style.icon}> <Image src="/assets/images/location.svg" width={32} height={32} alt=''/> </div>
                    <div className={style.detail}>
                   <p dangerouslySetInnerHTML={{ __html: locationData.address }} />
                    </div>
                    </li>
                 <li>
                    <div className={style.icon}> <Image src="/assets/images/call.svg" width={32} height={32} alt=''/> </div>
                     <div className={style.detail}>
                        {locationData.contact.map((mobile,i)=>(
                            <a key={i} href={`tel:${mobile.replaceAll(" ","")}`}>{mobile}</a>
                        ))}
                    </div>
                    </li>
                    <li>
                    <div className={style.icon}> <Image src="/assets/images/location.svg" width={32} height={32} alt=''/> </div>
                     <div className={style.detail}>
                        {locationData.mail.map((mail,i)=>(
                            <a key={i} href={`mailto:${mail}`}>{mail}</a>
                        ))}
                    </div>
                    </li>
                   
                </ul>
            </div>
        </div>
    </div>

    <iframe className={style.mapFrame} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.468916575973!2d80.24594998417403!3d13.00578368143212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526783c8fb58db%3A0x257cc233d5c0dee0!2sRela%20Clinic!5e0!3m2!1sen!2sin!4v1793792751511!5m2!1sen!2sin" allowFullScreen="" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>

    
</section>

  </>


  )
}
