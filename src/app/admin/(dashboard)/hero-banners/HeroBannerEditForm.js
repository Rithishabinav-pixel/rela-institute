'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import style from '../../content/content-admin.module.css'

export default function HeroBannerEditForm({ mode, banner }) {
  const router = useRouter()

  const [type, setType] = useState(banner?.type ?? 'content')
  const [title, setTitle] = useState(banner?.title ?? '')
  const [fancyText, setFancyText] = useState(banner?.fancyText ?? '')
  const [description, setDescription] = useState(banner?.description ?? '')
  const [buttonText, setButtonText] = useState(banner?.buttonText ?? '')
  const [buttonType, setButtonType] = useState(banner?.buttonType ?? 'common')
  const [buttonLink, setButtonLink] = useState(banner?.buttonLink ?? '')
  const [bannerLink, setBannerLink] = useState(banner?.bannerLink ?? '')
  const [desktopImage, setDesktopImage] = useState(banner?.desktopImage ?? '')
  const [mobileImage, setMobileImage] = useState(banner?.mobileImage ?? '')

  const [desktopUploading, setDesktopUploading] = useState(false)
  const [mobileUploading, setMobileUploading] = useState(false)
  const [desktopError, setDesktopError] = useState('')
  const [mobileError, setMobileError] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (kind) => async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const setUploading = kind === 'desktop' ? setDesktopUploading : setMobileUploading
    const setImageError = kind === 'desktop' ? setDesktopError : setMobileError
    const setImage = kind === 'desktop' ? setDesktopImage : setMobileImage

    setUploading(true)
    setImageError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('kind', kind)
      const res = await fetch('/api/admin/hero-banners/upload-image', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setImageError(data.error || 'Could not upload image.')
        return
      }

      setImage(data.url)
    } catch {
      setImageError('Could not upload image.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const input = {
      type,
      title,
      fancyText,
      description,
      buttonText,
      buttonType,
      buttonLink,
      bannerLink,
      desktopImage,
      mobileImage,
    }

    try {
      const res = await fetch(
        mode === 'create' ? '/api/admin/hero-banners' : `/api/admin/hero-banners/${banner.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        }
      )
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not save hero banner.')
        return
      }

      router.push('/admin/hero-banners')
    } catch {
      setError('Could not save hero banner.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={style.formCard} onSubmit={handleSubmit}>
      {error && <div className={style.errorBanner}>{error}</div>}

      <div className={style.typeToggle}>
        <button
          type="button"
          className={`${style.typeToggleButton} ${type === 'content' ? style.typeToggleButtonActive : ''}`}
          onClick={() => setType('content')}
        >
          Content Type
        </button>
        <button
          type="button"
          className={`${style.typeToggleButton} ${type === 'image' ? style.typeToggleButtonActive : ''}`}
          onClick={() => setType('image')}
        >
          Image Type
        </button>
      </div>

      {type === 'content' && (
        <>
          <div className={style.formRow}>
            <div className={style.field}>
              <label className={style.label}>
                Title <span className={style.required}>*</span>
              </label>
              <input className={style.input} value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className={style.field}>
              <label className={style.label}>Fancy Text</label>
              <input className={style.input} value={fancyText} onChange={(e) => setFancyText(e.target.value)} />
            </div>
          </div>

          <div className={style.field}>
            <label className={style.label}>Description</label>
            <textarea className={style.textarea} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className={style.formRow}>
            <div className={style.field}>
              <label className={style.label}>Button Text</label>
              <input className={style.input} value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
            </div>
            <div className={style.field}>
              <label className={style.label}>Button Type</label>
              <select className={style.input} value={buttonType} onChange={(e) => setButtonType(e.target.value)}>
                <option value="call">Call</option>
                <option value="common">Common Button</option>
              </select>
            </div>
          </div>

          <div className={style.field}>
            <label className={style.label}>
              Button {buttonType === 'call' ? 'Phone Number' : 'Link'}
            </label>
            <input className={style.input} value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} placeholder={buttonType === 'call' ? 'tel:0442200600' : '/'} />
          </div>
        </>
      )}

      {type === 'image' && (
        <div className={style.field}>
          <label className={style.label}>
            Banner Link <span className={style.required}>*</span>
          </label>
          <input className={style.input} value={bannerLink} onChange={(e) => setBannerLink(e.target.value)} placeholder="/" required />
        </div>
      )}

      <div className={style.field}>
        <label className={style.label}>
          Desktop Banner Image (1920 × 711px) <span className={style.required}>*</span>
        </label>
        <div className={style.imageUploadRow}>
          <span className={style.imagePreview}>
            {desktopImage && <Image src={desktopImage} alt="" width={160} height={90} />}
          </span>
          <div>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange('desktop')} />
            {desktopUploading && <p className={style.hint}>Uploading…</p>}
            {desktopError && <p className={style.hint} style={{ color: '#c0392b' }}>{desktopError}</p>}
          </div>
        </div>
      </div>

      <div className={style.field}>
        <label className={style.label}>
          Mobile Banner Image (786 × 1312px) <span className={style.required}>*</span>
        </label>
        <div className={style.imageUploadRow}>
          <span className={style.imagePreview}>
            {mobileImage && <Image src={mobileImage} alt="" width={90} height={160} />}
          </span>
          <div>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange('mobile')} />
            {mobileUploading && <p className={style.hint}>Uploading…</p>}
            {mobileError && <p className={style.hint} style={{ color: '#c0392b' }}>{mobileError}</p>}
          </div>
        </div>
      </div>

      <div className={style.formActions}>
        <button type="submit" className={style.primaryButton} disabled={submitting || desktopUploading || mobileUploading}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <button type="button" className={style.secondaryButton} onClick={() => router.push('/admin/hero-banners')}>
          Cancel
        </button>
      </div>
    </form>
  )
}
