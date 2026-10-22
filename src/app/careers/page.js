import React from 'react'
import style from './career.module.css'
import Button from '../components/UI/Button'
import Image from 'next/image'
import { listJobsPublic } from '@/lib/jobs'
import CareersTableClient from './CareersTableClient'

export const revalidate = 3600

const careerCards = [
    {
        icon:"/assets/images/clinical-excellence.svg",
        title:"Clinical Excellence",
        content:"Work alongside experienced specialists across a wide range of medical disciplines."
    },
    {
        icon:"/assets/images/multidisciplinary-collaboration.svg",
        title:"Multidisciplinary Collaboration",
        content:"Be part of teams where different areas of expertise come together to support complex patient care."
    },
    {
        icon:"/assets/images/advanced-healthcare.svg",
        title:"Advanced Healthcare",
        content:"Work in an environment supported by modern medical infrastructure and technology."
    },
    {
        icon:"/assets/images/continuous-learning.svg",
        title:"Continuous Learning",
        content:"Build your knowledge and capabilities through exposure to diverse clinical and professional experiences."
    },
]

export default async function page() {
  const jobs = await listJobsPublic().catch((error) => {
    console.error('[careers] failed to load jobs:', error.message)
    return []
  })

  return (
    <>
    
    <section className={style.bannerSection}>
        <div className={`${style.container} container`}>
            <div className='top_heading center'>
                <h1 className='white_text common_heading'>Build Your Career Where <span>Care Comes First</span></h1>
                <p className='white_text'>Join a healthcare environment where clinical expertise, advanced technology and a commitment to patient care come together to create meaningful work every day.</p>
                <div className={style.buttons}>
                    <a href='#explore' className='common_btn orange_btn'>Explore Opportunities <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt=''/></a>
                    <Button classname="white_btn orange_stroke" text="Submit Your Profile" link=""/>



                </div>
            </div>
        </div>
    </section>


    <section className={`common_section ${style.careerAbout_section}`} >
        <div className={`container ${style.container} section_container column`}>
            <div className='top_heading center'>
                <h2 className='common_heading'>More Than a Job. A Role in Better Healthcare.</h2>
                <p>Healthcare is built by people. At Rela, your expertise becomes part of a multidisciplinary environment where people work together to deliver advanced and compassionate care.</p>
            </div>

<div className={style.cards}>
    {careerCards.map((card,i)=>(
        <div className={style.card} key={i}>
            <Image className={style.icon} src={card.icon} width={80} height={80} alt={card.title}/>
            <h3>{card.title}</h3>
            <p>{card.content}</p>
        </div>
    ))}
</div>

        </div>
    </section>




     <section className={`common_section no_padding_top ${style.careersList_section}`} id='explore'>
        <div className={`container ${style.container} section_container column`}>
            <div className='top_heading center'>
                <h2 className='common_heading'>Find Your Next Opportunity</h2>
                <p>Whether you are an experienced healthcare professional or building your career in healthcare, explore opportunities across Rela.</p>
            </div>
<CareersTableClient jobs={jobs}/>

        </div>
    </section>
    
    </>
  )
}
