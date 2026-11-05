'use client'

import RichTextEditor from '../../RichTextEditor'
import style from '../../content/content-admin.module.css'

export default function PackageFaqRepeater({ faqs, onChange }) {
  const updateFaq = (index, patch) => {
    onChange(faqs.map((faq, i) => (i === index ? { ...faq, ...patch } : faq)))
  }

  const addFaq = () => {
    onChange([...faqs, { heading: '', answer: '' }])
  }

  const removeFaq = (index) => {
    onChange(faqs.filter((_, i) => i !== index))
  }

  const moveFaq = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= faqs.length) return
    const next = [...faqs]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div>
      {faqs.length === 0 && <p className={style.repeaterEmpty}>No FAQs added yet.</p>}

      {faqs.map((faq, index) => (
        <div className={style.repeaterGroup} key={index}>
          <div className={style.repeaterGroupHead}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className={style.repeaterSectionLabel}>FAQ Heading</span>
              <input
                className={style.input}
                placeholder="0.5"
                value={faq.heading}
                onChange={(e) => updateFaq(index, { heading: e.target.value })}
              />
            </div>
            <button type="button" className={style.iconButton} disabled={index === 0} onClick={() => moveFaq(index, -1)} aria-label="Move FAQ up">
              ↑
            </button>
            <button type="button" className={style.iconButton} disabled={index === faqs.length - 1} onClick={() => moveFaq(index, 1)} aria-label="Move FAQ down">
              ↓
            </button>
            <button type="button" className={style.iconButton} onClick={() => removeFaq(index)} aria-label="Remove FAQ">
              ×
            </button>
          </div>

          <RichTextEditor
            value={faq.answer}
            onChange={(value) => updateFaq(index, { answer: value })}
            resetKey={index}
          />
        </div>
      ))}

      <button type="button" className={style.secondaryButton} onClick={addFaq}>
        + Add FAQ
      </button>
    </div>
  )
}
