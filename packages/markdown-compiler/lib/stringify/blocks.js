const { stringifyInline } = require('./inline')
const { stringifyTable } = require('./table')

const stringifyListItem = (item, marker, stringifyNode) => {
  const checkStr = item.checked !== undefined ? (item.checked ? '[x] ' : '[ ] ') : ''
  const children = item.children || (Array.isArray(item) ? item : [])
  if (children.length === 0) return `${marker} ${checkStr}`
  const [first, ...rest] = children
  const firstText = first.type === 'paragraph' ? stringifyNode(first.children).trim() : stringifyNode(first).trim()
  let out = `${marker} ${checkStr}${firstText}`
  for (const block of rest) {
    const blockStr = stringifyNode(block).trim()
    const indented = blockStr.split('\n').map((l) => `  ${l}`).join('\n')
    out += `\n${indented}`
  }
  return out
}

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
      return `\n${(node.children || node.items || []).map((item) => stringifyListItem(item, '*', stringifyNode)).join('\n')}\n`
    case 'orderedList':
      return `\n${(node.children || node.items || []).map((item, idx) => stringifyListItem(item, `${(node.start || 1) + idx}.`, stringifyNode)).join('\n')}\n`
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
