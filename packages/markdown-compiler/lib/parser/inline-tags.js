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

  if (text.startsWith('$', index) && !text.startsWith('$$', index)) {
    const isEscaped = index > 0 && text[index - 1] === '\\'
    const nextChar = text[index + 1]
    const hasValidOpen = nextChar && ![' ', '\t', '\n', '$'].includes(nextChar)
    if (!isEscaped && hasValidOpen) {
      let close = index + 1
      while (close < text.length) {
        if (text[close] === '$' && text[close - 1] !== '\\') {
          const prevChar = text[close - 1]
          if (![' ', '\t', '\n'].includes(prevChar)) {
            const mathValue = text.slice(index + 1, close)
            if (!mathValue.includes('\n')) {
              return { token: { type: 'inlineMath', value: mathValue }, consumedLength: close + 1 - index }
            }
          }
        }
        close++
      }
    }
  }

  return null
}

module.exports = { parseInlineTags, indexOfUnescaped }
