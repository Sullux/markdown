const { renderInline } = require('./render-inline')

const renderListItem = (item, options, tight, renderBlock) => {
  const checkHtml = item.checked !== undefined
    ? `<input type="checkbox"${item.checked ? ' checked' : ''} disabled /> `
    : ''
  const taskClass = item.checked !== undefined ? ' class="task-list-item"' : ''

  if (Array.isArray(item)) {
    return `<li${taskClass}>${checkHtml}${renderInline(item, options)}</li>\n`
  }

  const children = item.children || []
  const childrenHtml = children
    .map((child, idx) => {
      if (child.type === 'paragraph' && tight && idx === 0) {
        return renderInline(child.children, options)
      }
      return renderBlock(child, options)
    })
    .join('')

  return `<li${taskClass}>${checkHtml}${childrenHtml}</li>\n`
}

const renderList = (node, options, renderBlock) => {
  const tight = node.tight !== false
  const isOrdered = node.type === 'orderedList'
  const listItems = node.children || node.items || []
  const itemsHtml = listItems.map((item) => renderListItem(item, options, tight, renderBlock)).join('')

  if (isOrdered) {
    const startAttr = node.start && node.start !== 1 ? ` start="${node.start}"` : ''
    return `<ol${startAttr}>\n${itemsHtml}</ol>\n`
  }
  return `<ul>\n${itemsHtml}</ul>\n`
}

module.exports = { renderList }
