import {
  listContactEnquiriesAdmin,
  listCareerEnquiriesAdmin,
  listContentEnquiriesAdmin,
  listDoctorEnquiriesAdmin,
  listPackageEnquiriesAdmin,
} from '@/lib/enquiries'
import EnquiriesPageClient from './EnquiriesPageClient'
import style from '../../content/content-admin.module.css'

export const metadata = {
  title: 'Enquiries — Admin',
}

export default async function EnquiriesPage() {
  const [contact, career, content, doctor, pkg] = await Promise.all([
    listContactEnquiriesAdmin(1),
    listCareerEnquiriesAdmin(1),
    listContentEnquiriesAdmin(1),
    listDoctorEnquiriesAdmin(1),
    listPackageEnquiriesAdmin(1),
  ])

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Enquiries</h1>
      </div>
      <EnquiriesPageClient initialResults={{ contact, career, content, doctor, package: pkg }} />
    </>
  )
}
