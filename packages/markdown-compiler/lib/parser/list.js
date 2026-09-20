const { parseThematicBreak } = require('./thematic-break')

const BULLET_RE = /^(\s*)([*+-])\s+(.*)$/
const ORDERED_RE = /^(\s*)(\d+)[.)]\s+(.*)$/
const TASK_RE = /^\[([ xX])\]\s+(.*)$/

const parseMarker = (line) => {
  if (parseThematicBreak(line)) return null
  const bMatch = line.match(BULLET_RE)
  if (bMatch) return { indent: bMatch[1].length, isOrdered: false, marker: bMatch[2], content: bMatch[3] }
  const oMatch = line.match(ORDERED_RE)
  if (oMatch) return { indent: oMatch[1].length, isOrdered: true, start: parseInt(oMatch[2], 10), content: oMatch[3] }
  return null
}

const parseList = (lines, startIndex, parseBlocks) => {
  const first = parseMarker(lines[startIndex])
  if (!first) return null

  const baseIndent = first.indent
  const isOrdered = first.isOrdered
  const start = isOrdered ? first.start : undefined
  const items = []
  let tight = true
  let i = startIndex

  while (i < lines.length) {
    const marker = parseMarker(lines[i])
    if (!marker || marker.indent !== baseIndent || marker.isOrdered !== isOrdered) break

    const taskMatch = marker.content.match(TASK_RE)
    const checked = taskMatch ? taskMatch[1].toLowerCase() === 'x' : undefined
    const firstLine = taskMatch ? taskMatch[2] : marker.content
    const rawContinuation = []
    i++

    let seenBlank = false
    while (i < lines.length) {
      const line = lines[i]
      if (!line.trim()) {
        let next = i + 1
        while (next < lines.length && !lines[next].trim()) next++
        if (next >= lines.length) { i = next; break }
        const nextMarker = parseMarker(lines[next])
        const nextIndent = lines[next].match(/^\s*/)[0].length
        if (nextIndent >= baseIndent + 2) {
          tight = false
          seenBlank = true
          rawContinuation.push(line)
          i++
          continue
        }
        if (nextMarker && nextMarker.indent === baseIndent && nextMarker.isOrdered === isOrdered) {
          tight = false
          i++
          break
        }
        break
      }

      const indent = line.match(/^\s*/)[0].length
      if (indent >= baseIndent + 2) {
        if (seenBlank) tight = false
        rawContinuation.push(line)
        i++
        continue
      }
      break
    }

    const nonBlank = rawContinuation.filter((l) => l.trim())
    const stripIndent = nonBlank.length > 0
      ? Math.min(...nonBlank.map((l) => l.match(/^\s*/)[0].length))
      : 0
    const dedented = rawContinuation.map((l) => (l.length >= stripIndent ? l.slice(stripIndent) : l.trim()))
    const itemContent = [firstLine, ...dedented].join('\n')
    const children = parseBlocks(itemContent)

    items.push({
      type: 'listItem',
      children,
      ...(checked !== undefined ? { checked } : {}),
    })
  }

  const block = {
    type: isOrdered ? 'orderedList' : 'bulletList',
    tight,
    ...(isOrdered ? { start: start || 1 } : {}),
    children: items,
  }

  return { block, nextIndex: i }
}

module.exports = { parseMarker, parseList }
