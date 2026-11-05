import { Country, State } from 'country-state-city'

export function getAllCountries() {
  return Country.getAllCountries().map((c) => ({ isoCode: c.isoCode, name: c.name }))
}

export function getStatesForCountry(isoCode) {
  if (!isoCode) return []
  return State.getStatesOfCountry(isoCode).map((s) => ({ isoCode: s.isoCode, name: s.name }))
}

export function isValidCountryState(countryIso, stateIso) {
  if (!countryIso) return !stateIso

  const country = Country.getCountryByCode(countryIso)
  if (!country) return false
  if (!stateIso) return true

  return State.getStatesOfCountry(countryIso).some((s) => s.isoCode === stateIso)
}

export function getCountryName(isoCode) {
  if (!isoCode) return null
  return Country.getCountryByCode(isoCode)?.name ?? null
}

export function getStateName(countryIso, stateIso) {
  if (!countryIso || !stateIso) return null
  return State.getStateByCodeAndCountry(stateIso, countryIso)?.name ?? null
}
