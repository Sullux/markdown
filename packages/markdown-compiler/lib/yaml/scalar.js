const parseInlineFlow = (v) => {
  try {
    return JSON.parse(v)
  } catch {
    // Relaxed flow parser for unquoted keys/values
    if (v.startsWith('[') && v.endsWith(']')) {
      return v
        .slice(1, -1)
        .split(',')
        .map((s) => parseScalar(s.trim()))
        .filter((s) => s !== '')
    }
    return v
  }
}

const parseScalar = (v) => {
  if (v === undefined || v === null) return ''
  const str = v.trim()
  if (!str) return ''
  if (str === 'null' || str === '~') return undefined
  if (str === 'true') return true
  if (str === 'false') return false
  if (/^-?\d+(\.\d+)?$/.test(str)) return Number(str)
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'"))
  ) {
    return str.slice(1, -1)
  }
  if (
    (str.startsWith('[') && str.endsWith(']')) ||
    (str.startsWith('{') && str.endsWith('}'))
  ) {
    return parseInlineFlow(str)
  }
  return str
}

const formatBlockScalar = (lines, mode = '|') => {
  if (lines.length === 0) return ''
  const indents = lines
    .filter((l) => l.trim().length > 0)
    .map((l) => l.search(/\S/))
  const minIndent = indents.length > 0 ? Math.min(...indents) : 0
  const stripped = lines.map((l) =>
    l.length >= minIndent ? l.slice(minIndent) : l.trim(),
  )

  let content = ''
  if (mode.startsWith('>')) {
    const paragraphs = []
    let current = []
    for (const line of stripped) {
      if (!line.trim()) {
        if (current.length) {
          paragraphs.push(current.join(' '))
          current = []
        }
        paragraphs.push('')
      } else {
        current.push(line)
      }
    }
    if (current.length) paragraphs.push(current.join(' '))
    content = paragraphs.join('\n')
  } else {
    content = stripped.join('\n')
  }

  if (mode.includes('-')) return content.trimEnd()
  if (mode.includes('+')) return content
  return content.trimEnd() + '\n'
}

module.exports = {
  parseScalar,
  formatBlockScalar,
}
