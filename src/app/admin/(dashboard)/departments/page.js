import Link from 'next/link'
import { listDepartmentsAdmin } from '@/lib/departments'
import DepartmentsClient from './DepartmentsClient'
import style from './departments.module.css'

export const metadata = {
  title: 'Departments — Admin',
}

export default async function DepartmentsPage() {
  const initial = await listDepartmentsAdmin({ page: 1, pageSize: 20 })

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Departments</h1>
        <Link href="/admin/departments/new" className={style.primaryButton}>
          + Add Department
        </Link>
      </div>
      <DepartmentsClient initial={initial} />
    </>
  )
}
