import React from 'react'
import style from './DepartmentCard.module.css'
import Image from 'next/image'
import Button from './Button'

export default function DepartmentCard({cardStyle,dept}) {
  return (
    <div className={`${style.deptCard} ${style[cardStyle]}`}>
        <div className={style.wrapper}>
            <div className={style.top}>
        <div className={style.icon}> <Image src={dept.icon} width={80} height={80} alt=''/> </div>
        <div className={style.content}>
            <h3>{dept.name}</h3>
            <div className={style.specialities}>
                {dept.specialities.map((item,index)=>(
                <span key={index}>{item}</span>
                ))}
            </div>
            </div>
            </div>

            <div className={style.bottom}>
                <Button type="link" text="Find a Doctor" classname="orange_btn" link={dept.doctorLink}/>
                <Button type="link" text="Learn More" classname="orange_btn" link={dept.departmentLink}/>

            </div>


        </div>
    </div>
  )
}
