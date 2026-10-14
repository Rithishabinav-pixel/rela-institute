import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/admin-session'
import LoginForm from './LoginForm'

export const metadata = {
  title: 'Admin Login',
}

export default async function AdminLoginPage() {
  if (await isAuthenticated()) {
    redirect('/admin/departments')
  }

  return <LoginForm />
}
