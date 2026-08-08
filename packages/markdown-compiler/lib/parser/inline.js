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

    let nextTagIndex = text.length
    const nextWiki = text.indexOf('[[', index)
    const nextBold = text.indexOf('**', index)
    const nextItalic = text.indexOf('*', index)
    const nextStrike = text.indexOf('~~', index)
    const nextCode = text.indexOf('`', index)
    const nextLink = text.indexOf('[', index)
    const nextImage = text.indexOf('![', index)
    const nextBr = text.indexOf('  \n', index)

    if (nextWiki !== -1 && nextWiki > index) nextTagIndex = Math.min(nextTagIndex, nextWiki)
    if (nextBold !== -1 && nextBold > index) nextTagIndex = Math.min(nextTagIndex, nextBold)
    if (nextItalic !== -1 && nextItalic > index) nextTagIndex = Math.min(nextTagIndex, nextItalic)
    if (nextStrike !== -1 && nextStrike > index) nextTagIndex = Math.min(nextTagIndex, nextStrike)
    if (nextCode !== -1 && nextCode > index) nextTagIndex = Math.min(nextTagIndex, nextCode)
    if (nextLink !== -1 && nextLink > index) nextTagIndex = Math.min(nextTagIndex, nextLink)
    if (nextImage !== -1 && nextImage > index) nextTagIndex = Math.min(nextTagIndex, nextImage)
    if (nextBr !== -1 && nextBr > index) nextTagIndex = Math.min(nextTagIndex, nextBr)

    tokens.push({ type: 'text', value: text.slice(index, nextTagIndex) })
    index = nextTagIndex
  }

  return tokens
}

module.exports = { parseInline }
