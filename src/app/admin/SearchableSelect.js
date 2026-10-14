'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import style from './SearchableSelect.module.css'

export default function SearchableSelect({
  options,
  value,
  onChange,
  multiple = false,
  placeholder = 'Search...',
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  const selectedIds = multiple ? value ?? [] : value != null ? [value] : []
  const selectedKey = selectedIds.join(',')
  const selectedOptions = options.filter((option) => selectedIds.includes(option.id))

  const filteredOptions = useMemo(() => {
    const term = query.trim().toLowerCase()
    return options
      .filter((option) => (multiple ? !selectedIds.includes(option.id) : true))
      .filter((option) => !term || option.name.toLowerCase().includes(term))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, query, multiple, selectedKey])

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const openDropdown = () => {
    setOpen(true)
    setActiveIndex(0)
  }

  const handleQueryChange = (nextQuery) => {
    setQuery(nextQuery)
    setActiveIndex(0)
  }

  const selectOption = (option) => {
    if (multiple) {
      onChange([...selectedIds, option.id])
      setQuery('')
    } else {
      onChange(option.id)
      setOpen(false)
      setQuery('')
    }
  }

  const removeOption = (id) => {
    onChange(selectedIds.filter((existingId) => existingId !== id))
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (filteredOptions[activeIndex]) selectOption(filteredOptions[activeIndex])
    } else if (event.key === 'Escape') {
      setOpen(false)
    } else if (event.key === 'Backspace' && multiple && !query && selectedIds.length > 0) {
      removeOption(selectedIds[selectedIds.length - 1])
    }
  }

  return (
    <div className={style.wrapper} ref={wrapperRef}>
      <div
        className={style.control}
        onClick={() => {
          openDropdown()
          inputRef.current?.focus()
        }}
      >
        {multiple &&
          selectedOptions.map((option) => (
            <span key={option.id} className={style.chip}>
              {option.name}
              <button
                type="button"
                className={style.chipRemove}
                onClick={(event) => {
                  event.stopPropagation()
                  removeOption(option.id)
                }}
                aria-label={`Remove ${option.name}`}
              >
                ×
              </button>
            </span>
          ))}

        {!multiple && selectedOptions[0] && !open && (
          <span className={style.singleValue}>{selectedOptions[0].name}</span>
        )}

        <input
          ref={inputRef}
          type="text"
          className={style.searchInput}
          placeholder={selectedOptions.length === 0 ? placeholder : multiple ? 'Search...' : ''}
          value={query}
          onFocus={openDropdown}
          onChange={(event) => handleQueryChange(event.target.value)}
          onKeyDown={handleKeyDown}
          style={!multiple && selectedOptions[0] && !open ? { width: 0, padding: 0 } : undefined}
        />
      </div>

      {open && (
        <div className={style.dropdown}>
          {filteredOptions.length === 0 && <div className={style.emptyOption}>No matches</div>}
          {filteredOptions.map((option, index) => (
            <div
              key={option.id}
              className={`${style.option} ${index === activeIndex ? style.optionActive : ''} ${
                selectedIds.includes(option.id) ? style.optionSelected : ''
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectOption(option)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
