const { parseInline } = require('./inline')

const parseAlignments = (dividerLine) => {
  const cells = dividerLine.split('|').map((s) => s.trim()).filter((s, idx, arr) => idx > 0 && idx < arr.length - 1)
  return cells.map((cell) => {
    const left = cell.startsWith(':')
    const right = cell.endsWith(':')
    if (left && right) return 'center'
    if (right) return 'right'
    if (left) return 'left'
    return 'default'
  })
}

const parseTableRow = (rowLine) => {
  const cells = rowLine.split('|').map((s) => s.trim())
  if (cells.length > 1 && cells[0] === '') cells.shift()
  if (cells.length > 0 && cells[cells.length - 1] === '') cells.pop()
  return cells.map((cell) => parseInline(cell))
}

const parseTableBlock = (rawHeader, dividerLine, rawRows) => {
  const alignments = parseAlignments(dividerLine)
  const headerCells = parseTableRow(rawHeader)
  const bodyRows = rawRows.map((r) => parseTableRow(r))
  return {
    type: 'table',
    alignments,
    rows: [headerCells, ...bodyRows],
  }
}

module.exports = { parseTableBlock }
