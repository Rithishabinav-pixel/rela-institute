export function parseCsvLine(line) {
  const fields = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      fields.push(current)
      current = ''
    } else {
      current += char
    }
  }

  fields.push(current)
  return fields
}

export function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.length > 0)
  if (lines.length === 0) return { header: [], rows: [] }

  const header = parseCsvLine(lines[0])
  const rows = lines.slice(1).map(parseCsvLine)

  return { header, rows }
}

// Newline-safe CSV parser: handles quoted fields containing literal line breaks
// (e.g. multi-line HTML in a `content` column), unlike parseCsv() above which
// splits the whole file on \n before parsing quotes.
export function parseCsvSafe(text) {
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text

  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  let i = 0
  const len = source.length

  while (i < len) {
    const char = source[i]

    if (inQuotes) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      field += char
      i++
      continue
    }

    if (char === '"') {
      inQuotes = true
      i++
      continue
    }
    if (char === ',') {
      row.push(field)
      field = ''
      i++
      continue
    }
    if (char === '\r') {
      i++
      continue
    }
    if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      i++
      continue
    }
    field += char
    i++
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  if (rows.length === 0) return { header: [], rows: [] }

  const [header, ...dataRows] = rows
  const filteredRows = dataRows.filter((r) => r.length > 1 || (r[0] && r[0].trim()))

  return { header, rows: filteredRows }
}
