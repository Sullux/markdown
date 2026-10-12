const { parseHeader, parseSetextUnderline } = require('./header')
const { parseThematicBreak } = require('./thematic-break')
const { parseCodeBlock, parseIndentedCodeBlock } = require('./code')
const { parseHtml } = require('./html')
const { parseMath } = require('./math')
const { parseQuote } = require('./quote')
const { parseTable } = require('./table')
const { parseList } = require('./list')
const { parseLinkDef, collectLinkDefs } = require('./link-def')
const { parseInline } = require('./inline')
const { parseAttributeList, extractTrailingAttributes } = require('./attributes')

const isBlockStart = (lines, idx, parseBlocks) => {
  const line = lines[idx]
  if (!line || !line.trim()) return true
  if (parseThematicBreak(line) || parseHeader(line)) return true
  const trimmed = line.trim()
  if (trimmed.startsWith('```') || trimmed.startsWith('~~~') || trimmed.startsWith('$$')) return true
  if (parseHtml(lines, idx, true) || parseTable(lines, idx) || parseQuote(lines, idx, parseBlocks)) return true
  const listRes = parseList(lines, idx, parseBlocks)
  if (listRes && listRes.block.children[0]?.children?.length > 0) {
    return listRes.block.type !== 'orderedList' || (listRes.block.start || 1) === 1
  }
  return false
}

const parseBlocks = (text, context = {}) => {
  if (!text || typeof text !== 'string') return []
  const cleanText = text.endsWith('\n') ? text.slice(0, -1) : text
  const lines = cleanText.split('\n')
  const blocks = []
  const defs = context.definitions || collectLinkDefs(lines)
  const ctx = { ...context, definitions: defs }
  let i = 0, pendingAttrs = null

  const add = (b) => {
    if (pendingAttrs) {
      if (pendingAttrs.id) b.id = pendingAttrs.id
      if (pendingAttrs.classes?.length) b.classes = pendingAttrs.classes
      if (pendingAttrs.attributes) b.attributes = pendingAttrs.attributes
      pendingAttrs = null
    }
    blocks.push(b)
  }

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    const attrMatch = line.match(/^ {0,3}\{(?!%)(:?[^}\n]+)\}[ \t]*$/)
    if (attrMatch && /^[ \t]*:|[#.]|[a-zA-Z0-9_\-]+[=:]/.test(attrMatch[1])) {
      pendingAttrs = parseAttributeList(attrMatch[0]); i++; continue
    }
    const linkDef = parseLinkDef(lines, i)
    if (linkDef) { i = linkDef.nextIndex; continue }
    const hr = parseThematicBreak(line); if (hr) { add(hr); i++; continue }
    const header = parseHeader(line, ctx); if (header) { add(header); i++; continue }
    const code = parseCodeBlock(lines, i); if (code) { add(code.block); i = code.nextIndex; continue }
    const ind = parseIndentedCodeBlock(lines, i); if (ind) { add(ind.block); i = ind.nextIndex; continue }
    const math = parseMath(lines, i); if (math) { add(math.block); i = math.nextIndex; continue }
    const html = parseHtml(lines, i); if (html) { add(html.block); i = html.nextIndex; continue }
    const table = parseTable(lines, i); if (table) { add(table.block); i = table.nextIndex; continue }
    const quote = parseQuote(lines, i, (t) => parseBlocks(t, ctx)); if (quote) { add(quote.block); i = quote.nextIndex; continue }
    const list = parseList(lines, i, (t) => parseBlocks(t, ctx)); if (list) { add(list.block); i = list.nextIndex; continue }

    const pLines = [line.replace(/^ {0,3}/, '')]
    i++
    while (i < lines.length) {
      const setextLevel = parseSetextUnderline(lines[i])
      if (setextLevel) {
        i++
        add({ type: 'header', level: setextLevel, children: parseInline(pLines.map((l) => l.trim()).join('\n'), ctx) })
        pLines.length = 0; break
      }
      if (isBlockStart(lines, i, parseBlocks)) break
      pLines.push(lines[i].replace(/^ {0,3}/, ''))
      i++
    }
    if (pLines.length > 0) {
      pLines[pLines.length - 1] = pLines[pLines.length - 1].replace(/[ \t]+$/, '')
      const pText = pLines.join('\n')
      const trailing = extractTrailingAttributes(pText)
      add({
        type: 'paragraph',
        children: parseInline(trailing ? trailing.cleanText : pText, ctx),
        ...(trailing?.id ? { id: trailing.id } : {}),
        ...(trailing?.classes?.length ? { classes: trailing.classes } : {}),
        ...(trailing?.attributes ? { attributes: trailing.attributes } : {}),
      })
    }
  }
  return blocks
}

module.exports = { parseBlocks }
