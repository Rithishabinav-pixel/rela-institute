'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import style from './admin.module.css'

const NAV_ITEMS = [
  { label: 'Hero Banners', href: '/admin/hero-banners' },
  { label: 'Careers / Jobs', href: '/admin/jobs' },
  { label: 'Department', href: '/admin/departments' },
  { label: 'Doctors', href: '/admin/doctors' },
  { label: 'Media', href: '/admin/media' },
  { label: 'Media Articles', href: '/admin/media-articles' },
  { label: 'Success Stories', href: '/admin/success-stories' },
  { label: 'Expert Talks', href: '/admin/expert-talks' },
  { label: 'Events', href: '/admin/events' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className={style.sidebar}>
      <p className={style.sidebarTitle}>Admin</p>
      <nav className={style.sidebarNav}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${style.sidebarLink} ${isActive ? style.sidebarLinkActive : ''}`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
