"use client"
import React, { useEffect, useState } from 'react'
import style from './rela.module.css'
import Image from 'next/image'
import Button from '@/app/components/UI/Button'

const advancementsData = [
    {
        icon:"/assets/images/liver-transplantation.svg",
        title:"Liver Transplantation",
        content:"A pioneer in liver transplantation, Prof. Rela has advanced complex surgical techniques and improved transplant care, giving patients renewed hope."
    },
     {
        icon:"/assets/images/medical-education.svg",
        title:"Medical Education",
        content:"Dedicated to nurturing future surgeons, Prof. Rela has trained and mentored medical professionals, sharing his expertise in advanced surgical care."
    },
     {
        icon:"/assets/images/research-innovation.svg",
        title:"Research & Innovation",
        content:"Through clinical research and surgical innovation, Prof. Rela continues to explore new techniques that enhance transplant outcomes and patient care."
    },
     {
        icon:"/assets/images/international-contributions.svg",
        title:"International Contributions",
        content:"Prof. Rela's global contributions to liver transplantation have helped advance surgical expertise and strengthen international medical collaboration."
    }
]

export default function page() {

      const [mobile, setMobile] = useState(false);
      const [laptop,setLaptop] = useState(false);
    
      useEffect(() => {
        const checkDevice = () => {
          setMobile(window.innerWidth < 1200);setLaptop(window.innerWidth<1500);
        }
    
        checkDevice()
        window.addEventListener('resize', checkDevice)
    
        return () => {
          window.removeEventListener('resize', checkDevice)
        }
      }, [])

  return (
  <>
  
  {/* hero section  */}
    <div className={`${style.about_section} gray_bg common_section no_padding_bottom ${style.rela}`}>
        <div className={`container section_container ${style.container}`}>
             <div className={`${style.content} top_heading left`} data-aos="fade-right">
                <div className={`${style.details} ${style.text}`}>
                    <h2 className='common_heading'>From the Desk of <br/><span>Prof. Mohamed Rela</span></h2>
                    <p><strong>Dear Friends & Colleagues,</strong></p>
                </div>
                <div className={style.text}>
                    <p>Rela Hospital has been established with a vision to provide outstanding clinical care. Here, we have integrated highly qualified medical professionals, who are best in their respective fields, with state-of-the-art infrastructure. We have dedicated ourselves to transforming the health of people we serve. We aim to innovate and lead by maintaining the highest standards in patient care. We guarantee complete doctor and employee commitment. We may be regarded as one of the most scientifically advanced hospitals in India because we believe that technology bridges therapeutic gaps. Above all, we believe that compassion cures.</p>
                </div>

                <div className={style.detail}>
                    <h3>Prof. Mohamed Rela </h3>
                    <p className='orange_text'>Chairman and Managing Director, Rela Hospital</p>
                </div>
            
            </div>
            <div className={style.image} data-aos="fade-left">
                <Image src="/assets/images/md-rela.png" width={688} height={749} alt=''/>
            </div>
           
        </div>
    </div>


    {/* vision  */}
  <section className={`common_section ${style.vision_section}`}>
    <div className={`container section_container ${style.container}`}>

        {laptop && 
<div className={style.image} data-aos="fade-right">
    <Image src="/assets/images/rela-vision.png" width={885} height={721} alt=''/>
</div>
}

<div className={`${style.content} top_heading left`} data-aos="fade-left">
<h2 className='common_heading'>The Man Behind the Vision</h2>
<div className={style.text}>
    <p>The sum and substance of a man is essentially routed in his origins but the raw material is moulded by the wealth of experience that life deals out. Prof. Mohamed Rela was born in a small village in the Thanjavur district which is known as the rice bowl of south India. It has also been the heart land of the Tamil culture for centuries. Essentially, this is who Prof. Rela is- a proud son of the soil with a native soul. He was moulded by an education at the eclectic Kalakshetra school in Chennai, an institute of formidable repute known for its deep rooted “Indianess”. After his formal medical education in Stanley Medical College, his sojourn to the UK and his subsequent life there honed his personality to include western ethics into Indian ethos. The man he is now, is a combination of keen intelligence, principles, diligence and generosity with a hint of vulnerability.</p>
    <p>Prof. Mohamed Rela has many accolades to his credit. He stood first in the first ever state level postgraduate entrance examination, as he enrolled for the Masters in Surgery course at Stanley Medical College, Chennai. After completing another Masters in Surgery, he cleared the Fellowship exams of the Royal College of Surgeons in the UK. He spent his initial few years in the UK rotating across surgical specialities fine tuning his surgical skills.</p>
</div>
 <div className={style.buttons}>
                    <Button classname="orange_btn" link="#" text={`View Profile`}/>
                    <Button classname="white_btn orange_stroke" link="#" text={`Book an Appointment`}/>

                </div>
</div>

    </div>
  </section>


{/* advancements  */}
<section className={`common_section dark_bg ${style.advancement_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={`top_heading center ${style.top_heading}`} data-aos="fade-up">
            <h2 className='common_heading white_text'>Pioneering Advancements in Medicine</h2>
        </div>

<div className={style.cards} >
    {advancementsData.map((card,i)=>(
        <div className={style.card} key={i}  data-aos="fade-up">
            <Image src={card.icon} width={80} height={80} alt=''/>
            <h3>{card.title}</h3>
            <p>{card.content}</p>
        </div>
    ))}
</div>

    </div>
</section>

{/* philosopy  */}

<section className={`common_section  ${style.philosopy_section}`}>
    <div className={`container section_container column ${style.container}`}>
        <div className={`top_heading center ${style.top_heading}`} data-aos="fade-up">
            <h2 className='common_heading'>The Philosophy Behind His Vision</h2>
            <p>Explore each award, the person or team it honoured, and the achievement behind the recognition.</p>
        </div>

<div className={style.cards}>
    <div className={`${style.card} ${style.vision}`} data-aos="fade-right">
        <div className={style.innerCard}>
        <h3 className="common_heading"><span className='black_text'>His Vision</span></h3>
        <p>Prof. Mohamed Rela’s vision is to bring international standards to healthcare. He envisions a patient-centric system dedicated to transforming lives through excellent clinical quality, easily accessible to all. His focus is on complex diseases requiring extensive treatment as well as primary healthcare.</p>
    </div>
    </div>

{!mobile && 
   <div className={style.image} data-aos="fade-up" data-aos-delay="1000">
<Image src="/assets/images/rela-mis-vis.png" width={403} height={449} alt=''/>
   </div>
}

        <div className={`${style.card} ${style.mission}`} data-aos="fade-left">
            <div className={style.innerCard}>
        <h3 className="common_heading"><span className='black_text'>His Mission</span></h3>
        <ul className='common_list'>
            <li>To cure disease and preserve health by providing comprehensive, ethical and affordable healthcare, delivered with kindness</li>
            <li>To bring to the patient highly qualified medical professionals who are pioneers in their respective field in our quaternary care Institute</li>
            <li>To provide primary, secondary and tertiary care to all sections of the society and international patients</li>
            <li>To create a supportive team by helping drive innovation, focusing on positive outcomes</li>
            <li>To foster growth through academics and research</li>
        </ul>
    </div>
    </div>

</div>

    </div>
</section>

  </>
  )
}
