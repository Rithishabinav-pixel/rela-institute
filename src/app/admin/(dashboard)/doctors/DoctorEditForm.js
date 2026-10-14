'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SearchableSelect from '../../SearchableSelect'
import RichTextEditor from '../../RichTextEditor'
import style from './doctors.module.css'

function emptyTab() {
  return { heading: '', content: '' }
}

export default function DoctorEditForm({ mode, doctor, departments }) {
  const router = useRouter()

  const [name, setName] = useState(doctor?.name ?? '')
  const [education, setEducation] = useState(doctor?.education ?? '')
  const [position, setPosition] = useState(doctor?.position ?? '')
  const [mainPosition, setMainPosition] = useState(doctor?.mainPosition ?? '')
  const [departmentIds, setDepartmentIds] = useState(
    doctor?.departments?.map((d) => d.departmentId) ?? []
  )
  const [specialityDepartmentId, setSpecialityDepartmentId] = useState(
    doctor?.speciality?.departmentId ?? null
  )
  const [image, setImage] = useState(doctor?.image ?? '')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const [tabs, setTabs] = useState(
    doctor?.tabs?.length ? doctor.tabs.map((t) => ({ heading: t.heading, content: t.content })) : [emptyTab()]
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    setImageError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/doctors/upload-image', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setImageError(data.error || 'Could not upload image.')
        return
      }

      setImage(data.url)
    } catch {
      setImageError('Could not upload image.')
    } finally {
      setImageUploading(false)
      event.target.value = ''
    }
  }

  const updateTab = (index, patch) => {
    setTabs((prev) => prev.map((tab, i) => (i === index ? { ...tab, ...patch } : tab)))
  }

  const addTab = () => setTabs((prev) => [...prev, emptyTab()])
  const removeTab = (index) => setTabs((prev) => prev.filter((_, i) => i !== index))
  const moveTab = (index, direction) => {
    setTabs((prev) => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = {
      name,
      education,
      position,
      mainPosition,
      departmentIds,
      specialityDepartmentId,
      image,
      tabs,
    }

    const url = mode === 'edit' ? `/api/admin/doctors/${doctor.id}` : '/api/admin/doctors'
    const method = mode === 'edit' ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not save doctor.')
        return
      }

      router.push('/admin/doctors')
      router.refresh()
    } catch {
      setError('Could not save doctor.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={style.formCard} onSubmit={handleSubmit}>
      {error && <div className={style.errorBanner}>{error}</div>}

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>
            Doctor Name <span className={style.required}>*</span>
          </label>
          <input
            className={style.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Education <span className={style.required}>*</span>
          </label>
          <input
            className={style.input}
            value={education}
            onChange={(event) => setEducation(event.target.value)}
            required
          />
        </div>
      </div>

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>
            Doctor Position <span className={style.required}>*</span>
          </label>
          <input
            className={style.input}
            value={position}
            onChange={(event) => setPosition(event.target.value)}
            required
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Main Position <span className={style.required}>*</span>
          </label>
          <input
            className={style.input}
            value={mainPosition}
            onChange={(event) => setMainPosition(event.target.value)}
            required
          />
        </div>
      </div>

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>
            Departments <span className={style.required}>*</span>
          </label>
          <SearchableSelect
            multiple
            options={departments}
            value={departmentIds}
            onChange={setDepartmentIds}
            placeholder="Search department..."
          />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Speciality <span className={style.required}>*</span>
          </label>
          <SearchableSelect
            options={departments}
            value={specialityDepartmentId}
            onChange={setSpecialityDepartmentId}
            placeholder="Search speciality..."
          />
        </div>
      </div>

      <div className={style.field}>
        <label className={style.label}>Doctor Image (360 × 423px)</label>
        <div className={style.imageUploadRow}>
          <span className={style.imagePreview}>
            <Image
              src={image || '/assets/images/doc-sample-img.png'}
              alt=""
              width={90}
              height={106}
            />
          </span>
          <div>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} />
            {imageUploading && <p className={style.hint}>Uploading…</p>}
            {imageError && <p className={style.hint} style={{ color: '#c0392b' }}>{imageError}</p>}
            {!imageError && !imageUploading && (
              <p className={style.hint}>Exactly 360×423px. Leave empty to use the placeholder image.</p>
            )}
          </div>
        </div>
      </div>

      <div className={style.tabsSection}>
        <label className={style.label}>
          Doctor Tabs <span className={style.required}>*</span>
        </label>

        {tabs.map((tab, index) => (
          <div key={index} className={style.tabCard}>
            <div className={style.tabCardHeader}>
              <input
                className={style.input}
                style={{ flex: 1 }}
                placeholder="Tab heading, e.g. Brief Profile"
                value={tab.heading}
                onChange={(event) => updateTab(index, { heading: event.target.value })}
                required
              />
              <div className={style.tabOrderButtons}>
                <button
                  type="button"
                  className={style.iconButton}
                  disabled={index === 0}
                  onClick={() => moveTab(index, -1)}
                  aria-label="Move tab up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={style.iconButton}
                  disabled={index === tabs.length - 1}
                  onClick={() => moveTab(index, 1)}
                  aria-label="Move tab down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={style.iconButton}
                  disabled={tabs.length === 1}
                  onClick={() => removeTab(index)}
                  aria-label="Remove tab"
                >
                  ×
                </button>
              </div>
            </div>

            <RichTextEditor
              value={tab.content}
              onChange={(content) => updateTab(index, { content })}
              resetKey={`${mode}-${doctor?.id ?? 'new'}-${index}`}
            />
          </div>
        ))}

        <button type="button" className={style.secondaryButton} onClick={addTab}>
          + Add Tab
        </button>
      </div>

      <div className={style.formActions}>
        <button type="submit" className={style.primaryButton} disabled={submitting}>
          {submitting ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Add Doctor'}
        </button>
      </div>
    </form>
  )
}
