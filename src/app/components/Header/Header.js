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
  { label: "Liver Disease & Transplantation", link: "/" },
  { label: "Advanced Paediatrics", link: "/" },
  { label: "Anaesthesia & Critical Care", link: "/" },
  { label: "Cardiac Sciences", link: "/" },
  { label: "Gastro Sciences", link: "/" },
  { label: "Neuroscience", link: "/" },
  { label: "Cancer Centre", link: "/" },
  { label: "Orthopaedics", link: "/" },
  { label: "Renal Sciences", link: "/" },
  { label: "Trauma Centre and Care", link: "/" },
  { label: "Reproductive Medicine", link: "/" },
  { label: "Women’s Health", link: "/" },
  { label: "Intensive Care Unit", link: "/" },
  { label: "Intestine Rehabilitation Unit", link: "/" },
];

const departmentMenu = [
  { label: "Pulmonary Medicine", link: "/" },
  { label: "Ear, Nose & Throat", link: "/" },
  { label: "Ophthalmology", link: "/" },
  { label: "Bariatric and Metabolic Surgeon", link: "/" },
  { label: "Vascular surgery", link: "/" },
  { label: "Infectious Disease", link: "/" },
  { label: "Plastic and Reconstructive Surgery", link: "/" },
  {
    label: "Interventional Radiology and Imaging Services",
    link: "/",
  },
  { label: "Internal Medicine", link: "/" },
  { label: "Endocrinology and Diabetology", link: "/" },
  { label: "Dermatology", link: "/" },
  { label: "Urology", link: "/" },
  { label: "Dental Surgery", link: "/" },
  { label: "Psychiatry and Psychotherapy", link: "/" },
  { label: "Clinical Laboratory", link: "/" },
  { label: "Transfusion Medicine", link: "/" },
  { label: "Nuclear Medicine", link: "/" },
  { label: "Hearing, communication & swallow sciences", link: "/" },
];

const specialitiesFeatureMenu = {

  ceo:{
    image:"/assets/images/megamenu-img.svg",
    label:"Liver Disease & Transplantation",
    link:"/"
  },
  department:{
    image:"/assets/images/megamenu-img.svg",
    label:"Liver Disease & Transplantation",
    link:"/"
  },

}


const womenMenu = {
  "Obstetrics": [
    { label: "Painless Labour and Delivery", link: "/" },
    { label: "High Risk Pregnancy", link: "/" },
    { label: "Vaginal Birth After C Section", link: "/" },
    { label: "Lactation Counselling", link: "/" },
    { label: "Antenatal Classes", link: "/" },
  ],
  "Cosmetology": [
    { label: "Cosmetology", link: "/" },
  ],

  "Breast Care": [
    { label: "Breast Care", link: "/" },
  ],
  "Gynaecology": [
    { label: "Gynaecology", link: "/" },
    { label: "Robotic Surgeries", link: "/" },
    { label: "Laparoscopic Surgeries", link: "/" },
    { label: "Endoscopic Surgeries", link: "/" },
    { label: "Uro-Gynecology", link: "/" },
    { label: "Gynae-Oncology", link: "/" },
  ],
   "Fetal Medicine": [
    { label: "Fetal Medicine", link: "/" },
  ],

  "Reproductive Medicine": [
    { label: "Reproductive Medicine", link: "/" },
    { label: "Ovulation Induction", link: "/" },
    { label: "In Vitro Fertilization (IVF) Treatment", link: "/" },
    { label: "Intrauterine Insemination (IUI) Treatment", link: "/" },
    { label: "Intracytoplasmic Sperm Injection (ICSI)", link: "/" },
    { label: "Cryopreservation", link: "/" },
    { label: "Frozen Embryo Transfer", link: "/" },
    { label: "Preconception Counselling", link: "/" },
    { label: "Infertility", link: "/" },
  ],

 


};

