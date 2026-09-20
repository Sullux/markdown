const { unescapeBackslashes, normalizeUrl } = require('../unescape')
const { decodeEntities } = require('../entities')

const normalizeLabel = (str) =>
  unescapeBackslashes(str || '').trim().replace(/\s+/g, ' ').toLowerCase()

const parseLinkDef = (lines, startIndex) => {
  let i = startIndex
  let header = lines[i]
  if (!header || !/^ {0,3}\[/.test(header)) return null

  while (!header.includes(']:') && i + 1 < lines.length && lines[i + 1].trim()) {
    i++
    header += '\n' + lines[i]
  }
  const labelMatch = header.match(/^ {0,3}\[((?:\\\]|[^\]])+)\]:[ \t]*(.*)$/)
  if (!labelMatch || /(?:^|[^\\])\[/.test(labelMatch[1])) return null

  const label = labelMatch[1]
  let rest = labelMatch[2]
  if (!rest.trim() && i + 1 < lines.length && lines[i + 1].trim()) {
    i++
    rest = lines[i].trim()
  }

  let url = ''
  let afterUrl = ''
  if (rest.startsWith('<')) {
    const closeAngle = rest.indexOf('>')
    if (closeAngle === -1) return null
    url = rest.slice(1, closeAngle)
    const afterAngle = rest.slice(closeAngle + 1)
    if (afterAngle && !/^[ \t]/.test(afterAngle)) return null
    afterUrl = afterAngle.trim()
  } else {
    const destMatch = rest.match(/^(\S+)(?:[ \t]+(.*))?$/)
    if (!destMatch) return null
    url = destMatch[1]
    afterUrl = (destMatch[2] || '').trim()
  }

  let title = undefined
  let titleStr = afterUrl
  let titleLineIdx = i
  if (!titleStr && i + 1 < lines.length && lines[i + 1].trim()) {
    const nextTrim = lines[i + 1].trim()
    if (/^["'(]/.test(nextTrim)) {
      titleStr = nextTrim
      titleLineIdx = i + 1
    }
  }

  if (titleStr && /^["'(]/.test(titleStr)) {
    const openChar = titleStr[0]
    const closeChar = openChar === '(' ? ')' : openChar
    let tempI = titleLineIdx
    let fullTitle = titleStr
    while (tempI + 1 < lines.length && !fullTitle.slice(1).includes(closeChar)) {
      if (!lines[tempI + 1].trim()) break
      tempI++
      fullTitle += '\n' + lines[tempI]
    }
    const escClose = closeChar === ')' ? '\\)' : closeChar
    const tm = fullTitle.match(new RegExp(`^${openChar === '(' ? '\\(' : openChar}((?:\\\\.|[^${escClose}])*)${escClose}[ \\t]*$`))
    if (tm) {
      title = tm[1]
      i = tempI
    } else if (afterUrl) {
      return null
    }
  } else if (afterUrl) {
    return null
  }

  return {
    def: {
      label,
      url: normalizeUrl(decodeEntities(unescapeBackslashes(url))),
      title: title !== undefined ? decodeEntities(unescapeBackslashes(title)) : undefined,
    },
    nextIndex: i + 1,
  }
}

module.exports = { normalizeLabel, parseLinkDef }
