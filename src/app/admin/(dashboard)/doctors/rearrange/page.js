import Link from 'next/link'
import { listDoctorsForRearrangeAdmin } from '@/lib/doctors'
import DoctorsRearrangeClient from './DoctorsRearrangeClient'
import style from '../doctors.module.css'

export const metadata = {
  title: 'Rearrange Doctors — Admin',
}

export default async function RearrangeDoctorsPage() {
  const doctors = await listDoctorsForRearrangeAdmin()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Rearrange Doctors</h1>
        <Link href="/admin/doctors" className={style.secondaryButton}>
          Back to Doctors
        </Link>
      </div>
      <DoctorsRearrangeClient initial={doctors} />
    </>
  )
}
