const parseThematicBreak = (line) => {
  if (!line || typeof line !== 'string') return null
  if (/^ {0,3}([*\-_])[ \t]*(?:\1[ \t]*){2,}$/.test(line)) {
    return { type: 'hr' }
  }
  return null
}

module.exports = { parseThematicBreak }
