import React from 'react'
import style from './testimonialCard.module.css'
import Image from 'next/image'


export default function TestimonialCard({data,cardStyle,activeVideo,setActiveVideo,setPopup}) {
  return (
     <div className={`${style.testSlide} ${style[cardStyle]}`}>

<button className={style.play} onClick={()=>{setActiveVideo(activeVideo);setPopup(true)}} ><span></span></button>
          
            <img
              src={data.featureImage}
              alt={data.name || "User"}
            />
            <h3 className={style.name}>{data.name}</h3>
     
        </div>
  )
}
