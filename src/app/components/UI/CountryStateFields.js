'use client'

import { useEffect, useState } from 'react'

export default function CountryStateFields({ formStyle, countryIso, stateIso, onCountryChange, onStateChange }) {
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [loadingStates, setLoadingStates] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch('/api/geo/countries')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setCountries(data.countries || [])
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!countryIso) return

    let cancelled = false

    const load = async () => {
      setLoadingStates(true)
      try {
        const res = await fetch(`/api/geo/states?country=${encodeURIComponent(countryIso)}`)
        const data = await res.json()
        if (!cancelled) setStates(data.states || [])
      } catch {
      } finally {
        if (!cancelled) setLoadingStates(false)
      }
    }

    load()

    return () => { cancelled = true }
  }, [countryIso])

  const handleCountryChange = (event) => {
    onCountryChange(event.target.value)
    onStateChange('')
  }

  return (
    <>
      <div className={formStyle.inputCont}>
        <select value={countryIso} onChange={handleCountryChange} required>
          <option value="">Country</option>
          {countries.map((country) => (
            <option key={country.isoCode} value={country.isoCode}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className={formStyle.inputCont}>
        <select
          value={stateIso}
          onChange={(event) => onStateChange(event.target.value)}
          disabled={!countryIso || loadingStates}
          required
        >
          <option value="">{countryIso ? 'State' : 'Select a country first'}</option>
          {(countryIso ? states : []).map((state) => (
            <option key={state.isoCode} value={state.isoCode}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
