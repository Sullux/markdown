const { renderInline } = require('./render-inline')

const renderListItem = (item, options, tight, renderBlock, hasInlineMath, KATEX_HEAD) => {
  const checkHtml = item.checked !== undefined ? `<input type="checkbox"${item.checked ? ' checked' : ''} disabled /> ` : ''
  const taskClass = item.checked !== undefined ? ' class="task-list-item"' : ''

  if (Array.isArray(item)) {
    const itemMath = hasInlineMath(item)
    return {
      html: `<li${taskClass}>${checkHtml}${renderInline(item, options)}</li>\n`,
      head: itemMath ? KATEX_HEAD : [],
    }
  }

  let head = []
  const childrenHtml = (item.children || []).map((child, idx) => {
    if (child.type === 'paragraph' && tight && idx === 0) {
      if (hasInlineMath(child.children)) head = head.concat(KATEX_HEAD)
      return renderInline(child.children, options)
    }
    const res = renderBlock(child, options)
    if (typeof res === 'object' && Array.isArray(res.head)) head = head.concat(res.head)
    return typeof res === 'string' ? res : res?.html || ''
  }).join('')

  return { html: `<li${taskClass}>${checkHtml}${childrenHtml}</li>\n`, head }
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

  const startAttr = isOrdered && node.start && node.start !== 1 ? ` start="${node.start}"` : ''
  const tag = isOrdered ? 'ol' : 'ul'
  return { html: `<${tag}${startAttr}>\n${itemsHtml}</${tag}>\n`, head }
}

module.exports = { renderList }
