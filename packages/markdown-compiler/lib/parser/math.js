const parseMath = (lines, startIndex) => {
  const first = lines[startIndex].trim()
  if (!first.startsWith('$$')) return null

  const afterOpen = first.slice(2)
  if (afterOpen.endsWith('$$') && afterOpen.length >= 2) {
    const content = afterOpen.slice(0, -2).trim()
    return { block: { type: 'mathBlock', value: content }, nextIndex: startIndex + 1 }
  }

  const mathLines = afterOpen.trim() ? [afterOpen.trim()] : []
  let i = startIndex + 1
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    if (trimmed.endsWith('$$')) {
      const content = line.slice(0, line.lastIndexOf('$$')).trim()
      if (content) mathLines.push(content)
      i++
      break
    }
    mathLines.push(line)
    i++
  }

  return {
    block: { type: 'mathBlock', value: mathLines.join('\n') },
    nextIndex: i,
  }
}

const parseInlineMath = (text, index) => {
  if (!text.startsWith('$', index) || text.startsWith('$$', index)) return null
  const isEscaped = index > 0 && text[index - 1] === '\\'
  const nextChar = text[index + 1]
  const hasValidOpen = nextChar && ![' ', '\t', '\n', '$'].includes(nextChar)
  if (isEscaped || !hasValidOpen) return null

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
  return null
}

module.exports = { parseMath, parseInlineMath }
