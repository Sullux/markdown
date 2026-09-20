const { parseInline } = require('./inline')

const parseHeader = (line) => {
  const match = line.match(/^ {0,3}(#{1,6})(?:[ \t]+(.*?))?[ \t]*$/)
  if (!match) return null
  const level = match[1].length
  let content = match[2] || ''
  content = content.replace(/(^|[ \t]+)(?<!\\)#+[ \t]*$/, '$1').trim()
  return {
    type: 'header',
    level,
    children: content ? parseInline(content) : [],
  }
}

const parseSetextUnderline = (line) => {
  if (!line || typeof line !== 'string') return null
  const match = line.match(/^ {0,3}(=+|-+)[ \t]*$/)
  if (!match) return null
  return match[1][0] === '=' ? 1 : 2
}

module.exports = { parseHeader, parseSetextUnderline }
