const stringifyInline = (node, stringifyNode) => {
  switch (node.type) {
    case 'text':
      return node.value
    case 'bold':
      return `**${stringifyNode(node.children)}**`
    case 'italic':
      return `*${stringifyNode(node.children)}*`
    case 'strikethrough':
      return `~~${stringifyNode(node.children)}~~`
    case 'code':
      return `\`${node.value}\``
    case 'link':
      return `[${stringifyNode(node.children)}](${node.url})`
    case 'wikilink':
      if (node.display === node.target) return `[[${node.target}]]`
      return `[[${node.target}|${node.display}]]`
    case 'image': {
      if (node.width || node.height) {
        const sizeStr = node.height ? `${node.width}x${node.height}` : `${node.width}`
        return `![${node.alt || ''}|${sizeStr}](${node.url})`
      }
      return `![${node.alt || ''}](${node.url})`
    }
    case 'checkbox':
      return node.checked ? '[x] ' : '[ ] '
    case 'br':
      return '  \n'
    default:
      return ''
  }
}

module.exports = { stringifyInline }
