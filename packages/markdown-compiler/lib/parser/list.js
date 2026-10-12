const { parseMarker, isSameListType, canInterruptLazy } = require('./list-marker')
const { parseInline } = require('./inline')
const { detabLine } = require('./tab')
const { extractTrailingAttributes } = require('./attributes')

const TASK_RE = /^\[([ xX])\]\s+(.*)$/

const parseList = (lines, startIndex, parseBlocks) => {
  const first = parseMarker(lines[startIndex])
  if (!first) return null
  const isOrdered = first.isOrdered, start = isOrdered ? first.start : undefined, items = []
  let tight = true, i = startIndex, prevContentIndent = 4

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

    let seenBlank = false, hasSubList = false, hasIndented = false
    let inFence = firstLine.trim().startsWith('```') || firstLine.trim().startsWith('~~~')
    let inParagraph = !firstLine.startsWith('    ') && !inFence && !canInterruptLazy(firstLine) && !/^ {0,3}<[a-zA-Z]/.test(firstLine)

    while (i < lines.length) {
      const line = lines[i]
      if (!line.trim()) {
        let next = i + 1
        while (next < lines.length && !lines[next].trim()) next++
        if (next >= lines.length) { i = next; break }
        const nextMarker = parseMarker(lines[next])
        const nextIndent = detabLine(lines[next]).match(/^ */)[0].length
        if (!firstLine && rawContinuation.length === 0) {
          if (nextMarker && isSameListType(first, nextMarker) && nextMarker.indent < contentIndent) { tight = false; i = next }
          break
        }
        if (nextIndent >= contentIndent) {
          if (!inFence && (!hasSubList || nextIndent === contentIndent)) tight = false
          if (!inFence) seenBlank = true
          inParagraph = false; rawContinuation.push(''); i++; continue
        }
        if (nextMarker && isSameListType(first, nextMarker) && nextMarker.indent < contentIndent) { tight = false; i = next; break }
        break
      }

      const detabbed = detabLine(line), indent = detabbed.match(/^ */)[0].length, nextMarker = parseMarker(line)
      if (line.trim().startsWith('```') || line.trim().startsWith('~~~')) inFence = !inFence
      const subIndent = isSameListType(first, nextMarker || {}) ? contentIndent : (first.marker.length > 2 ? contentIndent : 2)
      if (nextMarker && (isSameListType(first, nextMarker) ? nextMarker.indent < contentIndent : nextMarker.indent < subIndent)) break

      if (indent >= contentIndent || (nextMarker && indent >= subIndent)) {
        hasIndented = true
        if (nextMarker) hasSubList = true
        if (seenBlank && !inFence && (!hasSubList || indent === contentIndent)) tight = false
        rawContinuation.push(detabbed.slice(indent >= contentIndent ? contentIndent : indent)); i++; continue
      }
      if ((inParagraph || firstLine.startsWith('>')) && !seenBlank && !canInterruptLazy(line)) {
        rawContinuation.push(line.replace(/^ {0,3}/, '')); i++; continue
      }
      break
    }

    const isOnlyLazy = inParagraph && !seenBlank && !hasIndented && !hasSubList && !inFence
    const fullText = [firstLine, ...rawContinuation].join('\n')
    const tr = extractTrailingAttributes(fullText)
    const [pFirst, ...pCont] = (tr ? tr.cleanText : fullText).split('\n')
    const children = isOnlyLazy
      ? (pFirst || pCont.length > 0 ? [{ type: 'paragraph', children: parseInline([pFirst, ...pCont.map((l) => l.trimStart())].join('\n')) }] : [])
      : parseBlocks([pFirst, ...pCont].join('\n'))

    items.push({
      type: 'listItem',
      children,
      ...(checked !== undefined ? { checked } : {}),
      ...(tr?.id ? { id: tr.id } : {}),
      ...(tr?.classes?.length ? { classes: tr.classes } : {}),
      ...(tr?.attributes ? { attributes: tr.attributes } : {}),
    })
  }

  const block = { type: isOrdered ? 'orderedList' : 'bulletList', tight, children: items, ...(start !== undefined && start !== 1 ? { start } : {}) }
  return { block, nextIndex: i }
}

module.exports = { parseList }
