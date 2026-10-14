'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import style from './login.module.css'

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!username.trim() || !password) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid username or password.')
        return
      }

      router.push('/admin/departments')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={style.page}>
      <form className={style.card} onSubmit={handleSubmit}>
        <p className={style.title}>Admin Login</p>
        <p className={style.subtitle}>Sign in to manage rela Institute content.</p>

        {error && <div className={style.error}>{error}</div>}

        <div className={style.field}>
          <label className={style.label} htmlFor="admin-username">
            Username
          </label>
          <input
            id="admin-username"
            type="text"
            className={style.input}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
        </div>

        <div className={style.field}>
          <label className={style.label} htmlFor="admin-password">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            className={style.input}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className={style.submit} disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}
