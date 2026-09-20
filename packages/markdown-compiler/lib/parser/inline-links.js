const { normalizeLabel } = require('./link-def')
const { parseDestAndTitle } = require('./link-utils')
const { parseCodeSpan } = require('./code-span')
const { parseInlineHtml } = require('./inline-html')
const { parseAutolink } = require('./autolink')

const findParenClose = (text, startIdx) => {
  let inPointy = false, inQuote = null, depth = 0
  for (let i = startIdx; i < text.length; i++) {
    const char = text[i]
    let slashes = 0, p = i - 1
    while (p >= startIdx && text[p] === '\\') { slashes++; p-- }
    if (slashes % 2 === 1) continue
    if (inPointy) { if (char === '>') inPointy = false; continue }
    if (inQuote) { if (char === inQuote) inQuote = null; continue }
    if (char === '<' && i === startIdx + 1) { inPointy = true; continue }
    if ((char === '"' || char === "'") && i > startIdx + 1 && /[ \t\n\v\f\r]/.test(text[i - 1])) { inQuote = char; continue }
    if (char === '(') depth++
    else if (char === ')' && --depth === 0) return i
  }
  return -1
}

const parseInlineLinks = (text, index, parseInline, context = {}) => {
  if (!text.startsWith('[', index) || context.inLink) return null

  let bracketDepth = 0, textClose = -1
  for (let i = index; i < text.length; i++) {
    if (text[i] === '`') {
      const cs = parseCodeSpan(text, i)
      if (cs) { i += cs.consumedLength - 1; continue }
    }
    if (text[i] === '<') {
      const skip = parseInlineHtml(text, i) || parseAutolink(text, i)
      if (skip) { i += skip.consumedLength - 1; continue }
    }
    const char = text.charAt(i)
    let slashes = 0, p = i - 1
    while (p >= index && text[p] === '\\') { slashes++; p-- }
    if (slashes % 2 === 0) {
      if (char === '[') bracketDepth++
      else if (char === ']' && --bracketDepth === 0) { textClose = i; break }
    }
  }
  if (textClose === -1) return null

  const linkText = text.slice(index + 1, textClose)
  if (/(?:^|[^!\\])\[[^\]]+\](?:\([^)]+\)|\[[^\]]*\])/.test(linkText)) return null
  const innerCtx = { ...context, inLink: true }

  if (text.charAt(textClose + 1) === '(') {
    const urlClose = findParenClose(text, textClose + 1)
    if (urlClose !== -1) {
      const parsed = parseDestAndTitle(text.slice(textClose + 2, urlClose))
      if (parsed) {
        return {
          token: { type: 'link', url: parsed.url, title: parsed.title, children: parseInline(linkText, innerCtx) },
          consumedLength: urlClose + 1 - index,
        }
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
          token: { type: 'link', url: def.url, title: def.title, children: parseInline(linkText, innerCtx) },
          consumedLength: labelClose + 1 - index,
        }
      }
    }
  }

  const def = context.definitions?.get(normalizeLabel(linkText))
  if (def) {
    return {
      token: { type: 'link', url: def.url, title: def.title, children: parseInline(linkText, innerCtx) },
      consumedLength: textClose + 1 - index,
    }
  }
  return null
}

module.exports = { parseInlineLinks }
