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
    if (block.type === 'bulletList') return { type: 'bulletList', items: block.items.map((item) => parseInline(item)) }
    if (block.type === 'orderedList') return { type: 'orderedList', items: block.items.map((item) => parseInline(item)) }
    if (block.type === 'table') return parseTableBlock(block.headerLine, block.dividerLine, block.rows)
    return block
  })
}

module.exports = { mapBlocks }
