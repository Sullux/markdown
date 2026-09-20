const { normalizeLabel } = require('./link-def')
const { parseDestAndTitle, toPlainText } = require('./link-utils')

const normalizeDimension = (val) => {
  if (!val) return undefined
  val = val.trim()
  return /^\d+$/.test(val) ? `${val}px` : val
}

const parseImage = (text, index, context = {}) => {
  if (!text.startsWith('![', index)) return null

  let bracketDepth = 0
  let altClose = -1
  for (let i = index + 1; i < text.length; i++) {
    const char = text.charAt(i)
    if (char === '[') bracketDepth++
    else if (char === ']') {
      bracketDepth--
      if (bracketDepth === 0) {
        altClose = i
        break
      }
    }
  }
  if (altClose === -1) return null

  let rawAlt = text.slice(index + 2, altClose)
  let url = ''
  let title = undefined
  let consumedLength = 0
  let width, height

  const pipeIdx = rawAlt.lastIndexOf('|')
  if (pipeIdx !== -1) {
    const dimSpec = rawAlt.slice(pipeIdx + 1).trim()
    const sizeMatch = dimSpec.match(/^(\d+(?:px|%)?)(?:x(\d+(?:px|%)?))?$/i)
    if (sizeMatch) {
      rawAlt = rawAlt.slice(0, pipeIdx).trim()
      width = normalizeDimension(sizeMatch[1])
      if (sizeMatch[2]) height = normalizeDimension(sizeMatch[2])
    }
  }

  if (text.charAt(altClose + 1) === '(') {
    let parenDepth = 0
    let urlClose = -1
    for (let i = altClose + 1; i < text.length; i++) {
      if (text.charAt(i) === '(') parenDepth++
      else if (text.charAt(i) === ')') {
        parenDepth--
        if (parenDepth === 0) {
          urlClose = i
          break
        }
      }
    }
    if (urlClose === -1) return null
    let rawUrl = text.slice(altClose + 2, urlClose).trim()
    const eqMatch = rawUrl.match(/^(\S+)\s+=(\d+(?:px|%)?)(?:x(\d+(?:px|%)?))?$/i)
    if (eqMatch) {
      rawUrl = eqMatch[1]
      width = normalizeDimension(eqMatch[2])
      if (eqMatch[3]) height = normalizeDimension(eqMatch[3])
    }
    const parsed = parseDestAndTitle(rawUrl)
    if (!parsed) return null
    url = parsed.url
    title = parsed.title
    consumedLength = urlClose + 1 - index
    const braceMatch = text.slice(urlClose + 1).match(/^\{:?\s*([^}]+)\}/)
    if (braceMatch) {
      const wMatch = braceMatch[1].match(/width\s*[:=]\s*["']?([^"'\s}]+)["']?/i)
      const hMatch = braceMatch[1].match(/height\s*[:=]\s*["']?([^"'\s}]+)["']?/i)
      if (wMatch) width = normalizeDimension(wMatch[1])
      if (hMatch) height = normalizeDimension(hMatch[2] || hMatch[1])
      consumedLength += braceMatch[0].length
    }
  } else {
    const isRef = text.charAt(altClose + 1) === '['
    const labelClose = isRef ? text.indexOf(']', altClose + 2) : altClose
    if (isRef && labelClose === -1) return null
    const rawLabel = isRef ? (text.slice(altClose + 2, labelClose).trim() || rawAlt) : rawAlt
    const def = context.definitions?.get(normalizeLabel(rawLabel))
    if (!def) return null
    url = def.url
    title = def.title
    consumedLength = (isRef ? labelClose : altClose) + 1 - index
  }

  const token = { type: 'image', url, alt: toPlainText(rawAlt), title }
  if (width) token.width = width
  if (height) token.height = height
  return { token, consumedLength }
}

module.exports = { parseImage, normalizeDimension }
