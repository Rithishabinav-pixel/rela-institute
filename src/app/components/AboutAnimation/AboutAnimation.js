import React, { useEffect, useRef, useState } from 'react'
import style from './aboutAnimation.module.css'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function AboutAnimation() {

 const animationSection = useRef(null);
const stroke1 = useRef(null);
const stroke2 = useRef(null);

 const [mobile,setMobile] = useState(false);

useEffect(() => {
  stroke1.current.style.strokeDasharray = 1183.92529296875;
  stroke1.current.style.strokeDashoffset = 1183.92529296875;

  stroke2.current.style.strokeDasharray = 1378.89208984375;
  stroke2.current.style.strokeDashoffset = 1378.89208984375;
}, []);


      useEffect(()=>{
    
        const checkDevice = () =>{
        setMobile(window.innerWidth<1200);
        }
    
        checkDevice();
        window.addEventListener("resize",checkDevice);
    
        return(()=>{
        window.removeEventListener("resize",checkDevice);
        })
    
    
      },[])


useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 1200px)", () => {
    const points = gsap.utils.toArray(
      `.${style.points} span`,
      animationSection.current
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: animationSection.current,
        start: "center center",
        end: "+=2000",
        pin: true,
        pinSpacing: true,
        scrub: true,

        onUpdate: (self) => {
          const activeIndex = Math.floor(
            self.progress * (points.length + 1)
          );

          console.log(activeIndex)

          points.forEach((point, index) => {
            point.classList.toggle("active", index < activeIndex);
          });
        },
      },
    });

    tl.to(stroke1.current, {
      strokeDashoffset: 0,
    }).to(
      stroke2.current,
      {
        strokeDashoffset: 2757.7841796875,
      },
      ">"
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      points.forEach((point) => point.classList.remove("active"));
    };
  });

  return () => mm.revert();
}, { scope: animationSection });

