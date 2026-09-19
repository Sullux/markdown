const { parseImage } = require('./image')
const { parseInlineTags } = require('./inline-tags')
const { parseInlineLinks } = require('./inline-links')

const parseInline = (text) => {
  if (!text) return []

  const tokens = []
  let index = 0

  while (index < text.length) {
    if (index === 0 && text.startsWith('[ ] ')) {
      tokens.push({ type: 'checkbox', checked: false })
      index = 4
      continue
    }
    if (index === 0 && (text.startsWith('[x] ') || text.startsWith('[X] '))) {
      tokens.push({ type: 'checkbox', checked: true })
      index = 4
      continue
    }

    if (text.startsWith('[[', index)) {
      const closeIdx = text.indexOf(']]', index + 2)
      if (closeIdx !== -1) {
        const rawContent = text.slice(index + 2, closeIdx)
        const pipeIdx = rawContent.indexOf('|')
        let target = rawContent
        let display = rawContent
        if (pipeIdx !== -1) {
          target = rawContent.slice(0, pipeIdx).trim()
          display = rawContent.slice(pipeIdx + 1).trim()
        } else {
          target = target.trim()
          display = target
        }
        tokens.push({ type: 'wikilink', target, display })
        index = closeIdx + 2
        continue
      }
    }

    const imgResult = parseImage(text, index)
    if (imgResult) {
      tokens.push(imgResult.token)
      index += imgResult.consumedLength
      continue
    }

    const linkRes = parseInlineLinks(text, index, parseInline)
    if (linkRes) {
      tokens.push(linkRes.token)
      index += linkRes.consumedLength
      continue
    }

    const tagRes = parseInlineTags(text, index, parseInline)
    if (tagRes) {
      tokens.push(tagRes.token)
      index += tagRes.consumedLength
      continue
    }

    const candidateIndices = ['[[', '**', '*', '~~', '`', '[', '![', '  \n', '$']
      .map((marker) => text.indexOf(marker, index))
      .filter((pos) => pos > index)
    const nextTagIndex = candidateIndices.length > 0 ? Math.min(...candidateIndices) : text.length

    tokens.push({ type: 'text', value: text.slice(index, nextTagIndex) })
    index = nextTagIndex
  }

  return tokens
}

module.exports = { parseInline }
