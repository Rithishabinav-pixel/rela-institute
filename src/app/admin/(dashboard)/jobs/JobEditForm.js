'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BlockContentEditor from './BlockContentEditor'
import style from '../../content/content-admin.module.css'

export default function JobEditForm({ mode, job, titleOptions, categoryOptions, locationOptions }) {
  const router = useRouter()

  const [jobTitleId, setJobTitleId] = useState(job?.jobTitleId ?? '')
  const [jobCategoryId, setJobCategoryId] = useState(job?.jobCategoryId ?? '')
  const [jobLocationId, setJobLocationId] = useState(job?.jobLocationId ?? '')
  const [experience, setExperience] = useState(job?.experience ?? '')
  const [education, setEducation] = useState(job?.education ?? '')
  const [content, setContent] = useState(job?.content ?? '')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const input = { jobTitleId, jobCategoryId, jobLocationId, experience, education, content }

    try {
      const res = await fetch(mode === 'create' ? '/api/admin/jobs' : `/api/admin/jobs/${job.id}`, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not save job.')
        return
      }

      router.push('/admin/jobs')
    } catch {
      setError('Could not save job.')
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
            Job Title <span className={style.required}>*</span>
          </label>
          <select className={style.input} value={jobTitleId} onChange={(e) => setJobTitleId(e.target.value)} required>
            <option value="">Select a job title…</option>
            {titleOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Job Category <span className={style.required}>*</span>
          </label>
          <select className={style.input} value={jobCategoryId} onChange={(e) => setJobCategoryId(e.target.value)} required>
            <option value="">Select a category…</option>
            {categoryOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>
            Location <span className={style.required}>*</span>
          </label>
          <select className={style.input} value={jobLocationId} onChange={(e) => setJobLocationId(e.target.value)} required>
            <option value="">Select a location…</option>
            {locationOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Experience <span className={style.required}>*</span>
          </label>
          <input className={style.input} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="2-4 Years" required />
        </div>
      </div>

      <div className={style.field}>
        <label className={style.label}>
          Education <span className={style.required}>*</span>
        </label>
        <input className={style.input} value={education} onChange={(e) => setEducation(e.target.value)} placeholder="MBBS" required />
      </div>

      <div className={style.field}>
        <label className={style.label}>
          Content <span className={style.required}>*</span>
        </label>
        <BlockContentEditor value={content} onChange={setContent} />
      </div>

      <div className={style.formActions}>
        <button type="submit" className={style.primaryButton} disabled={submitting}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className={style.secondaryButton} onClick={() => router.push('/admin/jobs')}>
          Cancel
        </button>
      </div>
    </form>
  )
}
