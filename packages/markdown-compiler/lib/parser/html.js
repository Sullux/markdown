const parseHtml = (lines, startIndex) => {
  const first = lines[startIndex]
  const match = first.match(/^<([a-zA-Z][a-zA-Z0-9]*|!--)(?:\s|>|$)/)
  if (!match) return null

  const tag = match[1].toLowerCase()
  const isClosed = tag === '!--' ? first.includes('-->') : (first.trim().endsWith('/>') || first.includes(`</${tag}>`))
  const htmlLines = [first]
  let i = startIndex + 1

  if (!isClosed) {
    while (i < lines.length) {
      const line = lines[i]
      htmlLines.push(line)
      i++
      if (line.includes(`</${tag}>`) || (tag === '!--' && line.includes('-->'))) break
    }
  }

  return {
    block: { type: 'html', tag, value: htmlLines.join('\n') },
    nextIndex: i,
  }
}

module.exports = { parseHtml }
