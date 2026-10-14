import { notFound } from 'next/navigation'
import { listDepartments } from '@/lib/departments'
import { getDoctorByIdAdmin } from '@/lib/doctors'
import DoctorEditForm from '../DoctorEditForm'
import style from '../doctors.module.css'

export const metadata = {
  title: 'Edit Doctor — Admin',
}

export default async function EditDoctorPage({ params }) {
  const { id } = await params
  const doctor = await getDoctorByIdAdmin(Number(id))
  if (!doctor) notFound()

  const departments = await listDepartments()
  const options = departments.map((d) => ({ id: d.departmentId, name: d.name }))

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Doctor</h1>
      </div>
      <DoctorEditForm mode="edit" doctor={doctor} departments={options} />
    </>
  )
}
