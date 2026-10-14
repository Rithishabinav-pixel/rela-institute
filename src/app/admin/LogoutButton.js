'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import style from './admin.module.css'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <button type="button" className={style.logoutButton} onClick={handleLogout} disabled={loading}>
      {loading ? 'Logging out…' : 'Logout'}
    </button>
  )
}
