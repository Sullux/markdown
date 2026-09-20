const { parseInline } = require('./inline')

const parseHeader = (line) => {
  const match = line.match(/^(#{1,6})\s+(.*)$/)
  if (!match) return null
  return {
    type: 'header',
    level: match[1].length,
    children: parseInline(match[2].trim()),
  }
}

module.exports = { parseHeader }
