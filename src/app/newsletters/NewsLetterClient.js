"use client"

import React, { useEffect, useMemo, useState } from 'react'
import style from './newsletter.module.css'
import Image from 'next/image'
import Button from '../components/UI/Button'


export default function NewsLetterClient() {




  return (
      <>

<div className={`static_page`}>
<section className={style.topSection}>
  <div className={`container ${style.container}`}>
    <h1 className='common_heading'>Beyond the Headlines at Rela</h1>
  </div>
</section>

<section className={style.articlesGrid}>

  <div className={`container ${style.container}`}>

    <div className={style.newsletterListing}>

 <div className={style.actions}>


      <div className={`${style.action_button} ${style.search}`}>
<input
  type='text'
  placeholder='Search by Name'
  value=''
  onChange={()=>{}}
  
/>
<button type='button'> <Image src="/assets/images/search-normal.svg" width={32} height={32} alt=''/> </button>
      </div>

 <div className={`${style.action_button} ${style.sort}`}>
              <select >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="A-Z">A-Z</option>
              </select>
            </div>


    </div>

<div className={style.newsletterCards}>

  <div className={style.card}>
    <Image className={style.featureImg} src="/assets/images/sample-newsletter.png" width={360} height={202} alt=''/>
    <div className={style.content}>
    <p className={style.date}>April, 2023</p>
    <h2 className={style.title}>Ask. Listen. Care. By Dr. Somu Sivabalan.</h2>
    <Button type="link" classname="orange_btn" text="Download now" link="#"/>

    </div>
  </div>

    <div className={style.card}>
    <Image className={style.featureImg} src="/assets/images/sample-newsletter.png" width={360} height={202} alt=''/>
    <div className={style.content}>
    <p className={style.date}>April, 2023</p>
    <h2 className={style.title}>Ask. Listen. Care. By Dr. Somu Sivabalan. Ask. Listen. Care. By Dr. Somu Sivabalan.</h2>
    <Button type="link" classname="orange_btn" text="Download now" link="#"/>

    </div>
  </div>

</div>


</div>



</div>

</section>
</div>


    </>
  )
}
