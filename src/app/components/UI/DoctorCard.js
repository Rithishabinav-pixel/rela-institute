import React from 'react'
import style from './doctorCard.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function DoctorCard({doctor,cardStyle}) {
  return (
    <div className={`${style.doctorCard} ${style[cardStyle]}`} >

<div className={style.image}>
    <Image src={doctor.image || "/assets/images/doc-sample-img.png"} alt='' width={361} height={423}/>
</div>


<div className={style.content}>
<div className={style.detail}>
    {/* notranslate: GTranslate's client-side widget would otherwise transliterate
        doctor names like any other text — see src/app/layout.js for the widget setup */}
    <h3 className={`${style.name} notranslate`}>{doctor.name}</h3>
    <p className={style.speciality}>{doctor.speciality}</p>
    <p className={style.position}>{doctor.position}</p>
</div>

<Link href={doctor.link}>
<Image src="/assets/images/doctor-arrow.svg" width={40} height={40} alt=''/>
</Link>

</div>


    </div>
  )
}
