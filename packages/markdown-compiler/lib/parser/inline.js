const { parseBreak } = require('./break')
const { parseInlineMath } = require('./math')
const { parseImage } = require('./image')
const { parseWikilink } = require('./wikilink')
const { parseCodeSpan } = require('./code-span')
const { parseAutolink } = require('./autolink')
const { parseInlineHtml } = require('./inline-html')
const { parseEntity } = require('./entities')
const { parseInlineTags } = require('./inline-tags')
const { parseInlineLinks } = require('./inline-links')

const ASCII_PUNC = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/
const TAG_MARKERS = ['[[', '**', '*', '~~', '`', '[', '![', '$', '\\', '<', '\n', '&']

const pushText = (tokens, val) => {
  if (!val) return
  if (tokens.length > 0 && tokens[tokens.length - 1].type === 'text') {
    tokens[tokens.length - 1].value += val
  } else {
    tokens.push({ type: 'text', value: val })
  }
}

const parseInline = (text, context = {}) => {
  if (!text) return []
  if (text.startsWith('[ ] ')) return [{ type: 'checkbox', checked: false }, ...parseInline(text.slice(4), context)]
  if (/^\[[xX]\] /.test(text)) return [{ type: 'checkbox', checked: true }, ...parseInline(text.slice(4), context)]

  const tokens = []
  let index = 0

  while (index < text.length) {
    if (text[index] === '\\') {
      const next = text[index + 1]
      if (next === '\n') {
        const lead = text.slice(index + 2).match(/^[ \t]*/)
        tokens.push({ type: 'br' })
        index += 2 + (lead ? lead[0].length : 0)
        continue
      }
      if (next && ASCII_PUNC.test(next)) { pushText(tokens, next); index += 2; continue }
      pushText(tokens, '\\')
      index += 1
      continue
    }

    const brRes = parseBreak(text, index, tokens)
    if (brRes) {
      if (brRes.token) tokens.push(brRes.token)
      index += brRes.consumedLength
      continue
    }

    const entity = parseEntity(text, index)
    if (entity) {
      pushText(tokens, entity.token.value)
      index += entity.consumedLength
      continue
    }

    const tokenRes = (context?.wikilinks !== false ? parseWikilink(text, index) : null) ||
      parseCodeSpan(text, index) ||
      parseAutolink(text, index) ||
      parseInlineHtml(text, index) ||
      parseImage(text, index, context) ||
      parseInlineLinks(text, index, parseInline, context) ||
      parseInlineMath(text, index) ||
      parseInlineTags(text, index, parseInline, context)

    if (tokenRes) {
      tokens.push(tokenRes.token)
      index += tokenRes.consumedLength
      continue
    }

    if (text[index] === '`') {
      let runLen = 0
      while (index + runLen < text.length && text[index + runLen] === '`') runLen++
      pushText(tokens, text.slice(index, index + runLen))
      index += runLen
      continue
    }

    const candidateIndices = TAG_MARKERS.map((m) => text.indexOf(m, index + 1)).filter((p) => p !== -1)
    const nextTagIndex = candidateIndices.length > 0 ? Math.min(...candidateIndices) : text.length
    pushText(tokens, text.slice(index, nextTagIndex))
    index = nextTagIndex
  }

  return tokens
}

module.exports = { parseInline, pushText }
