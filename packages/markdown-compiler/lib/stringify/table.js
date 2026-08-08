const centerPad = (str, width) => {
  const totalPad = width - str.length
  if (totalPad <= 0) return str
  const leftPad = Math.floor(totalPad / 2)
  const rightPad = totalPad - leftPad
  return ' '.repeat(leftPad) + str + ' '.repeat(rightPad)
}

const stringifyTable = (node, stringifyNode) => {
  const alignments = node.alignments || []
  const rows = node.rows || []
  if (rows.length === 0) return ''

  const stringifiedRows = rows.map((row) => row.map((cell) => stringifyNode(cell).trim()))
  const numCols = Math.max(...stringifiedRows.map((r) => r.length))
  const colWidths = Array(numCols).fill(3)

  for (const row of stringifiedRows) {
    for (let colIdx = 0; colIdx < numCols; colIdx++) {
      const val = row[colIdx] || ''
      colWidths[colIdx] = Math.max(colWidths[colIdx], val.length)
    }
  }

  const lines = []
  const headerRow = stringifiedRows[0] || []
  const formattedHeader =
    '| ' +
    colWidths
      .map((w, colIdx) => {
        const val = headerRow[colIdx] || ''
        const align = alignments[colIdx] || 'default'
        if (align === 'right') return val.padStart(w)
        if (align === 'center') return centerPad(val, w)
        return val.padEnd(w)
      })
      .join(' | ') +
    ' |'
  lines.push(formattedHeader)

  const dividerCells = colWidths.map((w, colIdx) => {
    const align = alignments[colIdx] || 'default'
    if (align === 'left') return ':' + '-'.repeat(w - 1)
    if (align === 'center') return ':' + '-'.repeat(w - 2) + ':'
    if (align === 'right') return '-'.repeat(w - 1) + ':'
    return '-'.repeat(w)
  })
  lines.push('| ' + dividerCells.join(' | ') + ' |')

  for (let rowIdx = 1; rowIdx < stringifiedRows.length; rowIdx++) {
    const row = stringifiedRows[rowIdx] || []
    const formattedRow =
      '| ' +
      colWidths
        .map((w, colIdx) => {
          const val = row[colIdx] || ''
          const align = alignments[colIdx] || 'default'
          if (align === 'right') return val.padStart(w)
          if (align === 'center') return centerPad(val, w)
          return val.padEnd(w)
        })
        .join(' | ') +
      ' |'
    lines.push(formattedRow)
  }

  return `\n${lines.join('\n')}\n`
}

module.exports = { stringifyTable }
