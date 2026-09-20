const { normalizeLabel } = require('./link-def')
const { parseDestAndTitle } = require('./link-utils')
const { parseCodeSpan } = require('./code-span')

const parseInlineLinks = (text, index, parseInline, context = {}) => {
  if (!text.startsWith('[', index)) return null

  let bracketDepth = 0
  let textClose = -1
  for (let i = index; i < text.length; i++) {
    if (text[i] === '`') {
      const cs = parseCodeSpan(text, i)
      if (cs) {
        i += cs.consumedLength - 1
        continue
      }
    }
    const char = text.charAt(i)
    let slashes = 0, p = i - 1
    while (p >= index && text[p] === '\\') { slashes++; p-- }
    const isEscaped = slashes % 2 === 1
    if (!isEscaped) {
      if (char === '[') bracketDepth++
      else if (char === ']') {
        bracketDepth--
        if (bracketDepth === 0) {
          textClose = i
          break
        }
      }
    }
  }

  if (textClose === -1) return null
  const linkText = text.slice(index + 1, textClose)

  if (text.charAt(textClose + 1) === '(') {
    let parenDepth = 0
    let urlClose = -1
    for (let i = textClose + 1; i < text.length; i++) {
      const char = text.charAt(i)
      if (char === '(') parenDepth++
      else if (char === ')') {
        parenDepth--
        if (parenDepth === 0) {
          urlClose = i
          break
        }
      }
    }

    if (urlClose !== -1) {
      const parsed = parseDestAndTitle(text.slice(textClose + 2, urlClose))
      if (!parsed) return null
      return {
        token: { type: 'link', url: parsed.url, title: parsed.title, children: parseInline(linkText, context) },
        consumedLength: urlClose + 1 - index,
      }
    }
  }

  if (text.charAt(textClose + 1) === '[') {
    const labelClose = text.indexOf(']', textClose + 2)
    if (labelClose !== -1) {
      const rawLabel = text.slice(textClose + 2, labelClose)
      const targetLabel = rawLabel.trim() || linkText
      const def = context.definitions?.get(normalizeLabel(targetLabel))
      if (def) {
        return {
          token: { type: 'link', url: def.url, title: def.title, children: parseInline(linkText, context) },
          consumedLength: labelClose + 1 - index,
        }
      }
    }
  }

  const def = context.definitions?.get(normalizeLabel(linkText))
  if (def) {
    return {
      token: { type: 'link', url: def.url, title: def.title, children: parseInline(linkText, context) },
      consumedLength: textClose + 1 - index,
    }
  }

  return null
}

module.exports = { parseInlineLinks }
