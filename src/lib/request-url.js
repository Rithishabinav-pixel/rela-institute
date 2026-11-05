export function sanitizePageUrl(value) {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null
  if (!trimmed.startsWith('/')) return null
  if (trimmed.startsWith('//')) return null
  if (/[\r\n]/.test(trimmed)) return null

  return trimmed.slice(0, 500)
}
