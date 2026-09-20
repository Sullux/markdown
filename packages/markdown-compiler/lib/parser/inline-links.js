const { normalizeLabel } = require('./link-def')
const { unescapeBackslashes } = require('./unescape')

const parseInlineLinks = (text, index, parseInline, context = {}) => {
  if (!text.startsWith('[', index)) return null

  let bracketDepth = 0
  let textClose = -1
  for (let i = index; i < text.length; i++) {
    const char = text.charAt(i)
    if (char === '[') bracketDepth++
    else if (char === ']') {
      bracketDepth--
      if (bracketDepth === 0) {
        textClose = i
        break
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
      const rawContent = text.slice(textClose + 2, urlClose).trim()
      let url = rawContent
      let title = undefined
      const titleMatch = rawContent.match(/^(\S+)(?:[ \t]+(?:"([^"]*)"|'([^']*)'|\(([^)]*)\)))?$/)
      if (titleMatch) {
        url = unescapeBackslashes(titleMatch[1])
        const rawTitle = titleMatch[2] !== undefined ? titleMatch[2] : (titleMatch[3] !== undefined ? titleMatch[3] : titleMatch[4])
        title = unescapeBackslashes(rawTitle)
      } else {
        url = unescapeBackslashes(rawContent)
      }
      return {
        token: { type: 'link', url, title, children: parseInline(linkText, context) },
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
