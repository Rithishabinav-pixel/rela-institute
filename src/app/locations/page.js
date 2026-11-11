import React from 'react'
import style from './locations.module.css'
import Image from 'next/image';
import Button from '../components/UI/Button';

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


const cardData = [
    {
        icon:"/assets/images/me.svg",
        title:"Multispeciality Expertise",
        text:"Access specialists across a wide range of medical disciplines under one healthcare ecosystem."
    },
    {
        icon:"/assets/images/ai.svg",
        title:"Advanced Infrastructure",
        text:"Modern operating suites, diagnostic capabilities and critical-care infrastructure support complex treatment."
    },
    {
        icon:"/assets/images/ds.svg",
        title:"Dedicated Support",
        text:"Our international patient team helps coordinate the practical aspects of your healthcare journey."
    },
    {
        icon:"/assets/images/pc.svg",
        title:"Personalised Care",
        text:"Your medical needs, treatment plan and circumstances are considered throughout the care journey."
    },
]

export default function page() {
  return (
   <>
   
   
   <section className={`common_section  ${style.locationSection}`}>
  <div className={`container ${style.container}`}>

<div className={`section_container column`}>
  <div className={`top_heading left ${style.top_heading}`} data-aos="fade-up">
    <h2 className="common_heading">Find Rela Care <span>Near You</span> </h2>
    <p>Whether you need help with an appointment, medical enquiry, location, or patient support, our team is here to assist you.</p>
  </div>


   
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
      <Button type="link" link={item.link} classname={`orange_btn ${style.locationLink}`} text="View location"/>

    </div>

  </div>
  ))}

</div>



</div>




  </div>
</section>
   

   {/* decisions section  */}
<section className={`common_section gray_bg ${style.trust_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={`top_heading ${style.top_heading} center`} data-aos="fade-up">
            <h2 className='common_heading'>Advanced Diagnostics Behind Every Clinical Decision</h2>
        </div>
        <div className={style.cards} data-aos="fade-up">
            {cardData.map((item,index)=>(
            <div className={style.card} key={index}>
                <Image src={item.icon} width={80} height={80} alt=''/>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
            </div>

            ))}
        </div>
    </div>
</section>

   </>
  )
}
