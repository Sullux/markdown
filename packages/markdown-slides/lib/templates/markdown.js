const { parse } = require('@sullux/markdown-compiler')
const { markdownToHtml } = require('@sullux/markdown-html')
const { mergeHead } = require('./utils')

const extractCssBlocks = (blocks = []) => {
  const cssBlocks = []
  const remaining = []
  for (const b of blocks) {
    if (b.type === 'codeBlock' && (b.language === 'css' || b.languageMetadata === 'template')) {
      cssBlocks.push(b)
    } else {
      remaining.push(b)
    }
  }
  return { cssBlocks, blocks: remaining }
}

const renderSlotHtml = (templateHtml, state) => {
  let html = templateHtml

  // Named slots
  if (state.slots) {
    for (const [name, content] of Object.entries(state.slots)) {
      const regex = new RegExp(`<slot\\s+name=["']${name}["']\\s*\\/?>|<slot\\s+name=["']${name}["']><\\/slot>`, 'gi')
      html = html.replace(regex, content)
    }
  }
  // Clear any unfulfilled named slots
  html = html.replace(/<slot\s+name=["'][^"']+["']\s*\/?>|<slot\s+name=["'][^"']+["']><\/slot>/gi, '')

  // Default slot
  const defaultSlotRegex = /<slot\s*\/?>|<slot><\/slot>/gi
  if (defaultSlotRegex.test(html)) {
    html = html.replace(defaultSlotRegex, state.html)
  } else {
    // If no slot declared, append slide content
    html = `${html}\n${state.html}`
  }

  return html
}

const createMarkdownTemplate = (rawMarkdown, defaultName = '') => {
  const ast = parse(rawMarkdown)
  const fm = ast.frontmatter || {}
  const { cssBlocks, blocks } = extractCssBlocks(ast.blocks || [])
  const baseTemplate = fm.base || fm.extends

  const templateFn = (state, context = {}) => {
    const rendered = markdownToHtml({ ...ast, blocks })
    const styles = cssBlocks.map((b) => `<style>\n${b.value}\n</style>`)
    const finalHtml = renderSlotHtml(rendered.html, state)
    const customHead = Array.isArray(fm.head) ? fm.head : fm.head ? [fm.head] : []
    const head = mergeHead(state.head, rendered.head, styles, customHead)

    return {
      ...state,
      html: finalHtml,
      head,
    }
  }

  templateFn.templateName = fm.name || defaultName
  templateFn.base = baseTemplate
  templateFn.ast = ast

  return templateFn
}

module.exports = {
  createMarkdownTemplate,
  renderSlotHtml,
}
