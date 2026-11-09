import React from 'react'
import style from './resourcesCard.module.css'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../components/UI/Button'

export default function ResourcesCard({resources,cardStyle}) {
  return (
     <div className={`${style.resourcesCard} ${style[cardStyle]}`} >

<div className={style.image}>
    <Image src={resources.image || "/assets/images/resouces-sample.png"} alt={resources.name || ''} width={360} height={423}/>
</div>


<div className={style.content}>
<div className={style.detail}>
    {/* notranslate: GTranslate's client-side widget would otherwise transliterate
        resources names like any other text — see src/app/layout.js for the widget setup */}
    <h3 className={`${style.title} notranslate`}>{resources.title}</h3>
</div>

<Button type="link" link={resources.link} text={`View Document`} classname={`orange_btn`}/>

</div>


    </div>
  )
}
