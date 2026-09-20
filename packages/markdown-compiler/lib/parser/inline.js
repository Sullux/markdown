const { parseImage } = require('./image')
const { parseWikilink } = require('./wikilink')
const { parseCodeSpan } = require('./code-span')
const { parseAutolink } = require('./autolink')
const { parseInlineTags } = require('./inline-tags')
const { parseInlineLinks } = require('./inline-links')

const ASCII_PUNC = /[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/
const TAG_MARKERS = ['[[', '**', '*', '~~', '`', '[', '![', '$', '\\', '<', '\n']

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
  if (text.startsWith('[ ] ')) return [{ type: 'checkbox', checked: false }, ...parseInline(text.slice(4))]
  if (/^\[[xX]\] /.test(text)) return [{ type: 'checkbox', checked: true }, ...parseInline(text.slice(4))]

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

    if (text[index] === '\n') {
      let isHard = false
      if (tokens.length && tokens[tokens.length - 1].type === 'text') {
        const last = tokens[tokens.length - 1]
        const spaceMatch = last.value.match(/ {2,}$/)
        if (spaceMatch) {
          last.value = last.value.slice(0, -spaceMatch[0].length)
          isHard = true
        } else {
          last.value = last.value.replace(/[ \t]+$/, '')
        }
      }
      const lead = text.slice(index + 1).match(/^[ \t]*/)
      const skip = lead ? lead[0].length : 0
      const rest = text.slice(index + 1 + skip)
      if (rest.length > 0) {
        if (isHard) tokens.push({ type: 'br' })
        else pushText(tokens, '\n')
      }
      index += 1 + skip
      continue
    }

    const tokenRes = parseWikilink(text, index) ||
      parseCodeSpan(text, index) ||
      parseAutolink(text, index) ||
      parseImage(text, index) ||
      parseInlineLinks(text, index, parseInline) ||
      parseInlineTags(text, index, parseInline)

    if (tokenRes) {
      tokens.push(tokenRes.token)
      index += tokenRes.consumedLength
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
