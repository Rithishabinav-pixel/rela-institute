import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Button({ link, classname, text, type, aos }) {
  if (type === 'call') {
    return (
      <a href={link?link:"/"} target='_blank' className={`common_btn ${classname}`} >
        <Image src="/assets/images/call.svg" width={24} height={24} alt='' />
        {text}
      </a>
    )
  }

  if (type === 'download') {
    return (
      <a href={link?link:"/"} target='_blank' className={`common_btn ${classname}`} data-aos={aos || ''}>
        {text}
        <Image src="/assets/images/download.svg" width={24} height={24} alt='' />
      </a>
    )
  }

  if (type === 'link') {
    return (
      <Link href={link?link:"/"} className={`link_btn ${classname}`} data-aos={aos || ''}>
        {text}
        <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt='' />
      </Link>
    )
  }

  return (
    <Link href={link?link:"/"} className={`common_btn ${classname}`} data-aos={aos || ''}>
      {text}
      <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt='' />
    </Link>
  )
}