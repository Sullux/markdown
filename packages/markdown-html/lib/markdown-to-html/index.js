const { parse } = require('@sullux/markdown-compiler')
const { renderBlock } = require('./render-block')

const markdownToHtml = (markdown, options = {}) => {
  if (!markdown) return ''
  const ast = parse(markdown)
  const ctx = { ...options, usedSlugs: new Set() }
  return ast.blocks.map((block) => renderBlock(block, ctx)).join('')
}

module.exports = { markdownToHtml }
