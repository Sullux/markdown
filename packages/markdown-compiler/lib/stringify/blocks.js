const { stringifyInline } = require('./inline')
const { stringifyTable } = require('./table')

const stringifyNode = (node) => {
  if (!node) return ''
  if (Array.isArray(node)) return node.map(stringifyNode).join('')

  const inlineRes = stringifyInline(node, stringifyNode)
  if (inlineRes) return inlineRes

  switch (node.type) {
    case 'codeBlock': {
      const langStr = node.language
        ? (node.languageMetadata ? `${node.language} ${node.languageMetadata}` : node.language)
        : ''
      return `\n\`\`\`${langStr}\n${node.value}\n\`\`\`\n`
    }
    case 'paragraph':
      return `\n${stringifyNode(node.children)}\n`
    case 'header':
      return `\n${'#'.repeat(node.level)} ${stringifyNode(node.children)}\n`
    case 'blockquote': {
      const inner = stringifyNode(node.children).trim()
      return `\n${inner.split('\n').map((line) => `> ${line}`).join('\n')}\n`
    }
    case 'callout': {
      const tag = (node.style || 'note').toUpperCase()
      const inner = stringifyNode(node.children).trim()
      return `\n> [!${tag}]\n${inner.split('\n').map((line) => `> ${line}`).join('\n')}\n`
    }
    case 'bulletList':
      return `\n${node.items.map((item) => `* ${stringifyNode(item).trim()}`).join('\n')}\n`
    case 'orderedList':
      return `\n${node.items.map((item, idx) => `${idx + 1}. ${stringifyNode(item).trim()}`).join('\n')}\n`
    case 'table':
      return stringifyTable(node, stringifyNode)
    default:
      return ''
  }
}

module.exports = { stringifyNode }
