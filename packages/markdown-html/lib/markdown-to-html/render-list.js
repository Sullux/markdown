const { renderInline } = require('./render-inline')
const { escapeHtml } = require('./escape')

const renderListItem = (item, options, tight, renderBlock, hasInlineMath, KATEX_HEAD) => {
  const checkHtml = item.checked !== undefined ? `<input type="checkbox"${item.checked ? ' checked' : ''} disabled /> ` : ''
  const idAttr = item.id ? ` id="${escapeHtml(item.id)}"` : ''
  const classes = [
    ...(item.checked !== undefined ? ['task-list-item'] : []),
    ...(item.classes || []),
  ]
  const classAttr = classes.length ? ` class="${escapeHtml(classes.join(' '))}"` : ''

  if (Array.isArray(item)) {
    const itemMath = hasInlineMath(item)
    return {
      html: `<li${idAttr}${classAttr}>${checkHtml}${renderInline(item, options)}</li>\n`,
      head: itemMath ? KATEX_HEAD : [],
    }
  }

  let head = []
  let isInlineFirst = false
  const childrenHtml = (item.children || []).map((child, idx) => {
    if (child.type === 'paragraph' && tight) {
      if (idx === 0) isInlineFirst = true
      if (hasInlineMath(child.children)) head = head.concat(KATEX_HEAD)
      const inline = renderInline(child.children, options)
      return idx === 0 ? inline : (item.children[idx - 1]?.type === 'paragraph' ? `\n${inline}` : inline)
    }
    const res = renderBlock(child, options)
    if (typeof res === 'object' && Array.isArray(res.head)) head = head.concat(res.head)
    const rendered = typeof res === 'string' ? res : res?.html || ''
    return (isInlineFirst && idx === 1 ? '\n' : '') + rendered
  }).join('')

  const prefix = isInlineFirst || !childrenHtml ? '' : '\n'
  return { html: `<li${idAttr}${classAttr}>${checkHtml}${prefix}${childrenHtml}</li>\n`, head }
}

const renderList = (node, options, renderBlock, hasInlineMath, KATEX_HEAD) => {
  const tight = node.tight !== false
  const isOrdered = node.type === 'orderedList'
  const listItems = node.children || node.items || []
  let head = []

  const itemsHtml = listItems.map((item) => {
    const res = renderListItem(item, options, tight, renderBlock, hasInlineMath, KATEX_HEAD)
    if (res.head) head = head.concat(res.head)
    return res.html
  }).join('')

  const idAttr = node.id ? ` id="${escapeHtml(node.id)}"` : ''
  const classAttr = node.classes?.length ? ` class="${escapeHtml(node.classes.join(' '))}"` : ''
  const startAttr = isOrdered && node.start !== undefined && node.start !== 1 ? ` start="${node.start}"` : ''
  const tag = isOrdered ? 'ol' : 'ul'
  return { html: `<${tag}${idAttr}${classAttr}${startAttr}>\n${itemsHtml}</${tag}>\n`, head }
}

module.exports = { renderList }
