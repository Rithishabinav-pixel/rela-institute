import React from 'react'
import style from './popup.module.css'
import Image from 'next/image'

export default function Popup({ videoUrl, activeVideo,setPopup, setActiveVideo, length }) {
  return (
    <div className={style.popup}>
      <div className={style.overlay} onClick={()=>setPopup(false)}></div>

      <div className={style.container}>

        <button className={style.closeBtn} onClick={()=>setPopup(false)}> <Image src="/assets/images/close.svg" width={24} height={24} alt="Close" /> </button>

     
          <button disabled={activeVideo===0}
            className={`${style.button} ${style.prev}`}
            onClick={() => setActiveVideo(activeVideo - 1)}
          >
            <Image src="/assets/images/slider-prev-arrow.svg" width={24} height={24} alt="Previous" />
          </button>
  

   
          <button disabled={activeVideo === length - 1}
            className={`${style.button} ${style.next}`}
            onClick={() => setActiveVideo(activeVideo + 1)}
          >
            <Image src="/assets/images/slider-next-arrow.svg" width={24} height={24} alt="Next" />
          </button>
   

        <iframe
          src={videoUrl}
          title="Patient experience video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />

      </div>
    </div>
  )
}