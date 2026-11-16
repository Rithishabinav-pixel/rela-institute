import fs from 'node:fs'
import path from 'node:path'

const APP_DIR = path.join(process.cwd(), 'src', 'app')
const EXCLUDED_SEGMENTS = new Set(['admin', 'api', 'search'])

function isDynamicSegment(segment) {
  return segment.startsWith('[')
}

function isRouteGroup(segment) {
  return segment.startsWith('(') && segment.endsWith(')')
}

function segmentsToUrl(segments) {
  const cleaned = segments.filter((segment) => !isRouteGroup(segment))
  return cleaned.length === 0 ? '/' : `/${cleaned.join('/')}`
}

function extractMetadataField(source, field) {
  const metadataMatch = source.match(/export const metadata\s*=\s*\{([\s\S]*?)\n\}/)
  if (!metadataMatch) return null
  const fieldMatch = metadataMatch[1].match(new RegExp(`${field}\\s*:\\s*['"\`]([^'"\`]*)['"\`]`))
  return fieldMatch ? fieldMatch[1] : null
}

function collectPageFiles(dir, segments, results) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_SEGMENTS.has(entry.name) || isDynamicSegment(entry.name)) continue
      collectPageFiles(path.join(dir, entry.name), [...segments, entry.name], results)
    } else if (entry.name === 'page.js') {
      results.push({ filePath: path.join(dir, entry.name), url: segmentsToUrl(segments) })
    }
  }
}

export async function getStaticPageSearchEntries() {
  const files = []
  collectPageFiles(APP_DIR, [], files)

  return files
    .map(({ filePath, url }) => {
      const source = fs.readFileSync(filePath, 'utf8')
      const title = extractMetadataField(source, 'title')
      const description = extractMetadataField(source, 'description')
      if (!title) return null
      return { title, description: description || '', url }
    })
    .filter(Boolean)
}
