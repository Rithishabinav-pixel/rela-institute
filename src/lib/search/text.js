import { decodeEntities } from '@/app/articles/wordpress'

function stripHtml(html) {
  return decodeEntities(String(html).replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractFirstParagraphText(html) {
  if (!html) return ''
  const match = String(html).match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  return stripHtml(match ? match[1] : html)
}

export function truncateDescription(text, maxLength = 45) {
  const clean = String(text || '').trim()
  if (clean.length <= maxLength) return clean
  const truncated = clean.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  const safe = lastSpace > 10 ? truncated.slice(0, lastSpace) : truncated
  return `${safe.trim()}…`
}
