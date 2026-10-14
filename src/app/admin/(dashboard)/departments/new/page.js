import DepartmentEditForm from '../DepartmentEditForm'
import style from '../departments.module.css'

export const metadata = {
  title: 'Add Department — Admin',
}

export default function NewDepartmentPage() {
  return (
    <>
      <div className={style.pageHeader}>
        <h1 className={style.pageTitle}>Add Department</h1>
      </div>
      <DepartmentEditForm mode="create" />
    </>
  )
}
