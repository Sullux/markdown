const parseInlineTags = (text, index, parseInline) => {
  if (text.startsWith('~~', index)) {
    const close = text.indexOf('~~', index + 2)
    if (close !== -1) {
      return { token: { type: 'strikethrough', children: parseInline(text.slice(index + 2, close)) }, consumedLength: close + 2 - index }
    }
  }

  if (text.startsWith('`', index)) {
    const codeClose = text.indexOf('`', index + 1)
    if (codeClose !== -1) {
      return { token: { type: 'code', value: text.slice(index + 1, codeClose) }, consumedLength: codeClose + 1 - index }
    }
  }

  if (text.startsWith('**', index)) {
    const boldClose = text.indexOf('**', index + 2)
    if (boldClose !== -1) {
      return { token: { type: 'bold', children: parseInline(text.slice(index + 2, boldClose)) }, consumedLength: boldClose + 2 - index }
    }
  }

  if (text.startsWith('*', index)) {
    const italicClose = text.indexOf('*', index + 1)
    if (italicClose !== -1) {
      return { token: { type: 'italic', children: parseInline(text.slice(index + 1, italicClose)) }, consumedLength: italicClose + 1 - index }
    }
  }

  if (text.startsWith('  \n', index)) {
    return { token: { type: 'br' }, consumedLength: 3 }
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

module.exports = { parseInlineTags }
