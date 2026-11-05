import React from 'react'
import './ContentPageBanner.css'

export default function ContentPageBanner({title}) {
  return (
   <div className="banner">
    <h1 className='common_heading'>{title}</h1>
   </div>
  )
}
