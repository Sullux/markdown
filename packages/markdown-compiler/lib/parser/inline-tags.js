const indexOfUnescaped = (text, marker, fromIndex) => {
  let pos = fromIndex
  while (pos < text.length) {
    const idx = text.indexOf(marker, pos)
    if (idx === -1) return -1
    let slashes = 0, p = idx - 1
    while (p >= fromIndex && text[p] === '\\') { slashes++; p-- }
    if (slashes % 2 === 0) return idx
    pos = idx + marker.length
  }
  return -1
}

const parseInlineTags = (text, index, parseInline) => {
  if (text.startsWith('~~', index)) {
    const close = indexOfUnescaped(text, '~~', index + 2)
    if (close !== -1 && close > index + 2) {
      const inner = text.slice(index + 2, close)
      if (inner.trim().length > 0) {
        return { token: { type: 'strikethrough', children: parseInline(inner) }, consumedLength: close + 2 - index }
      }
    }
  }

  if (text.startsWith('**', index)) {
    const boldClose = indexOfUnescaped(text, '**', index + 2)
    if (boldClose !== -1 && boldClose > index + 2) {
      const inner = text.slice(index + 2, boldClose)
      if (inner.trim().length > 0) {
        return { token: { type: 'bold', children: parseInline(inner) }, consumedLength: boldClose + 2 - index }
      }
    }
  }

  if (text.startsWith('*', index)) {
    const italicClose = indexOfUnescaped(text, '*', index + 1)
    if (italicClose !== -1 && italicClose > index + 1) {
      const inner = text.slice(index + 1, italicClose)
      if (inner.trim().length > 0) {
        return { token: { type: 'italic', children: parseInline(inner) }, consumedLength: italicClose + 1 - index }
      }
    }
  }

  if (text.startsWith('__', index)) {
    const prevChar = index > 0 ? text[index - 1] : ' '
    const nextChar = text[index + 2] || ' '
    if (!/[a-zA-Z0-9]/.test(prevChar) && !/\s/.test(nextChar)) {
      let pos = index + 2
      while (pos < text.length) {
        const close = indexOfUnescaped(text, '__', pos)
        if (close === -1) break
        const charBefore = text[close - 1]
        const charAfter = text[close + 2] || ' '
        if (!/\s/.test(charBefore) && !/[a-zA-Z0-9]/.test(charAfter)) {
          const inner = text.slice(index + 2, close)
          if (inner.trim().length > 0) {
            return { token: { type: 'bold', children: parseInline(inner) }, consumedLength: close + 2 - index }
          }
        }
        pos = close + 1
      }
    }
  }

  if (text.startsWith('_', index)) {
    const prevChar = index > 0 ? text[index - 1] : ' '
    const nextChar = text[index + 1] || ' '
    if (!/[a-zA-Z0-9]/.test(prevChar) && !/\s/.test(nextChar)) {
      let pos = index + 1
      while (pos < text.length) {
        const close = indexOfUnescaped(text, '_', pos)
        if (close === -1) break
        const charBefore = text[close - 1]
        const charAfter = text[close + 1] || ' '
        if (!/\s/.test(charBefore) && !/[a-zA-Z0-9]/.test(charAfter)) {
          const inner = text.slice(index + 1, close)
          if (inner.trim().length > 0) {
            return { token: { type: 'italic', children: parseInline(inner) }, consumedLength: close + 1 - index }
          }
        }
        pos = close + 1
      }
    }
  }

  return null
}

module.exports = { parseInlineTags, indexOfUnescaped }
