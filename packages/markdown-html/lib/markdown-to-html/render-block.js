const { escapeHtml } = require('./escape')
const { slugify } = require('./slugify')
const { renderInline } = require('./render-inline')
const { highlightCode } = require('./highlight')

const renderBlock = (node, options = {}) => {
  if (!node) return ''

  switch (node.type) {
    case 'header': {
      const text = renderInline(node.children)
      const rawText = node.children ? node.children.map((c) => (c.type === 'text' ? c.value : '')).join('') : ''
      const slug = (options.slugify || slugify)(rawText, options.usedSlugs)
      return `<h${node.level} id="${slug}">${text}</h${node.level}>\n`
    }
    case 'paragraph': {
      return `<p>${renderInline(node.children)}</p>\n`
    }
    case 'codeBlock': {
      const lang = node.language || ''
      if (options.codeRenderers && lang && options.codeRenderers[lang]) {
        return options.codeRenderers[lang](node, options)
      }
      const highlighted = highlightCode(node.value, lang, options.tokenizers)
      const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : ''
      return `<pre><code${langClass}>${highlighted}</code></pre>\n`
    }
    case 'blockquote': {
      const innerHtml = node.children ? node.children.map((child) => renderBlock(child, options)).join('') : ''
      return `<blockquote>\n${innerHtml}</blockquote>\n`
    }
    case 'callout': {
      const style = node.style || 'note'
      const title = style.charAt(0).toUpperCase() + style.slice(1)
      const innerHtml = node.children ? node.children.map((child) => renderBlock(child, options)).join('') : ''
      return `<div class="callout callout-${style}">\n<div class="callout-title">${title}</div>\n${innerHtml}</div>\n`
    }
    case 'bulletList': {
      const itemsHtml = node.items ? node.items.map((item) => `<li>${renderInline(item)}</li>\n`).join('') : ''
      return `<ul>\n${itemsHtml}</ul>\n`
    }
    case 'orderedList': {
      const itemsHtml = node.items ? node.items.map((item) => `<li>${renderInline(item)}</li>\n`).join('') : ''
      return `<ol>\n${itemsHtml}</ol>\n`
    }
    case 'table': {
      const alignments = node.alignments || []
      const rows = node.rows || []
      if (rows.length === 0) return ''

      const headerRow = rows[0]
      const bodyRows = rows.slice(1)

      const renderRow = (row, isHeader) => {
        const cellTag = isHeader ? 'th' : 'td'
        const cells = row
          .map((cell, colIdx) => {
            const align = alignments[colIdx] || 'default'
            const alignAttr = align !== 'default' ? ` align="${align}"` : ''
            return `<${cellTag}${alignAttr}>${renderInline(cell)}</${cellTag}>`
          })
          .join('')
        return `<tr>${cells}</tr>\n`
      }

      let tableHtml = '<table>\n<thead>\n' + renderRow(headerRow, true) + '</thead>\n'
      if (bodyRows.length > 0) {
        tableHtml += '<tbody>\n' + bodyRows.map((r) => renderRow(r, false)).join('') + '</tbody>\n'
      }
      tableHtml += '</table>\n'
      return tableHtml
    }
    case 'hr': {
      return '<hr />\n'
    }
    default: {
      return ''
    }
  }
}

module.exports = { renderBlock }
