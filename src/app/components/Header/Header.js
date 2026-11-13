"use client"

import React, { useEffect, useRef, useState } from 'react'
import style from './header.module.css'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../UI/Button'
import { usePathname, useRouter } from 'next/navigation'
import WomenChildrenMegaMenu, {
  SpecialitiesMegaMenu,
} from "./MegaMenu";



const coeMenu = [
  { label: "Liver Disease & Transplantation", link: "/doctors" },
  { label: "Advanced Paediatrics", link: "/doctors" },
  { label: "Anaesthesia & Critical Care", link: "/doctors" },
  { label: "Cardiac Sciences", link: "/doctors" },
  { label: "Gastro Sciences", link: "/doctors" },
  { label: "Neuroscience", link: "/doctors" },
  { label: "Cancer Centre", link: "/doctors" },
  { label: "Orthopaedics", link: "/doctors" },
  { label: "Renal Sciences", link: "/doctors" },
  { label: "Trauma Centre and Care", link: "/doctors" },
  { label: "Reproductive Medicine", link: "/doctors" },
  { label: "Women’s Health", link: "/doctors" },
  { label: "Intensive Care Unit", link: "/doctors" },
  { label: "Intestine Rehabilitation Unit", link: "/doctors" },
];

const departmentMenu = [
  { label: "Pulmonary Medicine", link: "/doctors" },
  { label: "Ear, Nose & Throat", link: "/doctors" },
  { label: "Ophthalmology", link: "/doctors" },
  { label: "Bariatric and Metabolic Surgeon", link: "/doctors" },
  { label: "Vascular surgery", link: "/doctors" },
  { label: "Infectious Disease", link: "/doctors" },
  { label: "Plastic and Reconstructive Surgery", link: "/doctors" },
  {
    label: "Interventional Radiology and Imaging Services",
    link: "/doctors",
  },
  { label: "Internal Medicine", link: "/doctors" },
  { label: "Endocrinology and Diabetology", link: "/doctors" },
  { label: "Dermatology", link: "/doctors" },
  { label: "Urology", link: "/doctors" },
  { label: "Dental Surgery", link: "/doctors" },
  { label: "Psychiatry and Psychotherapy", link: "/doctors" },
  { label: "Clinical Laboratory", link: "/doctors" },
  { label: "Transfusion Medicine", link: "/doctors" },
  { label: "Nuclear Medicine", link: "/doctors" },
  { label: "Hearing, communication & swallow sciences", link: "/doctors" },
];

const specialitiesFeatureMenu = {

  ceo:{
    image:"/assets/images/megamenu-img.svg",
    label:"Liver Disease & Transplantation",
    link:"/doctors"
  },
  department:{
    image:"/assets/images/megamenu-img.svg",
    label:"Liver Disease & Transplantation",
    link:"/doctors"
  },

}


const womenMenu = {
  "Obstetrics": [
    { label: "Painless Labour and Delivery", link: "/doctors" },
    { label: "High Risk Pregnancy", link: "/doctors" },
    { label: "Vaginal Birth After C Section", link: "/doctors" },
    { label: "Lactation Counselling", link: "/doctors" },
    { label: "Antenatal Classes", link: "/doctors" },
  ],
  "Cosmetology": [
    { label: "Cosmetology", link: "/doctors" },
  ],

  "Breast Care": [
    { label: "Breast Care", link: "/doctors" },
  ],
  "Gynaecology": [
    { label: "Gynaecology", link: "/doctors" },
    { label: "Robotic Surgeries", link: "/doctors" },
    { label: "Laparoscopic Surgeries", link: "/doctors" },
    { label: "Endoscopic Surgeries", link: "/doctors" },
    { label: "Uro-Gynecology", link: "/doctors" },
    { label: "Gynae-Oncology", link: "/doctors" },
  ],
   "Fetal Medicine": [
    { label: "Fetal Medicine", link: "/doctors" },
  ],

  "Reproductive Medicine": [
    { label: "Reproductive Medicine", link: "/doctors" },
    { label: "Ovulation Induction", link: "/doctors" },
    { label: "In Vitro Fertilization (IVF) Treatment", link: "/doctors" },
    { label: "Intrauterine Insemination (IUI) Treatment", link: "/doctors" },
    { label: "Intracytoplasmic Sperm Injection (ICSI)", link: "/doctors" },
    { label: "Cryopreservation", link: "/doctors" },
    { label: "Frozen Embryo Transfer", link: "/doctors" },
    { label: "Preconception Counselling", link: "/doctors" },
    { label: "Infertility", link: "/doctors" },
  ],

 


};

