const { isCellEmpty, optimizeTable } = require('./utils')

const processTableNode = (node, style, blocks, traverse) => {
  const tableAlignments = []
  const tableRows = []

  const findRows = (tableNode) => {
    for (const child of tableNode.children) {
      if (child.tagName === 'tr') {
        const cells = []
        for (const cellNode of child.children) {
          if (cellNode.tagName === 'th' || cellNode.tagName === 'td') {
            if (tableRows.length === 0) {
              const alignAttr = cellNode.attributes.align || ''
              const styleMatch = cellNode.attributes.style?.match(/text-align:\s*([a-z]+)/)
              let align = alignAttr.toLowerCase() || styleMatch?.[1] || 'default'
              if (align !== 'left' && align !== 'right' && align !== 'center') align = 'default'
              tableAlignments.push(align)
            }
            const cellInline = []
            for (const cellChild of cellNode.children) traverse(cellChild, style, cellInline)
            cells.push(cellInline)
          }
        }
        if (cells.length > 0) tableRows.push(cells)
      } else if (child.tagName === 'tbody' || child.tagName === 'thead' || child.tagName === 'tfoot') {
        findRows(child)
      }
    }
  }

  findRows(node)

  if (tableRows.length > 0) {
    const optimized = optimizeTable(tableRows, tableAlignments)
    if (optimized) {
      if (optimized.rows[0].length <= 1 || optimized.rows.length <= 1) {
        for (const row of optimized.rows) {
          for (const cell of row) {
            if (!isCellEmpty(cell)) blocks.push({ type: 'paragraph', children: cell })
          }
        }
      } else {
        blocks.push({ type: 'table', alignments: optimized.alignments, rows: optimized.rows })
      }
    }
  }
}

module.exports = { processTableNode }
