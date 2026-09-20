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

const isBlockStart = (lines, idx, parseBlocks) => {
  const line = lines[idx]
  if (!line || !line.trim()) return true
  if (parseThematicBreak(line)) return true
  if (parseHeader(line)) return true
  const trimmed = line.trim()
  if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) return true
  if (trimmed.startsWith('$$')) return true
  if (parseHtml(lines, idx, true)) return true
  if (parseTable(lines, idx)) return true
  if (parseQuote(lines, idx, parseBlocks)) return true
  if (parseList(lines, idx, parseBlocks)) return true
  if (parseLinkDef(lines, idx)) return true
  return false
}

const parseBlocks = (text, context = {}) => {
  if (!text || typeof text !== 'string') return []
  const lines = text.split('\n')
  const blocks = []
  const defs = context.definitions || collectLinkDefs(lines)
  const ctx = { ...context, definitions: defs }
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }

    const linkDef = parseLinkDef(lines, i)
    if (linkDef) { i = linkDef.nextIndex; continue }

    const hr = parseThematicBreak(line)
    if (hr) { blocks.push(hr); i++; continue }

    const header = parseHeader(line, ctx)
    if (header) { blocks.push(header); i++; continue }

    const code = parseCodeBlock(lines, i)
    if (code) { blocks.push(code.block); i = code.nextIndex; continue }

    const indentedCode = parseIndentedCodeBlock(lines, i)
    if (indentedCode) { blocks.push(indentedCode.block); i = indentedCode.nextIndex; continue }

    const math = parseMath(lines, i)
    if (math) { blocks.push(math.block); i = math.nextIndex; continue }

    const html = parseHtml(lines, i)
    if (html) { blocks.push(html.block); i = html.nextIndex; continue }

    const table = parseTable(lines, i)
    if (table) { blocks.push(table.block); i = table.nextIndex; continue }

    const quote = parseQuote(lines, i, (t) => parseBlocks(t, ctx))
    if (quote) { blocks.push(quote.block); i = quote.nextIndex; continue }

    const list = parseList(lines, i, (t) => parseBlocks(t, ctx))
    if (list) { blocks.push(list.block); i = list.nextIndex; continue }

    const pLines = [line.replace(/^ {0,3}/, '')]
    i++
    while (i < lines.length) {
      const setextLevel = parseSetextUnderline(lines[i])
      if (setextLevel) {
        i++
        const headingText = pLines.map((l) => l.trim()).join('\n')
        blocks.push({ type: 'header', level: setextLevel, children: parseInline(headingText, ctx) })
        pLines.length = 0
        break
      }
      if (isBlockStart(lines, i, parseBlocks)) break
      pLines.push(lines[i].replace(/^ {0,3}/, ''))
      i++
    }
    if (pLines.length > 0) {
      pLines[pLines.length - 1] = pLines[pLines.length - 1].replace(/[ \t]+$/, '')
      blocks.push({ type: 'paragraph', children: parseInline(pLines.join('\n'), ctx) })
    }
  }

  return blocks
}

module.exports = { parseBlocks }
