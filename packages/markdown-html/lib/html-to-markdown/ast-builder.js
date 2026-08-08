const { processInlineNode } = require('./inline-builder')
const { processBlockNode } = require('./block-builder')

const DEFAULT_STYLE = {
  fontWeight: 'normal',
  fontStyle: 'normal',
  isCode: false,
}

const toAst = (htmlRoot) => {
  const blocks = []
  let currentInline = []

  const traverse = (node, style, inlineTarget) => {
    const target = inlineTarget || currentInline

    if (processInlineNode(node, style, target, traverse)) return
    if (processBlockNode(node, style, blocks, currentInline, traverse, toAst)) return

    if (node.children) {
      for (const child of node.children) traverse(child, style, target)
    }
  }

  for (const child of htmlRoot.children) traverse(child, DEFAULT_STYLE, currentInline)

  if (currentInline.length > 0) {
    if (currentInline[0].type === 'text' && currentInline[0].value === ' ') currentInline.shift()
    if (currentInline.length > 0 && currentInline[currentInline.length - 1].type === 'text' && currentInline[currentInline.length - 1].value === ' ') currentInline.pop()
    if (currentInline.length > 0) blocks.push({ type: 'paragraph', children: [...currentInline] })
  }

  return { frontmatter: {}, blocks }
}

module.exports = { toAst }
