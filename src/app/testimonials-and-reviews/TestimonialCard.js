import React from 'react'
import style from './testimonialCard.module.css'
import Image from 'next/image'


export default function TestimonialCard({data,index,cardStyle,setActivePopup}) {
  return (
     <div className={`${style.testSlide} ${style[cardStyle]}`}>
            <h3>{data.title}</h3>
          <p>{data.content}</p>

{cardStyle !=='popup_card' && 
                  <button href="javascript:void(0)" className={`link_btn orange_btn`} onClick={()=>setActivePopup(index)}>
                            Read More<Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt=''/> 
                        </button>
                        }


          <div className={style.testUser}>
            <Image
              src={data.image}
              width={40}
              height={40}
              alt={data.name || "User"}
            />
            <h4>{data.name}</h4>
          </div>
        </div>
  )
}
