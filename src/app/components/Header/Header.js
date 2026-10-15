"use client"

import React, { useEffect, useRef, useState } from 'react'
import style from './header.module.css'
import Link from 'next/link'
import Image from 'next/image'
import Button from '../UI/Button'
import { usePathname, useRouter } from 'next/navigation'

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

// GTranslate's generated widget script defines `window.doGTranslate(langPair)`
// globally (it sets Google's underlying translate-combo element and fires a
// change event). This is the widget's long-standing de-facto trigger — it is
// not part of GTranslate's documented public API, so we check it exists
// before calling it and retry briefly while the widget script is still
// loading, rather than assuming it is ready.
function triggerGTranslate(locale, attempt = 0) {
    if (typeof window === 'undefined') return

    if (typeof window.doGTranslate === 'function') {
        // The widget's own minified code can throw ("__GT is not defined") if
        // called before its internal state has finished initializing, even
        // though doGTranslate itself already exists — this is a quirk of the
        // third-party script, not something we control, so a failed call is
        // treated as "not ready yet" and retried rather than left to crash.
        try {
            window.doGTranslate(`en|${locale}`)
            return
        } catch {
            // fall through to retry below
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
    const [showMenu,setShowMenu] = useState(false);
    const [searchBar,setSearchBar] = useState(false);
    const [search,setSearch] = useState("");
    // Two separate containers (desktop search bar + the "tablet" variant
    // rendered alongside it) previously shared one ref, so whichever mounted
    // last silently won — any click inside the OTHER one then registered as
    // "outside" and closed the panel mid-interaction. Each gets its own ref
    // now, and a click only counts as outside when it's outside both.
    const desktopSearchContainer = useRef(null);
    const mobileSearchContainer = useRef(null);


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
            setMobile(window.innerWidth<1200)
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
    
    <header>

        {/* mobile top  */}
{mobile &&
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


        {/* top bar  */}

    <div className={style.topBar}>
        <div className={`container ${style.container}`}>

            

            <div className={style.logo}>
            <Link href="/">
            <Image src="/assets/images/logo.svg" width={117} height={60} alt=''/>
            </Link>
            </div>



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
{/* search for desktop */}

<div className={`${style.searchBar} ${searchBar?style.active:""}`} ref={desktopSearchContainer}>
    {!mobile && <input type='text' placeholder='Search...' aria-label='Search' value={search} onChange={(e)=>setSearch(e.target.value)}/>}
    <button onClick={()=>setSearchBar(true)} className={style.searchBtn} aria-label='Open search' aria-expanded={searchBar}> <Image src="/assets/images/search.svg" width={32} height={32} alt=''/>  </button>

    {search && searchBar && !mobile && <button className={style.searchClose} aria-label='Close search' onClick={()=>{setSearch("");setSearchBar(false);}}> <Image src="/assets/images/menu-close.svg" width={12} height={12} alt=''/> </button>}
</div>

{/* translate  */}

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

{/* nav + cta */}

<div className={`${style.navigations} ${showMenu ? style.active : ""}`}>
        {mobile && <button className={style.menuClose} onClick={()=>setShowMenu(!showMenu)} aria-label='Close menu'> <Image src="/assets/images/menu-close.svg" width={24} height={24} alt='' /> </button>}
    <div className={`container ${style.container}`}>
        <nav>
        <ul>
            <li> <Link href="#" className={style.hasMenu}>Specialities</Link> </li>
            <li> <Link href="#" className={style.hasMenu}>Patient Services</Link> </li>
            <li> <Link href="#" className={style.hasMenu}>Find a Doctor</Link> </li>
            <li> <Link href="#">Health Packages</Link> </li>
            <li> <Link href="#">Patient Care</Link> </li>
            <li> <Link href="#">Loaction</Link> </li>
            <li> <Link href="#" className={style.hasMenu}>About Rela</Link> </li>
        </ul>
        </nav>
        <Button link="#" classname={`white_btn`} text="Book an Appointment" type="call"/>
    </div>
</div>

{/* search for tablet */}

{searchBar &&
<div className={`${style.searchBar} ${style.mobileSearch} ${searchBar?style.active:""}`} ref={mobileSearchContainer}>
    {mobile && <input type='text' placeholder='Search...' aria-label='Search' value={search} onChange={(e)=>setSearch(e.target.value)}/>}
    {search &&  <button className={style.searchClose} aria-label='Close search' onClick={()=>{setSearch("");setSearchBar(false);}}> <Image src="/assets/images/menu-close.svg" width={12} height={12} alt=''/> </button>}
</div>
}

    </header>
    
    </>
  )
}
