const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
])

const parseAttributes = (attrStr) => {
  const attrs = {}
  if (!attrStr) return attrs
  const matches = attrStr.matchAll(/([a-zA-Z0-9_\-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)
  for (const match of matches) {
    const key = match[1].toLowerCase()
    const val = match[2] !== undefined ? match[2] : (match[3] !== undefined ? match[3] : (match[4] !== undefined ? match[4] : ''))
    attrs[key] = val
  }
  return attrs
}

const parseStyleAttr = (styleStr) => {
  if (!styleStr) return {}
  const styles = {}
  styleStr.split(';').forEach(decl => {
    const parts = decl.split(':')
    if (parts.length === 2) {
      styles[parts[0].trim().toLowerCase()] = parts[1].trim().toLowerCase()
    }
  })
  return styles
}

const decodeHtmlEntities = (str) => {
  if (!str) return ''
  const entities = {
    nbsp: ' ', zwnj: '', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
    ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', ndash: '–', mdash: '—',
  }
  return str
    .replace(/&([a-z0-9]+);/gi, (match, name) => {
      const lower = name.toLowerCase()
      return entities[lower] !== undefined ? entities[lower] : match
    })
    .replace(/&#([0-9]+);/g, (match, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
}

const isCellEmpty = (cell) => {
  if (!cell || cell.length === 0) return true
  return cell.every(node => {
    if (node.type === 'text') return !node.value.trim()
    if (node.type === 'br') return true
    return false
  })
}

const optimizeTable = (rows, alignments) => {
  const nonDescantRows = rows.filter(row => row.some(cell => !isCellEmpty(cell)))
  if (nonDescantRows.length === 0) return null

  const numCols = Math.max(...nonDescantRows.map(r => r.length))
  const emptyCols = new Set()
  for (let c = 0; c < numCols; c++) {
    let colIsEmpty = true
    for (const row of nonDescantRows) {
      if (row[c] && !isCellEmpty(row[c])) {
        colIsEmpty = false
        break
      }
    }
    if (colIsEmpty) emptyCols.add(c)
  }

  const cleanRows = nonDescantRows.map(row => {
    const newRow = []
    for (let c = 0; c < numCols; c++) {
      if (!emptyCols.has(c)) newRow.push(row[c] || [])
    }
    return newRow
  })

  const cleanAlignments = []
  for (let c = 0; c < numCols; c++) {
    if (!emptyCols.has(c)) cleanAlignments.push(alignments[c] || 'default')
  }

  return { rows: cleanRows, alignments: cleanAlignments }
}

module.exports = {
  VOID_TAGS,
  parseAttributes,
  parseStyleAttr,
  decodeHtmlEntities,
  isCellEmpty,
  optimizeTable,
}
