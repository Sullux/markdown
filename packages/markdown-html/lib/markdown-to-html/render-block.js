const { escapeHtml } = require('./escape')
const { slugify } = require('./slugify')
const { renderInline } = require('./render-inline')
const { highlightCode } = require('./highlight')
const { renderList } = require('./render-list')
const { KATEX_HEAD, MERMAID_HEAD } = require('./assets')

const hasInlineMath = (children) => Boolean(children?.some((c) => c.type === 'inlineMath'))

const renderBlock = (node, options = {}) => {
  if (!node) return ''

  switch (node.type) {
    case 'header': {
      const text = renderInline(node.children, options)
      const rawText = node.children ? node.children.map((c) => (c.type === 'text' ? c.value : '')).join('') : ''
      const idAttr = options.headingIds !== false ? ` id="${(options.slugify || slugify)(rawText, options.usedSlugs)}"` : ''
      const html = `<h${node.level}${idAttr}>${text}</h${node.level}>\n`
      return hasInlineMath(node.children) ? { html, head: KATEX_HEAD } : html
    }
    case 'paragraph': {
      const html = `<p>${renderInline(node.children, options)}</p>\n`
      return hasInlineMath(node.children) ? { html, head: KATEX_HEAD } : html
    }
    case 'codeBlock': {
      const lang = node.language || ''
      if (options.codeRenderers?.[lang]) return options.codeRenderers[lang](node, options)
      if (lang === 'math') {
        if (options.mathBlockRenderer) return options.mathBlockRenderer(node, options)
        return { html: `<div class="math-display" data-latex="${escapeHtml(node.value)}">$$\n${escapeHtml(node.value)}\n$$</div>\n`, head: KATEX_HEAD }
      }
      if (lang === 'mermaid') {
        return { html: `<pre class="mermaid">${escapeHtml(node.value)}</pre>\n`, head: MERMAID_HEAD }
      }
      const highlighted = highlightCode(node.value, lang, options.tokenizers)
      const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : ''
      return `<pre><code${langClass}>${highlighted}\n</code></pre>\n`
    }
    case 'blockquote': {
      const { html, head } = renderBlocks(node.children, options)
      return { html: `<blockquote>\n${html}</blockquote>\n`, head }
    }
    case 'callout': {
      const style = node.style || 'note'
      const title = style.charAt(0).toUpperCase() + style.slice(1)
      const { html, head } = renderBlocks(node.children, options)
      return { html: `<div class="callout callout-${style}">\n<div class="callout-title">${title}</div>\n${html}</div>\n`, head }
    }
    case 'bulletList':
    case 'orderedList': {
      return renderList(node, options, renderBlock, hasInlineMath, KATEX_HEAD)
    }
    case 'table': {
      const alignments = node.alignments || []
      const rows = node.rows || []
      if (rows.length === 0) return ''
      const renderRow = (row, isHeader) => {
        const tag = isHeader ? 'th' : 'td'
        const cells = row.map((cell, i) => {
          const align = alignments[i] || 'default'
          return `<${tag}${align !== 'default' ? ` align="${align}"` : ''}>${renderInline(cell, options)}</${tag}>`
        }).join('')
        return `<tr>${cells}</tr>\n`
      }
      const tableBody = rows.slice(1).length ? `<tbody>\n${rows.slice(1).map((r) => renderRow(r, false)).join('')}</tbody>\n` : ''
      const tableHtml = `<table>\n<thead>\n${renderRow(rows[0], true)}</thead>\n${tableBody}</table>\n`
      const hasMath = rows.some((row) => row.some((cell) => hasInlineMath(cell)))
      return hasMath ? { html: tableHtml, head: KATEX_HEAD } : tableHtml
    }
    case 'hr': return '<hr />\n'
    case 'html': return `${node.value}\n`
    case 'mathBlock': {
      const mathRenderer = options.mathBlockRenderer || options.codeRenderers?.math
      if (mathRenderer) return mathRenderer(node, options)
      return { html: `<div class="math-display" data-latex="${escapeHtml(node.value)}">$$\n${escapeHtml(node.value)}\n$$</div>\n`, head: KATEX_HEAD }
    }
    default: return ''
  }
}

const renderBlocks = (blocks, options) => (blocks || []).reduce(
  (acc, block) => {
    const res = renderBlock(block, options)
    const html = typeof res === 'string' ? res : res?.html || ''
    const head = typeof res === 'object' && Array.isArray(res?.head) ? res.head : []
    return { html: acc.html + html, head: acc.head.concat(head) }
  },
  { html: '', head: [] }
)

module.exports = { renderBlock, renderBlocks }
