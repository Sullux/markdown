const stringifyCodeSpan = (value) => {
  const matches = value.match(/`+/g) || []
  let maxLen = 0
  for (const m of matches) if (m.length > maxLen) maxLen = m.length
  const delim = '`'.repeat(maxLen === 0 ? 1 : maxLen + 1)
  const pad = value.startsWith('`') || value.endsWith('`') ? ' ' : ''
  return `${delim}${pad}${value}${pad}${delim}`
}

const stringifyInline = (node, stringifyNode) => {
  switch (node.type) {
    case 'text':
      return node.value
    case 'html':
      return node.value
    case 'bold':
      return `**${stringifyNode(node.children)}**`
    case 'italic':
      return `*${stringifyNode(node.children)}*`
    case 'strikethrough':
      return `~~${stringifyNode(node.children)}~~`
    case 'code':
      return stringifyCodeSpan(node.value || '')
    case 'link': {
      const titleStr = node.title ? ` "${node.title.replace(/"/g, '\\"')}"` : ''
      return `[${stringifyNode(node.children)}](${node.url}${titleStr})`
    }
    case 'wikilink':
      return node.display === node.target ? `[[${node.target}]]` : `[[${node.target}|${node.display}]]`
    case 'image': {
      const titleStr = node.title ? ` "${node.title.replace(/"/g, '\\"')}"` : ''
      const sizeStr = node.width || node.height ? `|${node.height ? `${node.width}x${node.height}` : `${node.width}`}` : ''
      return `![${node.alt || ''}${sizeStr}](${node.url}${titleStr})`
    }
    case 'checkbox':
      return node.checked ? '[x] ' : '[ ] '
    case 'inlineMath':
      return `$${node.value}$`
    case 'br':
      return '  \n'
    default:
      return ''
  }
}

module.exports = { stringifyInline }
