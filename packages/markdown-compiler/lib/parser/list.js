const { parseMarker } = require('./list-marker')
const { detabLine } = require('./tab')

const TASK_RE = /^\[([ xX])\]\s+(.*)$/

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
    const contentIndent = marker.contentIndent
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
        const nextIndent = detabLine(lines[next]).match(/^ */)[0].length
        if (nextIndent >= contentIndent) {
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

      const detabbed = detabLine(line)
      const indent = detabbed.match(/^ */)[0].length
      const requiredIndent = seenBlank ? contentIndent : Math.min(contentIndent, baseIndent + 2)
      if (indent >= requiredIndent) {
        if (seenBlank) tight = false
        rawContinuation.push(line)
        i++
        continue
      }
      break
    }

    const nonBlank = rawContinuation.filter((l) => l.trim())
    const minIndent = nonBlank.length > 0 ? Math.min(...nonBlank.map((l) => detabLine(l).match(/^ */)[0].length)) : 0
    const stripIndent = Math.min(contentIndent, minIndent)
    const dedented = rawContinuation.map((l) => {
      if (!l.trim()) return ''
      const dl = detabLine(l)
      return dl.length >= stripIndent ? dl.slice(stripIndent) : dl.trim()
    })
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
    children: items,
    ...(start !== undefined && start !== 1 ? { start } : {}),
  }
  return { block, nextIndex: i }
}

module.exports = { parseList }
