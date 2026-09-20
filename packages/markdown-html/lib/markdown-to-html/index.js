const { parse } = require('@sullux/markdown-compiler')
const { renderBlocks } = require('./render-block')

const markdownToHtml = (markdown, options = {}) => {
  if (!markdown) {
    return { html: '', head: [], toString() { return '' } }
  }
  const ast = typeof markdown === 'string' ? parse(markdown, options) : markdown
  const ctx = { ...options, usedSlugs: new Set() }
  const result = renderBlocks(ast.blocks, ctx)
  const uniqueHead = [...new Set(result.head)]

  return {
    html: result.html,
    head: uniqueHead,
    toString() {
      return this.html
    },
  }
}

module.exports = { markdownToHtml }
