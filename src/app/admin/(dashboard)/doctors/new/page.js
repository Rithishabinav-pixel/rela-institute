import { listDepartments } from '@/lib/departments'
import { getDoctorContentLinkingOptions } from '@/lib/doctors'
import DoctorEditForm from '../DoctorEditForm'
import style from '../doctors.module.css'

export const metadata = {
  title: 'Add Doctor — Admin',
}

export default async function NewDoctorPage() {
  const departments = await listDepartments()
  const options = departments.map((d) => ({ id: d.departmentId, name: d.name }))
  const contentOptions = await getDoctorContentLinkingOptions()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Doctor</h1>
      </div>
      <DoctorEditForm mode="create" departments={options} {...contentOptions} />
    </>
  )
}
