const { renderBlockList, mergeHead } = require('./utils')

const titleContent = (state, context = {}) => {
  const blocks = state.ast?.blocks || []
  const hasHeader = blocks.length > 0 && blocks[0].type === 'header'
  const headerBlocks = hasHeader ? [blocks[0]] : []
  const bodyBlocks = hasHeader ? blocks.slice(1) : blocks

  const headerRes = renderBlockList(headerBlocks, context.options)
  const bodyRes = renderBlockList(bodyBlocks, context.options)

  const headerHtml = hasHeader
    ? `<header class="slide-header">${headerRes.html}</header>`
    : ''
  const bodyHtml = `<div class="slide-body">${bodyRes.html}</div>`

  return {
    ...state,
    html: `<div class="slide-layout slide-title-content">${headerHtml}${bodyHtml}</div>`,
    head: mergeHead(state.head, headerRes.head, bodyRes.head),
  }
}

titleContent.docs = {
  description: 'Standard slide layout with top title bar and flexible content body.',
}

module.exports = { titleContent }
