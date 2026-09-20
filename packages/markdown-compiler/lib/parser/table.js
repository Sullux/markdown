const { parseInline } = require('./inline')

const parseAlignments = (dividerLine) => {
  const cells = dividerLine.split('|').map((s) => s.trim()).filter((s, idx, arr) => idx > 0 && idx < arr.length - 1)
  return cells.map((cell) => {
    if (cell.startsWith(':') && cell.endsWith(':')) return 'center'
    if (cell.endsWith(':')) return 'right'
    if (cell.startsWith(':')) return 'left'
    return 'default'
  })
}

const parseTableRow = (rowLine) => {
  const cells = rowLine.split('|').map((s) => s.trim())
  if (cells.length > 1 && cells[0] === '') cells.shift()
  if (cells.length > 0 && cells[cells.length - 1] === '') cells.pop()
  return cells.map((cell) => parseInline(cell))
}

const parseTableBlock = (rawHeader, dividerLine, rawRows) => ({
  type: 'table',
  alignments: parseAlignments(dividerLine),
  rows: [parseTableRow(rawHeader), ...rawRows.map((r) => parseTableRow(r))],
})

const isTableDivider = (line) => Boolean(line && /^\s*\|?\s*(:?\-+:?\s*\|?\s*)+$/.test(line) && line.includes('|'))

const parseTable = (lines, startIndex) => {
  const header = lines[startIndex]
  const divider = lines[startIndex + 1]
  if (!header || !header.includes('|') || !isTableDivider(divider)) return null

  const rawRows = []
  let i = startIndex + 2
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim() || !line.includes('|')) break
    rawRows.push(line)
    i++
  }

  return { block: parseTableBlock(header, divider, rawRows), nextIndex: i }
}

module.exports = { parseTable, parseTableBlock }
