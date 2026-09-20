const { unescapeBackslashes, normalizeUrl } = require('./unescape')
const { decodeEntities } = require('./entities')

const parseDestAndTitle = (rawContent) => {
  const trimmed = rawContent.trim()
  let dest = ''
  let rest = ''
  if (trimmed.startsWith('<')) {
    const closeAngle = trimmed.indexOf('>')
    if (closeAngle === -1) return null
    dest = trimmed.slice(1, closeAngle)
    rest = trimmed.slice(closeAngle + 1).trim()
  } else {
    const sp = trimmed.search(/\s/)
    dest = sp === -1 ? trimmed : trimmed.slice(0, sp)
    rest = sp === -1 ? '' : trimmed.slice(sp).trim()
  }
  let title = undefined
  if (rest) {
    const tm = rest.match(/^(?:"([^"]*)"|'([^']*)'|\(([^)]*)\))$/)
    if (!tm) return null
    const rawTitle = tm[1] !== undefined ? tm[1] : (tm[2] !== undefined ? tm[2] : tm[3])
    title = decodeEntities(unescapeBackslashes(rawTitle))
  }
  const url = normalizeUrl(decodeEntities(unescapeBackslashes(dest)))
  return { url, title }
}

const toPlainText = (text) =>
  text ? text.replace(/!?\[([^\]]*)\](?:\([^)]*\))?/g, '$1').replace(/[*_~`]/g, '').trim() : ''

module.exports = { parseDestAndTitle, toPlainText }
