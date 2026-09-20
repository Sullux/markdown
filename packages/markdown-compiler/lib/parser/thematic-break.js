const parseThematicBreak = (line) => {
  const trimmed = line.trim()
  if (['---', '***', '___'].includes(trimmed)) return { type: 'hr' }
  if (/^(\*\s*){3,}$|^(-\s*){3,}$|^(_\s*){3,}$/.test(trimmed)) return { type: 'hr' }
  return null
}

module.exports = { parseThematicBreak }
