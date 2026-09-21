const { stringifyInline } = require('./inline')
const { stringifyTable } = require('./table')

const stringifyListItem = (item, marker, stringifyNode, tight = true) => {
  const children = item.children || (Array.isArray(item) ? item : [])
  const hasInlineCheck = children[0]?.type === 'paragraph' && children[0]?.children?.[0]?.type === 'checkbox'
  const checkStr = item.checked !== undefined && !hasInlineCheck ? (item.checked ? '[x] ' : '[ ] ') : ''
  if (children.length === 0) return `${marker} ${checkStr}`

  const [first, ...rest] = children
  const indentStr = ' '.repeat(marker.length + 1)
  let out = ''
  if (first.type === 'paragraph') {
    out = `${marker} ${checkStr}${stringifyNode(first.children).trim()}`
  } else {
    const firstStr = stringifyNode(first).trim()
    out = `${marker} ${checkStr}\n${firstStr.split('\n').map((l) => `${indentStr}${l}`).join('\n')}`
  }

  for (const block of rest) {
    const blockStr = stringifyNode(block).trim()
    const isSubList = block.type === 'bulletList' || block.type === 'orderedList'
    const blockSep = tight && isSubList ? '\n' : '\n\n'
    const indented = blockStr.split('\n').map((l) => `${indentStr}${l}`).join('\n')
    out += `${blockSep}${indented}`
  }
  return out
}

const stringifyCodeBlock = (node) => {
  const langStr = node.language
    ? (node.languageMetadata ? `${node.language} ${node.languageMetadata}` : node.language)
    : ''
  const runs = (node.value || '').match(/`{3,}/g) || []
  let maxFence = 2
  for (const r of runs) if (r.length > maxFence) maxFence = r.length
  const fence = '`'.repeat(maxFence + 1)
  return `\n${fence}${langStr}\n${node.value}\n${fence}\n`
}

const stringifyNode = (node) => {
  if (!node) return ''
  if (Array.isArray(node)) return node.map(stringifyNode).join('')

  const inlineRes = stringifyInline(node, stringifyNode)
  if (inlineRes) return inlineRes

  switch (node.type) {
    case 'codeBlock':
      return stringifyCodeBlock(node)
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
      const titleStr = node.title ? ` ${node.title}` : ''
      const inner = stringifyNode(node.children).trim()
      return `\n> [!${tag}]${titleStr}\n${inner.split('\n').map((line) => `> ${line}`).join('\n')}\n`
    }
    case 'bulletList': {
      const sep = node.tight ? '\n' : '\n\n'
      return `\n${(node.children || node.items || []).map((item) => stringifyListItem(item, '*', stringifyNode, node.tight)).join(sep)}\n`
    }
    case 'orderedList': {
      const sep = node.tight ? '\n' : '\n\n'
      return `\n${(node.children || node.items || []).map((item, idx) => stringifyListItem(item, `${(node.start || 1) + idx}.`, stringifyNode, node.tight)).join(sep)}\n`
    }
    case 'table':
      return stringifyTable(node, stringifyNode)
    case 'hr':
      return '\n---\n'
    case 'html':
      return `\n${node.value}\n`
    case 'mathBlock':
      return `\n$$\n${node.value}\n$$\n`
    default:
      return ''
  }
}

module.exports = { stringifyNode }
