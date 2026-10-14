import Link from 'next/link'
import { listDoctorsAdmin } from '@/lib/doctors'
import DoctorsClient from './DoctorsClient'
import style from './doctors.module.css'

export const metadata = {
  title: 'Doctors — Admin',
}

export default async function DoctorsPage() {
  const initial = await listDoctorsAdmin({ page: 1, pageSize: 20 })

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Doctors</h1>
        <Link href="/admin/doctors/new" className={style.primaryButton}>
          + Add Doctor
        </Link>
      </div>
      <DoctorsClient initial={initial} />
    </>
  )
}
