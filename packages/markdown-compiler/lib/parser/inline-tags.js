const { parseCodeSpan } = require('./code-span')

const indexOfUnescaped = (text, marker, fromIndex) => {
  let pos = fromIndex
  while (pos < text.length) {
    if (text[pos] === '`') {
      const cs = parseCodeSpan(text, pos)
      if (cs) { pos += cs.consumedLength; continue }
    }
    if (text[pos] === '[') {
      const bClose = text.indexOf(']', pos)
      if (bClose !== -1) {
        if (text.charAt(bClose + 1) === '(') {
          const pClose = text.indexOf(')', bClose + 1)
          if (pClose !== -1) { pos = pClose + 1; continue }
        } else if (text.charAt(bClose + 1) === '[') {
          const rClose = text.indexOf(']', bClose + 2)
          if (rClose !== -1) { pos = rClose + 1; continue }
        }
      }
    }
    const idx = text.indexOf(marker, pos)
    if (idx === -1) return -1
    const nextTick = text.indexOf('`', pos)
    if (nextTick !== -1 && nextTick < idx) {
      const cs = parseCodeSpan(text, nextTick)
      if (cs) { pos = nextTick + cs.consumedLength; continue }
    }
    let slashes = 0, p = idx - 1
    while (p >= fromIndex && text[p] === '\\') { slashes++; p-- }
    if (slashes % 2 === 0) return idx
    pos = idx + marker.length
  }
  return -1
}

const parseTag = (text, index, marker, type, parseInline) => {
  if (!text.startsWith(marker, index)) return null
  const len = marker.length
  const close = indexOfUnescaped(text, marker, index + len)
  if (close === -1 || close <= index + len) return null
  const inner = text.slice(index + len, close)
  if (!inner.trim()) return null
  return { token: { type, children: parseInline(inner) }, consumedLength: close + len - index }
}

const parseUnderscoreTag = (text, index, marker, type, parseInline) => {
  if (!text.startsWith(marker, index)) return null
  const len = marker.length
  const prevChar = index > 0 ? text[index - 1] : ' '
  const nextChar = text[index + len] || ' '
  if (/[a-zA-Z0-9]/.test(prevChar) || /\s/.test(nextChar)) return null

  let pos = index + len
  while (pos < text.length) {
    const close = indexOfUnescaped(text, marker, pos)
    if (close === -1) break
    const charBefore = text[close - 1]
    const charAfter = text[close + len] || ' '
    if (!/\s/.test(charBefore) && !/[a-zA-Z0-9]/.test(charAfter)) {
      const inner = text.slice(index + len, close)
      if (inner.trim().length > 0) {
        return { token: { type, children: parseInline(inner) }, consumedLength: close + len - index }
      }
    }
    pos = close + 1
  }
  return null
}

const parseInlineTags = (text, index, parseInline) =>
  parseTag(text, index, '~~', 'strikethrough', parseInline) ||
  parseTag(text, index, '**', 'bold', parseInline) ||
  parseTag(text, index, '*', 'italic', parseInline) ||
  parseUnderscoreTag(text, index, '__', 'bold', parseInline) ||
  parseUnderscoreTag(text, index, '_', 'italic', parseInline)

module.exports = { parseInlineTags, indexOfUnescaped }
