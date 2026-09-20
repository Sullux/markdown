const { normalizeLabel, parseLinkDef } = require('./parse')

const collectLinkDefs = (lines) => {
  const defs = new Map()
  let i = 0
  let inParagraph = false

  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.replace(/^ {0,3}>[ \t]?/, '')
    if (!line.trim()) {
      inParagraph = false
      i++
      continue
    }

    const fence = line.match(/^ {0,3}(`{3,}|~{3,})/)
    if (fence) {
      inParagraph = false
      const char = fence[1][0]
      const len = fence[1].length
      i++
      while (i < lines.length) {
        const cLine = lines[i].replace(/^ {0,3}>[ \t]?/, '')
        if (new RegExp(`^ {0,3}${char}{${len},}[ \\t]*$`).test(cLine)) { i++; break }
        i++
      }
      continue
    }

    if (!inParagraph) {
      const parsed = parseLinkDef(lines, i) || (raw !== line ? parseLinkDef([line], 0) : null)
      if (parsed) {
        const norm = normalizeLabel(parsed.def.label)
        if (!defs.has(norm)) defs.set(norm, parsed.def)
        i = parsed.nextIndex === 1 && raw !== line ? i + 1 : parsed.nextIndex
        continue
      }
    }

    const isNonParaBlock = /^ {0,3}#{1,6}(?:[ \t]|$)/.test(line) || /^ {0,3}[*\-_][ \t]*(?:\1[ \t]*){2,}$/.test(line)
    inParagraph = !isNonParaBlock
    i++
  }
  return defs
}

module.exports = { collectLinkDefs }
