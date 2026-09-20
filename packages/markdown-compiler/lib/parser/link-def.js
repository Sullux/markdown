const { unescapeBackslashes } = require('./unescape')

const normalizeLabel = (str) =>
  (str || '').trim().replace(/\s+/g, ' ').toLowerCase()

const parseLinkDef = (lines, startIndex) => {
  const first = lines[startIndex]
  if (!first) return null
  const labelMatch = first.match(/^ {0,3}\[((?:\\\]|[^\]])+)\]:[ \t]*(.*)$/)
  if (!labelMatch) return null

  const label = labelMatch[1]
  let rest = labelMatch[2]
  let i = startIndex

  if (!rest.trim() && i + 1 < lines.length && lines[i + 1].trim()) {
    i++
    rest = lines[i].trim()
  }

  let url = ''
  let afterUrl = ''
  if (rest.startsWith('<')) {
    const closeAngle = rest.indexOf('>')
    if (closeAngle === -1) return null
    url = rest.slice(1, closeAngle)
    afterUrl = rest.slice(closeAngle + 1).trim()
  } else {
    const destMatch = rest.match(/^(\S+)(?:[ \t]+(.*))?$/)
    if (!destMatch) return null
    url = destMatch[1]
    afterUrl = (destMatch[2] || '').trim()
  }

  let title = undefined
  let titleLine = afterUrl
  if (!titleLine && i + 1 < lines.length && lines[i + 1].trim()) {
    const nextTrim = lines[i + 1].trim()
    if (/^(?:"[^"]*"|'[^']*'|\([^)]*\))$/.test(nextTrim)) {
      i++
      titleLine = nextTrim
    }
  }

  if (titleLine) {
    const tm = titleLine.match(/^(?:"([^"]*)"|'([^']*)'|\(([^)]*)\))$/)
    if (tm) {
      title = tm[1] !== undefined ? tm[1] : (tm[2] !== undefined ? tm[2] : tm[3])
    } else if (afterUrl) {
      return null
    }
  }

  return {
    def: {
      label,
      url: unescapeBackslashes(url),
      title: title !== undefined ? unescapeBackslashes(title) : undefined,
    },
    nextIndex: i + 1,
  }
}

const collectLinkDefs = (lines) => {
  const defs = new Map()
  let i = 0
  while (i < lines.length) {
    const parsed = parseLinkDef(lines, i)
    if (parsed) {
      const norm = normalizeLabel(parsed.def.label)
      if (!defs.has(norm)) {
        defs.set(norm, parsed.def)
      }
      i = parsed.nextIndex
    } else {
      i++
    }
  }
  return defs
}

module.exports = { normalizeLabel, parseLinkDef, collectLinkDefs }
