'use client'

import style from '../../content/content-admin.module.css'

export default function TestsIncludesRepeater({ groups, onChange }) {
  const updateGroup = (index, patch) => {
    onChange(groups.map((group, i) => (i === index ? { ...group, ...patch } : group)))
  }

  const addGroup = () => {
    onChange([...groups, { heading: '', tests: [''] }])
  }

  const removeGroup = (index) => {
    onChange(groups.filter((_, i) => i !== index))
  }

  const moveGroup = (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= groups.length) return
    const next = [...groups]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const addTest = (groupIndex) => {
    const group = groups[groupIndex]
    updateGroup(groupIndex, { tests: [...group.tests, ''] })
  }

  const updateTest = (groupIndex, testIndex, value) => {
    const group = groups[groupIndex]
    updateGroup(groupIndex, { tests: group.tests.map((t, i) => (i === testIndex ? value : t)) })
  }

  const removeTest = (groupIndex, testIndex) => {
    const group = groups[groupIndex]
    updateGroup(groupIndex, { tests: group.tests.filter((_, i) => i !== testIndex) })
  }

  return (
    <div>
      {groups.length === 0 && <p className={style.repeaterEmpty}>No test groups added yet.</p>}

      {groups.map((group, groupIndex) => (
        <div className={style.testGroupCard} key={groupIndex}>
          <div className={style.testGroupHead}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className={style.repeaterSectionLabel}>Test Group Heading</span>
              <input
                className={style.input}
                placeholder="0.5"
                value={group.heading}
                onChange={(e) => updateGroup(groupIndex, { heading: e.target.value })}
              />
            </div>
            <button type="button" className={style.iconButton} disabled={groupIndex === 0} onClick={() => moveGroup(groupIndex, -1)} aria-label="Move group up">
              ↑
            </button>
            <button type="button" className={style.iconButton} disabled={groupIndex === groups.length - 1} onClick={() => moveGroup(groupIndex, 1)} aria-label="Move group down">
              ↓
            </button>
            <button type="button" className={style.iconButton} onClick={() => removeGroup(groupIndex)} aria-label="Remove group">
              ×
            </button>
          </div>

          <div className={style.nestedTestsBox}>
            <span className={style.repeaterSectionLabel}>Test Names</span>

            {group.tests.map((test, testIndex) => (
              <div className={style.repeaterRow} key={testIndex}>
                <input
                  className={style.input}
                  placeholder="0.5"
                  value={test}
                  onChange={(e) => updateTest(groupIndex, testIndex, e.target.value)}
                />
                <button type="button" className={style.iconButton} onClick={() => removeTest(groupIndex, testIndex)} aria-label="Remove test">
                  ×
                </button>
              </div>
            ))}

            <button type="button" className={style.secondaryButton} onClick={() => addTest(groupIndex)}>
              + Add Test Name
            </button>
          </div>
        </div>
      ))}

      <button type="button" className={style.primaryButton} onClick={addGroup}>
        + Add Test Group
      </button>
    </div>
  )
}
