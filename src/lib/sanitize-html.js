import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'span', 'div',
  'strong', 'b', 'em', 'i', 'u',
  'a', 'img', 'iframe',
  'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
]

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'target', 'rel', 'width', 'height',
  'frameborder', 'allow', 'allowfullscreen',
]

export function sanitizeRichHtml(html) {
  if (!html || typeof html !== 'string') return ''

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i,
  }).trim()
}

// Strips <script> tags and event-handler attributes (onload, onclick, ...)
// from an uploaded SVG before it's written to disk. SVGs are served as
// static files, so navigating to one directly would otherwise execute any
// embedded script in the page's own origin.
export function sanitizeSvg(svgText) {
  if (!svgText || typeof svgText !== 'string') return ''

  return DOMPurify.sanitize(svgText, { USE_PROFILES: { svg: true, svgFilters: true } })
}
