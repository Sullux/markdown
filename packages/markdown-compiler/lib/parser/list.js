const { parseMarker, isSameListType, canInterruptLazy } = require('./list-marker')
const { detabLine } = require('./tab')

const TASK_RE = /^\[([ xX])\]\s+(.*)$/

const parseList = (lines, startIndex, parseBlocks) => {
  const first = parseMarker(lines[startIndex])
  if (!first) return null

  const isOrdered = first.isOrdered
  const start = isOrdered ? first.start : undefined
  const items = []
  let tight = true
  let i = startIndex
  let prevContentIndent = 4

  while (i < lines.length) {
    const marker = parseMarker(lines[i])
    if (!marker || !isSameListType(first, marker) || marker.indent >= 4 || marker.indent >= prevContentIndent) break

    const taskMatch = marker.content.match(TASK_RE)
    const checked = taskMatch ? taskMatch[1].toLowerCase() === 'x' : undefined
    const firstLine = taskMatch ? taskMatch[2] : marker.content
    const contentIndent = marker.contentIndent
    prevContentIndent = contentIndent
    const rawContinuation = []
    i++

    let seenBlank = false
    let inParagraph = !firstLine.startsWith('    ') && !/^ {0,3}(?:`{3,}|~{3,}|#{1,6}(?:[ \t]|$))/.test(firstLine)

    while (i < lines.length) {
      const line = lines[i]
      if (!line.trim()) {
        if (!firstLine && rawContinuation.length === 0) break
        let next = i + 1
        while (next < lines.length && !lines[next].trim()) next++
        if (next >= lines.length) { i = next; break }
        const nextMarker = parseMarker(lines[next])
        const nextIndent = detabLine(lines[next]).match(/^ */)[0].length
        if (nextIndent >= contentIndent) {
          tight = false
          seenBlank = true
          inParagraph = false
          rawContinuation.push('')
          i++
          continue
        }
        if (nextMarker && isSameListType(first, nextMarker) && nextMarker.indent < contentIndent) {
          tight = false
          i++
          break
        }
        break
      }

      const detabbed = detabLine(line)
      const indent = detabbed.match(/^ */)[0].length
      const nextMarker = parseMarker(line)
      const subIndent = first.marker.length > 2 ? contentIndent : 2
      if (nextMarker && (isSameListType(first, nextMarker) ? nextMarker.indent < contentIndent : nextMarker.indent < subIndent)) break

      if (indent >= contentIndent) {
        if (seenBlank) tight = false
        rawContinuation.push(detabbed.slice(contentIndent))
        i++
        continue
      }
      if (nextMarker && !isSameListType(first, nextMarker) && indent >= subIndent) {
        if (seenBlank) tight = false
        rawContinuation.push(detabbed.slice(indent))
        i++
        continue
      }
      if (inParagraph && !seenBlank && !canInterruptLazy(line)) {
        rawContinuation.push(line.trimStart())
        i++
        continue
      }
      break
    }

    const itemContent = [firstLine, ...rawContinuation].join('\n')
    items.push({ type: 'listItem', children: parseBlocks(itemContent), ...(checked !== undefined ? { checked } : {}) })
  }

  const block = {
    type: isOrdered ? 'orderedList' : 'bulletList',
    tight,
    children: items,
    ...(start !== undefined && start !== 1 ? { start } : {}),
  }
  return { block, nextIndex: i }
}

module.exports = { parseList }
