const { parseInline } = require('./inline')
const { parseTableBlock } = require('./table')

const mapBlocks = (blocks, parseBlocks) => {
  return blocks.map((block) => {
    if (block.type === 'paragraph') return { type: 'paragraph', children: parseInline(block.rawText) }
    if (block.type === 'header') return { type: 'header', level: block.level, children: parseInline(block.rawText) }
    if (block.type === 'blockquote') {
      const fullContent = block.lines.join('\n')
      if (fullContent.trim().startsWith('[!')) {
        const match = fullContent.trim().match(/^\[!([A-Z0-9_\-]+)\]\s*([\s\S]*)$/i)
        if (match) {
          const style = match[1].toLowerCase()
          return { type: 'callout', style, children: parseBlocks(match[2].trim()) }
        }
      }
      return { type: 'blockquote', children: parseBlocks(fullContent) }
    }
    if (block.type === 'hintBlock') {
      const fullContent = block.lines.join('\n')
      return { type: 'callout', style: block.style, children: parseBlocks(fullContent) }
    }
    if (block.type === 'bulletList' || block.type === 'orderedList') {
      const rawItems = block.items || []
      const uniqueIndents = [...new Set(rawItems.map((it) => (typeof it === 'object' ? (it.indent || 0) : 0)))].sort((a, b) => a - b)
      const depthCounters = {}
      let lastDepth = 0

      const items = rawItems.map((item, idx) => {
        const raw = typeof item === 'string' ? item : (item.text || '')
        const children = parseInline(raw)
        if (typeof item === 'object') {
          const indent = item.indent || 0
          const depth = item.depth != null ? item.depth : uniqueIndents.indexOf(indent)
          if (depth < lastDepth) {
            Object.keys(depthCounters).forEach((d) => { if (Number(d) > depth) delete depthCounters[d] })
          }
          lastDepth = depth

          children.indent = indent
          children.depth = depth
          children.listType = item.listType || (block.type === 'orderedList' ? 'ordered' : 'bullet')
          if (children.listType === 'ordered') {
            const nextExpected = (depthCounters[depth] || 0) + 1
            const order = item.order && item.order >= nextExpected ? item.order : nextExpected
            depthCounters[depth] = order
            children.order = order
          }
          if (item.marker) children.marker = item.marker
        } else {
          children.depth = 0
          children.indent = 0
          children.listType = block.type === 'orderedList' ? 'ordered' : 'bullet'
          if (children.listType === 'ordered') children.order = idx + 1
        }
        return children
      })
      return { type: block.type, items }
    }
    if (block.type === 'table') return parseTableBlock(block.headerLine, block.dividerLine, block.rows)
    return block
  })
}

module.exports = { mapBlocks }
