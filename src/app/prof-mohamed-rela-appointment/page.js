"use client"
import React, { useEffect, useState } from 'react'
import style from './appointment.module.css'
import Image from 'next/image'
import Button from '@/app/components/UI/Button'
import AnimatedCounter from '../components/UI/AnimatedCounter'
import useSectionInView from '../components/UI/useSectionInView'


export default function page() {

      const [mobile, setMobile] = useState(false);
      const [laptop,setLaptop] = useState(false);
      const [advancedSectionRef, countersInView] = useSectionInView();
    
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
    <div className={`${style.about_section} gray_bg  ${style.rela}`} ref={advancedSectionRef}>
        <div className={`container section_container ${style.container}`}>
             <div className={`${style.content} top_heading left`} data-aos="fade-right">
                <div className={`${style.details} ${style.text}`}>
                    <h2 className='common_heading'>Expert Liver Care with <span>Prof. Mohamed Rela</span></h2>
                    <p>Consult Prof. Mohamed Rela, MS, FRCS, DSc, for liver disease, HPB surgery and liver transplantation. Choose your preferred language to begin your appointment request.</p>
                </div>
                                    <h3 className='orange_text'>Guinness World Record Holder for a transplant on a five-day-old baby</h3>

            <div className={style.stats}>
                <div className={style.card}>
                    <h3 className="orange_text"><AnimatedCounter target={28} start={countersInView} /><span>+</span></h3>
                    <p>Years of International Experience</p>
                </div>
                 <div className={style.card}>
                    <h3 className="orange_text"><AnimatedCounter target={4000} start={countersInView} /><span>+</span></h3>
                    <p>Liver Transplant Surgeries</p>
                </div>
            </div>

            <div className={style.buttons}>
                {/* <Button classname="orange_btn" link="#" text="View Profile"/> */}
                <Button classname="white_btn orange_stroke" link="https://appointments.relainstitute.com:8080/" text="Book an Appointment"/>
            </div>

        
            
            </div>
            <div className={style.image} data-aos="fade-left">
                <Image src="/assets/images/rela-app.png" width={667} height={777} alt=''/>
            </div>
           
        </div>
    </div>

  </>
  )
}
