'use client'

import { useState } from 'react'
import { ENQUIRY_TYPES } from './enquiryTypes'
import adminStyle from '../../content/content-admin.module.css'
import style from './enquiries.module.css'

function formatValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (value instanceof Date) return new Date(value).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  return String(value)
}

function DetailModal({ typeConfig, enquiry, onClose }) {
  return (
    <div className={style.overlay} onClick={onClose}>
      <div className={style.modal} onClick={(event) => event.stopPropagation()}>
        <div className={style.modalTitle}>{typeConfig.label} — #{enquiry.id}</div>

        {typeConfig.detailFields.map(([key, label]) => (
          <div className={style.detailRow} key={key}>
            <div className={style.detailLabel}>{label}</div>
            <div className={style.detailValue}>
              {key === 'createdAt' ? formatValue(new Date(enquiry[key])) : formatValue(enquiry[key])}
            </div>
          </div>
        ))}

        {typeConfig.hasResume && (
          <div className={style.detailRow}>
            <div className={style.detailLabel}>Resume</div>
            <div className={style.detailValue}>
              {enquiry.resumePath ? (
                <a href={`/api/admin/career-enquiries/${enquiry.id}/resume`} target="_blank" rel="noopener noreferrer">
                  Download Resume
                </a>
              ) : (
                '—'
              )}
            </div>
          </div>
        )}

        <button type="button" className={style.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default function EnquiriesPageClient({ initialResults }) {
  const [activeType, setActiveType] = useState(ENQUIRY_TYPES[0].key)
  const [results, setResults] = useState(initialResults)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detailEnquiry, setDetailEnquiry] = useState(null)

  const activeTypeConfig = ENQUIRY_TYPES.find((t) => t.key === activeType)
  const activeResult = results[activeType]

  const loadPage = async (type, page) => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/enquiries/${type}?page=${page}`)
      if (!res.ok) throw new Error('Could not load enquiries')
      const data = await res.json()
      setResults((prev) => ({ ...prev, [type]: data }))
    } catch {
      setError('Could not load enquiries. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={style.tabs}>
        {ENQUIRY_TYPES.map((type) => (
          <button
            key={type.key}
            type="button"
            className={`${style.tabButton} ${activeType === type.key ? style.tabButtonActive : ''}`}
            onClick={() => setActiveType(type.key)}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className={adminStyle.card}>
        <table className={adminStyle.table}>
          <thead>
            <tr>
              {activeTypeConfig.columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th>Submitted At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr className={adminStyle.errorRow}>
                <td colSpan={activeTypeConfig.columns.length + 2}>{error}</td>
              </tr>
            )}

            {!error && loading && (
              <tr className={adminStyle.stateRow}>
                <td colSpan={activeTypeConfig.columns.length + 2}>Loading…</td>
              </tr>
            )}

            {!error && !loading && activeResult.items.length === 0 && (
              <tr className={adminStyle.stateRow}>
                <td colSpan={activeTypeConfig.columns.length + 2}>No enquiries found.</td>
              </tr>
            )}

            {!error &&
              !loading &&
              activeResult.items.map((enquiry) => (
                <tr key={enquiry.id}>
                  {activeTypeConfig.columns.map((col) => (
                    <td key={col.key}>{formatValue(enquiry[col.key])}</td>
                  ))}
                  <td>{new Date(enquiry.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}</td>
                  <td>
                    <button type="button" className={adminStyle.secondaryButton} onClick={() => setDetailEnquiry(enquiry)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {activeResult.totalPages > 1 && (
          <div className={adminStyle.pagination}>
            <button
              type="button"
              disabled={activeResult.page <= 1}
              onClick={() => loadPage(activeType, activeResult.page - 1)}
            >
              Prev
            </button>
            <span className={adminStyle.pageInfo}>
              Page {activeResult.page} of {activeResult.totalPages}
            </span>
            <button
              type="button"
              disabled={activeResult.page >= activeResult.totalPages}
              onClick={() => loadPage(activeType, activeResult.page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {detailEnquiry && (
        <DetailModal typeConfig={activeTypeConfig} enquiry={detailEnquiry} onClose={() => setDetailEnquiry(null)} />
      )}
    </>
  )
}
