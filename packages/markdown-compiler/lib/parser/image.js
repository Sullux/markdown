const normalizeDimension = (val) => {
  if (!val) return undefined
  val = val.trim()
  if (/^\d+$/.test(val)) return `${val}px`
  return val
}

const parseImage = (text, index) => {
  if (!text.startsWith('![', index)) return null

  const altClose = text.indexOf(']', index + 2)
  if (altClose === -1 || text.charAt(altClose + 1) !== '(') return null

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

  let rawAlt = text.slice(index + 2, altClose)
  let rawUrl = text.slice(altClose + 2, urlClose).trim()
  let consumedLength = urlClose + 1 - index

  let width
  let height
  let alt = rawAlt
  let url = rawUrl

  // 1. Obsidian pipe in alt: ![alt text|400x200](url) or ![alt text|400](url)
  const pipeIdx = rawAlt.lastIndexOf('|')
  if (pipeIdx !== -1) {
    const dimSpec = rawAlt.slice(pipeIdx + 1).trim()
    const sizeMatch = dimSpec.match(/^(\d+(?:px|%)?)(?:x(\d+(?:px|%)?))?$/i)
    if (sizeMatch) {
      alt = rawAlt.slice(0, pipeIdx).trim()
      width = normalizeDimension(sizeMatch[1])
      if (sizeMatch[2]) height = normalizeDimension(sizeMatch[2])
    }
  }

  // 2. VS Code space-equal in url: ![alt](url =300x200) or ![alt](url =300)
  const eqMatch = rawUrl.match(/^(\S+)\s+=(\d+(?:px|%)?)(?:x(\d+(?:px|%)?))?$/i)
  if (eqMatch) {
    url = eqMatch[1]
    width = normalizeDimension(eqMatch[2])
    if (eqMatch[3]) height = normalizeDimension(eqMatch[3])
  }

  // 3. Attribute braces after URL: ![alt](url){width=50% height=200px} or {:width="400px"}
  const rest = text.slice(urlClose + 1)
  const braceMatch = rest.match(/^\{:?\s*([^}]+)\}/)
  if (braceMatch) {
    const attrString = braceMatch[1]
    const wMatch = attrString.match(/width\s*[:=]\s*["']?([^"'\s}]+)["']?/i)
    const hMatch = attrString.match(/height\s*[:=]\s*["']?([^"'\s}]+)["']?/i)
    if (wMatch) width = normalizeDimension(wMatch[1])
    if (hMatch) height = normalizeDimension(hMatch[2] || hMatch[1])
    consumedLength += braceMatch[0].length
  }

  const token = { type: 'image', url, alt }
  if (width) token.width = width
  if (height) token.height = height

  return { token, consumedLength }
}

module.exports = { parseImage, normalizeDimension }