const childrenMenu = {
  "Paediatric Specialities": [
    { label: "Paediatric Gastroenterology & Hepatology", link: "/" },
    { label: "Paediatric Hematology", link: "/" },
    { label: "Paediatric Hemato Oncology", link: "/" },
    { label: "Paediatric Cardiology", link: "/" },
    { label: "Paediatric Endocrinology", link: "/" },
    { label: "Paediatric Infectious Disease", link: "/" },
    { label: "Paediatric Intensive Care Unit", link: "/" },
    { label: "Paediatric Nephrology", link: "/" },
    { label: "Paediatric Neurology", link: "/" },
    { label: "Paediatric Orthopaedics", link: "/" },
    { label: "Paediatric Trauma", link: "/" },
    { label: "Pediatric Surgery and Urology", link: "/" },
  ],

  "Paediatrics Transplantation": [
    {
      label: "Paediatric Liver Transplant at Rela Hospital: Care, Process & Recovery",
      link: "/",
    },
    { label: "Paediatric Bone Marrow Transplantation", link: "/" },
    { label: "Paediatric Kidney Transplantation", link: "/" },
    { label: "Paediatric Small Bowel Transplantation", link: "/" },
  ],

  "Paediatric Faciomaxillary Surgery": [
    { label: "Paediatric Faciomaxillary Surgery", link: "/" },
  ],
    "General Paediatrics": [
    { label: "General Paediatrics", link: "/" },
  ],

  Newborn: [
    { label: "Neonatology", link: "/" },
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
                        <a href='tel:04422006001'>
                            <div className={style.icon}> <Image src="/assets/images/ambulance.svg" width={40} height={40} alt=''/></div>

                            <div className={style.content}>
                                <p className={style.label}>Ambulance:</p>
                                <p className={style.text}>044 2200 6001</p>
                                </div>
                        </a>
                         </li>
                         <li> 
                        <a href='tel:04422006000'>
                            <div className={style.icon}> <Image src="/assets/images/emergency.svg" width={40} height={40} alt=''/></div>
                            <div className={style.content}>
                                <p className={style.label}>Emergency:</p>
                                <p className={style.text}>044 2200 6000</p>
                                </div>
                             
                        </a>
                         </li>
                         <li> 
                        <a href='tel:+911234567890'>
                            <div className={style.icon}> <Image src="/assets/images/apointment.svg" width={40} height={40} alt=''/></div>
                            <div className={style.content}>
                                <p className={style.label}>Appointment:</p>
                                <p className={style.text}>+91 1234567890</p>
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
                        <a href='tel:04422006001'>
                            <div className={style.icon}> <Image src="/assets/images/ambulance.svg" width={40} height={40} alt=''/></div>

                            <div className={style.content}>
                                <p className={style.label}>Ambulance:</p>
                                <p className={style.text}>044 2200 6001</p>
                                </div>
                        </a>
                         </li>
                         <li> 
                        <a href='tel:04422006000'>
                            <div className={style.icon}> <Image src="/assets/images/emergency.svg" width={40} height={40} alt=''/></div>
                            <div className={style.content}>
                                <p className={style.label}>Emergency:</p>
                                <p className={style.text}>044 2200 6000</p>
                                </div>
                             
                        </a>
                         </li>
                         <li> 
                        <a href='tel:+911234567890'>
                            <div className={style.icon}> <Image src="/assets/images/apointment.svg" width={40} height={40} alt=''/></div>
                            <div className={style.content}>
                                <p className={style.label}>Appointment:</p>
                                <p className={style.text}>+91 1234567890</p>
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
            <li className={style.menuItem}> <Link href="#">Find a Doctor</Link> </li>
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
            <li className={style.menuItem}> <Link href="#">Health Packages</Link></li>

            <li className={style.menuItem} onClick={() => { if (mobile) { setSubMenu( subMenu === "patient-service" ? "" : "patient-service" ); } }} onMouseEnter={() => { if (!mobile) setSubMenu("patient-service"); }} onMouseLeave={() => { if (!mobile) setSubMenu(""); }}> <Link href="#" onClick={(e) => e.preventDefault()} className={style.hasMenu}>Patient Services </Link> {mobile && <button></button>}
            <ul className={`${style.subMenu} ${subMenu==="patient-service"?style.active:""}`}>
                <li className={style.subMenuItem}> <Link href="#">Evening Clinic</Link>  </li>
                <li className={style.subMenuItem}> <Link href="#">International Patients</Link>  </li>
                <li className={style.subMenuItem}> <Link href="#">Patient Care</Link>  </li>
                <li className={style.subMenuItem}> <Link href="#">Emergency Care</Link>  </li>
                <li className={style.subMenuItem}> <Link href="#">Second Opinion</Link>  </li>
            </ul>
             </li>

{!laptop && 
            <li className={style.menuItem}> <Link href="#">Loaction</Link> </li>
            }

            {mobile && 
            <li className={style.menuItem}> <Link href="#">Loaction</Link> </li>
            }

          <li className={style.menuItem} onClick={() => { if (mobile) { setSubMenu((prev) => prev === "about-rela" ? "" : "about-rela"); } }} onMouseEnter={()=>{if (!mobile) setSubMenu("about-rela")}} onMouseLeave={()=>{if (!mobile) setSubMenu("")}}> <Link href="#" onClick={(e) => e.preventDefault()} className={style.hasMenu}>About Rela </Link> {mobile && <button type="button"></button>} 
            <ul className={`${style.subMenu} ${subMenu==="about-rela"?style.active:""}`}>
                <li className={style.subMenuItem}> <Link href="#">Overview </Link>  </li>
                <li className={style.subMenuItem}> <Link href="#">Leadership Team</Link>  </li>
                <li className={style.subMenuItem}> <Link href="#">Awards</Link>  </li>
                <li className={style.subMenuItem}> <Link href="#">Academics</Link>  </li>
                <li className={style.subMenuItem}> <Link href="#">Careers</Link>  </li>
                <li className={style.subMenuItem}> <Link href="#">Contact Us</Link>  </li>
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
