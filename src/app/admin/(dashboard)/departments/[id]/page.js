import { notFound } from 'next/navigation'
import { getDepartmentByIdAdmin } from '@/lib/departments'
import DepartmentEditForm from '../DepartmentEditForm'
import style from '../departments.module.css'

export const metadata = {
  title: 'Edit Department — Admin',
}

export default async function EditDepartmentPage({ params }) {
  const { id } = await params
  const department = await getDepartmentByIdAdmin(Number(id))
  if (!department) notFound()

  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Edit Department</h1>
      </div>
      <DepartmentEditForm mode="edit" department={department} />
    </>
  )
}
