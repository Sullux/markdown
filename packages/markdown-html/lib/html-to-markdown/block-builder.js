const { parseStyleAttr } = require('./utils')
const { processTableNode } = require('./block-table')

const processBlockNode = (node, style, blocks, currentInline, traverse, toAst) => {
  if (node.type !== 'element') return false

  const tagName = node.tagName
  const attrs = node.attributes || {}
  const inlineStyles = parseStyleAttr(attrs.style)

  const flushInline = () => {
    if (currentInline.length > 0) {
      blocks.push({ type: 'paragraph', children: [...currentInline] })
      currentInline.length = 0
    }
  }

  if (tagName === 'hr') {
    flushInline()
    blocks.push({ type: 'hr' })
    return true
  }

  const headerMatch = tagName.match(/^h([1-6])$/)
  if (headerMatch) {
    flushInline()
    const level = parseInt(headerMatch[1])
    const headerInline = []
    for (const child of node.children) traverse(child, { ...style, fontWeight: 'normal' }, headerInline)
    if (headerInline.length > 0) blocks.push({ type: 'header', level, children: headerInline })
    return true
  }

  const fontSizeVal = inlineStyles['font-size']
  if (fontSizeVal && (tagName === 'div' || tagName === 'p' || tagName === 'span')) {
    const sizePx = parseInt(fontSizeVal)
    if (sizePx >= 20) {
      flushInline()
      const level = sizePx >= 28 ? 1 : (sizePx >= 24 ? 2 : 3)
      const headerInline = []
      for (const child of node.children) traverse(child, { ...style, fontWeight: 'normal' }, headerInline)
      if (headerInline.length > 0) blocks.push({ type: 'header', level, children: headerInline })
      return true
    }
  }

  if (tagName === 'blockquote') {
    flushInline()
    const innerDoc = toAst(node)
    if (innerDoc.blocks.length > 0) blocks.push({ type: 'blockquote', children: innerDoc.blocks })
    return true
  }

  if (tagName === 'ul' || tagName === 'ol') {
    flushInline()
    const items = []
    for (const child of node.children) {
      if (child.tagName === 'li') {
        const itemInline = []
        for (const liChild of child.children) traverse(liChild, style, itemInline)
        if (itemInline.length > 0) items.push(itemInline)
      } else {
        traverse(child, style, currentInline)
      }
    }
    if (items.length > 0) blocks.push({ type: tagName === 'ul' ? 'bulletList' : 'orderedList', items })
    return true
  }

  if (tagName === 'table') {
    flushInline()
    processTableNode(node, style, blocks, traverse)
    return true
  }

  const isBlockContainer = new Set(['div', 'p', 'section', 'article', 'main', 'header', 'footer', 'address', 'pre']).has(tagName)
  if (isBlockContainer) {
    flushInline()
    for (const child of node.children) traverse(child, style, currentInline)
    flushInline()
    return true
  }

  return false
}

module.exports = { processBlockNode }
