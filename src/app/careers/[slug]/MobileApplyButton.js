'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function MobileApplyButton() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setMobile(window.innerWidth < 1200)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
    }
  }, [])

  if (!mobile) return null

  return (
    <a className="common_btn orange_btn" href="#form">
      Apply Now <Image src="/assets/images/btn-arrow.svg" width={24} height={24} alt="" />
    </a>
  )
}
