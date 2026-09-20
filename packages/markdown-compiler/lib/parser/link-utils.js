const { unescapeBackslashes, normalizeUrl } = require('./unescape')
const { decodeEntities } = require('./entities')

const parseDestAndTitle = (rawContent) => {
  const trimmed = rawContent.trim()
  if (!trimmed) return { url: '', title: undefined }
  let dest = ''
  let rest = ''
  if (trimmed.startsWith('<')) {
    let slashes = 0
    let closeAngle = -1
    for (let i = 1; i < trimmed.length; i++) {
      if (trimmed[i] === '\\') { slashes++; continue }
      if (trimmed[i] === '>' && slashes % 2 === 0) { closeAngle = i; break }
      slashes = 0
    }
    if (closeAngle === -1) return null
    dest = trimmed.slice(1, closeAngle)
    if (dest.includes('\n')) return null
    const afterAngle = trimmed.slice(closeAngle + 1)
    if (afterAngle && !/^[ \t]/.test(afterAngle)) return null
    rest = afterAngle.trim()
  } else {
    let sp = -1
    let parens = 0
    for (let i = 0; i < trimmed.length; i++) {
      let slashes = 0, p = i - 1
      while (p >= 0 && trimmed[p] === '\\') { slashes++; p-- }
      if (slashes % 2 === 1) continue
      if (trimmed[i] === '(') parens++
      else if (trimmed[i] === ')') parens--
      else if (/[ \t\n\v\f\r]/.test(trimmed[i]) && parens <= 0) { sp = i; break }
    }
    dest = sp === -1 ? trimmed : trimmed.slice(0, sp)
    rest = sp === -1 ? '' : trimmed.slice(sp).trim()
    if (dest.includes('\n') || parens !== 0) return null
  }
  let title = undefined
  if (rest) {
    const tm = rest.match(/^(?:"((?:\\.|[^"])*)"|'((?:\\.|[^'])*)'|\(((?:\\.|[^)])*)\))$/)
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
