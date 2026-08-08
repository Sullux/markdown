const { escapeHtml } = require('./escape')

const renderInline = (tokens) => {
  if (!tokens) return ''
  if (!Array.isArray(tokens)) return escapeHtml(tokens)

  return tokens
    .map((token) => {
      if (!token) return ''
      if (typeof token === 'string') return escapeHtml(token)

      switch (token.type) {
        case 'text':
          return escapeHtml(token.value)
        case 'bold':
          return `<strong>${renderInline(token.children)}</strong>`
        case 'italic':
          return `<em>${renderInline(token.children)}</em>`
        case 'strikethrough':
          return `<del>${renderInline(token.children)}</del>`
        case 'code':
          return `<code>${escapeHtml(token.value)}</code>`
        case 'link':
          return `<a href="${escapeHtml(token.url)}">${renderInline(token.children)}</a>`
        case 'wikilink':
          return `<a href="${escapeHtml(token.target)}">${escapeHtml(token.display)}</a>`
        case 'image': {
          let styleAttr = ''
          if (token.width || token.height) {
            const styles = []
            if (token.width) styles.push(`width: ${token.width}`)
            if (token.height) styles.push(`height: ${token.height}`)
            styleAttr = ` style="${styles.join('; ')};"`
          }
          return `<img src="${escapeHtml(token.url)}" alt="${escapeHtml(token.alt)}"${styleAttr} />`
        }
        case 'checkbox':
          return `<input type="checkbox"${token.checked ? ' checked' : ''} disabled /> `
        case 'br':
          return '<br />'
        default:
          return escapeHtml(token.value || '')
      }
    })
    .join('')
}

module.exports = { renderInline }
