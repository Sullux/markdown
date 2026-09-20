const canInterruptLazy = (line) => {
  if (/^ {0,3}>/.test(line)) return true
  if (/^ {0,3}(#{1,6})(?:[ \t]|$)/.test(line)) return true
  if (/^ {0,3}(`{3,}|~{3,})/.test(line)) return true
  if (/^ {0,3}([*\-_])[ \t]*(?:\1[ \t]*){2,}$/.test(line)) return true
  if (/^ {0,3}(?:[*+-]|\d{1,9}[.)])[ \t]+/.test(line)) return true
  return false
}

const parseQuote = (lines, startIndex, parseBlocks) => {
  const first = lines[startIndex]
  const isHint = first.startsWith('{% hint')
  const isQuote = /^ {0,3}>/.test(first)
  if (!isHint && !isQuote) return null

  if (isHint) {
    const styleMatch = first.match(/style="([^"]+)"/)
    const style = styleMatch ? styleMatch[1].toLowerCase() : 'info'
    const innerLines = []
    let i = startIndex + 1
    while (i < lines.length && !lines[i].includes('{% endhint %}')) {
      innerLines.push(lines[i])
      i++
    }
    const children = parseBlocks(innerLines.join('\n'))
    return { block: { type: 'callout', style, children }, nextIndex: i + 1 }
  }

  const innerLines = []
  let i = startIndex
  let lastWasBlank = false
  let inParagraph = false

  while (i < lines.length) {
    const line = lines[i]
    if (/^ {0,3}>/.test(line)) {
      const content = line.replace(/^ {0,3}>[ \t]?/, '')
      innerLines.push(content)
      lastWasBlank = content.trim().length === 0
      const isCode = content.startsWith('    ') || content.startsWith('\t') || /^ {0,3}(`{3,}|~{3,})/.test(content)
      const isHeader = /^ {0,3}#{1,6}(?:[ \t]|$)/.test(content)
      inParagraph = !lastWasBlank && !isCode && !isHeader
      i++
    } else if (inParagraph && line.trim() && !lastWasBlank && !canInterruptLazy(line)) {
      const lazyLine = /^ {0,3}=+[ \t]*$/.test(line) ? line.replace(/^ {0,3}=/, '\\=') : line
      innerLines.push(lazyLine)
      i++
    } else {
      break
    }
  }

  const fullContent = innerLines.join('\n')
  const alertMatch = fullContent.trim().match(/^\[!([A-Z0-9_\-]+)\]\s*([\s\S]*)$/i)
  if (alertMatch) {
    const style = alertMatch[1].toLowerCase()
    const children = parseBlocks(alertMatch[2].trim())
    return { block: { type: 'callout', style, children }, nextIndex: i }
  }

  return { block: { type: 'blockquote', children: parseBlocks(fullContent) }, nextIndex: i }
}

module.exports = { parseQuote }
