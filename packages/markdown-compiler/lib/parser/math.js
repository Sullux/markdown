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

module.exports = { parseMath }