if(mobile) return null

  return (
    <>
    <div className={style.animation} ref={animationSection}>

        <div className={`${style.points} ${style.points1}`}>
            <span>EXCELLENCE</span><span>EMPATHY</span><span>EFFICACY</span><span>ETHICS</span>
        </div>

        <div className={`${style.points} ${style.points2}`}>
            <span>ACCESSIBILITY</span><span>ADVANCEMENT</span>
        </div>

         <div className={`${style.points} ${style.points3}`}>
            <span>RESPONSIBILITY</span><span>RESPECT</span><span>RELIABILITY</span><span>RESEARCH</span><span>RELATIONSHIPS</span>
        </div>

         <div className={`${style.points} ${style.points4}`}>
            <span>LEARNING</span><span>LISTENING</span><span>LEVERAGE</span>
        </div>

        <Image src="/assets/images/ar1.svg" width={100} height={82} alt='' className={`${style.arrow} ${style.arrow1}`}/>
        <Image src="/assets/images/ar2.svg" width={122} height={97} alt='' className={`${style.arrow} ${style.arrow2}`}/>
        <Image src="/assets/images/ar3.svg" width={102} height={118} alt='' className={`${style.arrow} ${style.arrow3}`}/>
        <Image src="/assets/images/ar4.svg" width={83} height={67} alt='' className={`${style.arrow} ${style.arrow4}`}/>



        <svg xmlns="http://www.w3.org/2000/svg" width="1920" height="348" viewBox="0 0 1920 348" fill="none">
<g clipPath="url(#clip0_1009_3705)">
<path d="M430.454 230.103H390.073V341.5H329.5V34.5H443.183C467.763 34.5 488.393 39.1781 505.072 48.5343C521.752 57.8905 534.042 70.0243 541.943 84.9357C549.843 99.8471 553.794 116.074 553.794 133.617C553.794 153.791 548.527 172.065 537.992 188.439C527.458 204.52 511.51 216.069 490.149 223.086L559.5 341.5H495.855L430.454 230.103ZM390.073 180.544H433.966C450.938 180.544 465.276 177.036 476.981 170.019C488.978 162.709 494.977 150.575 494.977 133.617C494.977 116.659 489.125 104.818 477.42 98.0929C465.715 91.0757 451.23 87.5671 433.966 87.5671H390.073V180.544Z" fill="#3F3F3F"/>
<path d="M734.444 87.24V161.6H855.016V209.56H734.444V288.76H876.5V342H673.5V34H876.5V87.24H734.444Z" fill="#3F3F3F"/>
<path d="M1187.5 289.741V343.5H990.945L990.5 32.5H1052.76L1052.31 289.741H1187.5Z" fill="#3F3F3F"/>
<path d="M1501.25 269.371H1391.29L1365.64 348H1301.5L1416.95 28H1476.51L1591.5 348H1527.36L1501.25 269.371ZM1485.21 220.457L1447.19 106.629H1444.44L1407.33 220.457H1485.21Z" fill="#3F3F3F"/>
<g clipPath="url(#clip1_1009_3705)">
<path d="M1187.5 289.241V343H990.945L990.5 32H1052.76L1052.31 289.241H1187.5Z" fill="#3F3F3F"/>
</g>
<mask id="mask0_1009_3705" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="-3" y="-3" width="1027" height="314">
<path ref={stroke1}  d="M1 0C48 71.6667 179.2 228.6 328 283C514 351 654 248 669.5 237C685 226 849 103 977.5 104.5C984 104.833 1001.3 107 1022.5 115" strokeWidth="8" stroke="black"/>
</mask>
<g mask="url(#mask0_1009_3705)">
<path d="M1 0C48 71.6667 179.2 228.6 328 283C514 351 654 248 669.5 237C685 226 849 103 977.5 104.5C984 104.833 1001.3 107 1022.5 115" strokeWidth="8" stroke="url(#paint0_linear_1009_3705)"/>
</g>
<mask id="mask1_1009_3705" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="942" y="100" width="979" height="152">
<path  d="M1023.81 117.127C946.81 133.627 918.81 208.627 977.31 237.627C1024.11 260.827 1064.48 236.961 1078.81 222.127C1118.39 166.555 1060.65 129.48 1025.81 117.627M1023.81 117.127C1024.08 117.044 1024.35 116.961 1024.63 116.878M1023.81 117.127C1023.82 117.131 1024.26 116.994 1024.63 116.878M1024.63 116.878C1024.8 116.825 1024.98 116.773 1025.15 116.721M1024.63 116.878C1024.9 116.792 1025.14 116.718 1025.15 116.721M1025.15 116.721C1064.38 104.968 1153.74 91.1431 1208.31 127.127C1215.14 131.461 1236.61 146.727 1267.81 173.127C1299.01 199.527 1339.14 210.127 1355.31 212.127C1368.31 215.961 1414.02 208.467 1500.81 162.127C1611.31 103.127 1751.31 83.1273 1918.31 165.627" strokeWidth="8" stroke="black"/>
</mask>
<g mask="url(#mask1_1009_3705)">
<path ref={stroke2} d="M1918.31 165.414C1751.31 82.9141 1611.31 102.914 1500.81 161.914C1414.02 208.254 1368.31 215.747 1355.31 211.914C1339.14 209.914 1299.01 199.314 1267.81 172.914C1236.61 146.514 1215.14 131.247 1208.31 126.914C1153.11 90.5141 1062.81 108.557 1023.81 116.914C946.81 133.414 918.81 208.414 977.31 237.414C1024.11 260.614 1064.48 236.747 1078.81 221.914C1118.39 166.341 1064.65 133.267 1029.81 121.414M1023.81 116.914C1023.83 116.92 1025.13 116.502 1025.15 116.508" strokeWidth="8" stroke="url(#paint1_linear_1009_3705)"/>
</g>
<g clipPath="url(#clip2_1009_3705)">
<path d="M430.454 230.103H390.073V341.5H329.5V34.5H443.183C467.763 34.5 488.393 39.1781 505.072 48.5343C521.752 57.8905 534.042 70.0243 541.943 84.9357C549.843 99.8471 553.794 116.074 553.794 133.617C553.794 153.791 548.527 172.065 537.992 188.439C527.458 204.52 511.51 216.069 490.149 223.086L559.5 341.5H495.855L430.454 230.103ZM390.073 180.544H433.966C450.938 180.544 465.276 177.036 476.981 170.019C488.978 162.709 494.977 150.575 494.977 133.617C494.977 116.659 489.125 104.818 477.42 98.0929C465.715 91.0757 451.23 87.5671 433.966 87.5671H390.073V180.544Z" fill="#3F3F3F"/>
<g clipPath="url(#clip3_1009_3705)">
<path d="M430.954 230.603H390.573V342H330V35H443.683C468.263 35 488.893 39.6781 505.572 49.0343C522.252 58.3905 534.542 70.5243 542.443 85.4357C550.343 100.347 554.294 116.574 554.294 134.117C554.294 154.291 549.027 172.565 538.492 188.939C527.958 205.02 512.01 216.569 490.649 223.586L560 342H496.355L430.954 230.603ZM390.573 181.044H434.466C451.438 181.044 465.776 177.536 477.481 170.519C489.478 163.209 495.477 151.075 495.477 134.117C495.477 117.159 489.625 105.318 477.92 98.5929C466.215 91.5757 451.73 88.0671 434.466 88.0671H390.573V181.044Z" fill="#3F3F3F"/>
</g>
</g>
<g clipPath="url(#clip4_1009_3705)">
<path d="M1187.5 289.741V343.5H990.945L990.5 32.5H1052.76L1052.31 289.741H1187.5Z" fill="#3F3F3F"/>
</g>
<g clipPath="url(#clip5_1009_3705)">
<path d="M1501.25 269.371H1391.29L1365.64 348H1301.5L1416.95 28H1476.51L1591.5 348H1527.36L1501.25 269.371ZM1485.21 220.457L1447.19 106.629H1444.44L1407.33 220.457H1485.21Z" fill="#3F3F3F"/>
</g>
<path d="M734.944 86.24V160.6H855.516V208.56H734.944V287.76H877V341H674V33H877V86.24H734.944Z" fill="#3F3F3F"/>
</g>
<defs>
<linearGradient id="paint0_linear_1009_3705" x1="901.457" y1="28.0967" x2="530.266" y2="606.769" gradientUnits="userSpaceOnUse">
<stop stopColor="#FC4A1A"/>
<stop offset="1" stopColor="#F7B733"/>
</linearGradient>
<linearGradient id="paint1_linear_1009_3705" x1="1803.1" y1="116.943" x2="1693.33" y2="464.771" gradientUnits="userSpaceOnUse">
<stop stopColor="#FC4A1A"/>
<stop offset="1" stopColor="#F7B733"/>
</linearGradient>
<clipPath id="clip0_1009_3705">
<rect width="1920" height="348" fill="white"/>
</clipPath>
<clipPath id="clip1_1009_3705">
<rect width="197" height="174" fill="white" transform="translate(991 169)"/>
</clipPath>
<clipPath id="clip2_1009_3705">
<rect width="159" height="307" fill="white" transform="translate(401 35)"/>
</clipPath>
<clipPath id="clip3_1009_3705">
<rect width="133" height="307" fill="white" transform="translate(427 35)"/>
</clipPath>
<clipPath id="clip4_1009_3705">
<rect width="197" height="131" fill="white" transform="translate(991 212)"/>
</clipPath>
<clipPath id="clip5_1009_3705">
<rect width="148" height="320" fill="white" transform="translate(1302 29)"/>
</clipPath>
</defs>
</svg>
    </div>
    
    </>
  )
}
