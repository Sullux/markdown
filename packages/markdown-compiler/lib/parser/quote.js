const parseQuote = (lines, startIndex, parseBlocks) => {
  const first = lines[startIndex]
  const isHint = first.startsWith('{% hint')
  const isQuote = first.startsWith('>')
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
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('>')) {
      innerLines.push(line.replace(/^>\s?/, ''))
      i++
    } else if (line.trim() && !line.startsWith('#') && !line.startsWith('```') && !line.startsWith('- ') && !line.startsWith('* ')) {
      innerLines.push(line)
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
