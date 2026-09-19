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
      return `\n${node.items.map((item) => {
        const indentStr = ' '.repeat(item.indent || 0)
        const marker = item.listType === 'ordered' ? `${item.order || 1}. ` : `${item.marker || '*'} `
        return `${indentStr}${marker}${stringifyNode(item).trim()}`
      }).join('\n')}\n`
    case 'orderedList':
      return `\n${node.items.map((item, idx) => {
        const indentStr = ' '.repeat(item.indent || 0)
        const marker = item.listType === 'bullet' ? `${item.marker || '*'} ` : `${item.order || (idx + 1)}. `
        return `${indentStr}${marker}${stringifyNode(item).trim()}`
      }).join('\n')}\n`
    case 'table':
      return stringifyTable(node, stringifyNode)
    case 'html':
      return `\n${node.value}\n`
    case 'mathBlock':
      return `\n$$\n${node.value}\n$$\n`
    default:
      return ''
  }
}

module.exports = { stringifyNode }
