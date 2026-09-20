const { parseImage } = require('./image')
const { parseWikilink } = require('./wikilink')
const { parseCodeSpan } = require('./code-span')
const { parseInlineTags } = require('./inline-tags')
const { parseInlineLinks } = require('./inline-links')

const ASCII_PUNC = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/
const TAG_MARKERS = ['[[', '**', '*', '~~', '`', '[', '![', '  \n', '$', '\\']

const pushText = (tokens, val) => {
  if (!val) return
  if (tokens.length > 0 && tokens[tokens.length - 1].type === 'text') {
    tokens[tokens.length - 1].value += val
  } else {
    tokens.push({ type: 'text', value: val })
  }
}

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
    if (text[index] === '\\') {
      const next = text[index + 1]
      if (next === '\n') {
        tokens.push({ type: 'br' })
        index += 2
        continue
      }
      if (next && ASCII_PUNC.test(next)) {
        pushText(tokens, next)
        index += 2
        continue
      }
      pushText(tokens, '\\')
      index += 1
      continue
    }

    const wiki = parseWikilink(text, index)
    if (wiki) {
      tokens.push(wiki.token)
      index += wiki.consumedLength
      continue
    }

    const codeSpan = parseCodeSpan(text, index)
    if (codeSpan) {
      tokens.push(codeSpan.token)
      index += codeSpan.consumedLength
      continue
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

    const candidateIndices = TAG_MARKERS.map((m) => text.indexOf(m, index)).filter((p) => p > index)
    const nextTagIndex = candidateIndices.length > 0 ? Math.min(...candidateIndices) : text.length

    pushText(tokens, text.slice(index, nextTagIndex))
    index = nextTagIndex
  }

  return tokens
}

module.exports = { parseInline, pushText }
