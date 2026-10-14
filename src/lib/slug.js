export function normalizeWhitespace(value) {
  return (value ?? '').trim().replace(/\s+/g, ' ')
}

export function slugify(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
