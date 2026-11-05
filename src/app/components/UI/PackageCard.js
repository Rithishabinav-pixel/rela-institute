import React from 'react'
import style from './PackageCard.module.css'
import Button from './Button'

export default function PackageCard({item,duration}) {
  return (
      <div className={style.card}  data-aos="fade-up" data-aos-delay={`${duration*100}`}>
        <div className={style.cardTop} >
            {/* package tag */}
            {item.isPopular &&
            <span className={style.tag}>Most Popular</span>
            }

{/* package discount  */}
            {item.discount && 
            <div className={style.discount}><span>{item.discount}</span>{item.discountText}</div>
            }
            <div className={style.main}>
                <div className={style.price}>
                    {/* offer price  */}
                    <h3 className={style.offerPrice}>₹{item.offerPrice}</h3> 
                    {/* actual price  */}
                    <del className={style.actualPrice}>₹{item.actualPrice}</del>
                </div>
                {/* test name  */}
                <h3 className={style.testName}>{item.testName}</h3>
                {/* test count  */}
                <p className={style.test}>{item.testCount}</p>
                {/* disclaimer */}
                {item.disclaimer && 
                <p className={style.disclaimer}>*{item.disclaimer}</p>
                }
            </div>
            <div className={style.detail}>
                {/* tests includes */}
                <ul className={style.tests}>
                    {item.testsIncludes.slice(0,2).map((test,i)=>(
                        <li key={i}>{test.heading}</li>
                    ))}
                    {item.testsIncludes.length>2 && <li> {item.testsIncludes.length - 2}+ more </li>}
                </ul>
                {/* test lists */}
                <ul className={`${style.lists} common_list`}>
                    {item.fastingFor && <li>Fasting for {item.fastingFor}</li>}
                    {item.reportsWithin && <li>Reports within {item.reportsWithin}</li>}
                </ul>
            </div>
        </div>
        <div className={style.actions}>
            {/* deatail page link  */}
            <Button classname="orange_btn" text="View Details" link={item.link}/>
            {/* deatail page link with #book-package */}
            <Button type="link" classname="orange_btn" text="Book Package" link={`${item.link}#book-package`}/>

        </div>
        </div>
  )
}
