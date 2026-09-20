const { normalizeLabel } = require('./link-def')
const { unescapeBackslashes, normalizeUrl } = require('./unescape')
const { decodeEntities } = require('./entities')

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
      let dest = ''
      let rest = ''
      if (rawContent.startsWith('<')) {
        const closeAngle = rawContent.indexOf('>')
        if (closeAngle === -1) return null
        dest = rawContent.slice(1, closeAngle)
        rest = rawContent.slice(closeAngle + 1).trim()
      } else {
        const sp = rawContent.search(/\s/)
        dest = sp === -1 ? rawContent : rawContent.slice(0, sp)
        rest = sp === -1 ? '' : rawContent.slice(sp).trim()
      }
      let title = undefined
      if (rest) {
        const tm = rest.match(/^(?:"([^"]*)"|'([^']*)'|\(([^)]*)\))$/)
        if (!tm) return null
        const rawTitle = tm[1] !== undefined ? tm[1] : (tm[2] !== undefined ? tm[2] : tm[3])
        title = decodeEntities(unescapeBackslashes(rawTitle))
      }
      const url = normalizeUrl(decodeEntities(unescapeBackslashes(dest)))
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
