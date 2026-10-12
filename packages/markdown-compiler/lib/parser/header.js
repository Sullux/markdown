const { parseInline } = require('./inline')
const { extractTrailingAttributes } = require('./attributes')

const parseHeader = (line, context) => {
  const match = line.match(/^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/)
  if (!match) return null
  const level = match[1].length
  let content = match[2] || ''
  content = content.replace(/(^|[ \t]+)(?<!\\)#+[ \t]*$/, '$1').trim()
  const trailing = extractTrailingAttributes(content)
  const headerText = trailing ? trailing.cleanText : content
  return {
    type: 'header',
    level,
    children: headerText ? parseInline(headerText, context) : [],
    ...(trailing?.id ? { id: trailing.id } : {}),
    ...(trailing?.classes?.length ? { classes: trailing.classes } : {}),
    ...(trailing?.attributes && Object.keys(trailing.attributes).length ? { attributes: trailing.attributes } : {}),
  }
}

const parseSetextUnderline = (line) => {
  if (!line || typeof line !== 'string') return null
  const match = line.match(/^ {0,3}(=+|-+)[ \t]*$/)
  if (!match) return null
  return match[1][0] === '=' ? 1 : 2
}

module.exports = { parseHeader, parseSetextUnderline }