const childrenMenu = {
  "Paediatric Specialities": [
    { label: "Paediatric Gastroenterology & Hepatology", link: "/doctors" },
    { label: "Paediatric Hematology", link: "/doctors" },
    { label: "Paediatric Hemato Oncology", link: "/doctors" },
    { label: "Paediatric Cardiology", link: "/doctors" },
    { label: "Paediatric Endocrinology", link: "/doctors" },
    { label: "Paediatric Infectious Disease", link: "/doctors" },
    { label: "Paediatric Intensive Care Unit", link: "/doctors" },
    { label: "Paediatric Nephrology", link: "/doctors" },
    { label: "Paediatric Neurology", link: "/doctors" },
    { label: "Paediatric Orthopaedics", link: "/doctors" },
    { label: "Paediatric Trauma", link: "/doctors" },
    { label: "Pediatric Surgery and Urology", link: "/doctors" },
  ],

  "Paediatrics Transplantation": [
    {
      label: "Paediatric Liver Transplant at Rela Hospital: Care, Process & Recovery",
      link: "/doctors",
    },
    { label: "Paediatric Bone Marrow Transplantation", link: "/doctors" },
    { label: "Paediatric Kidney Transplantation", link: "/doctors" },
    { label: "Paediatric Small Bowel Transplantation", link: "/doctors" },
  ],

  "Paediatric Faciomaxillary Surgery": [
    { label: "Paediatric Faciomaxillary Surgery", link: "/doctors" },
  ],
    "General Paediatrics": [
    { label: "General Paediatrics", link: "/doctors" },
  ],

  Newborn: [
    { label: "Neonatology", link: "/doctors" },
  ],
};

const specialitiesMenuCategories = [
  { label: "Centres of Excellence", items: coeMenu },
  { label: "Departments", items: departmentMenu },
];

const womenChildrenMenuCategories = Object.entries({ ...womenMenu, ...childrenMenu });

const SUPPORTED_LANGUAGES = ['ta', 'hi', 'te', 'bn', 'ar']
const RTL_LANGUAGES = ['ar']

function splitLocaleFromPathname(pathname) {
    const segments = pathname.split('/').filter(Boolean)
    const [first, ...rest] = segments

    if (SUPPORTED_LANGUAGES.includes(first)) {
        return { locale: first, pathWithoutLocale: `/${rest.join('/')}` }
    }

    return { locale: 'en', pathWithoutLocale: pathname || '/' }
}

function triggerGTranslate(locale, attempt = 0) {
    if (typeof window === 'undefined') return

    if (typeof window.doGTranslate === 'function') {
        
        try {
            window.doGTranslate(`en|${locale}`)
            return
        } catch {
        }
    }

    if (attempt < 15) {
        setTimeout(() => triggerGTranslate(locale, attempt + 1), 300)
    } else if (process.env.NODE_ENV !== 'production') {
        console.warn('[gtranslate] widget did not become ready in time — URL routing still switched, but page text was not translated.')
    }
}

