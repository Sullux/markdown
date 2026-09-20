const { parseThematicBreak } = require('./thematic-break')
const { detabLine } = require('./tab')

const BULLET_RE = /^( {0,3})([*+-])( *)(.*)$/
const ORDERED_RE = /^( {0,3})(\d{1,9}[.)])( *)(.*)$/

const parseMarker = (rawLine) => {
  const line = detabLine(rawLine)
  if (parseThematicBreak(line)) return null
  const bMatch = line.match(BULLET_RE)
  if (bMatch && (bMatch[3].length > 0 || !bMatch[4])) {
    const spaces = bMatch[3].length
    const isCode = spaces > 4
    const contentIndent = isCode ? bMatch[1].length + bMatch[2].length + 1 : bMatch[1].length + bMatch[2].length + spaces
    const firstContent = isCode ? ' '.repeat(spaces - 1) + bMatch[4] : bMatch[4]
    return {
      indent: bMatch[1].length,
      contentIndent,
      isOrdered: false,
      marker: bMatch[2],
      content: firstContent,
    }
  }
  const oMatch = line.match(ORDERED_RE)
  if (oMatch && (oMatch[3].length > 0 || !oMatch[4])) {
    const spaces = oMatch[3].length
    const isCode = spaces > 4
    const contentIndent = isCode ? oMatch[1].length + oMatch[2].length + 1 : oMatch[1].length + oMatch[2].length + spaces
    const firstContent = isCode ? ' '.repeat(spaces - 1) + oMatch[4] : oMatch[4]
    return {
      indent: oMatch[1].length,
      contentIndent,
      isOrdered: true,
      start: parseInt(oMatch[2], 10),
      marker: oMatch[2],
      content: firstContent,
    }
  }
  return null
}

module.exports = { parseMarker }
