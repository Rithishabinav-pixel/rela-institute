import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/admin-session'
import Sidebar from '../Sidebar'
import LogoutButton from '../LogoutButton'
import style from '../admin.module.css'

export default async function AdminDashboardLayout({ children }) {
  if (!(await isAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <div className={style.shell}>
      <header className={style.header}>
        <div className={style.headerBrand}>
          rela <span>Admin</span>
        </div>
        <LogoutButton />
      </header>
      <div className={style.body}>
        <Sidebar />
        <main className={style.main}>{children}</main>
      </div>
    </div>
  )
}
