'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import TestsIncludesRepeater from './TestsIncludesRepeater'
import PackageFaqRepeater from './PackageFaqRepeater'
import style from '../../content/content-admin.module.css'

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function HealthPackageEditForm({ mode, pkg }) {
  const router = useRouter()

  const [isPopular, setIsPopular] = useState(pkg?.isPopular ?? false)
  const [testName, setTestName] = useState(pkg?.testName ?? '')
  const [slug, setSlug] = useState(pkg?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(mode === 'edit')
  const [discount, setDiscount] = useState(pkg?.discount ?? '')
  const [discountText, setDiscountText] = useState(pkg?.discountText ?? '')
  const [offerPrice, setOfferPrice] = useState(pkg?.offerPrice ?? '')
  const [actualPrice, setActualPrice] = useState(pkg?.actualPrice ?? '')
  const [testCount, setTestCount] = useState(pkg?.testCount ?? '')
  const [disclaimer, setDisclaimer] = useState(pkg?.disclaimer ?? '')
  const [testGroups, setTestGroups] = useState(
    pkg?.testGroups?.length ? pkg.testGroups : []
  )
  const [ageGroup, setAgeGroup] = useState(pkg?.ageGroup ?? '')
  const [gender, setGender] = useState(pkg?.gender ?? '')
  const [fastingFor, setFastingFor] = useState(pkg?.fastingFor ?? '')
  const [reportsWithin, setReportsWithin] = useState(pkg?.reportsWithin ?? '')
  const [faqs, setFaqs] = useState(pkg?.faqs?.length ? pkg.faqs : [])
  const [packageImage, setPackageImage] = useState(pkg?.packageImage ?? '')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const [isActive, setIsActive] = useState(pkg?.isActive !== false)
  const [metaTitle, setMetaTitle] = useState(pkg?.metaTitle ?? '')
  const [metaDescription, setMetaDescription] = useState(pkg?.metaDescription ?? '')
  const [canonicalUrl, setCanonicalUrl] = useState(pkg?.canonicalUrl ?? '')
  const [seoOpen, setSeoOpen] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleNameChange = (value) => {
    setTestName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  const handleSlugChange = (value) => {
    setSlugTouched(true)
    setSlug(value)
  }

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    setImageError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/health-packages/upload-image', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setImageError(data.error || 'Could not upload image.')
        return
      }

      setPackageImage(data.url)
    } catch {
      setImageError('Could not upload image.')
    } finally {
      setImageUploading(false)
      event.target.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const input = {
      testName,
      slug,
      isPopular,
      discount,
      discountText,
      offerPrice,
      actualPrice,
      testCount,
      disclaimer,
      testGroups,
      ageGroup,
      gender,
      fastingFor,
      reportsWithin,
      faqs,
      packageImage,
      metaTitle,
      metaDescription,
      canonicalUrl,
      isActive,
    }

    try {
      const res = await fetch(
        mode === 'create' ? '/api/admin/health-packages' : `/api/admin/health-packages/${pkg.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        }
      )
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not save health package.')
        return
      }

      router.push('/admin/health-packages')
      router.refresh()
    } catch {
      setError('Could not save health package.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={style.formCard} onSubmit={handleSubmit}>
      {error && <div className={style.errorBanner}>{error}</div>}

      <div className={style.checkboxField}>
        <input type="checkbox" id="isPopular" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} />
        <label className={style.label} htmlFor="isPopular">Most Popular</label>
      </div>

      <p className={style.sectionTitle}>Basic Info</p>

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>
            Test Name <span className={style.required}>*</span>
          </label>
          <input className={style.input} placeholder="0.5" value={testName} onChange={(e) => handleNameChange(e.target.value)} required />
        </div>
        <div className={style.field}>
          <label className={style.label}>
            Package URL / Slug <span className={style.required}>*</span>
          </label>
          <input className={style.input} placeholder="0.5" value={slug} onChange={(e) => handleSlugChange(e.target.value)} required />
        </div>
      </div>

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>Test Count</label>
          <input className={style.input} placeholder="0.5" value={testCount} onChange={(e) => setTestCount(e.target.value)} required />
        </div>
        <div className={style.field}>
          <label className={style.label}>Disclaimer</label>
          <input className={style.input} placeholder="0.5" value={disclaimer} onChange={(e) => setDisclaimer(e.target.value)} />
        </div>
      </div>

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>Offer Price</label>
          <input className={style.input} placeholder="0.5" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} required />
        </div>
        <div className={style.field}>
          <label className={style.label}>Actual Price</label>
          <input className={style.input} placeholder="0.5" value={actualPrice} onChange={(e) => setActualPrice(e.target.value)} required />
        </div>
      </div>

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>Package Discount</label>
          <input className={style.input} placeholder="0.5" value={discount} onChange={(e) => setDiscount(e.target.value)} />
        </div>
        <div className={style.field}>
          <label className={style.label}>Discount Text</label>
          <input className={style.input} placeholder="0.5" value={discountText} onChange={(e) => setDiscountText(e.target.value)} />
        </div>
      </div>

      <p className={style.sectionTitle}>Tests Includes</p>
      <TestsIncludesRepeater groups={testGroups} onChange={setTestGroups} />

      <p className={style.sectionTitle}>Package Details</p>

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>Age Group</label>
          <input className={style.input} placeholder="0.5" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} />
        </div>
        <div className={style.field}>
          <label className={style.label}>Gender</label>
          <select className={style.input} value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Men & Women">Men & Women</option>
          </select>
        </div>
      </div>

      <div className={style.formRow}>
        <div className={style.field}>
          <label className={style.label}>Fasting For</label>
          <input className={style.input} placeholder="0.5" value={fastingFor} onChange={(e) => setFastingFor(e.target.value)} />
        </div>
        <div className={style.field}>
          <label className={style.label}>Reports Within</label>
          <input className={style.input} placeholder="0.5" value={reportsWithin} onChange={(e) => setReportsWithin(e.target.value)} />
        </div>
      </div>

      <p className={style.sectionTitle}>Package FAQ</p>
      <PackageFaqRepeater faqs={faqs} onChange={setFaqs} />

      <p className={style.sectionTitle}>Package Image</p>
      <div className={style.field}>
        <label className={style.label}>Package Image (397 × 415px, PNG or WEBP)</label>
        <div className={style.imageUploadRow}>
          <span className={style.imagePreview}>
            {packageImage && <Image src={packageImage} alt="" width={160} height={166} />}
          </span>
          <div>
            <input type="file" accept="image/png,image/webp" onChange={handleImageChange} />
            {imageUploading && <p className={style.hint}>Uploading…</p>}
            {imageError && <p className={style.hint} style={{ color: '#c0392b' }}>{imageError}</p>}
          </div>
        </div>
      </div>

      <div className={style.collapsibleSection}>
        <button type="button" className={style.collapsibleHeader} onClick={() => setSeoOpen((prev) => !prev)}>
          <span>SEO Settings</span>
          <span>{seoOpen ? '−' : '+'}</span>
        </button>

        {seoOpen && (
          <div className={style.collapsibleBody}>
            <div className={style.field}>
              <label className={style.label}>Meta Title</label>
              <input className={style.input} placeholder="0.5" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
            </div>

            <div className={style.field}>
              <label className={style.label}>Meta Description</label>
              <textarea className={style.textarea} rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
            </div>

            <div className={style.field}>
              <label className={style.label}>Meta URL / Canonical URL</label>
              <input className={style.input} placeholder="0.5" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      <div className={style.checkboxField} style={{ marginTop: 36 }}>
        <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <label className={style.label} htmlFor="isActive">Active (visible on the public site)</label>
      </div>

      <div className={style.formActions}>
        <button type="submit" className={style.primaryButton} disabled={submitting || imageUploading}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className={style.secondaryButton} onClick={() => router.push('/admin/health-packages')}>
          Cancel
        </button>
      </div>
    </form>
  )
}