export default function Header() {


    const pathname = usePathname();
    const router = useRouter();
    const [mobile,setMobile] = useState(false);
    const [laptop,setLaptop] = useState(false)
    const [showMenu,setShowMenu] = useState(false);
    const [searchBar,setSearchBar] = useState(false);
    const [search,setSearch] = useState("");
    
    const desktopSearchContainer = useRef(null);
    const mobileSearchContainer = useRef(null);

    const [megaMenuTab,setMegaMenuTab] = useState("")
    const [activeMenu,setActiveMenu] = useState("");
    const [navFixed, setNavFixed] = useState(false);
    const [revScroll, setRevScroll] = useState(false);
    const [subMenu,setSubMenu] = useState("")
    const [subMenuCategory,setSubMenuCategory] = useState("")

useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    setNavFixed(currentScrollY >= 76);

    if (currentScrollY < lastScrollY) {
      setRevScroll(currentScrollY >= 76);
    } else if (currentScrollY > lastScrollY) {
      setRevScroll(false);
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  handleScroll();

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

useEffect(() => {
  const clickOutSearch = (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;

    const insideDesktop = desktopSearchContainer.current?.contains(target);
    const insideMobile = mobileSearchContainer.current?.contains(target);

    if (!insideDesktop && !insideMobile) {
      setSearch("");
      setSearchBar(false);
    }
  };

  const closeOnEscape = (event) => {
    if (event.key === "Escape") {
      setSearch("");
      setSearchBar(false);
    }
  };

  document.addEventListener("mousedown", clickOutSearch);
  document.addEventListener("keydown", closeOnEscape);

  return () => {
    document.removeEventListener("mousedown", clickOutSearch);
    document.removeEventListener("keydown", closeOnEscape);
  };
}, []);




    useEffect(()=>{

        const checkDevice = () =>{
            setMobile(window.innerWidth<1200);
            setLaptop(window.innerWidth<1500);
        }

        checkDevice();

        window.addEventListener("resize",checkDevice);

        return(()=>{
            window.removeEventListener("resize",checkDevice)
    })

    },[])

    const { locale: currentLocale, pathWithoutLocale } = splitLocaleFromPathname(pathname || '/')


    useEffect(() => {
        document.documentElement.lang = currentLocale
        document.documentElement.dir = RTL_LANGUAGES.includes(currentLocale) ? 'rtl' : 'ltr'
    }, [currentLocale])

  
    useEffect(() => {
        triggerGTranslate(currentLocale)
    }, [currentLocale])

    const handleLanguageChange = (event) => {
        const nextLocale = event.target.value
        const query = typeof window !== 'undefined' ? window.location.search : ''
        const base = pathWithoutLocale === '/' ? '' : pathWithoutLocale
        const nextPath = nextLocale === 'en' ? (base || '/') : `/${nextLocale}${base}`

        triggerGTranslate(nextLocale)
        router.push(`${nextPath}${query}`)
    }

    if (pathname && pathname.startsWith('/admin')) {
        return null;
    }

  return (
    <>
    
    <header className={revScroll?style.fixedHeader:""} id={style.header}>

{mobile &&
            <div className={`${style.topbarCta} ${searchBar?style.hide:""} `}>
                <ul>
                    <li> 
                        <a href='tel:+914466667788'>
                            <div className={style.icon}> <Image src="/assets/images/ambulance.svg" width={40} height={40} alt=''/></div>

                            <div className={style.content}>
                                <p className={style.label}>Ambulance:</p>
                                <p className={style.text}>+91 44 66667788</p>
                                </div>
                        </a>
                         </li>
                         <li> 
                        <a href='tel:+914466667777'>
                            <div className={style.icon}> <Image src="/assets/images/emergency.svg" width={40} height={40} alt=''/></div>
                            <div className={style.content}>
                                <p className={style.label}>Emergency:</p>
                                <p className={style.text}>+91 44 66667777</p>
                                </div>
                             
                        </a>
                         </li>
                         <li> 
                        <a href='tel:+919384681770'>
                            <div className={style.icon}> <Image src="/assets/images/apointment.svg" width={40} height={40} alt=''/></div>
                            <div className={style.content}>
                                <p className={style.label}>Appointment:</p>
                                <p className={style.text}>+91 9384681770</p>
                                </div>
                             
                        </a>
                         </li>
                </ul>
            </div>
            }



    <div className={`${style.topBar} ${mobile && !revScroll && navFixed?style.fixedMobileNav:""}`}>
        <div className={`container ${style.container}`}>

            

            <div className={style.logo}>
            <Link href="/">
            <Image src="/assets/images/logo.svg" width={117} height={60} alt=''/>
            </Link>
            </div>

{mobile && showMenu && <div className={style.mobileMenuOverlay} onClick={()=>setShowMenu(false)}></div>}

{!searchBar && !mobile &&
            <div className={`${style.topbarCta} ${searchBar?style.hide:""}`}>
                <ul>
                    <li> 
                        <a href='tel:+914466667788'>
                            <div className={style.icon}> <Image src="/assets/images/ambulance.svg" width={40} height={40} alt=''/></div>

                            <div className={style.content}>
                                <p className={style.label}>Ambulance:</p>
                                <p className={style.text}>+91 44 66667788</p>
                                </div>
                        </a>
                         </li>
                         <li> 
                        <a href='tel:+914466667777'>
                            <div className={style.icon}> <Image src="/assets/images/emergency.svg" width={40} height={40} alt=''/></div>
                            <div className={style.content}>
                                <p className={style.label}>Emergency:</p>
                                <p className={style.text}>+91 44 66667777</p>
                                </div>
                             
                        </a>
                         </li>
                         <li> 
                        <a href='tel:++919384681770'>
                            <div className={style.icon}> <Image src="/assets/images/apointment.svg" width={40} height={40} alt=''/></div>
                            <div className={style.content}>
                                <p className={style.label}>Appointment:</p>
                                <p className={style.text}>+91 9384681770</p>
                                </div>
                             
                        </a>
                         </li>
                </ul>
            </div>

            }

            <div className={style.actions}>

<div className={`${style.searchBar} ${searchBar?style.active:""}`} ref={desktopSearchContainer}>
    {!mobile && <input type='text' placeholder='Search...' aria-label='Search' value={search} onChange={(e)=>setSearch(e.target.value)}/>}
    <button onClick={()=>setSearchBar(true)} className={style.searchBtn} aria-label='Open search' aria-expanded={searchBar}> <Image src="/assets/images/search.svg" width={32} height={32} alt=''/>  </button>

    {search && searchBar && !mobile && <button className={style.searchClose} aria-label='Close search' onClick={()=>{setSearch("");setSearchBar(false);}}> <Image src="/assets/images/menu-close.svg" width={12} height={12} alt=''/> </button>}
</div>


<div className={style.translator}>
    <select value={currentLocale} onChange={handleLanguageChange} aria-label='Select language'>
        <option value="en" className='notranslate'>English</option>
        <option value="ta" className='notranslate'>Tamil</option>
        <option value="hi" className='notranslate'>Hindi</option>
        <option value="te" className='notranslate'>Telugu</option>
        <option value="bn" className='notranslate'>Bengali</option>
        <option value="ar" className='notranslate'>Arabic</option>
    </select>
</div>

{mobile && 
            <button className={style.hamburgerMenu} onClick={()=>setShowMenu(!showMenu)} aria-label='Toggle menu' aria-expanded={showMenu}>
                <Image src="/assets/images/hamburger.svg" width={32} height={32} alt=''/>
            </button>
            }

            </div>

        </div>
    </div>


<div className={`${style.navigations} ${navFixed && !revScroll && !mobile?style.navFixed:""} ${showMenu ? style.active : ""}`}>
        {mobile && <button className={style.menuClose} onClick={()=>setShowMenu(!showMenu)} aria-label='Close menu'> <Image src="/assets/images/menu-close.svg" width={24} height={24} alt='' /> </button>}
    <div className={`container ${style.container}`}>
        <nav>
        <ul className={style.mainMenu}>

            <li className={style.menuItem} onClick={() => { if (mobile) { setSubMenu(subMenu === "specialities" ? "" : "specialities"); } }} onMouseEnter={()=>{setActiveMenu("specialities"); setMegaMenuTab("center-of-excellence")}} onMouseLeave={()=>setActiveMenu("")}> <Link href="#" onClick={(e) => mobile && e.preventDefault()} className={style.hasMenu} >Specialities</Link>
            {mobile && <button></button>}
            {mobile && 
            <ul className={`${style.subMenu} ${subMenu==="specialities"?style.active:""}`}>
                {specialitiesMenuCategories.map((category) => (
                    <li className={style.subMenuItem} key={category.label} onClick={(e) => { if (mobile) { e.stopPropagation(); setSubMenuCategory(subMenuCategory === category.label ? "" : category.label); } }}>
                        <Link href="#" onClick={(e) => mobile && e.preventDefault()} className={style.hasMenu}>{category.label}</Link>
                        {mobile && <button></button>}
                        <ul className={`${style.subMenu} ${subMenuCategory===category.label?style.active:""}`}>
                            {category.items.map((item,index) => (
                                <li className={style.subMenuItem} key={index}> <Link href={item.link}>{item.label}</Link> </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            }
            </li>






            <li className={style.menuItem}> <Link href="#">Robotic Surgery</Link></li>
            <li className={style.menuItem}> <Link href="/doctors">Find a Doctor</Link> </li>
            <li className={style.menuItem} onClick={() => { if (mobile) { setSubMenu(subMenu === "women-children" ? "" : "women-children"); } }} onMouseEnter={()=>{setActiveMenu("women-children");setMegaMenuTab("women")}} onMouseLeave={()=>setActiveMenu("")}> <Link href="#" onClick={(e) => mobile && e.preventDefault()} className={style.hasMenu}>Women & Children’s Hospital</Link> {mobile && <button></button>}
            {mobile && 
            <ul className={`${style.subMenu} ${subMenu==="women-children"?style.active:""}`}>
                {womenChildrenMenuCategories.map(([category,items]) => (
                    <li className={style.subMenuItem} key={category} onClick={(e) => { if (mobile) { e.stopPropagation(); setSubMenuCategory(subMenuCategory === category ? "" : category); } }}>
                        <Link href="#" onClick={(e) => mobile && e.preventDefault()} className={style.hasMenu}>{category}</Link>
                        {mobile && <button></button>}
                        <ul className={`${style.subMenu} ${subMenuCategory===category?style.active:""}`}>
                            {items.map((item,index) => (
                                <li className={style.subMenuItem} key={index}> <Link href={item.link}>{item.label}</Link> </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            }
            </li>
            <li className={style.menuItem}> <Link href="/health-packages">Health Packages</Link></li>

            <li className={style.menuItem} onClick={() => { if (mobile) { setSubMenu( subMenu === "patient-service" ? "" : "patient-service" ); } }} onMouseEnter={() => { if (!mobile) setSubMenu("patient-service"); }} onMouseLeave={() => { if (!mobile) setSubMenu(""); }}> <Link href="#" onClick={(e) => e.preventDefault()} className={style.hasMenu}>Patient Services </Link> {mobile && <button></button>}
            <ul className={`${style.subMenu} ${subMenu==="patient-service"?style.active:""}`}>
                <li className={style.subMenuItem}> <Link href="/evening-clinic">Evening Clinic</Link>  </li>
                <li className={style.subMenuItem}> <Link href="/international-patients">International Patients</Link>  </li>
                <li className={style.subMenuItem}> <Link href="/patient-care">Patient Care</Link>  </li>
                <li className={style.subMenuItem}> <Link href="#">Emergency Care</Link>  </li>
                <li className={style.subMenuItem}> <Link href="/second-opinion">Second Opinion</Link>  </li>
            </ul>
             </li>

{!laptop && 
            <li className={style.menuItem}> <Link href="/locations">Location</Link> </li>
            }

           

          <li className={style.menuItem} onClick={() => { if (mobile) { setSubMenu((prev) => prev === "about-rela" ? "" : "about-rela"); } }} onMouseEnter={()=>{if (!mobile) setSubMenu("about-rela")}} onMouseLeave={()=>{if (!mobile) setSubMenu("")}}> <Link href="#" onClick={(e) => e.preventDefault()} className={style.hasMenu}>About Rela </Link> {mobile && <button type="button"></button>} 
            <ul className={`${style.subMenu} ${subMenu==="about-rela"?style.active:""}`}>
                <li className={style.subMenuItem}> <Link href="/about-us">Overview </Link>  </li>
                <li className={style.subMenuItem}> <Link href="/about-us/from-the-desk-of-prof-mohamed-rela">From the desk of Prof. Mohamed Rela </Link>  </li>
                <li className={style.subMenuItem}> <Link href="/leadership-team">Leadership Team</Link>  </li>
                <li className={style.subMenuItem}> <Link href="/about-us/awards-honors">Awards</Link>  </li>
                <li className={style.subMenuItem}> <Link href="/academics">Academics</Link>  </li>
                 {laptop && 
            <li className={style.menuItem}> <Link href="/locations">Location</Link> </li>
            }
                <li className={style.subMenuItem}> <Link href="/careers">Careers</Link>  </li>
                <li className={style.subMenuItem}> <Link href="/contact-us">Contact Us</Link>  </li>
            </ul>
             </li>
        </ul>
        </nav>
        <Button link="#" classname={`white_btn`} text="Book an Appointment" type="call"/>
    </div>
</div>


{searchBar &&
<div className={`${style.searchBar} ${style.mobileSearch} ${searchBar?style.active:""}`} ref={mobileSearchContainer}>
    {mobile && <input type='text' placeholder='Search...' aria-label='Search' value={search} onChange={(e)=>setSearch(e.target.value)}/>}
    {search &&  <button className={style.searchClose} aria-label='Close search' onClick={()=>{setSearch("");setSearchBar(false);}}> <Image src="/assets/images/menu-close.svg" width={12} height={12} alt=''/> </button>}
</div>
}

    </header>





{!mobile && <SpecialitiesMegaMenu activeMenu={activeMenu} setActiveMenu={setActiveMenu} megaMenuTab ={megaMenuTab} coeMenu={coeMenu} setMegaMenuTab ={setMegaMenuTab} departmentMenu={departmentMenu } specialitiesFeatureMenu={specialitiesFeatureMenu} /> }


{!mobile && <WomenChildrenMegaMenu activeMenu={activeMenu} setActiveMenu={setActiveMenu} megaMenuTab ={megaMenuTab} womenMenu={womenMenu} setMegaMenuTab ={setMegaMenuTab} childrenMenu={childrenMenu } /> }

    
    </>
  )
}
