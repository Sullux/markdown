const { normalizeLabel } = require('./link-def')
const { parseDestAndTitle, toPlainText } = require('./link-utils')
const { parseAttributeList } = require('./attributes')

const normalizeDimension = (val) => {
  if (!val) return undefined
  val = val.trim()
  return /^\d+$/.test(val) ? `${val}px` : val
}

const findClosing = (text, start, open, close) => {
  let depth = 0
  for (let i = start; i < text.length; i++) {
    if (text[i] === open) depth++
    else if (text[i] === close && --depth === 0) return i
  }
  return -1
}

const parseDimensionsFromAlt = (rawAlt) => {
  const pipeIdx = rawAlt.lastIndexOf('|')
  if (pipeIdx === -1) return { alt: rawAlt }
  const match = rawAlt.slice(pipeIdx + 1).trim().match(/^(\d+(?:px|%)?)(?:x(\d+(?:px|%)?))?$/i)
  if (!match) return { alt: rawAlt }
  return {
    alt: rawAlt.slice(0, pipeIdx).trim(),
    width: normalizeDimension(match[1]),
    height: match[2] ? normalizeDimension(match[2]) : undefined,
  }
}

const parseImage = (text, index, context = {}) => {
  if (!text.startsWith('![', index)) return null
  const altClose = findClosing(text, index + 1, '[', ']')
  if (altClose === -1) return null

  const dimInfo = parseDimensionsFromAlt(text.slice(index + 2, altClose))
  let rawAlt = dimInfo.alt
  let width = dimInfo.width
  let height = dimInfo.height
  let url = ''
  let title = undefined
  let consumedLength = 0
  let attrList = undefined

  if (text.charAt(altClose + 1) === '(') {
    const urlClose = findClosing(text, altClose + 1, '(', ')')
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
      attrList = parseAttributeList(braceMatch[0])
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

  if (attrList) {
    if (attrList.id) token.id = attrList.id
    if (attrList.classes?.length) token.classes = attrList.classes
    if (attrList.attributes && Object.keys(attrList.attributes).length) {
      token.attributes = attrList.attributes
      if (attrList.attributes.width) token.width = normalizeDimension(attrList.attributes.width)
      if (attrList.attributes.height) token.height = normalizeDimension(attrList.attributes.height)
    }
  }
  return { token, consumedLength }
}

module.exports = { parseImage, normalizeDimension }
