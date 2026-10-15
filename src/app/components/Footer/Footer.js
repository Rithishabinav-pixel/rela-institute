"use client"

import React, { useEffect, useState } from 'react'
import style from "./footer.module.css"
import Button from '../UI/Button'
import Link from 'next/link'
import menuLinks from './menuLinks';
import Image from 'next/image';


const { mainMenuLinks, otherLinks } = menuLinks;




export default function Footer() {


    const [activeMenu,setActiveMenu] = useState();

    const showMenu = (i) =>{
        activeMenu===i?setActiveMenu(null):setActiveMenu(i)       ;
    }

    
      const [mobile,setMobile] = useState(false);
    
      useEffect(()=>{
    
        const checkDevice = () =>{
        setMobile(window.innerWidth<767);
        }
    
        checkDevice();
        window.addEventListener("resize",checkDevice);
    
        return(()=>{
        window.removeEventListener("resize",checkDevice);
        })
    
    
      },[])




  return (
    <footer id={style.footer}>

        

{/* cta section  */}
<div className={style.ctaSection}>
    <div className={`container ${style.container}`}>
    <div className={`top_heading ${style.left}`}>
        <h2 className='common_heading white_text'>
            Need Help Finding the <br className='desktop_break'/><span>Right Care?</span>
        </h2>
        <p className='white_text'>Speak with our patient-care team for appointments, medical enquiries and treatment assistance.</p>
    </div>

    <Button classname="orange_btn" link="#" text="Discover Rela Hospital"/>
</div>
        </div>

        {/* main menu container */}

        <div className={style.mainMenu}>
             <div className={`container ${style.container}`}>
                {mainMenuLinks.map((menu,i)=>(

 <div className={style.menuColumn} key={i}>
                <h3>{menu.heading}
                    {mobile &&  <button onClick={()=>showMenu(i)}></button> }
                     </h3>
                <ul className={activeMenu===i?style.active:""}>
                    {menu.links.map((link,index)=>(
                    <li key={index}> <Link href={link.link}>{link.label}</Link> </li>

                    ))}
                    
                </ul>
            </div>

                ))}
           

            </div>
        </div>

        {/* other links  */}
<div className={style.otherLinks}>
    <div className={`container ${style.container}`}>
        <h3>See Other Link</h3>
        <div className={style.otherMenuCard}>
        {otherLinks.map((item,i)=>(
            <div className={style.card} key={i}>
<h4>{item.heading}  
    
    {mobile &&  <button onClick={()=>showMenu(i+20)}></button>
    }
    </h4>

<ul className={`${style.linksList} ${activeMenu===i+20?style.active:""}`}>
{item.links.map((link,index)=>(
    <li key={index}> <Link href={link.link}>{link.label}</Link> </li>
))}
</ul>

            </div>
        ))}
        </div>
    </div>
</div>


{/* bottom content  */}

<div className={style.staticSection}>
    <div className={`container ${style.container}`}>
        <Link href="/" className={style.logo}>
        <Image src="/assets/images/footer-logo.svg" width={230} height={118} alt=''/>
        </Link>

        <div className={style.certificate}>
        <Image src="/assets/images/certificate.svg" width={300} height={115} alt=''/>
        </div>

        <p className='white_text'>
            Rela Hospital is a multispeciality and quaternary care hospital in Chennai, providing advanced care across liver transplantation, critical care, cardiac sciences, cancer care, neurosciences, orthopaedics, women’s health, paediatrics and other medical specialities.
        </p>


    </div>
</div>


{/* bottom bar  */}
<div className={style.bottomBar}>
    <div className={`container ${style.container}`}>
        <ul className={style.socialLinks}>
            <li> <a href='#'> <Image src="/assets/images/fb-i.svg" width={30} height={30} alt=''/> </a> </li>
            <li> <a href='#'> <Image src="/assets/images/x-i.svg" width={30} height={30} alt=''/> </a> </li>
            <li> <a href='#'> <Image src="/assets/images/insta-i.svg" width={30} height={30} alt=''/> </a> </li>
            <li> <a href='#'> <Image src="/assets/images/linkedin-i.svg" width={30} height={30} alt=''/> </a> </li>
        </ul>
        <p className='white_text'>Copyrights © {new Date().getFullYear()} Rela Institute & Medical Centre. All Rights Reserved.</p>
        <ul className={style.bottomLinks}>
            <li> <Link href="/">Terms and Conditions </Link>  </li>
            <li> <Link href="/">Cancellation and Refund Policy</Link>  </li>
            <li> <Link href="/">Privacy Policy</Link>  </li>
            <li> <Link href="/">Disclaimer</Link>  </li>

        </ul>
    </div>
</div>


    </footer>
  )
}
