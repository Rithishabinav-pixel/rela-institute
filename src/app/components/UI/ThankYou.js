import React from 'react'
import style from "./ThankYou.module.css"
import Button from './Button'

export default function ThankYou() {
  return (
  <section className='common_section'>
    <div className={`container ${style.container}`}>
        <h1 className='common_heading'>Thank <span>You</span></h1>
        <p>We have successfully received your enquiry. Our team will review your request and get in touch with you shortly to assist you. Your health and well-being are our priority. We look forward to helping you on your journey towards better health.</p>
  
        <b>For immediate assistance, please contact us at:</b>
        <div className={style.buttons}>
            <Button type={`call`} link={`tel:+914466667777`} classname={`orange_btn`} text={`Call now`}/>
            <Button  link="/" classname={`white_btn orange_stroke`} text={`GoTo Home`}/>

        </div>
    </div>
  </section>
  )
}
