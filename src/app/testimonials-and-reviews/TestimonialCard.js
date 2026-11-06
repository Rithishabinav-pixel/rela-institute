import React from 'react'
import style from './testimonialCard.module.css'
import Image from 'next/image'


export default function TestimonialCard({data,cardStyle}) {
  return (
     <div className={`${style.testSlide} ${style[cardStyle]}`}>
          <p>{data.content}</p>

          <div className={style.testUser}>
            <Image
              src={data.image}
              width={40}
              height={40}
              alt={data.name || "User"}
            />
            <h3>{data.name}</h3>
          </div>
        </div>
  )
}
