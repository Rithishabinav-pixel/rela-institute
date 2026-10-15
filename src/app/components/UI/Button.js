import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Button({ link, classname, text, type,aos }) {
  if (type === 'call') {
    return (
      <a href={link} className={`common_btn ${classname}`}>
         <Image src="/assets/images/call.svg" width={24} height={24} alt=''/> {text}
      </a>
    )
  }

   if (type === 'link') {
    return (
      <a href={link} className={`link_btn ${classname}`}>
        {text} <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt=''/> 
      </a>
    )
  }

  return (
    <Link href={link} className={`common_btn ${classname}`} dats-aos={aos?aos:""}>
      {text} <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt=''/>
    </Link>
  )
}